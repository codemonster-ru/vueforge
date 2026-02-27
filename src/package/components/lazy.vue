<template>
    <component
        :is="as"
        ref="rootRef"
        class="vf-lazy"
        :class="{ 'vf-lazy_disabled': disabled }"
        :aria-label="ariaLabel || undefined"
    >
        <slot v-if="isRendered" />
        <slot v-else name="placeholder">
            <component :is="placeholderTag" class="vf-lazy__placeholder" aria-hidden="true" />
        </slot>
    </component>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
    as?: string;
    when?: boolean;
    disabled?: boolean;
    eager?: boolean;
    once?: boolean;
    delay?: number;
    rootMargin?: string;
    threshold?: number;
    placeholderTag?: string;
    ariaLabel?: string;
}

defineOptions({ name: 'VfLazy' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    when: true,
    disabled: false,
    eager: false,
    once: true,
    delay: 0,
    rootMargin: '200px',
    threshold: 0,
    placeholderTag: 'div',
    ariaLabel: '',
});

const emits = defineEmits<{
    (event: 'enter'): void;
    (event: 'leave'): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const isRendered = ref(false);
const hasActivated = ref(false);
const observer = ref<IntersectionObserver | null>(null);
let delayTimer: ReturnType<typeof setTimeout> | null = null;

const isEligible = computed(() => props.when && !props.disabled);

const clearDelay = () => {
    if (!delayTimer) {
        return;
    }

    clearTimeout(delayTimer);
    delayTimer = null;
};

const teardownObserver = () => {
    observer.value?.disconnect();
    observer.value = null;
};

const setRendered = (value: boolean) => {
    if (isRendered.value === value) {
        return;
    }

    isRendered.value = value;
    if (value) {
        emits('enter');
    } else {
        emits('leave');
    }
};

const activate = () => {
    if (!isEligible.value) {
        return;
    }

    hasActivated.value = true;
    setRendered(true);

    if (props.once) {
        teardownObserver();
    }
};

const deactivate = () => {
    if (props.once) {
        return;
    }

    setRendered(false);
};

const applyVisibility = (visible: boolean) => {
    if (!isEligible.value) {
        clearDelay();
        setRendered(false);
        return;
    }

    if (props.once && hasActivated.value) {
        setRendered(true);
        return;
    }

    if (visible) {
        if (props.delay <= 0) {
            activate();
            return;
        }

        clearDelay();
        delayTimer = setTimeout(() => {
            activate();
            delayTimer = null;
        }, props.delay);
        return;
    }

    clearDelay();
    deactivate();
};

const setupObserver = () => {
    teardownObserver();
    clearDelay();

    if (!isEligible.value) {
        setRendered(false);
        return;
    }

    if (props.once && hasActivated.value) {
        setRendered(true);
        return;
    }

    if (props.eager) {
        activate();
        return;
    }

    if (typeof IntersectionObserver === 'undefined') {
        activate();
        return;
    }

    const target = rootRef.value;
    if (!target) {
        activate();
        return;
    }

    observer.value = new IntersectionObserver(
        entries => {
            const visible = entries.some(entry => entry.isIntersecting || entry.intersectionRatio > 0);
            applyVisibility(visible);
        },
        {
            root: null,
            rootMargin: props.rootMargin,
            threshold: props.threshold,
        },
    );

    observer.value.observe(target);
};

watch(
    () =>
        [props.when, props.disabled, props.eager, props.once, props.delay, props.rootMargin, props.threshold] as const,
    async () => {
        await nextTick();
        setupObserver();
    },
);

onMounted(() => {
    setupObserver();
});

onBeforeUnmount(() => {
    clearDelay();
    teardownObserver();
});
</script>

<style lang="scss">
.vf-lazy {
    display: block;
}

.vf-lazy__placeholder {
    display: block;
    min-height: var(--vf-lazy-placeholder-min-height);
    border-radius: var(--vf-lazy-placeholder-border-radius);
    background: var(--vf-lazy-placeholder-background-color);
}

.vf-lazy_disabled {
    opacity: var(--vf-lazy-disabled-opacity);
}
</style>
