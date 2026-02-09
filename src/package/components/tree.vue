<template>
    <div
        :class="rootClass"
        role="tree"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <ul class="vf-tree__list" role="group">
            <TreeNode
                v-for="node in items"
                :key="node.key"
                :node="node"
                :level="1"
                :size="size"
                :variant="variant"
                :disabled="disabled"
                :expand-on-click="expandOnClick"
                :selectable="selectable"
                :is-selected="isSelected"
                :is-expanded="isExpanded"
                :is-disabled="isNodeDisabled"
                :on-select="onSelect"
                :on-toggle="onToggle"
            >
                <template #label="slotProps">
                    <slot name="label" v-bind="slotProps" />
                </template>
            </TreeNode>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeNode from './tree-node.vue';

export type TreeValue = string | number;

export interface TreeItem {
    key: TreeValue;
    label: string;
    disabled?: boolean;
    children?: Array<TreeItem>;
}

type TreeModelValue = TreeValue | Array<TreeValue> | undefined;
type TreeLabelSlotProps = {
    node: TreeItem;
    level: number;
    selected: boolean;
    expanded: boolean;
    disabled: boolean;
};

interface Props {
    items?: Array<TreeItem>;
    modelValue?: TreeModelValue;
    expandedKeys?: Array<TreeValue>;
    multiple?: boolean;
    selectable?: boolean;
    expandOnClick?: boolean;
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
    expandOnClick: true,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Tree',
    ariaLabelledby: '',
});
defineSlots<{
    label?: (props: TreeLabelSlotProps) => unknown;
}>();

const emits = defineEmits(['update:modelValue', 'update:expandedKeys', 'change', 'toggle', 'nodeClick']);

const normalizeModelValue = (value: TreeModelValue) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === undefined || value === null) {
        return [];
    }

    return [value];
};

const rootClass = computed(() => {
    const classes = ['vf-tree', `vf-tree_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-tree_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-tree_disabled');
    }

    return classes;
});

const selectedValues = computed(() => normalizeModelValue(props.modelValue));
const selectedSet = computed(() => new Set(selectedValues.value));
const expandedSet = computed(() => new Set(props.expandedKeys));

const isNodeDisabled = (node: TreeItem) => props.disabled || !!node.disabled;
const isSelected = (key: TreeValue) => selectedSet.value.has(key);
const isExpanded = (key: TreeValue) => expandedSet.value.has(key);

const onSelect = (node: TreeItem, event: Event) => {
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

const onToggle = (node: TreeItem, event: Event) => {
    if (isNodeDisabled(node)) {
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
.vf-tree {
    color: var(--vf-tree-row-text-color);
}

.vf-tree__list,
.vf-tree__group {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-tree-gap);
}

.vf-tree_disabled {
    opacity: var(--vf-tree-disabled-opacity);
}
</style>
