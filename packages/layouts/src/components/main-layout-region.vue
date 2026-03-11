<template>
    <component :is="as" :class="rootClass" :style="rootStyle" :role="resolvedRole" :aria-label="resolvedAriaLabel">
        <div class="vf-main-layout-region__inner" :class="innerClass">
            <slot />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    as?: string;
    landmark?: boolean;
    ariaLabel?: string;
    padded?: boolean;
    bordered?: boolean;
    constrained?: boolean;
    center?: boolean;
    maxWidth?: string;
}

defineOptions({ name: 'VfMainLayoutRegion' });

const props = withDefaults(defineProps<Props>(), {
    as: 'main',
    landmark: true,
    ariaLabel: 'Main content',
    padded: true,
    bordered: false,
    constrained: false,
    center: true,
    maxWidth: '',
});

const rootClass = computed(() => [
    'vf-main-layout-region',
    {
        'vf-main-layout-region_padded': props.padded,
        'vf-main-layout-region_bordered': props.bordered,
    },
]);

const innerClass = computed(() => [
    {
        'vf-main-layout-region__inner_constrained': props.constrained,
        'vf-main-layout-region__inner_centered': props.constrained && props.center,
    },
]);

const rootStyle = computed(() => {
    const style: Record<string, string> = {};

    if (props.maxWidth) {
        style['--vf-main-layout-region-max-width-override'] = props.maxWidth;
    }

    return style;
});

const resolvedRole = computed(() => {
    if (!props.landmark) {
        return undefined;
    }

    return props.as === 'main' ? undefined : 'main';
});

const resolvedAriaLabel = computed(() => {
    if (!props.landmark) {
        return undefined;
    }

    return props.ariaLabel;
});
</script>

<style lang="scss">
.vf-main-layout-region {
    display: block;
    min-width: 0;
    min-height: 0;
    color: var(--vf-main-layout-region-text-color);
    background-color: var(--vf-main-layout-region-background-color);
}

.vf-main-layout-region_padded {
    padding: var(--vf-main-layout-region-padding);
}

.vf-main-layout-region_bordered {
    border: var(--vf-border-width) solid var(--vf-main-layout-region-border-color);
}

.vf-main-layout-region__inner {
    min-width: 0;
}

.vf-main-layout-region__inner_constrained {
    max-width: var(--vf-main-layout-region-max-width-override, var(--vf-main-layout-region-max-width));
}

.vf-main-layout-region__inner_centered {
    margin-inline: auto;
}
</style>
