<template>
    <div
        :class="rootClass"
        role="tree"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <ul v-if="!virtualMode" class="vf-tree__list" role="group">
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
                :is-loading="isLoading"
                :on-select="onSelect"
                :on-toggle="onToggle"
                :loading-label="asyncBranchLabel"
            >
                <template #label="slotProps">
                    <slot name="label" v-bind="slotProps" />
                </template>
            </TreeNode>
        </ul>
        <div
            v-else
            class="vf-tree__virtual"
            :style="{ maxHeight: `${virtualHeight.toString()}px` }"
            @scroll="onVirtualScroll"
        >
            <div
                class="vf-tree__spacer"
                :style="{ height: `${virtualTopSpacer.toString()}px` }"
                aria-hidden="true"
            ></div>
            <ul class="vf-tree__list" role="group">
                <li v-for="entry in virtualVisibleEntries" :key="entry.key" class="vf-tree__node" role="none">
                    <div
                        class="vf-tree__row"
                        :class="getVirtualRowClass(entry.node)"
                        :style="{ '--vf-tree-level': String(entry.level) }"
                        role="treeitem"
                        :aria-level="entry.level"
                        :aria-expanded="entry.hasChildren ? isExpanded(entry.node.key) : undefined"
                        :aria-selected="isSelected(entry.node.key)"
                        :aria-disabled="isNodeDisabled(entry.node) ? 'true' : undefined"
                        :aria-busy="isLoading(entry.node.key) ? 'true' : undefined"
                        :tabindex="isNodeDisabled(entry.node) ? -1 : 0"
                        :data-node-key="String(entry.node.key)"
                        @click="onVirtualRowClick(entry, $event)"
                        @keydown="onVirtualRowKeydown(entry, $event)"
                    >
                        <button
                            v-if="entry.hasChildren"
                            type="button"
                            class="vf-tree__toggle"
                            :class="{ 'is-expanded': isExpanded(entry.node.key) }"
                            :disabled="isNodeDisabled(entry.node) || isLoading(entry.node.key)"
                            tabindex="-1"
                            :aria-label="isExpanded(entry.node.key) ? 'Collapse' : 'Expand'"
                            @click.stop="onToggle(entry.node, $event)"
                        >
                            {{ isLoading(entry.node.key) ? '...' : isExpanded(entry.node.key) ? '-' : '+' }}
                        </button>
                        <span v-else class="vf-tree__toggle-spacer" aria-hidden="true" />
                        <span class="vf-tree__label">
                            <slot
                                name="label"
                                :node="entry.node"
                                :level="entry.level"
                                :selected="isSelected(entry.node.key)"
                                :expanded="isExpanded(entry.node.key)"
                                :disabled="isNodeDisabled(entry.node)"
                            >
                                {{ entry.node.label }}
                            </slot>
                        </span>
                    </div>
                </li>
            </ul>
            <div
                class="vf-tree__spacer"
                :style="{ height: `${virtualBottomSpacer.toString()}px` }"
                aria-hidden="true"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import TreeNode from './tree-node.vue';

export type TreeValue = string | number;
export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export interface TreeItem {
    key: TreeValue;
    label: string;
    disabled?: boolean;
    hasChildren?: boolean;
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
    selectionMode?: TreeSelectionMode;
    selectable?: boolean;
    expandOnClick?: boolean;
    disabled?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'filled' | 'outlined';
    ariaLabel?: string;
    ariaLabelledby?: string;
    virtualized?: boolean;
    virtualizationThreshold?: number;
    itemHeight?: number;
    virtualHeight?: number;
    overscan?: number;
    loadingKeys?: Array<TreeValue>;
    loadOnExpand?: boolean;
    asyncBranchLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: undefined,
    expandedKeys: () => [],
    multiple: false,
    selectionMode: undefined,
    selectable: true,
    expandOnClick: true,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Tree',
    ariaLabelledby: '',
    virtualized: false,
    virtualizationThreshold: 120,
    itemHeight: 32,
    virtualHeight: 360,
    overscan: 4,
    loadingKeys: () => [],
    loadOnExpand: false,
    asyncBranchLabel: 'Loading...',
});
defineSlots<{
    label?: (props: TreeLabelSlotProps) => unknown;
}>();

const emits = defineEmits([
    'update:modelValue',
    'update:expandedKeys',
    'change',
    'toggle',
    'nodeClick',
    'loadChildren',
]);

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
const loadingSet = computed(() => new Set(props.loadingKeys));
const virtualScrollTop = ref(0);

const effectiveSelectionMode = computed<TreeSelectionMode>(() => {
    if (props.selectionMode) {
        return props.selectionMode;
    }

    if (!props.selectable) {
        return 'none';
    }

    return props.multiple ? 'multiple' : 'single';
});

const isNodeDisabled = (node: TreeItem) => props.disabled || !!node.disabled;
const isSelected = (key: TreeValue) => selectedSet.value.has(key);
const isExpanded = (key: TreeValue) => expandedSet.value.has(key);
const isLoading = (key: TreeValue) => loadingSet.value.has(key);
const hasChildren = (node: TreeItem) => Boolean(node.hasChildren) || !!node.children?.length;

type FlattenedTreeNode = {
    key: string;
    node: TreeItem;
    level: number;
    hasChildren: boolean;
};

const flattenVisibleTree = (source: Array<TreeItem>, level: number): Array<FlattenedTreeNode> => {
    const result: Array<FlattenedTreeNode> = [];

    for (const node of source) {
        const nodeHasChildren = hasChildren(node);
        result.push({
            key: String(node.key),
            node,
            level,
            hasChildren: nodeHasChildren,
        });

        if (nodeHasChildren && isExpanded(node.key) && node.children?.length) {
            result.push(...flattenVisibleTree(node.children, level + 1));
        }
    }

    return result;
};

const flattenedVisibleNodes = computed(() => flattenVisibleTree(props.items, 1));
const virtualMode = computed(
    () => props.virtualized && flattenedVisibleNodes.value.length >= props.virtualizationThreshold,
);
const virtualWindow = computed(() => {
    if (!virtualMode.value) {
        return {
            start: 0,
            end: flattenedVisibleNodes.value.length,
        };
    }

    const visibleCount = Math.max(1, Math.ceil(props.virtualHeight / props.itemHeight));
    const start = Math.max(0, Math.floor(virtualScrollTop.value / props.itemHeight) - props.overscan);
    const end = Math.min(flattenedVisibleNodes.value.length, start + visibleCount + props.overscan * 2);

    return { start, end };
});
const virtualVisibleEntries = computed(() =>
    flattenedVisibleNodes.value.slice(virtualWindow.value.start, virtualWindow.value.end),
);
const virtualTopSpacer = computed(() => virtualWindow.value.start * props.itemHeight);
const virtualBottomSpacer = computed(() =>
    Math.max(0, (flattenedVisibleNodes.value.length - virtualWindow.value.end) * props.itemHeight),
);

const focusVirtualNode = async (key: TreeValue) => {
    await nextTick();
    const selector = `[data-node-key="${String(key)}"]`;
    const element = document.querySelector<HTMLElement>(selector);
    element?.focus();
};

const onSelect = (node: TreeItem, event: Event) => {
    emits('nodeClick', node, event);

    if (effectiveSelectionMode.value === 'none' || isNodeDisabled(node)) {
        return;
    }

    if (effectiveSelectionMode.value === 'multiple') {
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

    if (!exists && props.loadOnExpand && hasChildren(node) && !node.children?.length) {
        emits('loadChildren', node.key, node, event);
    }

    emits('update:expandedKeys', next);
    emits('toggle', node.key, !exists, node, event);
};

const onVirtualScroll = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    virtualScrollTop.value = target.scrollTop;
};

const getVirtualRowClass = (node: TreeItem) => {
    const classes = [`vf-tree__row_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-tree__row_${props.size}`);
    }

    if (isSelected(node.key)) {
        classes.push('is-selected');
    }

    if (isNodeDisabled(node)) {
        classes.push('is-disabled');
    }

    return classes;
};

const focusNextVirtual = (entry: FlattenedTreeNode, offset: number) => {
    const index = flattenedVisibleNodes.value.findIndex(item => item.key === entry.key);

    if (index < 0) {
        return;
    }

    const nextIndex = Math.max(0, Math.min(flattenedVisibleNodes.value.length - 1, index + offset));
    const nextEntry = flattenedVisibleNodes.value[nextIndex];

    if (!nextEntry || isNodeDisabled(nextEntry.node)) {
        return;
    }

    focusVirtualNode(nextEntry.node.key);
};

const onVirtualRowClick = (entry: FlattenedTreeNode, event: Event) => {
    if (props.expandOnClick && entry.hasChildren) {
        onToggle(entry.node, event);
    }

    onSelect(entry.node, event);
};

const onVirtualRowKeydown = (entry: FlattenedTreeNode, event: KeyboardEvent) => {
    if (isNodeDisabled(entry.node)) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onVirtualRowClick(entry, event);
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusNextVirtual(entry, 1);
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusNextVirtual(entry, -1);
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (entry.hasChildren && !isExpanded(entry.node.key)) {
            onToggle(entry.node, event);
        }
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (entry.hasChildren && isExpanded(entry.node.key)) {
            onToggle(entry.node, event);
        }
        return;
    }
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

.vf-tree__virtual {
    overflow: auto;
}

.vf-tree__spacer {
    width: 1px;
}
</style>
