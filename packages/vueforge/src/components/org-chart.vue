<template>
    <div
        :class="rootClass"
        role="tree"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <ul class="vf-org-chart__root" role="group">
            <OrgChartNode
                v-for="node in items"
                :key="node.key"
                :node="node"
                :level="1"
                :disabled="disabled"
                :size="size"
                :variant="variant"
                :collapsible="collapsible"
                :is-selected="isSelected"
                :is-expanded="isExpanded"
                :is-disabled="isNodeDisabled"
                :on-select="onSelect"
                :on-toggle="onToggle"
            >
                <template #node="slotProps">
                    <slot name="node" v-bind="slotProps" />
                </template>
            </OrgChartNode>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OrgChartNode from './org-chart-node.vue';

export type OrgChartValue = string | number;

export interface OrgChartNodeItem {
    key: OrgChartValue;
    label: string;
    title?: string;
    disabled?: boolean;
    children?: Array<OrgChartNodeItem>;
}

type ModelValue = OrgChartValue | Array<OrgChartValue> | undefined;
type NodeSlotProps = {
    node: OrgChartNodeItem;
    level: number;
    selected: boolean;
    expanded: boolean;
    disabled: boolean;
};

interface Props {
    items?: Array<OrgChartNodeItem>;
    modelValue?: ModelValue;
    expandedKeys?: Array<OrgChartValue>;
    multiple?: boolean;
    selectable?: boolean;
    collapsible?: boolean;
    disabled?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'filled' | 'outlined';
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: undefined,
    expandedKeys: () => [],
    multiple: false,
    selectable: true,
    collapsible: true,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Org chart',
    ariaLabelledby: '',
});

defineSlots<{
    node?: (props: NodeSlotProps) => unknown;
}>();

const emits = defineEmits(['update:modelValue', 'update:expandedKeys', 'change', 'toggle', 'nodeClick']);

const normalizeModelValue = (value: ModelValue) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === undefined || value === null) {
        return [];
    }

    return [value];
};

const selectedValues = computed(() => normalizeModelValue(props.modelValue));
const selectedSet = computed(() => new Set(selectedValues.value));
const expandedSet = computed(() => new Set(props.expandedKeys));

const rootClass = computed(() => {
    const classes = ['vf-org-chart', `vf-org-chart_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-org-chart_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-org-chart_disabled');
    }

    return classes;
});

const isNodeDisabled = (node: OrgChartNodeItem) => props.disabled || !!node.disabled;
const isSelected = (key: OrgChartValue) => selectedSet.value.has(key);
const isExpanded = (key: OrgChartValue) => expandedSet.value.has(key);

const onSelect = (node: OrgChartNodeItem, event: Event) => {
    emits('nodeClick', node, event);

    if (!props.selectable || isNodeDisabled(node)) {
        return;
    }

    if (props.multiple) {
        const current = selectedValues.value;
        const exists = current.includes(node.key);
        const next = exists ? current.filter(value => value !== node.key) : [...current, node.key];

        emits('update:modelValue', next);
        emits('change', next, node, event);

        return;
    }

    const next = props.modelValue === node.key ? undefined : node.key;
    emits('update:modelValue', next);
    emits('change', next, node, event);
};

const onToggle = (node: OrgChartNodeItem, event: Event) => {
    if (!props.collapsible || isNodeDisabled(node)) {
        return;
    }

    const current = props.expandedKeys;
    const exists = current.includes(node.key);
    const next = exists ? current.filter(value => value !== node.key) : [...current, node.key];

    emits('update:expandedKeys', next);
    emits('toggle', node.key, !exists, node, event);
};
</script>

<style lang="scss">
.vf-org-chart {
    color: var(--vf-org-chart-text-color);
}

.vf-org-chart__root,
.vf-org-chart__children {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: var(--vf-org-chart-gap);
    justify-content: center;
    align-items: flex-start;
}

.vf-org-chart__children {
    margin-top: var(--vf-org-chart-children-margin-top);
    position: relative;
}

.vf-org-chart__node {
    display: grid;
    justify-items: center;
    min-width: 0;
}

.vf-org-chart__children::before {
    content: '';
    position: absolute;
    top: calc(var(--vf-org-chart-children-margin-top) * -0.55);
    left: 50%;
    width: 1px;
    height: calc(var(--vf-org-chart-children-margin-top) * 0.55);
    background-color: var(--vf-org-chart-connector-color);
}

.vf-org-chart__card {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--vf-org-chart-card-gap);
    min-width: var(--vf-org-chart-card-min-width);
    max-width: var(--vf-org-chart-card-max-width);
    padding: var(--vf-org-chart-card-padding);
    border: var(--vf-border-width) solid var(--vf-org-chart-card-border-color);
    border-radius: var(--vf-org-chart-card-border-radius);
    background-color: var(--vf-org-chart-card-background-color);
    color: var(--vf-org-chart-card-text-color);
    cursor: pointer;
    outline: none;
}

.vf-org-chart__card::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    left: 50%;
    width: 1px;
    height: 0.8rem;
    background-color: var(--vf-org-chart-connector-color);
    transform: translateX(-50%);
}

.vf-org-chart__node:last-child > .vf-org-chart__card::after {
    display: none;
}

.vf-org-chart__toggle {
    width: var(--vf-org-chart-toggle-size);
    height: var(--vf-org-chart-toggle-size);
    border: var(--vf-border-width) solid var(--vf-org-chart-toggle-border-color);
    border-radius: var(--vf-org-chart-toggle-radius);
    background-color: var(--vf-org-chart-toggle-background-color);
    color: var(--vf-org-chart-toggle-text-color);
    line-height: 1;
    padding: 0;
    cursor: pointer;
}

.vf-org-chart__content {
    display: grid;
    min-width: 0;
}

.vf-org-chart__label {
    font-size: var(--vf-org-chart-label-font-size);
    font-weight: var(--vf-org-chart-label-font-weight);
}

.vf-org-chart__title {
    font-size: var(--vf-org-chart-title-font-size);
    color: var(--vf-org-chart-title-color);
}

.vf-org-chart__card:hover {
    background-color: var(--vf-org-chart-card-hover-background-color);
}

.vf-org-chart__card:focus-visible {
    box-shadow: 0 0 0 2px var(--vf-org-chart-focus-ring-color);
}

.vf-org-chart__card.is-selected {
    background-color: var(--vf-org-chart-card-selected-background-color);
    color: var(--vf-org-chart-card-selected-color);
}

.vf-org-chart__card.is-disabled {
    cursor: not-allowed;
}

.vf-org-chart_small .vf-org-chart__card {
    padding: var(--vf-org-chart-small-card-padding);
}

.vf-org-chart_small .vf-org-chart__label {
    font-size: var(--vf-org-chart-small-label-font-size);
}

.vf-org-chart_large .vf-org-chart__card {
    padding: var(--vf-org-chart-large-card-padding);
}

.vf-org-chart_large .vf-org-chart__label {
    font-size: var(--vf-org-chart-large-label-font-size);
}

.vf-org-chart_disabled {
    opacity: var(--vf-org-chart-disabled-opacity);
}

.vf-org-chart_disabled .vf-org-chart__toggle,
.vf-org-chart_disabled .vf-org-chart__card {
    pointer-events: none;
}
</style>
