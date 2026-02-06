<template>
    <label :class="getClass">
        <input
            class="vf-radio__control"
            type="radio"
            :name="resolvedName"
            :value="value"
            :checked="checked"
            :disabled="isDisabled"
            @change="onChange"
        />
        <span class="vf-radio__circle"></span>
        <span v-if="label || $slots.default" class="vf-radio__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { radioGroupKey, type RadioGroupContext, type RadioValue, type RadioVariant } from './radio-context';

interface Props {
    modelValue?: RadioValue;
    value?: RadioValue;
    label?: string;
    disabled?: boolean;
    name?: string;
    variant?: RadioVariant;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    label: '',
    disabled: false,
    name: '',
    variant: 'filled',
});

const group = inject<RadioGroupContext | null>(radioGroupKey, null);

const resolvedModelValue = computed(() => (group ? group.modelValue.value : props.modelValue));
const resolvedName = computed(() => (group ? group.name.value : props.name));
const resolvedVariant = computed(() => (group ? group.variant.value : props.variant));
const isDisabled = computed(() => (group ? group.disabled.value : false) || props.disabled);
const checked = computed(() => resolvedModelValue.value === props.value);

const getClass = computed(() => {
    const classes = ['vf-radio', `vf-radio_${resolvedVariant.value}`];

    if (isDisabled.value) {
        classes.push('vf-radio_disabled');
    }

    return classes;
});

const onChange = (event: Event) => {
    if (isDisabled.value) {
        return;
    }

    if (group) {
        group.onChange(props.value, event);
    } else {
        emits('update:modelValue', props.value);
    }

    emits('change', props.value, event);
};
</script>

<style lang="scss">
.vf-radio {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-radio-gap);
    cursor: pointer;
    color: var(--vf-radio-text-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-radio__control {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.vf-radio__circle {
    width: var(--vf-radio-size);
    height: var(--vf-radio-size);
    border: var(--vf-border-width) solid var(--vf-radio-border-color);
    border-radius: var(--vf-radio-border-radius);
    background-color: var(--vf-radio-background-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease;
}

.vf-radio__control:checked + .vf-radio__circle {
    background-color: var(--vf-radio-checked-background-color);
    border-color: var(--vf-radio-checked-border-color);
}

.vf-radio__control:checked + .vf-radio__circle::after {
    content: '';
    width: var(--vf-radio-dot-size);
    height: var(--vf-radio-dot-size);
    background-color: var(--vf-radio-dot-color);
    border-radius: var(--vf-radio-dot-border-radius);
}

.vf-radio_outlined .vf-radio__circle {
    background-color: transparent;
}

.vf-radio_disabled {
    opacity: var(--vf-radio-disabled-opacity);
    cursor: not-allowed;
}
</style>
