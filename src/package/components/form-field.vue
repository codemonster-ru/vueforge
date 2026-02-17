<template>
    <div :class="getClass">
        <label v-if="hasLabel" class="vf-form-field__label" :for="targetId">
            <slot name="label">{{ label }}</slot>
            <span v-if="required" class="vf-form-field__required" aria-hidden="true">*</span>
        </label>
        <div class="vf-form-field__control">
            <slot :id="targetId" :described-by="describedBy" :invalid="hasError" :required="required" />
        </div>
        <p v-if="hasHint" :id="hintId" class="vf-form-field__hint">
            <slot name="hint">{{ hint }}</slot>
        </p>
        <p v-if="hasError" :id="errorId" class="vf-form-field__error" role="alert">
            <slot name="error">{{ error }}</slot>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type Size = 'small' | 'normal' | 'large';

interface Props {
    id?: string;
    label?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    label: '',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    size: 'normal',
});

const slots = useSlots();
const generatedId = `vf-form-field-${Math.random().toString(36).slice(2, 10)}`;
const targetId = computed(() => props.id || generatedId);
const hintId = computed(() => `${targetId.value}-hint`);
const errorId = computed(() => `${targetId.value}-error`);
const hasLabel = computed(() => !!props.label || !!slots.label);
const hasHint = computed(() => !!props.hint || !!slots.hint);
const hasError = computed(() => !!props.error || !!slots.error);
const describedBy = computed(() => {
    const ids: Array<string> = [];

    if (hasHint.value) {
        ids.push(hintId.value);
    }
    if (hasError.value) {
        ids.push(errorId.value);
    }

    return ids.length ? ids.join(' ') : undefined;
});
const getClass = computed(() => {
    const classes = ['vf-form-field'];

    if (props.size !== 'normal') {
        classes.push(`vf-form-field_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-form-field_disabled');
    }
    if (hasError.value) {
        classes.push('vf-form-field_invalid');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-form-field {
    display: grid;
    gap: var(--vf-form-field-gap);
    color: var(--vf-form-field-text-color);
}

.vf-form-field__label {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--vf-form-field-label-font-size);
    line-height: var(--vf-typography-line-height);
    color: var(--vf-form-field-label-color);
}

.vf-form-field__required {
    color: var(--vf-form-field-required-color);
}

.vf-form-field__control {
    min-width: 0;
}

.vf-form-field__hint,
.vf-form-field__error {
    margin: 0;
    font-size: var(--vf-form-field-hint-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-form-field__hint {
    color: var(--vf-form-field-hint-color);
}

.vf-form-field__error {
    color: var(--vf-form-field-error-color);
}

.vf-form-field_invalid :is(
        .vf-input,
        .vf-textarea,
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
    ),
.vf-form-field_invalid .vf-password-input__field,
.vf-form-field_invalid .vf-color-picker__control,
.vf-form-field_invalid .vf-otp-input__cell {
    border-color: var(--vf-form-field-error-border-color);
}

.vf-form-field_invalid :is(
        .vf-input,
        .vf-textarea,
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
    ):focus-within,
.vf-form-field_invalid :is(
        .vf-select_open,
        .vf-autocomplete_open,
        .vf-combobox_open,
        .vf-multiselect_open,
        .vf-taginput_open,
        .vf-datepicker_open,
        .vf-daterangepicker_open,
        .vf-datetimepicker_open,
        .vf-timepicker_open,
        .vf-mention-input_open,
        .vf-treeselect_open
    ),
.vf-form-field_invalid .vf-password-input:focus-within .vf-password-input__field,
.vf-form-field_invalid .vf-color-picker__control:focus-visible,
.vf-form-field_invalid .vf-otp-input__cell:focus {
    border-color: var(--vf-form-field-error-focus-border-color);
}

.vf-form-field_small {
    gap: var(--vf-form-field-small-gap);
}

.vf-form-field_small .vf-form-field__label {
    font-size: var(--vf-form-field-small-label-font-size);
}

.vf-form-field_small .vf-form-field__hint,
.vf-form-field_small .vf-form-field__error {
    font-size: var(--vf-form-field-small-hint-font-size);
}

.vf-form-field_large {
    gap: var(--vf-form-field-large-gap);
}

.vf-form-field_large .vf-form-field__label {
    font-size: var(--vf-form-field-large-label-font-size);
}

.vf-form-field_large .vf-form-field__hint,
.vf-form-field_large .vf-form-field__error {
    font-size: var(--vf-form-field-large-hint-font-size);
}

.vf-form-field_disabled {
    opacity: var(--vf-form-field-disabled-opacity);
}
</style>
