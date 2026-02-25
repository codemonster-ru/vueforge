<template>
    <div class="vf-infinite-scroll" :class="rootClass">
        <slot />
        <div ref="sentinel" class="vf-infinite-scroll__sentinel" role="status" :aria-live="loading ? 'polite' : 'off'">
            <template v-if="error">
                <slot name="error" :retry="retry">
                    <button type="button" class="vf-infinite-scroll__retry" @click="retry">
                        {{ retryLabel }}
                    </button>
                </slot>
            </template>
            <template v-else-if="loading">
                <slot name="loading">{{ loadingText }}</slot>
            </template>
            <template v-else-if="!hasMore">
                <slot name="end">{{ endText }}</slot>
            </template>
            <template v-else>
                <slot name="sentinel">
                    <span class="vf-infinite-scroll__hint" aria-hidden="true" />
                </slot>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type InfiniteScrollLoadTrigger = 'intersection' | 'scroll' | 'retry' | 'manual';
export type InfiniteScrollLoadPayload = {
    trigger: InfiniteScrollLoadTrigger;
};

interface Props {
    loading?: boolean;
    error?: boolean;
    hasMore?: boolean;
    disabled?: boolean;
    root?: HTMLElement | null;
    scrollTarget?: Window | HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
    fallbackOffset?: number;
    debounceMs?: number;
    observeOnMount?: boolean;
    loadingText?: string;
    endText?: string;
    retryLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: false,
    hasMore: true,
    disabled: false,
    root: null,
    scrollTarget: null,
    rootMargin: '0px 0px 220px 0px',
    threshold: 0,
    fallbackOffset: 160,
    debounceMs: 180,
    observeOnMount: true,
    loadingText: 'Loading more...',
    endText: 'No more items',
    retryLabel: 'Retry',
});

const emits = defineEmits<{
    (event: 'load', payload: InfiniteScrollLoadPayload): void;
    (event: 'retry'): void;
}>();

const sentinel = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const locked = ref(false);
const rootClass = computed(() => ({
    'vf-infinite-scroll_loading': props.loading,
    'vf-infinite-scroll_error': props.error,
    'vf-infinite-scroll_end': !props.loading && !props.error && !props.hasMore,
    'vf-infinite-scroll_disabled': props.disabled,
}));

let removeFallbackListeners: (() => void) | null = null;
let unlockTimer: number | null = null;

const clearUnlockTimer = () => {
    if (unlockTimer === null) {
        return;
    }

    window.clearTimeout(unlockTimer);
    unlockTimer = null;
};

const releaseLockAfterDebounce = () => {
    clearUnlockTimer();

    unlockTimer = window.setTimeout(
        () => {
            if (!props.loading) {
                locked.value = false;
            }
        },
        Math.max(0, props.debounceMs),
    );
};

const canRequest = (allowWhenError = false) => {
    if (!props.hasMore || props.disabled || props.loading || locked.value) {
        return false;
    }

    if (props.error && !allowWhenError) {
        return false;
    }

    return true;
};

const requestLoad = (trigger: InfiniteScrollLoadTrigger, allowWhenError = false) => {
    if (!canRequest(allowWhenError)) {
        return false;
    }

    locked.value = true;
    emits('load', { trigger });
    releaseLockAfterDebounce();

    return true;
};

const retry = () => {
    emits('retry');
    requestLoad('retry', true);
};

const loadMore = () => {
    requestLoad('manual');
};

const getFallbackTarget = () => props.scrollTarget ?? window;
const isWindowTarget = (target: Window | HTMLElement): target is Window => target === window;

const checkFallbackThreshold = () => {
    if (!sentinel.value) {
        return;
    }

    const sentinelRect = sentinel.value.getBoundingClientRect();
    const target = getFallbackTarget();

    if (isWindowTarget(target)) {
        const remaining = sentinelRect.top - window.innerHeight;

        if (remaining <= props.fallbackOffset) {
            requestLoad('scroll');
        }

        return;
    }

    const targetRect = target.getBoundingClientRect();
    const remaining = sentinelRect.top - targetRect.bottom;

    if (remaining <= props.fallbackOffset) {
        requestLoad('scroll');
    }
};

const unbindFallbackListeners = () => {
    if (!removeFallbackListeners) {
        return;
    }

    removeFallbackListeners();
    removeFallbackListeners = null;
};

const bindFallbackListeners = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const target = getFallbackTarget();
    const onScroll = () => checkFallbackThreshold();

    if (isWindowTarget(target)) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        removeFallbackListeners = () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    } else {
        target.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        removeFallbackListeners = () => {
            target.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }

    onScroll();
};

const stopObserver = () => {
    observer.value?.disconnect();
    observer.value = null;
};

const refresh = () => {
    if (!props.observeOnMount || typeof window === 'undefined') {
        return;
    }

    stopObserver();
    unbindFallbackListeners();

    if (typeof window.IntersectionObserver === 'function') {
        observer.value = new window.IntersectionObserver(
            entries => {
                const reached = entries.some(entry => entry.isIntersecting || entry.intersectionRatio > 0);

                if (!reached) {
                    return;
                }

                requestLoad('intersection');
            },
            {
                root: props.root ?? null,
                rootMargin: props.rootMargin,
                threshold: props.threshold,
            },
        );

        if (sentinel.value) {
            observer.value.observe(sentinel.value);
        }

        return;
    }

    bindFallbackListeners();
};

watch(
    () => props.loading,
    value => {
        if (!value) {
            locked.value = false;
        }
    },
);

watch(
    () => [props.root, props.scrollTarget, props.rootMargin, props.threshold, props.observeOnMount] as const,
    () => {
        refresh();
    },
);

onMounted(() => {
    refresh();
});

onBeforeUnmount(() => {
    stopObserver();
    unbindFallbackListeners();
    clearUnlockTimer();
});

defineExpose({
    loadMore,
    refresh,
    retry,
});
</script>

<style lang="scss">
.vf-infinite-scroll {
    display: flex;
    flex-direction: column;
    gap: var(--vf-infinite-scroll-gap);
}

.vf-infinite-scroll__sentinel {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--vf-infinite-scroll-sentinel-min-height);
    padding: var(--vf-infinite-scroll-sentinel-padding);
    color: var(--vf-infinite-scroll-text-color);
    font-size: var(--vf-infinite-scroll-font-size);
}

.vf-infinite-scroll_loading .vf-infinite-scroll__sentinel {
    color: var(--vf-infinite-scroll-loading-color);
}

.vf-infinite-scroll_error .vf-infinite-scroll__sentinel {
    color: var(--vf-infinite-scroll-error-color);
}

.vf-infinite-scroll_end .vf-infinite-scroll__sentinel {
    color: var(--vf-infinite-scroll-end-color);
}

.vf-infinite-scroll_disabled {
    opacity: var(--vf-infinite-scroll-disabled-opacity);
}

.vf-infinite-scroll__hint {
    width: var(--vf-infinite-scroll-hint-width);
    height: var(--vf-infinite-scroll-hint-height);
    border-radius: 999px;
    background-color: var(--vf-infinite-scroll-hint-color);
}

.vf-infinite-scroll__retry {
    border: 1px solid var(--vf-infinite-scroll-retry-border-color);
    border-radius: var(--vf-infinite-scroll-retry-radius);
    background-color: var(--vf-infinite-scroll-retry-background-color);
    color: var(--vf-infinite-scroll-retry-text-color);
    padding: var(--vf-infinite-scroll-retry-padding);
    font-size: var(--vf-infinite-scroll-retry-font-size);
    cursor: pointer;
}

.vf-infinite-scroll__retry:hover {
    background-color: var(--vf-infinite-scroll-retry-hover-background-color);
}

.vf-infinite-scroll__retry:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-infinite-scroll-focus-ring-color);
}
</style>
