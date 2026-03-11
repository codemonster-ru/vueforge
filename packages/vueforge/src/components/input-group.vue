<template>
    <div
        :class="getClass"
        role="group"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    size?: Size;
    variant?: Variant;
    disabled?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'normal',
    variant: 'filled',
    disabled: false,
    ariaLabel: '',
    ariaLabelledby: '',
});

const getClass = computed(() => {
    const classes = ['vf-input-group', `vf-input-group_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-input-group_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-input-group_disabled');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-input-group {
    display: flex;
    align-items: stretch;
    width: 100%;
    gap: var(--vf-input-group-gap);
    min-width: 0;
}

.vf-input-group > * {
    min-width: 0;
}

.vf-input-group > :not(:first-child) {
    margin-left: calc(var(--vf-border-width) * -1);
}

.vf-input-group
    > :is(
        .vf-input-group__addon,
        .vf-input,
        .vf-number-input,
        .vf-search-input,
        .vf-masked-input,
        .vf-select,
        .vf-autocomplete,
        .vf-combobox,
        .vf-multiselect,
        .vf-taginput,
        .vf-datepicker,
        .vf-daterangepicker,
        .vf-datetimepicker,
        .vf-timepicker,
        .vf-mention-input,
        .vf-treeselect,
        .vf-button
    ) {
    border-radius: 0;
}

.vf-input-group
    > :first-child:is(
        .vf-input-group__addon,
        .vf-input,
        .vf-number-input,
        .vf-search-input,
        .vf-masked-input,
        .vf-select,
        .vf-autocomplete,
        .vf-combobox,
        .vf-multiselect,
        .vf-taginput,
        .vf-datepicker,
        .vf-daterangepicker,
        .vf-datetimepicker,
        .vf-timepicker,
        .vf-mention-input,
        .vf-treeselect,
        .vf-button
    ) {
    border-top-left-radius: var(--vf-input-group-border-radius);
    border-bottom-left-radius: var(--vf-input-group-border-radius);
}

.vf-input-group
    > :last-child:is(
        .vf-input-group__addon,
        .vf-input,
        .vf-number-input,
        .vf-search-input,
        .vf-masked-input,
        .vf-select,
        .vf-autocomplete,
        .vf-combobox,
        .vf-multiselect,
        .vf-taginput,
        .vf-datepicker,
        .vf-daterangepicker,
        .vf-datetimepicker,
        .vf-timepicker,
        .vf-mention-input,
        .vf-treeselect,
        .vf-button
    ) {
    border-top-right-radius: var(--vf-input-group-border-radius);
    border-bottom-right-radius: var(--vf-input-group-border-radius);
}

.vf-input-group
    > :is(
        .vf-input,
        .vf-number-input,
        .vf-search-input,
        .vf-masked-input,
        .vf-select,
        .vf-autocomplete,
        .vf-combobox,
        .vf-multiselect,
        .vf-taginput,
        .vf-datepicker,
        .vf-daterangepicker,
        .vf-datetimepicker,
        .vf-timepicker,
        .vf-mention-input,
        .vf-treeselect
    ) {
    flex: 1 1 auto;
}

.vf-input-group__addon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-input-group-addon-padding);
    border: var(--vf-border-width) solid var(--vf-input-group-addon-border-color);
    background-color: var(--vf-input-group-addon-background-color);
    color: var(--vf-input-group-addon-text-color);
    font-size: var(--vf-input-group-addon-font-size);
    line-height: var(--vf-typography-line-height);
    white-space: nowrap;
}

.vf-input-group_outlined .vf-input-group__addon {
    background-color: var(--vf-input-group-addon-outlined-background-color);
}

.vf-input-group_small .vf-input-group__addon {
    padding: var(--vf-input-group-small-addon-padding);
    font-size: var(--vf-input-group-small-addon-font-size);
}

.vf-input-group_large .vf-input-group__addon {
    padding: var(--vf-input-group-large-addon-padding);
    font-size: var(--vf-input-group-large-addon-font-size);
}

.vf-input-group_disabled {
    opacity: var(--vf-input-group-disabled-opacity);
    pointer-events: none;
}
</style>
