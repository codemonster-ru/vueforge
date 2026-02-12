<template>
    <div :class="getClass">
        <span v-if="$slots.prefix" class="vf-masked-input__prefix">
            <slot name="prefix" />
        </span>
        <input
            ref="control"
            class="vf-masked-input__control"
            type="text"
            :value="displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span v-if="$slots.suffix" class="vf-masked-input__suffix">
            <slot name="suffix" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type MaskTransformer = (value: string) => string;

interface Props {
    modelValue?: string;
    mask?: string | MaskTransformer;
    placeholder?: string;
    placeholderChar?: string;
    disabled?: boolean;
    readonly?: boolean;
    unmask?: boolean;
    size?: Size;
    variant?: Variant;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'complete']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    mask: '',
    placeholder: '',
    placeholderChar: '_',
    disabled: false,
    readonly: false,
    unmask: false,
    size: 'normal',
    variant: 'filled',
});

const tokenMatchers: Record<string, RegExp> = {
    '#': /\d/,
    A: /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
};

const stringMask = computed(() => (typeof props.mask === 'string' ? props.mask : ''));
const functionMask = computed(() => (typeof props.mask === 'function' ? props.mask : null));
const maskTokens = computed(() => stringMask.value.split('').filter(char => !!tokenMatchers[char]));
const tokenCount = computed(() => maskTokens.value.length);

const normalizeRaw = (value: string) => {
    return `${value ?? ''}`.replace(/\s+/g, '');
};

const extractRawByStringMask = (value: string) => {
    if (!stringMask.value) {
        return normalizeRaw(value);
    }

    const chars = `${value ?? ''}`.split('');
    const maskChars = stringMask.value.split('');
    const rawChars: Array<string> = [];
    let maskIndex = 0;
    let inputIndex = 0;

    while (maskIndex < maskChars.length && inputIndex < chars.length) {
        const maskChar = maskChars[maskIndex];
        const inputChar = chars[inputIndex];
        const matcher = tokenMatchers[maskChar];

        if (matcher) {
            if (matcher.test(inputChar)) {
                rawChars.push(inputChar);

                maskIndex += 1;
                inputIndex += 1;

                continue;
            }

            inputIndex += 1;

            continue;
        }

        if (inputChar === maskChar) {
            inputIndex += 1;
        }

        maskIndex += 1;
    }

    return rawChars.join('');
};

const applyStringMask = (rawValue: string) => {
    if (!stringMask.value) {
        return rawValue;
    }

    const raw = extractRawByStringMask(rawValue);

    if (!raw.length) {
        return '';
    }

    const mask = stringMask.value;
    let rawIndex = 0;
    let result = '';

    for (const maskChar of mask) {
        const matcher = tokenMatchers[maskChar];

        if (matcher) {
            if (rawIndex >= raw.length) {
                break;
            }

            const next = raw[rawIndex];

            if (!matcher.test(next)) {
                rawIndex += 1;

                continue;
            }

            result += next;
            rawIndex += 1;

            continue;
        }

        if (rawIndex === 0) {
            result += maskChar;

            continue;
        }

        if (rawIndex < raw.length) {
            result += maskChar;
        }
    }

    return result;
};

const getRawValue = (value: string) => {
    if (functionMask.value) {
        return normalizeRaw(value);
    }

    return extractRawByStringMask(value);
};

const getMaskedValue = (rawValue: string) => {
    if (functionMask.value) {
        return functionMask.value(rawValue);
    }

    return applyStringMask(rawValue);
};

const displayValue = computed(() => {
    const source = `${props.modelValue ?? ''}`;

    if (!props.mask) {
        return source;
    }

    if (props.unmask) {
        return getMaskedValue(getRawValue(source));
    }

    return functionMask.value ? source : getMaskedValue(getRawValue(source));
});

const isComplete = (rawValue: string) => {
    if (!stringMask.value) {
        return false;
    }

    return rawValue.length === tokenCount.value;
};

const getClass = computed(() => {
    const classes = ['vf-masked-input', `vf-masked-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-masked-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-masked-input_disabled');
    }

    return classes;
});

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const rawValue = getRawValue(target.value);
    const maskedValue = getMaskedValue(rawValue);

    target.value = maskedValue;

    emits('update:modelValue', props.unmask ? rawValue : maskedValue);
    emits('input', event);

    if (isComplete(rawValue)) {
        emits('complete', props.unmask ? rawValue : maskedValue);
    }
};

const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-masked-input {
    display: flex;
    align-items: center;
    gap: var(--vf-masked-input-gap);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-masked-input-padding);
    border-radius: var(--vf-masked-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-masked-input-border-color);
    background-color: var(--vf-masked-input-background-color);
    color: var(--vf-masked-input-text-color);
    transition: border-color 0.2s ease;
}

.vf-masked-input__control {
    flex: 1;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-masked-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    min-width: 0;
}

.vf-masked-input__control::placeholder {
    color: var(--vf-masked-input-placeholder-color);
}

.vf-masked-input:hover:not(.vf-masked-input_disabled) {
    border-color: var(--vf-masked-input-hover-border-color);
}

.vf-masked-input:focus-within:not(.vf-masked-input_disabled) {
    border-color: var(--vf-masked-input-focus-border-color);
    box-shadow: var(--vf-masked-input-focus-ring-shadow);
}

.vf-masked-input_outlined {
    background-color: transparent;
}

.vf-masked-input_small {
    padding: var(--vf-masked-input-small-padding);

    .vf-masked-input__control {
        font-size: var(--vf-masked-input-small-font-size);
    }
}

.vf-masked-input_large {
    padding: var(--vf-masked-input-large-padding);

    .vf-masked-input__control {
        font-size: var(--vf-masked-input-large-font-size);
    }
}

.vf-masked-input_disabled {
    opacity: var(--vf-masked-input-disabled-opacity);
    cursor: not-allowed;
}
</style>
