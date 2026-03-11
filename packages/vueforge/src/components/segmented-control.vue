<template>
    <div
        :class="getClass"
        role="radiogroup"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <button
            v-for="(option, index) in normalizedOptions"
            :key="option.key"
            :ref="(element: unknown) => setButtonRef(element, index)"
            class="vf-segmented-control__item"
            type="button"
            role="radio"
            :aria-checked="isSelected(option.value)"
            :class="{ 'is-active': isSelected(option.value) }"
            :disabled="disabled || option.disabled"
            @click="selectOption(option.value, $event)"
            @keydown="onOptionKeydown(index, $event)"
            @focus="onFocus"
            @blur="onBlur"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type SegmentedValue = string | number;
type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface SegmentedOption {
    label: string;
    value: SegmentedValue;
    disabled?: boolean;
}

interface Props {
    modelValue?: SegmentedValue;
    options?: Array<SegmentedOption>;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    disabled: false,
    fullWidth: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: '',
    ariaLabelledby: '',
});

const buttonRefs = ref<Array<HTMLButtonElement | null>>([]);

const normalizedOptions = computed(() => {
    return props.options.map((option, index) => ({
        ...option,
        key: `${String(option.value)}-${index}`,
    }));
});
const enabledIndices = computed(() => {
    return normalizedOptions.value.reduce<Array<number>>((result, option, index) => {
        if (!option.disabled) {
            result.push(index);
        }

        return result;
    }, []);
});
const getClass = computed(() => {
    const classes = ['vf-segmented-control', `vf-segmented-control_${props.variant}`];

    if (props.fullWidth) {
        classes.push('vf-segmented-control_full-width');
    }

    if (props.size !== 'normal') {
        classes.push(`vf-segmented-control_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-segmented-control_disabled');
    }

    return classes;
});

const isSelected = (value: SegmentedValue) => props.modelValue === value;

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const selectOption = (value: SegmentedValue, event: Event) => {
    if (props.disabled) {
        return;
    }

    const target = normalizedOptions.value.find(option => option.value === value);

    if (!target || target.disabled) {
        return;
    }

    emits('update:modelValue', value);
    emits('change', value, event);
};

const setButtonRef = (element: unknown, index: number) => {
    buttonRefs.value[index] = element instanceof HTMLButtonElement ? element : null;
};

const onOptionKeydown = (index: number, event: KeyboardEvent) => {
    if (props.disabled || !enabledIndices.value.length) {
        return;
    }

    const key = event.key;

    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(key)) {
        return;
    }

    event.preventDefault();

    const currentEnabledIndex = enabledIndices.value.indexOf(index);
    const fallbackEnabled = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    let nextEnabledIndex = fallbackEnabled;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
        nextEnabledIndex = (fallbackEnabled + 1) % enabledIndices.value.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        nextEnabledIndex = (fallbackEnabled - 1 + enabledIndices.value.length) % enabledIndices.value.length;
    } else if (key === 'Home') {
        nextEnabledIndex = 0;
    } else if (key === 'End') {
        nextEnabledIndex = enabledIndices.value.length - 1;
    }

    const nextOptionIndex = enabledIndices.value[nextEnabledIndex];
    const nextOption = normalizedOptions.value[nextOptionIndex];
    const nextButton = buttonRefs.value[nextOptionIndex];

    nextButton?.focus();

    if (nextOption) {
        selectOption(nextOption.value, event);
    }
};
</script>

<style lang="scss">
.vf-segmented-control {
    display: inline-flex;
    align-items: stretch;
    gap: var(--vf-segmented-control-gap);
    padding: var(--vf-segmented-control-padding);
    border: var(--vf-border-width) solid var(--vf-segmented-control-border-color);
    border-radius: var(--vf-segmented-control-border-radius);
    background-color: var(--vf-segmented-control-background-color);
    color: var(--vf-segmented-control-text-color);
    font-size: var(--vf-segmented-control-font-size);
    box-sizing: border-box;
}

.vf-segmented-control_outlined {
    background-color: transparent;
}

.vf-segmented-control__item {
    appearance: none;
    border: none;
    border-radius: var(--vf-segmented-control-segment-radius);
    background: transparent;
    color: inherit;
    padding: var(--vf-segmented-control-segment-padding);
    font: inherit;
    font-weight: var(--vf-segmented-control-segment-font-weight);
    line-height: var(--vf-typography-line-height);
    cursor: pointer;
    white-space: nowrap;
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-segmented-control__item:hover:not(:disabled),
.vf-segmented-control__item:focus-visible:not(:disabled) {
    background-color: var(--vf-segmented-control-hover-background-color);
    outline: none;
    box-shadow: var(--vf-segmented-control-focus-ring-shadow);
}

.vf-segmented-control__item.is-active {
    background-color: var(--vf-segmented-control-active-background-color);
    color: var(--vf-segmented-control-active-text-color);
}

.vf-segmented-control__item:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.vf-segmented-control_full-width {
    display: flex;
    width: 100%;

    .vf-segmented-control__item {
        flex: 1 1 0;
    }
}

.vf-segmented-control_small {
    font-size: var(--vf-segmented-control-small-font-size);
    padding: var(--vf-segmented-control-small-padding);

    .vf-segmented-control__item {
        padding: var(--vf-segmented-control-small-segment-padding);
    }
}

.vf-segmented-control_large {
    font-size: var(--vf-segmented-control-large-font-size);
    padding: var(--vf-segmented-control-large-padding);

    .vf-segmented-control__item {
        padding: var(--vf-segmented-control-large-segment-padding);
    }
}

.vf-segmented-control_disabled {
    opacity: var(--vf-segmented-control-disabled-opacity);
    cursor: not-allowed;
}
</style>
