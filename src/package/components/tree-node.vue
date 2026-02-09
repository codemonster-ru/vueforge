<template>
    <li class="vf-tree__node" role="none">
        <div
            class="vf-tree__row"
            :class="rowClass"
            :style="rowStyle"
            role="treeitem"
            :aria-level="level"
            :aria-expanded="hasChildren ? expanded : undefined"
            :aria-selected="selected"
            :aria-disabled="disabledNode ? 'true' : undefined"
            :tabindex="disabledNode ? -1 : 0"
            @click="onRowClick"
            @keydown="onRowKeydown"
        >
            <button
                v-if="hasChildren"
                type="button"
                class="vf-tree__toggle"
                :class="{ 'is-expanded': expanded }"
                :disabled="disabledNode"
                tabindex="-1"
                :aria-label="expanded ? 'Collapse' : 'Expand'"
                @click.stop="onToggleClick"
            >
                {{ expanded ? '-' : '+' }}
            </button>
            <span v-else class="vf-tree__toggle-spacer" aria-hidden="true" />
            <span class="vf-tree__label">
                <slot
                    name="label"
                    :node="node"
                    :level="level"
                    :selected="selected"
                    :expanded="expanded"
                    :disabled="disabledNode"
                >
                    {{ node.label }}
                </slot>
            </span>
        </div>
        <ul v-if="hasChildren && expanded" class="vf-tree__group" role="group">
            <TreeNode
                v-for="child in node.children"
                :key="child.key"
                :node="child"
                :level="level + 1"
                :size="size"
                :variant="variant"
                :disabled="disabled"
                :expand-on-click="expandOnClick"
                :selectable="selectable"
                :is-selected="isSelected"
                :is-expanded="isExpanded"
                :is-disabled="isDisabled"
                :on-select="onSelect"
                :on-toggle="onToggle"
            >
                <template #label="slotProps">
                    <slot name="label" v-bind="slotProps" />
                </template>
            </TreeNode>
        </ul>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TreeItem, TreeValue } from './tree.vue';

interface Props {
    node: TreeItem;
    level: number;
    size: 'small' | 'normal' | 'large';
    variant: 'filled' | 'outlined';
    disabled: boolean;
    expandOnClick: boolean;
    selectable: boolean;
    isSelected: (key: TreeValue) => boolean;
    isExpanded: (key: TreeValue) => boolean;
    isDisabled: (node: TreeItem) => boolean;
    onSelect: (node: TreeItem, event: Event) => void;
    onToggle: (node: TreeItem, event: Event) => void;
}
type TreeLabelSlotProps = {
    node: TreeItem;
    level: number;
    selected: boolean;
    expanded: boolean;
    disabled: boolean;
};

const props = defineProps<Props>();
defineSlots<{
    label?: (props: TreeLabelSlotProps) => unknown;
}>();

const hasChildren = computed(() => !!props.node.children?.length);
const disabledNode = computed(() => props.isDisabled(props.node));
const selected = computed(() => props.isSelected(props.node.key));
const expanded = computed(() => props.isExpanded(props.node.key));

const rowClass = computed(() => {
    const classes = [`vf-tree__row_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-tree__row_${props.size}`);
    }

    if (selected.value) {
        classes.push('is-selected');
    }

    if (disabledNode.value) {
        classes.push('is-disabled');
    }

    return classes;
});

const rowStyle = computed(() => ({
    '--vf-tree-level': String(props.level),
}));

const onRowClick = (event: Event) => {
    if (disabledNode.value) {
        return;
    }

    if (props.expandOnClick && hasChildren.value) {
        props.onToggle(props.node, event);
    }

    props.onSelect(props.node, event);
};

const getVisibleItems = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    const root = element?.closest('[role="tree"]');

    if (!root) {
        return [];
    }

    return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
};

const focusItemAt = (items: Array<HTMLElement>, index: number) => {
    if (index < 0 || index >= items.length) {
        return;
    }

    items[index].focus();
};

const focusParent = (element: HTMLElement) => {
    const group = element.closest('[role="group"]');

    if (!group) {
        return;
    }

    const parent = group.previousElementSibling;

    if (parent instanceof HTMLElement && parent.getAttribute('role') === 'treeitem') {
        parent.focus();
    }
};

const onRowKeydown = (event: KeyboardEvent) => {
    if (disabledNode.value) {
        return;
    }

    const current = event.currentTarget as HTMLElement;

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onRowClick(event);

        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();

        if (hasChildren.value && !expanded.value) {
            props.onToggle(props.node, event);

            return;
        }

        const items = getVisibleItems(event.target);
        const index = items.indexOf(current);

        focusItemAt(items, index + 1);

        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();

        if (hasChildren.value && expanded.value) {
            props.onToggle(props.node, event);

            return;
        }

        focusParent(current);

        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();

        const items = getVisibleItems(event.target);

        if (!items.length) {
            return;
        }

        const index = items.indexOf(current);

        if (event.key === 'ArrowDown') {
            focusItemAt(items, index + 1);

            return;
        }

        if (event.key === 'ArrowUp') {
            focusItemAt(items, index - 1);

            return;
        }

        if (event.key === 'Home') {
            focusItemAt(items, 0);

            return;
        }

        focusItemAt(items, items.length - 1);
    }
};

const onToggleClick = (event: MouseEvent) => {
    if (disabledNode.value || !hasChildren.value) {
        return;
    }

    props.onToggle(props.node, event);
};
</script>

<style lang="scss">
.vf-tree__row {
    display: flex;
    align-items: center;
    gap: var(--vf-tree-row-gap);
    width: 100%;
    padding: var(--vf-tree-row-padding);
    padding-left: calc(var(--vf-tree-row-padding-inline) + (var(--vf-tree-indent) * (var(--vf-tree-level) - 1)));
    border-radius: var(--vf-tree-row-border-radius);
    border: none;
    background-color: var(--vf-tree-row-background-color);
    color: var(--vf-tree-row-text-color);
    font-size: var(--vf-tree-row-font-size);
    text-align: left;
    cursor: pointer;
    outline: none;
}

.vf-tree__row:hover {
    background-color: var(--vf-tree-row-hover-background-color);
}

.vf-tree__row:focus-visible {
    box-shadow: var(--vf-tree-focus-ring-shadow);
}

.vf-tree__row.is-selected {
    background-color: var(--vf-tree-row-selected-background-color);
    color: var(--vf-tree-row-selected-text-color);
}

.vf-tree__row.is-disabled {
    cursor: not-allowed;
}

.vf-tree__toggle,
.vf-tree__toggle-spacer {
    width: var(--vf-tree-toggle-size);
    height: var(--vf-tree-toggle-size);
    flex: 0 0 var(--vf-tree-toggle-size);
}

.vf-tree__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--vf-tree-toggle-radius);
    border: 1px solid var(--vf-tree-toggle-border-color);
    background-color: var(--vf-tree-toggle-background-color);
    color: var(--vf-tree-toggle-text-color);
    padding: 0;
    cursor: pointer;
}

.vf-tree__toggle:hover {
    background-color: var(--vf-tree-toggle-hover-background-color);
}

.vf-tree__toggle:disabled {
    cursor: not-allowed;
}

.vf-tree__label {
    min-width: 0;
}

.vf-tree__row_small {
    font-size: var(--vf-tree-small-row-font-size);
    padding: var(--vf-tree-small-row-padding);
    padding-left: calc(var(--vf-tree-small-row-padding-inline) + (var(--vf-tree-indent) * (var(--vf-tree-level) - 1)));

    .vf-tree__toggle,
    .vf-tree__toggle-spacer {
        width: var(--vf-tree-small-toggle-size);
        height: var(--vf-tree-small-toggle-size);
        flex-basis: var(--vf-tree-small-toggle-size);
    }
}

.vf-tree__row_large {
    font-size: var(--vf-tree-large-row-font-size);
    padding: var(--vf-tree-large-row-padding);
    padding-left: calc(var(--vf-tree-large-row-padding-inline) + (var(--vf-tree-indent) * (var(--vf-tree-level) - 1)));

    .vf-tree__toggle,
    .vf-tree__toggle-spacer {
        width: var(--vf-tree-large-toggle-size);
        height: var(--vf-tree-large-toggle-size);
        flex-basis: var(--vf-tree-large-toggle-size);
    }
}

.vf-tree__row_outlined {
    border: var(--vf-border-width) solid var(--vf-tree-row-border-color);
    background-color: transparent;
}
</style>
