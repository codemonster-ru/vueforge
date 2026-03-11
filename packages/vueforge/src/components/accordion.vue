<template>
    <div :class="getClass" :aria-label="ariaLabel || undefined" :aria-labelledby="ariaLabelledby || undefined">
        <div v-if="showGroupHeader" class="vf-accordion__group-header">
            <div class="vf-accordion__group-text">
                <slot name="group-title">
                    <p v-if="groupTitle" class="vf-accordion__group-title">{{ groupTitle }}</p>
                </slot>
                <slot name="group-description">
                    <p v-if="groupDescription" class="vf-accordion__group-description">{{ groupDescription }}</p>
                </slot>
            </div>
            <div v-if="$slots['group-actions']" class="vf-accordion__group-actions">
                <slot name="group-actions" />
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, useSlots } from 'vue';
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
    dense?: boolean;
    grouped?: boolean;
    groupTitle?: string;
    groupDescription?: string;
    analytics?: boolean;
    analyticsContext?: string;
    variant?: AccordionVariant;
    size?: AccordionSize;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'itemToggle', 'itemExpand', 'itemCollapse', 'analytics']);
const slots = useSlots();
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    multiple: false,
    disabled: false,
    dense: false,
    grouped: false,
    groupTitle: '',
    groupDescription: '',
    analytics: false,
    analyticsContext: '',
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
    if (props.dense) {
        classes.push('vf-accordion_dense');
    }
    if (props.grouped) {
        classes.push('vf-accordion_grouped');
    }

    return classes;
});
const showGroupHeader = computed(() => {
    return (
        props.grouped &&
        (!!props.groupTitle ||
            !!props.groupDescription ||
            !!slots['group-title'] ||
            !!slots['group-description'] ||
            !!slots['group-actions'])
    );
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
        const expanded = !exists;

        emits('update:modelValue', next);
        emits('change', next, event);
        emits('itemToggle', { value, expanded, values: next, event });
        emits(expanded ? 'itemExpand' : 'itemCollapse', value, next, event);
        if (props.analytics) {
            emits('analytics', {
                type: expanded ? 'expand' : 'collapse',
                value,
                values: next,
                context: props.analyticsContext || undefined,
                at: new Date().toISOString(),
            });
        }

        return;
    }

    const next = props.modelValue === value ? undefined : value;
    const expanded = next !== undefined;

    emits('update:modelValue', next);
    emits('change', next, event);
    emits('itemToggle', { value, expanded, values: next, event });
    emits(expanded ? 'itemExpand' : 'itemCollapse', value, next, event);
    if (props.analytics) {
        emits('analytics', {
            type: expanded ? 'expand' : 'collapse',
            value,
            values: next,
            context: props.analyticsContext || undefined,
            at: new Date().toISOString(),
        });
    }
};

const context: AccordionContext = {
    modelValue: computed(() => props.modelValue),
    multiple: computed(() => props.multiple),
    disabled: computed(() => props.disabled),
    dense: computed(() => props.dense),
    grouped: computed(() => props.grouped),
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

.vf-accordion__group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.25rem 0.125rem 0.5rem;
}

.vf-accordion__group-text {
    min-width: 0;
}

.vf-accordion__group-title,
.vf-accordion__group-description {
    margin: 0;
}

.vf-accordion__group-title {
    font-size: 0.875rem;
    font-weight: 600;
}

.vf-accordion__group-description {
    margin-top: 0.125rem;
    font-size: 0.8125rem;
    opacity: 0.78;
}

.vf-accordion_dense {
    --vf-accordion-gap: 0.25rem;
}

.vf-accordion_grouped {
    gap: 0;
}

.vf-accordion_grouped .vf-accordion-item {
    border-radius: 0;
}

.vf-accordion_grouped .vf-accordion-item + .vf-accordion-item {
    margin-top: calc(var(--vf-border-width) * -1);
}

.vf-accordion_grouped .vf-accordion-item:first-of-type {
    border-top-left-radius: var(--vf-accordion-border-radius);
    border-top-right-radius: var(--vf-accordion-border-radius);
}

.vf-accordion_grouped .vf-accordion-item:last-of-type {
    border-bottom-left-radius: var(--vf-accordion-border-radius);
    border-bottom-right-radius: var(--vf-accordion-border-radius);
}

.vf-accordion_disabled {
    opacity: var(--vf-accordion-disabled-opacity);
}
</style>
