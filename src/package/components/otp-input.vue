<template>
    <div :class="getClass" role="group" :aria-label="ariaLabel" @paste="onPaste">
        <input
            v-for="(_item, index) in lengthValue"
            :key="index"
            :ref="element => setInputRef(element, index)"
            class="vf-otp-input__cell"
            :type="mask ? 'password' : 'text'"
            inputmode="numeric"
            :pattern="alphanumeric ? undefined : '[0-9]*'"
            :placeholder="placeholder"
            :value="characters[index]"
            :disabled="disabled"
            :readonly="readonly"
            :autocomplete="autocomplete"
            maxlength="1"
            @input="onInput($event, index)"
            @keydown="onKeydown($event, index)"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: string;
    length?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    mask?: boolean;
    alphanumeric?: boolean;
    autocomplete?: string;
    autoFocus?: boolean;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'complete', 'focus', 'blur', 'paste']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    length: 6,
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    mask: false,
    alphanumeric: false,
    autocomplete: 'one-time-code',
    autoFocus: false,
    ariaLabel: 'OTP input',
});

const inputRefs = ref<Array<HTMLInputElement | null>>([]);

const lengthValue = computed(() => Math.max(1, Math.floor(props.length)));
const cellPattern = computed(() => (props.alphanumeric ? /[0-9a-z]/i : /[0-9]/));

const sanitize = (value: string) => {
    const normalized = `${value ?? ''}`;
    let result = '';

    for (const char of normalized) {
        if (cellPattern.value.test(char)) {
            result += char;
        }
    }

    return result.slice(0, lengthValue.value);
};

const characters = computed(() => {
    const value = sanitize(props.modelValue);
    const result = Array.from({ length: lengthValue.value }, () => '');

    for (let index = 0; index < value.length; index += 1) {
        result[index] = value[index];
    }

    return result;
});

const getClass = computed(() => {
    const classes = ['vf-otp-input', `vf-otp-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-otp-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-otp-input_disabled');
    }

    return classes;
});

const setInputRef = (element: unknown, index: number) => {
    inputRefs.value[index] = element as HTMLInputElement | null;
};

const focusCell = (index: number) => {
    const safeIndex = Math.max(0, Math.min(lengthValue.value - 1, index));
    const input = inputRefs.value[safeIndex];

    input?.focus();
    input?.select();
};

const emitValue = (nextChars: Array<string>) => {
    const nextValue = nextChars.join('');

    emits('update:modelValue', nextValue);
    emits('change', nextValue);

    if (nextValue.length === lengthValue.value) {
        emits('complete', nextValue);
    }
};

const applyChunk = (chunk: string, fromIndex: number) => {
    const nextChars = [...characters.value];
    const sanitizedChunk = sanitize(chunk);
    let lastIndex = fromIndex;

    for (let offset = 0; offset < sanitizedChunk.length; offset += 1) {
        const index = fromIndex + offset;

        if (index >= lengthValue.value) {
            break;
        }

        nextChars[index] = sanitizedChunk[offset];
        lastIndex = index;
    }

    emitValue(nextChars);

    if (sanitizedChunk.length > 0) {
        focusCell(Math.min(lastIndex + 1, lengthValue.value - 1));
    }
};

const onInput = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement;
    const raw = target.value ?? '';

    if (!raw) {
        const nextChars = [...characters.value];
        nextChars[index] = '';

        emitValue(nextChars);

        return;
    }

    applyChunk(raw, index);
};

const onPaste = (event: ClipboardEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const activeElement = document.activeElement;
    const activeIndex = inputRefs.value.findIndex(item => item === activeElement);
    const startIndex = activeIndex >= 0 ? activeIndex : 0;
    const text = event.clipboardData?.getData('text') ?? '';

    event.preventDefault();

    emits('paste', text);
    applyChunk(text, startIndex);
};

const onKeydown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Backspace') {
        event.preventDefault();

        const nextChars = [...characters.value];

        if (nextChars[index]) {
            nextChars[index] = '';

            emitValue(nextChars);

            return;
        }

        if (index > 0) {
            nextChars[index - 1] = '';

            emitValue(nextChars);
            focusCell(index - 1);
        }

        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();

        focusCell(index - 1);

        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();

        focusCell(index + 1);
    }
};

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

onMounted(() => {
    if (props.autoFocus && !props.disabled && !props.readonly) {
        focusCell(0);
    }
});
</script>

<style lang="scss">
.vf-otp-input {
    display: inline-flex;
    gap: var(--vf-otp-input-gap);
}

.vf-otp-input__cell {
    width: var(--vf-otp-input-cell-size);
    height: var(--vf-otp-input-cell-size);
    box-sizing: border-box;
    padding: var(--vf-otp-input-padding);
    border-radius: var(--vf-otp-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-otp-input-border-color);
    background-color: var(--vf-otp-input-background-color);
    color: var(--vf-otp-input-text-color);
    font-size: var(--vf-otp-input-font-size);
    line-height: 1;
    font-family: inherit;
    text-align: center;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-otp-input__cell::placeholder {
    color: var(--vf-otp-input-placeholder-color);
}

.vf-otp-input__cell:hover:not(:disabled):not([readonly]) {
    border-color: var(--vf-otp-input-hover-border-color);
}

.vf-otp-input__cell:focus-visible {
    border-color: var(--vf-otp-input-focus-border-color);
    box-shadow: var(--vf-otp-input-focus-ring-shadow);
    outline: none;
}

.vf-otp-input_outlined .vf-otp-input__cell {
    background-color: transparent;
}

.vf-otp-input_small .vf-otp-input__cell {
    width: var(--vf-otp-input-small-cell-size);
    height: var(--vf-otp-input-small-cell-size);
    padding: var(--vf-otp-input-small-padding);
    font-size: var(--vf-otp-input-small-font-size);
}

.vf-otp-input_large .vf-otp-input__cell {
    width: var(--vf-otp-input-large-cell-size);
    height: var(--vf-otp-input-large-cell-size);
    padding: var(--vf-otp-input-large-padding);
    font-size: var(--vf-otp-input-large-font-size);
}

.vf-otp-input_disabled {
    opacity: var(--vf-otp-input-disabled-opacity);
}
</style>
