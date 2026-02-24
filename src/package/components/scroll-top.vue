<template>
    <button
        v-show="visible"
        type="button"
        class="vf-scrolltop"
        :class="rootClass"
        :style="buttonStyle"
        :aria-label="ariaLabel"
        :disabled="disabled"
        @click="onClick"
    >
        <slot>
            <span class="vf-scrolltop__icon" aria-hidden="true">{{ icon }}</span>
            <span v-if="showLabel" class="vf-scrolltop__label">{{ label }}</span>
        </slot>
    </button>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type ScrollTopVariant = 'filled' | 'outlined';
type ScrollToBehavior = 'auto' | 'smooth';

interface Props {
    threshold?: number;
    behavior?: ScrollToBehavior;
    target?: Window | HTMLElement | null;
    right?: string;
    bottom?: string;
    zIndex?: number | string;
    showLabel?: boolean;
    label?: string;
    icon?: string;
    ariaLabel?: string;
    alwaysVisible?: boolean;
    disabled?: boolean;
    variant?: ScrollTopVariant;
}

const props = withDefaults(defineProps<Props>(), {
    threshold: 240,
    behavior: 'smooth',
    target: null,
    right: '1rem',
    bottom: '1rem',
    zIndex: '60',
    showLabel: false,
    label: 'Top',
    icon: '\u2191',
    ariaLabel: 'Scroll to top',
    alwaysVisible: false,
    disabled: false,
    variant: 'filled',
});

const emits = defineEmits(['click']);

const visible = ref(props.alwaysVisible);
let removeListener: (() => void) | null = null;

const rootClass = computed(() => [`vf-scrolltop_${props.variant}`]);

const buttonStyle = computed(() => ({
    insetInlineEnd: props.right,
    bottom: props.bottom,
    zIndex: String(props.zIndex),
}));

const resolveTarget = (): Window | HTMLElement => {
    if (props.target) {
        return props.target;
    }

    return window;
};

const getTargetScrollTop = (target: Window | HTMLElement) => {
    if (target === window) {
        return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
    }

    return (target as HTMLElement).scrollTop;
};

const syncVisible = () => {
    if (props.alwaysVisible) {
        visible.value = true;

        return;
    }

    if (typeof window === 'undefined') {
        visible.value = false;

        return;
    }

    const target = resolveTarget();
    visible.value = getTargetScrollTop(target) >= Math.max(0, props.threshold);
};

const bindScrollListener = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const target = resolveTarget();
    const onScroll = () => syncVisible();

    if (target === window) {
        window.addEventListener('scroll', onScroll, { passive: true });
        removeListener = () => window.removeEventListener('scroll', onScroll);
    } else {
        target.addEventListener('scroll', onScroll, { passive: true });
        removeListener = () => target.removeEventListener('scroll', onScroll);
    }

    syncVisible();
};

const unbindScrollListener = () => {
    if (removeListener) {
        removeListener();
        removeListener = null;
    }
};

const scrollToTop = () => {
    const target = resolveTarget();

    if (target === window) {
        window.scrollTo({ top: 0, behavior: props.behavior });

        return;
    }

    target.scrollTo({ top: 0, behavior: props.behavior });
};

const onClick = (event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    scrollToTop();
    emits('click', event);
};

watch(
    () => [props.target, props.threshold, props.alwaysVisible] as const,
    () => {
        unbindScrollListener();
        bindScrollListener();
    },
);

onMounted(() => {
    bindScrollListener();
});

onBeforeUnmount(() => {
    unbindScrollListener();
});
</script>

<style lang="scss">
.vf-scrolltop {
    position: fixed;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-scrolltop-gap);
    min-width: var(--vf-scrolltop-size);
    height: var(--vf-scrolltop-size);
    border-radius: var(--vf-scrolltop-border-radius);
    border: var(--vf-border-width) solid var(--vf-scrolltop-border-color);
    background-color: var(--vf-scrolltop-background-color);
    color: var(--vf-scrolltop-text-color);
    cursor: pointer;
    padding: var(--vf-scrolltop-padding);
}

.vf-scrolltop:hover:not(:disabled) {
    background-color: var(--vf-scrolltop-hover-background-color);
}

.vf-scrolltop:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-scrolltop-focus-ring-color);
}

.vf-scrolltop:disabled {
    opacity: var(--vf-scrolltop-disabled-opacity);
    cursor: not-allowed;
}

.vf-scrolltop_outlined {
    background-color: transparent;
}

.vf-scrolltop__icon {
    font-size: var(--vf-scrolltop-icon-size);
    line-height: 1;
}

.vf-scrolltop__label {
    font-size: var(--vf-scrolltop-label-font-size);
    line-height: 1;
}
</style>
