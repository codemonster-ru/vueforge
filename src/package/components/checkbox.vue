<template>
    <label :class="getClass">
        <input
            class="vf-checkbox__control"
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            @change="onChange"
        />
        <span class="vf-checkbox__box"></span>
        <span v-if="label || $slots.default" class="vf-checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    disabled: false,
});

const getClass = computed(() => {
    const classes = ['vf-checkbox'];
    if (props.disabled) {
        classes.push('vf-checkbox_disabled');
    }
    return classes;
});

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('update:modelValue', target.checked);
    emits('change', event);
};
</script>

<style lang="scss">
.vf-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-checkbox-gap);
    cursor: pointer;
    color: var(--vf-checkbox-text-color);
}

.vf-checkbox__control {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.vf-checkbox__box {
    width: var(--vf-checkbox-size);
    height: var(--vf-checkbox-size);
    border: var(--vf-border-width) solid var(--vf-checkbox-border-color);
    border-radius: var(--vf-checkbox-border-radius);
    background-color: var(--vf-checkbox-background-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease;
}

.vf-checkbox__control:checked + .vf-checkbox__box {
    background-color: var(--vf-checkbox-checked-background-color);
    border-color: var(--vf-checkbox-checked-border-color);
}

.vf-checkbox__control:checked + .vf-checkbox__box::after {
    content: '';
    width: calc(var(--vf-checkbox-size) / 2);
    height: calc(var(--vf-checkbox-size) / 2);
    background-color: var(--vf-checkbox-check-color);
    border-radius: var(--vf-checkbox-check-border-radius);
}

.vf-checkbox_disabled {
    opacity: var(--vf-checkbox-disabled-opacity);
    cursor: not-allowed;
}
</style>
