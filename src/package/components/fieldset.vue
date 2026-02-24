<template>
    <fieldset :class="rootClass" :disabled="disabled">
        <legend class="vf-fieldset__legend">
            <span class="vf-fieldset__legend-label">
                <slot name="legend">{{ legend }}</slot>
            </span>
            <span
                v-if="$slots.actions || collapsible"
                class="vf-fieldset__actions"
                role="group"
                :aria-label="actionsAriaLabel || undefined"
            >
                <slot name="actions" />
                <button
                    v-if="collapsible"
                    type="button"
                    class="vf-fieldset__toggle"
                    :aria-expanded="expanded"
                    :aria-controls="contentId"
                    :disabled="disabled"
                    @click="toggleFieldset"
                >
                    {{ expanded ? collapseLabel : expandLabel }}
                </button>
            </span>
        </legend>
        <div v-if="expanded" :id="contentId" class="vf-fieldset__content">
            <slot />
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: boolean;
    legend?: string;
    variant?: Variant;
    collapsible?: boolean;
    disabled?: boolean;
    actionsAriaLabel?: string;
    expandLabel?: string;
    collapseLabel?: string;
}

let fieldsetIdSeed = 0;

const props = withDefaults(defineProps<Props>(), {
    modelValue: true,
    legend: 'Details',
    variant: 'filled',
    collapsible: false,
    disabled: false,
    actionsAriaLabel: 'Fieldset actions',
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
});

const emits = defineEmits(['update:modelValue', 'toggle']);

const expanded = ref(props.modelValue);

watch(
    () => props.modelValue,
    value => {
        expanded.value = value;
    },
);

fieldsetIdSeed += 1;
const contentId = `vf-fieldset-${fieldsetIdSeed.toString(36)}-content`;

const rootClass = computed(() => {
    const classes = ['vf-fieldset', `vf-fieldset_${props.variant}`];

    if (props.disabled) {
        classes.push('vf-fieldset_disabled');
    }
    if (!expanded.value) {
        classes.push('vf-fieldset_collapsed');
    }

    return classes;
});

const toggleFieldset = (event: Event) => {
    if (props.disabled) {
        return;
    }

    const next = !expanded.value;
    expanded.value = next;
    emits('update:modelValue', next);
    emits('toggle', next, event);
};
</script>

<style lang="scss">
.vf-fieldset {
    border: var(--vf-border-width) solid var(--vf-fieldset-border-color);
    border-radius: var(--vf-fieldset-border-radius);
    background-color: var(--vf-fieldset-background-color);
    color: var(--vf-fieldset-text-color);
    margin: 0;
    padding: var(--vf-fieldset-padding);
    min-inline-size: 0;
}

.vf-fieldset__legend {
    width: 100%;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-fieldset-header-gap);
    padding: var(--vf-fieldset-legend-padding);
    font-size: var(--vf-fieldset-legend-font-size);
    font-weight: var(--vf-fieldset-legend-font-weight);
    color: var(--vf-fieldset-legend-color);
}

.vf-fieldset__legend-label {
    overflow-wrap: anywhere;
}

.vf-fieldset__actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-fieldset-actions-gap);
}

.vf-fieldset__toggle {
    border: var(--vf-border-width) solid var(--vf-fieldset-toggle-border-color);
    border-radius: var(--vf-fieldset-toggle-radius);
    background-color: var(--vf-fieldset-toggle-background-color);
    color: var(--vf-fieldset-toggle-text-color);
    min-height: var(--vf-fieldset-toggle-size);
    padding: 0.15rem 0.45rem;
    cursor: pointer;
    font: inherit;
}

.vf-fieldset__toggle:hover {
    background-color: var(--vf-fieldset-toggle-hover-background-color);
}

.vf-fieldset__content {
    padding: var(--vf-fieldset-content-padding);
}

.vf-fieldset_outlined {
    background-color: transparent;
}

.vf-fieldset_disabled {
    opacity: var(--vf-fieldset-disabled-opacity);
}

.vf-fieldset_disabled .vf-fieldset__toggle {
    cursor: not-allowed;
}
</style>
