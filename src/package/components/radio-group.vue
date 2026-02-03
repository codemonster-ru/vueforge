<template>
    <div
        :class="getClass"
        role="radiogroup"
        :aria-disabled="disabled || undefined"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { radioGroupKey, type RadioGroupContext, type RadioValue, type RadioVariant } from './radio-context';

type Direction = 'vertical' | 'horizontal';

interface Props {
    modelValue?: RadioValue;
    name?: string;
    disabled?: boolean;
    variant?: RadioVariant;
    direction?: Direction;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    disabled: false,
    variant: 'filled',
    direction: 'vertical',
});

const getClass = computed(() => {
    const classes = ['vf-radio-group'];

    if (props.direction === 'horizontal') {
        classes.push('vf-radio-group_horizontal');
    }

    return classes;
});

const onChange = (value: RadioValue, event: Event) => {
    emits('update:modelValue', value);
    emits('change', value, event);
};

const context: RadioGroupContext = {
    name: computed(() => props.name),
    modelValue: computed(() => props.modelValue),
    disabled: computed(() => props.disabled),
    variant: computed(() => props.variant),
    onChange,
};

provide(radioGroupKey, context);
</script>

<style lang="scss">
.vf-radio-group {
    display: inline-flex;
    flex-direction: column;
    gap: var(--vf-radio-group-gap);
}

.vf-radio-group_horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}

</style>
