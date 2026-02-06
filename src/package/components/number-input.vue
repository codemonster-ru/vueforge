<template>
    <div :class="getClass">
        <span v-if="$slots.prefix" class="vf-number-input__prefix">
            <slot name="prefix" />
        </span>
        <input
            class="vf-number-input__control"
            type="number"
            :value="displayValue"
            :min="minValue"
            :max="maxValue"
            :step="stepValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :aria-label="ariaLabel"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <div v-if="controls" class="vf-number-input__controls">
            <button
                class="vf-number-input__step"
                type="button"
                :disabled="disabled || readonly"
                aria-label="Increment"
                @click="stepUp"
            >
                +
            </button>
            <button
                class="vf-number-input__step"
                type="button"
                :disabled="disabled || readonly"
                aria-label="Decrement"
                @click="stepDown"
            >
                -
            </button>
        </div>
        <span v-if="$slots.suffix" class="vf-number-input__suffix">
            <slot name="suffix" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    controls?: boolean;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    min: undefined,
    max: undefined,
    step: 1,
    precision: undefined,
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    controls: true,
    ariaLabel: 'Number input',
});

const minValue = computed(() => (typeof props.min === 'number' && Number.isFinite(props.min) ? props.min : undefined));
const maxValue = computed(() => (typeof props.max === 'number' && Number.isFinite(props.max) ? props.max : undefined));
const stepValue = computed(() => (props.step && props.step > 0 ? props.step : 1));

const clamp = (value: number) => {
    if (typeof minValue.value === 'number') {
        value = Math.max(minValue.value, value);
    }

    if (typeof maxValue.value === 'number') {
        value = Math.min(maxValue.value, value);
    }

    return value;
};

const applyPrecision = (value: number) => {
    if (typeof props.precision !== 'number' || !Number.isFinite(props.precision)) {
        return value;
    }

    const digits = Math.max(0, Math.floor(props.precision));

    return Number.parseFloat(value.toFixed(digits));
};

const normalize = (raw: string) => {
    if (!raw.trim()) {
        return null;
    }

    const numeric = Number(raw);

    if (!Number.isFinite(numeric)) {
        return null;
    }

    return applyPrecision(clamp(numeric));
};

const displayValue = computed(() => {
    if (props.modelValue === null || props.modelValue === undefined || !Number.isFinite(props.modelValue)) {
        return '';
    }

    return `${props.modelValue}`;
});

const getClass = computed(() => {
    const classes = ['vf-number-input', `vf-number-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-number-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-number-input_disabled');
    }

    if (props.controls) {
        classes.push('vf-number-input_controls');
    }

    return classes;
});

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const next = normalize(target.value);

    emits('update:modelValue', next);
    emits('input', event);
};
const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const stepUp = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    const base = Number.isFinite(props.modelValue as number)
        ? (props.modelValue as number)
        : typeof minValue.value === 'number'
          ? minValue.value
          : 0;
    const next = applyPrecision(clamp(base + stepValue.value));

    emits('update:modelValue', next);
};
const stepDown = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    const base = Number.isFinite(props.modelValue as number)
        ? (props.modelValue as number)
        : typeof minValue.value === 'number'
          ? minValue.value
          : 0;
    const next = applyPrecision(clamp(base - stepValue.value));

    emits('update:modelValue', next);
};
</script>

<style lang="scss">
.vf-number-input {
    display: flex;
    align-items: center;
    gap: var(--vf-number-input-gap);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-number-input-padding);
    border-radius: var(--vf-number-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-number-input-border-color);
    background-color: var(--vf-number-input-background-color);
    color: var(--vf-number-input-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-number-input__control {
    flex: 1;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-number-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    min-width: 0;
    appearance: textfield;
}

.vf-number-input__control::-webkit-outer-spin-button,
.vf-number-input__control::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.vf-number-input__control::placeholder {
    color: var(--vf-number-input-placeholder-color);
}

.vf-number-input__controls {
    display: flex;
    flex-direction: column;
    gap: var(--vf-number-input-control-gap);
    height: 100%;
    padding-left: var(--vf-number-input-control-gap);
    border-left: var(--vf-border-width) solid var(--vf-number-input-control-border-color);
}

.vf-number-input__step {
    width: var(--vf-number-input-control-width);
    flex: 1;
    border: none;
    border-radius: var(--vf-number-input-control-radius);
    background-color: var(--vf-number-input-control-background-color);
    color: var(--vf-number-input-control-text-color);
    font-size: var(--vf-number-input-control-font-size);
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.vf-number-input__step:hover:not(:disabled) {
    background-color: var(--vf-number-input-control-hover-background-color);
}

.vf-number-input__step:disabled {
    cursor: not-allowed;
}

.vf-number-input:hover:not(.vf-number-input_disabled) {
    border-color: var(--vf-number-input-hover-border-color);
}

.vf-number-input:focus-within:not(.vf-number-input_disabled) {
    border-color: var(--vf-number-input-focus-border-color);
    box-shadow: var(--vf-number-input-focus-ring-shadow);
}

.vf-number-input_outlined {
    background-color: transparent;
}

.vf-number-input_small {
    padding: var(--vf-number-input-small-padding);

    .vf-number-input__control {
        font-size: var(--vf-number-input-small-font-size);
    }

    .vf-number-input__step {
        width: var(--vf-number-input-small-control-width);
        font-size: var(--vf-number-input-small-control-font-size);
    }
}

.vf-number-input_large {
    padding: var(--vf-number-input-large-padding);

    .vf-number-input__control {
        font-size: var(--vf-number-input-large-font-size);
    }

    .vf-number-input__step {
        width: var(--vf-number-input-large-control-width);
        font-size: var(--vf-number-input-large-control-font-size);
    }
}

.vf-number-input_disabled {
    opacity: var(--vf-number-input-disabled-opacity);
    cursor: not-allowed;
}
</style>
