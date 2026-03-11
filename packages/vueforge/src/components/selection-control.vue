<template>
    <label :class="rootClass">
        <input
            :id="id"
            class="vf-selection-control__control"
            :name="resolvedName"
            :type="nativeType"
            :value="nativeType === 'radio' ? String(resolvedValue) : undefined"
            :checked="checked"
            :disabled="isDisabled"
            :required="required"
            :role="type === 'switch' ? 'switch' : undefined"
            :aria-checked="type === 'switch' ? (checked ? 'true' : 'false') : undefined"
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

        <span v-if="type === 'checkbox'" class="vf-selection-control__box"></span>
        <span v-else-if="type === 'radio'" class="vf-selection-control__circle"></span>
        <span v-else class="vf-selection-control__track">
            <span class="vf-selection-control__thumb"></span>
        </span>

        <span v-if="label || $slots.default" class="vf-selection-control__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import {
    selectionControlGroupKey,
    type SelectionControlType,
    type SelectionControlValue,
} from './selection-control-context';

interface Props {
    modelValue?: unknown;
    value?: SelectionControlValue;
    type?: SelectionControlType;
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

defineOptions({ name: 'VfSelectionControl' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: true,
    type: 'checkbox',
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

const emits = defineEmits<{
    (event: 'update:modelValue', value: unknown): void;
    (event: 'change', value: unknown, eventRef: Event): void;
}>();

const group = inject(selectionControlGroupKey, null);

const type = computed(() => group?.type.value ?? props.type);
const nativeType = computed(() => (type.value === 'switch' ? 'checkbox' : type.value));
const resolvedValue = computed(() => props.value);
const resolvedName = computed(() => group?.name.value ?? props.name);
const isDisabled = computed(() => (group?.disabled.value ?? false) || props.disabled);
const resolvedModelValue = computed(() => group?.modelValue.value ?? props.modelValue);
const groupMultiple = computed(() => group?.multiple.value ?? false);

const checked = computed(() => {
    const model = resolvedModelValue.value;
    const value = resolvedValue.value;

    if (type.value === 'radio') {
        return model === value;
    }

    if (group && groupMultiple.value) {
        return Array.isArray(model) ? model.includes(value) : false;
    }

    if (Array.isArray(model)) {
        return model.includes(value);
    }

    return Boolean(model);
});

const rootClass = computed(() => {
    const classes = ['vf-selection-control', `vf-selection-control_${type.value}`];

    if (isDisabled.value) {
        classes.push('vf-selection-control_disabled');
    }

    return classes;
});

const onChange = (event: Event) => {
    if (isDisabled.value) {
        return;
    }

    const target = event.target as HTMLInputElement;
    const value = resolvedValue.value;

    if (group) {
        group.onControlChange({
            checked: target.checked,
            value,
            event,
        });
        return;
    }

    if (type.value === 'radio') {
        emits('update:modelValue', value);
        emits('change', value, event);
        return;
    }

    if (Array.isArray(props.modelValue)) {
        const next = [...props.modelValue];
        const index = next.findIndex(item => item === value);

        if (target.checked && index < 0) {
            next.push(value);
        }
        if (!target.checked && index >= 0) {
            next.splice(index, 1);
        }

        emits('update:modelValue', next);
        emits('change', next, event);
        return;
    }

    emits('update:modelValue', target.checked);
    emits('change', target.checked, event);
};
</script>

<style lang="scss">
.vf-selection-control {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-selection-control-gap);
    cursor: pointer;
    color: var(--vf-selection-control-text-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-selection-control__control {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.vf-selection-control__box {
    width: var(--vf-selection-control-box-size);
    height: var(--vf-selection-control-box-size);
    border: var(--vf-border-width) solid var(--vf-selection-control-box-border-color);
    border-radius: var(--vf-selection-control-box-border-radius);
    background-color: var(--vf-selection-control-box-background-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.vf-selection-control__control:checked + .vf-selection-control__box {
    background-color: var(--vf-selection-control-box-checked-background-color);
    border-color: var(--vf-selection-control-box-checked-border-color);
}

.vf-selection-control__control:checked + .vf-selection-control__box::after {
    content: '';
    width: calc(var(--vf-selection-control-box-size) / 2);
    height: calc(var(--vf-selection-control-box-size) / 2);
    background-color: var(--vf-selection-control-box-check-color);
    border-radius: var(--vf-selection-control-box-check-radius);
}

.vf-selection-control__circle {
    width: var(--vf-selection-control-radio-size);
    height: var(--vf-selection-control-radio-size);
    border: var(--vf-border-width) solid var(--vf-selection-control-radio-border-color);
    border-radius: 50%;
    background-color: var(--vf-selection-control-radio-background-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.vf-selection-control__control:checked + .vf-selection-control__circle {
    background-color: var(--vf-selection-control-radio-checked-background-color);
    border-color: var(--vf-selection-control-radio-checked-border-color);
}

.vf-selection-control__control:checked + .vf-selection-control__circle::after {
    content: '';
    width: var(--vf-selection-control-radio-dot-size);
    height: var(--vf-selection-control-radio-dot-size);
    background-color: var(--vf-selection-control-radio-dot-color);
    border-radius: 50%;
}

.vf-selection-control__track {
    position: relative;
    width: var(--vf-selection-control-switch-width);
    height: var(--vf-selection-control-switch-height);
    border-radius: var(--vf-selection-control-switch-height);
    background-color: var(--vf-selection-control-switch-background-color);
}

.vf-selection-control__thumb {
    position: absolute;
    top: 50%;
    left: var(--vf-selection-control-switch-thumb-offset);
    width: var(--vf-selection-control-switch-thumb-size);
    height: var(--vf-selection-control-switch-thumb-size);
    border-radius: 50%;
    background-color: var(--vf-selection-control-switch-thumb-color);
    transform: translate(0, -50%);
}

.vf-selection-control__control:checked + .vf-selection-control__track {
    background-color: var(--vf-selection-control-switch-checked-background-color);
}

.vf-selection-control__control:checked + .vf-selection-control__track .vf-selection-control__thumb {
    transform: translate(
        calc(
            var(--vf-selection-control-switch-width) - var(--vf-selection-control-switch-thumb-size) - var(
                    --vf-selection-control-switch-thumb-translate-offset
                )
        ),
        -50%
    );
}

.vf-selection-control_disabled {
    opacity: var(--vf-selection-control-disabled-opacity);
    cursor: not-allowed;
}
</style>
