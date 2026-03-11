<template>
    <div
        class="vf-selection-control-group"
        :class="{ 'vf-selection-control-group_horizontal': direction === 'horizontal' }"
        :role="groupRole"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import {
    selectionControlGroupKey,
    type SelectionControlType,
    type SelectionControlValue,
} from './selection-control-context';

type Direction = 'vertical' | 'horizontal';

interface Props {
    modelValue?: unknown;
    type?: SelectionControlType;
    name?: string;
    disabled?: boolean;
    direction?: Direction;
    multiple?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

defineOptions({ name: 'VfSelectionControlGroup' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    type: 'checkbox',
    name: undefined,
    disabled: false,
    direction: 'vertical',
    multiple: undefined,
    ariaLabel: '',
    ariaLabelledby: '',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: unknown): void;
    (event: 'change', value: unknown, eventRef: Event): void;
}>();

const resolvedMultiple = computed(() => {
    if (props.multiple !== undefined) {
        return props.multiple;
    }

    return props.type !== 'radio';
});

const groupRole = computed(() => (props.type === 'radio' ? 'radiogroup' : 'group'));

const onControlChange = (payload: { checked: boolean; value: SelectionControlValue; event: Event }) => {
    if (props.disabled) {
        return;
    }

    if (props.type === 'radio' || !resolvedMultiple.value) {
        const next = payload.value;
        emits('update:modelValue', next);
        emits('change', next, payload.event);
        return;
    }

    const current = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : props.modelValue == null
          ? []
          : [props.modelValue as SelectionControlValue];
    const existingIndex = current.findIndex(value => value === payload.value);

    if (payload.checked && existingIndex < 0) {
        current.push(payload.value);
    }

    if (!payload.checked && existingIndex >= 0) {
        current.splice(existingIndex, 1);
    }

    emits('update:modelValue', current);
    emits('change', current, payload.event);
};

provide(selectionControlGroupKey, {
    type: computed(() => props.type),
    modelValue: computed(() => props.modelValue),
    disabled: computed(() => props.disabled),
    name: computed(() => props.name),
    multiple: resolvedMultiple,
    onControlChange,
});
</script>

<style lang="scss">
.vf-selection-control-group {
    display: inline-flex;
    flex-direction: column;
    gap: var(--vf-selection-control-group-gap);
}

.vf-selection-control-group_horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--vf-selection-control-group-horizontal-gap);
}
</style>
