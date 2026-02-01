<template>
    <div :class="getClass">
        <span v-if="$slots.prefix" class="vf-input__prefix">
            <slot name="prefix" />
        </span>
        <input
            class="vf-input__control"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span v-if="$slots.suffix" class="vf-input__suffix">
            <slot name="suffix" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: string | number;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
});

const getClass = computed(() => {
    const classes = ['vf-input', `vf-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-input_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-input_disabled');
    }

    return classes;
});

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('update:modelValue', target.value);
    emits('input', event);
};
const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-input {
    display: flex;
    align-items: center;
    gap: var(--vf-input-gap);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-input-padding);
    border-radius: var(--vf-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-input-border-color);
    background-color: var(--vf-input-background-color);
    color: var(--vf-input-text-color);
    transition: border-color 0.2s ease;
}

.vf-input__control {
    flex: 1;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;

    &::placeholder {
        color: var(--vf-input-placeholder-color);
    }
}

.vf-input:hover:not(.vf-input_disabled) {
    border-color: var(--vf-input-hover-border-color);
}

.vf-input:focus-within:not(.vf-input_disabled) {
    border-color: var(--vf-input-focus-border-color);
    box-shadow: var(--vf-input-focus-ring-shadow);
}

.vf-input_outlined {
    background-color: transparent;
}

.vf-input_small {
    padding: var(--vf-input-small-padding);

    .vf-input__control {
        font-size: var(--vf-input-small-font-size);
    }
}

.vf-input_large {
    padding: var(--vf-input-large-padding);

    .vf-input__control {
        font-size: var(--vf-input-large-font-size);
    }
}

.vf-input_disabled {
    opacity: var(--vf-input-disabled-opacity);
    cursor: not-allowed;
}
</style>
