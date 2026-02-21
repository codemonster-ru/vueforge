<template>
    <div :class="getClass">
        <textarea
            :id="id"
            class="vf-textarea__control"
            :name="name"
            :value="modelValue"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :inputmode="inputmode"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
            :aria-invalid="
                ariaInvalid === true || ariaInvalid === 'true' ? 'true' : ariaInvalid === 'false' ? 'false' : undefined
            "
            :aria-required="
                required
                    ? 'true'
                    : ariaRequired === true || ariaRequired === 'true'
                      ? 'true'
                      : ariaRequired === 'false'
                        ? 'false'
                        : undefined
            "
            :rows="rows"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    autocomplete?: string;
    inputmode?: InputMode;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    ariaInvalid?: boolean | 'true' | 'false';
    ariaRequired?: boolean | 'true' | 'false';
    size?: Size;
    variant?: Variant;
    rows?: number;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    id: undefined,
    name: undefined,
    autocomplete: undefined,
    inputmode: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
    ariaInvalid: undefined,
    ariaRequired: undefined,
    size: 'normal',
    variant: 'filled',
    rows: 3,
});

const getClass = computed(() => {
    const classes = ['vf-textarea', `vf-textarea_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-textarea_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-textarea_disabled');
    }

    return classes;
});

const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;

    emits('update:modelValue', target.value);
    emits('input', event);
};
const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-textarea {
    display: flex;
    align-items: stretch;
    gap: var(--vf-textarea-gap);
    min-height: var(--vf-textarea-min-height);
    box-sizing: border-box;
    padding: var(--vf-textarea-padding);
    border-radius: var(--vf-textarea-border-radius);
    border: var(--vf-border-width) solid var(--vf-textarea-border-color);
    background-color: var(--vf-textarea-background-color);
    color: var(--vf-textarea-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-textarea__control {
    flex: 1;
    min-height: var(--vf-textarea-min-height);
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-textarea-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    resize: var(--vf-textarea-resize);
    width: 100%;
    padding: 0;
    box-sizing: border-box;

    &::placeholder {
        color: var(--vf-textarea-placeholder-color);
    }
}

.vf-textarea:hover:not(.vf-textarea_disabled) {
    border-color: var(--vf-textarea-hover-border-color);
}

.vf-textarea:focus-within:not(.vf-textarea_disabled) {
    border-color: var(--vf-textarea-focus-border-color);
    box-shadow: var(--vf-textarea-focus-ring-shadow);
}

.vf-textarea_outlined {
    background-color: transparent;
}

.vf-textarea_small {
    padding: var(--vf-textarea-small-padding);

    .vf-textarea__control {
        font-size: var(--vf-textarea-small-font-size);
    }
}

.vf-textarea_large {
    padding: var(--vf-textarea-large-padding);

    .vf-textarea__control {
        font-size: var(--vf-textarea-large-font-size);
    }
}

.vf-textarea_disabled {
    opacity: var(--vf-textarea-disabled-opacity);
    cursor: not-allowed;
}
</style>
