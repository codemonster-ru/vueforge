<template>
    <div :class="getClass" :aria-label="ariaLabel || undefined" :aria-labelledby="ariaLabelledby || undefined">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import {
    accordionKey,
    type AccordionContext,
    type AccordionSize,
    type AccordionValue,
    type AccordionVariant,
} from './accordion-context';

let accordionIdCounter = 0;

interface Props {
    modelValue?: AccordionValue | AccordionValue[];
    multiple?: boolean;
    disabled?: boolean;
    variant?: AccordionVariant;
    size?: AccordionSize;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    multiple: false,
    disabled: false,
    variant: 'filled',
    size: 'normal',
    ariaLabel: '',
    ariaLabelledby: '',
});

const uid = ++accordionIdCounter;
const normalizeId = (value: AccordionValue) =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');

const getClass = computed(() => {
    const classes = ['vf-accordion', `vf-accordion_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-accordion_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-accordion_disabled');
    }

    return classes;
});

const toArray = (value: AccordionValue | AccordionValue[] | undefined) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === undefined || value === null) {
        return [];
    }

    return [value];
};

const onToggle = (value: AccordionValue, event: Event) => {
    if (props.disabled) {
        return;
    }

    if (props.multiple) {
        const current = toArray(props.modelValue);
        const exists = current.includes(value);
        const next = exists ? current.filter(item => item !== value) : [...current, value];

        emits('update:modelValue', next);
        emits('change', next, event);

        return;
    }

    const next = props.modelValue === value ? undefined : value;

    emits('update:modelValue', next);
    emits('change', next, event);
};

const context: AccordionContext = {
    modelValue: computed(() => props.modelValue),
    multiple: computed(() => props.multiple),
    disabled: computed(() => props.disabled),
    variant: computed(() => props.variant),
    size: computed(() => props.size),
    onToggle,
    getHeaderId: (value: AccordionValue) => `vf-accordion-header-${uid}-${normalizeId(value)}`,
    getPanelId: (value: AccordionValue) => `vf-accordion-panel-${uid}-${normalizeId(value)}`,
};

provide(accordionKey, context);
</script>

<style lang="scss">
.vf-accordion {
    display: grid;
    gap: var(--vf-accordion-gap);
}

.vf-accordion_disabled {
    opacity: var(--vf-accordion-disabled-opacity);
}
</style>
