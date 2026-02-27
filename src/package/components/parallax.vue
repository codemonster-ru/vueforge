<template>
    <component
        :is="as"
        ref="rootRef"
        class="vf-parallax"
        :class="{ 'vf-parallax_disabled': disabled || isReducedMotion }"
        :aria-label="ariaLabel || undefined"
    >
        <div class="vf-parallax__inner" :style="innerStyle">
            <slot />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Axis = 'x' | 'y';

interface Props {
    as?: string;
    speed?: number;
    axis?: Axis;
    reverse?: boolean;
    maxOffset?: number;
    clamp?: boolean;
    disabled?: boolean;
    reducedMotion?: boolean | null;
    ariaLabel?: string;
}

defineOptions({ name: 'VfParallax' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    speed: 0.2,
    axis: 'y',
    reverse: false,
    maxOffset: 120,
    clamp: true,
    disabled: false,
    reducedMotion: null,
    ariaLabel: '',
});

const emits = defineEmits<{
    (event: 'change', payload: { offset: number }): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const offset = ref(0);
let frame: number | null = null;

const detectReducedMotion = () => {
    if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-vf-reduced-motion') === 'true') {
        return true;
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
};

const isReducedMotion = computed(() => {
    if (props.reducedMotion === true) {
        return true;
    }
    if (props.reducedMotion === false) {
        return false;
    }

    return detectReducedMotion();
});

const clampOffset = (value: number) => {
    if (!props.clamp) {
        return value;
    }

    const max = Math.max(props.maxOffset, 0);
    if (value > max) {
        return max;
    }
    if (value < -max) {
        return -max;
    }

    return value;
};

const updateOffset = () => {
    const isDisabled = props.disabled || isReducedMotion.value;
    if (isDisabled || typeof window === 'undefined') {
        offset.value = 0;
        emits('change', { offset: 0 });
        return;
    }

    const direction = props.reverse ? -1 : 1;
    const raw = window.scrollY * props.speed * direction;
    const next = clampOffset(raw);

    offset.value = next;
    emits('change', { offset: next });
};

const requestUpdate = () => {
    if (frame !== null || typeof window === 'undefined') {
        return;
    }

    frame = window.requestAnimationFrame(() => {
        frame = null;
        updateOffset();
    });
};

const innerStyle = computed(() => {
    const translateX = props.axis === 'x' ? offset.value : 0;
    const translateY = props.axis === 'y' ? offset.value : 0;

    return {
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    };
});

watch(
    () =>
        [
            props.speed,
            props.axis,
            props.reverse,
            props.maxOffset,
            props.clamp,
            props.disabled,
            props.reducedMotion,
        ] as const,
    () => {
        requestUpdate();
    },
);

onMounted(() => {
    updateOffset();

    if (typeof window === 'undefined') {
        return;
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
});

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', requestUpdate);
        window.removeEventListener('resize', requestUpdate);
    }

    if (frame !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(frame);
        frame = null;
    }
});
</script>

<style lang="scss">
.vf-parallax {
    display: block;
    overflow: var(--vf-parallax-overflow);
}

.vf-parallax__inner {
    will-change: transform;
    transform-origin: var(--vf-parallax-transform-origin);
    transition: transform var(--vf-parallax-transition);
}

.vf-parallax_disabled .vf-parallax__inner {
    transform: translate3d(0, 0, 0) !important;
}

.vf-parallax_disabled {
    opacity: var(--vf-parallax-disabled-opacity);
}
</style>
