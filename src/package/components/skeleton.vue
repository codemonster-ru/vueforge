<template>
    <div :class="getClass" :style="inlineStyle" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'text' | 'rect' | 'circle';

interface Props {
    width?: string | number;
    height?: string | number;
    variant?: Variant;
    animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    width: '',
    height: '',
    variant: 'text',
    animated: true,
});

const normalizeSize = (value?: string | number) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
};

const inlineStyle = computed(() => {
    const width = normalizeSize(props.width);
    const height = normalizeSize(props.height);
    const style: Record<string, string> = {};

    if (width) {
        style.width = width;
    }
    if (height) {
        style.height = height;
    }

    if (props.variant === 'circle') {
        if (!width && height) {
            style.width = height;
        }

        if (!height && width) {
            style.height = width;
        }
    }

    return style;
});

const getClass = computed(() => {
    const classes = ['vf-skeleton', `vf-skeleton_${props.variant}`];

    if (props.animated) {
        classes.push('vf-skeleton_animated');
    }

    return classes;
});
</script>

<style lang="scss">
@keyframes vf-skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.vf-skeleton {
    display: block;
    width: var(--vf-skeleton-width);
    height: var(--vf-skeleton-height);
    border-radius: var(--vf-skeleton-border-radius);
    background: linear-gradient(
        90deg,
        var(--vf-skeleton-background-color) 0%,
        var(--vf-skeleton-shimmer-color) 50%,
        var(--vf-skeleton-background-color) 100%
    );
    background-size: 200% 100%;
}

.vf-skeleton_animated {
    animation: vf-skeleton-shimmer var(--vf-skeleton-animation-duration) ease-in-out infinite;
}

.vf-skeleton_text {
    height: var(--vf-skeleton-line-height);
}

.vf-skeleton_circle {
    border-radius: 50%;
}
</style>
