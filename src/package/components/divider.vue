<template>
    <div :class="getClass" role="separator" :aria-orientation="orientation" :aria-label="ariaLabel">
        <span v-if="showLabel" class="vf-divider__label">
            <slot>{{ label }}</slot>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type Orientation = 'horizontal' | 'vertical';
type Variant = 'solid' | 'dashed' | 'dotted';

interface Props {
    orientation?: Orientation;
    variant?: Variant;
    inset?: boolean;
    label?: string;
    ariaLabel?: string;
}

defineOptions({ name: 'VfDivider' });

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    variant: 'solid',
    inset: false,
    label: '',
    ariaLabel: 'Divider',
});

const slots = useSlots();

const showLabel = computed(() => {
    return props.orientation === 'horizontal' && (!!props.label || !!slots.default);
});

const getClass = computed(() => {
    const classes = ['vf-divider', `vf-divider_${props.orientation}`, `vf-divider_${props.variant}`];

    if (props.inset) {
        classes.push('vf-divider_inset');
    }

    if (showLabel.value) {
        classes.push('vf-divider_with-label');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-divider {
    --vf-divider-line-style: solid;
    color: var(--vf-divider-text-color);
    box-sizing: border-box;
}

.vf-divider_horizontal {
    display: flex;
    align-items: center;
    width: 100%;
    border-top: var(--vf-divider-thickness) var(--vf-divider-line-style) var(--vf-divider-color);
}

.vf-divider_horizontal.vf-divider_with-label {
    border-top: none;
    gap: var(--vf-divider-gap);
}

.vf-divider_horizontal.vf-divider_with-label::before,
.vf-divider_horizontal.vf-divider_with-label::after {
    content: '';
    flex: 1;
    border-top: var(--vf-divider-thickness) var(--vf-divider-line-style) var(--vf-divider-color);
}

.vf-divider_vertical {
    display: inline-flex;
    align-self: stretch;
    min-height: var(--vf-divider-min-length);
    border-left: var(--vf-divider-thickness) var(--vf-divider-line-style) var(--vf-divider-color);
}

.vf-divider_solid {
    --vf-divider-line-style: solid;
}

.vf-divider_dashed {
    --vf-divider-line-style: dashed;
}

.vf-divider_dotted {
    --vf-divider-line-style: dotted;
}

.vf-divider_inset.vf-divider_horizontal {
    margin-inline: var(--vf-divider-inset);
    width: auto;
}

.vf-divider_inset.vf-divider_vertical {
    margin-block: var(--vf-divider-inset);
}

.vf-divider__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--vf-divider-label-padding);
    font-size: var(--vf-divider-label-font-size);
    line-height: var(--vf-typography-line-height);
    color: inherit;
    white-space: nowrap;
}
</style>
