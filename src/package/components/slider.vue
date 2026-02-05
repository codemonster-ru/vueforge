<template>
    <div :class="getClass" :style="sliderStyle">
        <div class="vf-slider__control">
            <div class="vf-slider__track">
                <div class="vf-slider__fill"></div>
            </div>
            <input
                class="vf-slider__input vf-slider__input_start"
                type="range"
                :min="minValue"
                :max="maxValue"
                :step="stepValue"
                :value="startValue"
                :disabled="disabled"
                :aria-label="startAriaLabel"
                :style="startInputStyle"
                @input="onInputStart"
                @change="onChangeStart"
                @focus="onFocus"
                @blur="onBlur"
            />
            <input
                v-if="isRange"
                class="vf-slider__input vf-slider__input_end"
                type="range"
                :min="minValue"
                :max="maxValue"
                :step="stepValue"
                :value="endValue"
                :disabled="disabled"
                :aria-label="endAriaLabel"
                :style="endInputStyle"
                @input="onInputEnd"
                @change="onChangeEnd"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>
        <div v-if="marks.length" class="vf-slider__marks">
            <span v-for="mark in marks" :key="mark.value" class="vf-slider__mark" :style="markStyle(mark.value)">
                <span v-if="mark.label" class="vf-slider__mark-label">{{ mark.label }}</span>
            </span>
        </div>
        <div v-if="showValue" class="vf-slider__value">{{ displayValue }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface SliderMark {
    value: number;
    label?: string;
}

interface Props {
    modelValue?: number | [number, number];
    min?: number;
    max?: number;
    step?: number;
    range?: boolean;
    disabled?: boolean;
    size?: Size;
    variant?: Variant;
    showValue?: boolean;
    marks?: Array<SliderMark>;
    ariaLabel?: string;
    ariaLabelStart?: string;
    ariaLabelEnd?: string;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);

defineOptions({ name: 'VfSlider' });

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    showValue: false,
    marks: () => [],
    ariaLabel: 'Slider',
    ariaLabelStart: 'Start value',
    ariaLabelEnd: 'End value',
});

const isRange = computed(() => props.range || Array.isArray(props.modelValue));
const minValue = computed(() => (Number.isFinite(props.min) ? props.min : 0));
const maxValue = computed(() => (Number.isFinite(props.max) ? props.max : 100));
const stepValue = computed(() => (props.step && props.step > 0 ? props.step : 1));

const getDecimals = (value: number) => {
    const text = value.toString();

    return text.includes('.') ? text.split('.')[1].length : 0;
};

const clamp = (value: number) => Math.min(maxValue.value, Math.max(minValue.value, value));

const normalize = (value: unknown) => {
    const numeric = Number(value);
    const fallback = minValue.value;
    const safe = Number.isFinite(numeric) ? numeric : fallback;
    const clamped = clamp(safe);
    const step = stepValue.value;
    const decimals = getDecimals(step);
    const snapped = Math.round((clamped - minValue.value) / step) * step + minValue.value;

    return Number.parseFloat(snapped.toFixed(decimals));
};

const rangeValue = computed<[number, number]>(() => {
    if (!isRange.value) {
        const value = normalize(props.modelValue ?? minValue.value);

        return [value, value];
    }

    const source = Array.isArray(props.modelValue) ? props.modelValue : [minValue.value, maxValue.value];
    let start = normalize(source[0]);
    let end = normalize(source[1]);

    if (start > end) {
        [start, end] = [end, start];
    }

    return [start, end];
});

const startValue = computed(() =>
    isRange.value ? rangeValue.value[0] : normalize(props.modelValue ?? minValue.value),
);
const endValue = computed(() => (isRange.value ? rangeValue.value[1] : normalize(props.modelValue ?? minValue.value)));

const toPercent = (value: number) => {
    const diff = maxValue.value - minValue.value;

    if (diff <= 0) {
        return 0;
    }

    return ((value - minValue.value) / diff) * 100;
};

const startPercent = computed(() => (isRange.value ? toPercent(startValue.value) : 0));
const endPercent = computed(() => toPercent(isRange.value ? endValue.value : startValue.value));

const sliderStyle = computed(() => ({
    '--vf-slider-start': `${startPercent.value}%`,
    '--vf-slider-end': `${endPercent.value}%`,
}));

const getClass = computed(() => {
    const classes = ['vf-slider', `vf-slider_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-slider_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-slider_disabled');
    }

    if (isRange.value) {
        classes.push('vf-slider_range');
    }

    return classes;
});

const startInputStyle = computed(() => ({
    zIndex: isRange.value && startPercent.value > 50 ? 4 : 3,
}));
const endInputStyle = computed(() => ({
    zIndex: isRange.value && startPercent.value > 50 ? 3 : 4,
}));

const updateSingle = (value: string, event: Event, type: 'input' | 'change') => {
    if (props.disabled) {
        return;
    }

    const next = normalize(Number(value));

    emits('update:modelValue', next);
    emits(type, event);
};

const updateRange = (value: string, from: 'start' | 'end', event: Event, type: 'input' | 'change') => {
    if (props.disabled) {
        return;
    }

    const next = normalize(Number(value));
    let [start, end] = rangeValue.value;

    if (from === 'start') {
        start = Math.min(next, end);
    } else {
        end = Math.max(next, start);
    }

    emits('update:modelValue', [start, end]);
    emits(type, event);
};

const onInputStart = (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (isRange.value) {
        updateRange(target.value, 'start', event, 'input');

        return;
    }

    updateSingle(target.value, event, 'input');
};
const onInputEnd = (event: Event) => {
    const target = event.target as HTMLInputElement;

    updateRange(target.value, 'end', event, 'input');
};
const onChangeStart = (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (isRange.value) {
        updateRange(target.value, 'start', event, 'change');

        return;
    }

    updateSingle(target.value, event, 'change');
};
const onChangeEnd = (event: Event) => {
    const target = event.target as HTMLInputElement;

    updateRange(target.value, 'end', event, 'change');
};
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const marks = computed(() => props.marks ?? []);
const markStyle = (value: number) => {
    const percent = toPercent(clamp(value));

    return { left: `${percent}%` };
};

const displayValue = computed(() => {
    if (isRange.value) {
        return `${rangeValue.value[0]} - ${rangeValue.value[1]}`;
    }

    return `${startValue.value}`;
});

const startAriaLabel = computed(() => (isRange.value ? props.ariaLabelStart : props.ariaLabel));
const endAriaLabel = computed(() => (isRange.value ? props.ariaLabelEnd : props.ariaLabel));
</script>

<style lang="scss">
.vf-slider {
    display: inline-flex;
    flex-direction: column;
    gap: var(--vf-slider-gap);
    width: var(--vf-slider-width);
    color: var(--vf-slider-text-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-slider__control {
    position: relative;
    height: var(--vf-slider-thumb-size);
}

.vf-slider__track {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: var(--vf-slider-track-height);
    background-color: var(--vf-slider-track-background-color);
    border-radius: var(--vf-slider-track-radius);
    transform: translateY(-50%);
}

.vf-slider__fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--vf-slider-start);
    right: calc(100% - var(--vf-slider-end));
    background-color: var(--vf-slider-fill-background-color);
    border-radius: inherit;
}

.vf-slider__input {
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: var(--vf-slider-thumb-size);
    margin: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: none;
}

.vf-slider__input:disabled {
    cursor: not-allowed;
}

.vf-slider__input::-webkit-slider-runnable-track {
    height: var(--vf-slider-track-height);
    background: transparent;
}

.vf-slider__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--vf-slider-thumb-size);
    height: var(--vf-slider-thumb-size);
    border-radius: 50%;
    background-color: var(--vf-slider-thumb-color);
    border: var(--vf-slider-thumb-border-width) solid var(--vf-slider-thumb-border-color);
    box-shadow: var(--vf-slider-thumb-shadow);
    margin-top: calc((var(--vf-slider-track-height) - var(--vf-slider-thumb-size)) / 2);
    pointer-events: auto;
}

.vf-slider__input:focus-visible::-webkit-slider-thumb {
    box-shadow: var(--vf-slider-thumb-shadow), var(--vf-slider-focus-ring-shadow);
}

.vf-slider__input::-moz-range-track {
    height: var(--vf-slider-track-height);
    background: transparent;
}

.vf-slider__input::-moz-range-thumb {
    width: var(--vf-slider-thumb-size);
    height: var(--vf-slider-thumb-size);
    border-radius: 50%;
    background-color: var(--vf-slider-thumb-color);
    border: var(--vf-slider-thumb-border-width) solid var(--vf-slider-thumb-border-color);
    box-shadow: var(--vf-slider-thumb-shadow);
    pointer-events: auto;
}

.vf-slider__input:focus-visible::-moz-range-thumb {
    box-shadow: var(--vf-slider-thumb-shadow), var(--vf-slider-focus-ring-shadow);
}

.vf-slider__marks {
    position: relative;
    height: var(--vf-slider-marks-height);
}

.vf-slider__mark {
    position: absolute;
    top: 0;
    width: var(--vf-slider-mark-size);
    height: var(--vf-slider-mark-size);
    border-radius: 50%;
    background-color: var(--vf-slider-mark-color);
    transform: translateX(-50%);
}

.vf-slider__mark-label {
    position: absolute;
    top: calc(var(--vf-slider-mark-size) + 2px);
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--vf-slider-mark-label-font-size);
    color: var(--vf-slider-mark-label-color);
    white-space: nowrap;
}

.vf-slider__value {
    font-size: var(--vf-slider-value-font-size);
    color: var(--vf-slider-value-color);
}

.vf-slider_small {
    --vf-slider-thumb-size: var(--vf-slider-small-thumb-size);
    --vf-slider-track-height: var(--vf-slider-small-track-height);
    --vf-slider-value-font-size: var(--vf-slider-small-value-font-size);
}

.vf-slider_large {
    --vf-slider-thumb-size: var(--vf-slider-large-thumb-size);
    --vf-slider-track-height: var(--vf-slider-large-track-height);
    --vf-slider-value-font-size: var(--vf-slider-large-value-font-size);
}

.vf-slider_disabled {
    opacity: var(--vf-slider-disabled-opacity);
}
</style>
