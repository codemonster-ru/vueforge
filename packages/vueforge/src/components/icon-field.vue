<template>
    <div
        class="vf-icon-field"
        :class="rootClass"
        role="group"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <div v-if="$slots.start" class="vf-icon-field__slot vf-icon-field__slot_start" aria-hidden="true">
            <slot name="start" />
        </div>

        <slot />

        <div v-if="$slots.end" class="vf-icon-field__slot vf-icon-field__slot_end" aria-hidden="true">
            <slot name="end" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    size?: Size;
    variant?: Variant;
    disabled?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

defineOptions({ name: 'VfIconField' });

const props = withDefaults(defineProps<Props>(), {
    size: 'normal',
    variant: 'filled',
    disabled: false,
    ariaLabel: '',
    ariaLabelledby: '',
});

const slots = useSlots();

const rootClass = computed(() => {
    const classes = ['vf-icon-field', `vf-icon-field_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-icon-field_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-icon-field_disabled');
    }
    if (slots.start) {
        classes.push('vf-icon-field_has-start');
    }
    if (slots.end) {
        classes.push('vf-icon-field_has-end');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-icon-field {
    position: relative;
    width: 100%;
}

.vf-icon-field > :not(.vf-icon-field__slot) {
    width: 100%;
}

.vf-icon-field__slot {
    position: absolute;
    inset-block-start: 50%;
    transform: translateY(-50%);
    color: var(--vf-icon-field-icon-color);
    font-size: var(--vf-icon-field-icon-size);
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.vf-icon-field__slot_start {
    inset-inline-start: var(--vf-icon-field-slot-offset);
}

.vf-icon-field__slot_end {
    inset-inline-end: var(--vf-icon-field-slot-offset);
}

.vf-icon-field_has-start
    :is(.vf-input, .vf-search-input, .vf-number-input, .vf-masked-input, .vf-password-input__field) {
    padding-inline-start: var(--vf-icon-field-control-padding-start);
}

.vf-icon-field_has-end :is(.vf-input, .vf-search-input, .vf-number-input, .vf-masked-input, .vf-password-input__field) {
    padding-inline-end: var(--vf-icon-field-control-padding-end);
}

.vf-icon-field_has-start :is(.vf-select .vf-select__control, .vf-datepicker__trigger, .vf-timepicker__trigger) {
    padding-inline-start: var(--vf-icon-field-control-padding-start);
}

.vf-icon-field_has-end :is(.vf-select .vf-select__control, .vf-datepicker__trigger, .vf-timepicker__trigger) {
    padding-inline-end: var(--vf-icon-field-control-padding-end);
}

.vf-icon-field_disabled {
    opacity: var(--vf-icon-field-disabled-opacity);
}
</style>
