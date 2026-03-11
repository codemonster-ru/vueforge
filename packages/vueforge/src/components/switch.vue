<template>
    <label :class="getClass">
        <input
            :id="id"
            class="vf-switch__control"
            :name="name"
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
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
            @change="onChange"
        />
        <span class="vf-switch__track">
            <span class="vf-switch__thumb"></span>
        </span>
        <span v-if="label || $slots.default" class="vf-switch__label">
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
    id?: string;
    name?: string;
    required?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    ariaInvalid?: boolean | 'true' | 'false';
    ariaRequired?: boolean | 'true' | 'false';
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    disabled: false,
    id: undefined,
    name: undefined,
    required: false,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
    ariaInvalid: undefined,
    ariaRequired: undefined,
});

const getClass = computed(() => {
    const classes = ['vf-switch'];
    if (props.disabled) {
        classes.push('vf-switch_disabled');
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
.vf-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-switch-gap);
    cursor: pointer;
    color: var(--vf-switch-text-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-switch__control {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.vf-switch__track {
    position: relative;
    width: var(--vf-switch-width);
    height: var(--vf-switch-height);
    border-radius: var(--vf-switch-height);
    background-color: var(--vf-switch-background-color);
    transition: background-color 0.2s ease;
}

.vf-switch__thumb {
    position: absolute;
    top: 50%;
    left: var(--vf-switch-thumb-offset);
    width: var(--vf-switch-thumb-size);
    height: var(--vf-switch-thumb-size);
    border-radius: 50%;
    background-color: var(--vf-switch-thumb-color);
    transform: translate(0, -50%);
    transition: transform 0.2s ease;
}

.vf-switch__control:checked + .vf-switch__track {
    background-color: var(--vf-switch-checked-background-color);
}

.vf-switch__control:checked + .vf-switch__track .vf-switch__thumb {
    transform: translate(
        calc(var(--vf-switch-width) - var(--vf-switch-thumb-size) - var(--vf-switch-thumb-translate-offset)),
        -50%
    );
}

.vf-switch_disabled {
    opacity: var(--vf-switch-disabled-opacity);
    cursor: not-allowed;
}
</style>
