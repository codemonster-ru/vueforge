<template>
    <div :class="rootClass">
        <table class="vf-treetable__table" role="treegrid" :aria-label="ariaLabel">
            <thead class="vf-treetable__head">
                <tr class="vf-treetable__row vf-treetable__row_header" role="row">
                    <th
                        v-for="(column, index) in columns"
                        :key="column.field"
                        class="vf-treetable__header"
                        :class="`vf-treetable__header_${column.align ?? 'left'}`"
                        :style="column.width ? { width: column.width } : undefined"
                        scope="col"
                        role="columnheader"
                    >
                        <slot
                            v-if="$slots[`header-${column.field}`]"
                            :name="`header-${column.field}`"
                            :column="column"
                        />
                        <template v-else>{{ column.header ?? column.field }}</template>
                        <span v-if="index === 0" class="vf-treetable__sr-only">Hierarchy column</span>
                    </th>
                </tr>
            </thead>
            <tbody class="vf-treetable__body">
                <tr v-if="!visibleRows.length" class="vf-treetable__row vf-treetable__row_state" role="row">
                    <td class="vf-treetable__cell vf-treetable__cell_state" :colspan="Math.max(1, columns.length)">
                        <slot name="empty">{{ emptyText }}</slot>
                    </td>
                </tr>
                <tr
                    v-for="(entry, index) in visibleRows"
                    v-else
                    :key="entry.node.key"
                    class="vf-treetable__row"
                    :class="getRowClass(entry, index)"
                    role="row"
                    :aria-level="entry.level"
                    :aria-expanded="entry.hasChildren ? entry.expanded : undefined"
                    :aria-selected="selectable ? isSelected(entry.node.key) : undefined"
                    :tabindex="focusedKey === entry.node.key ? 0 : -1"
                    @focus="onRowFocus(entry.node.key)"
                    @click="onRowClick(entry, $event)"
                    @keydown="onRowKeydown(entry, index, $event)"
                >
                    <td
                        v-for="(column, columnIndex) in columns"
                        :key="column.field"
                        class="vf-treetable__cell"
                        :class="`vf-treetable__cell_${column.align ?? 'left'}`"
                        role="gridcell"
                    >
                        <div v-if="columnIndex === 0" class="vf-treetable__cell-tree">
                            <span
                                class="vf-treetable__indent"
                                :style="{ '--vf-treetable-level': String(entry.level - 1) }"
                            />
                            <button
                                v-if="entry.hasChildren"
                                type="button"
                                class="vf-treetable__toggle"
                                :aria-label="entry.expanded ? collapseLabel : expandLabel"
                                :aria-expanded="entry.expanded"
                                @click.stop="toggleNode(entry.node, $event)"
                            >
                                {{ entry.expanded ? '−' : '+' }}
                            </button>
                            <span v-else class="vf-treetable__toggle-spacer" aria-hidden="true" />
                            <slot
                                v-if="$slots[`cell-${column.field}`]"
                                :name="`cell-${column.field}`"
                                :node="entry.node"
                                :column="column"
                                :value="getCellValue(entry.node, column)"
                                :level="entry.level"
                                :expanded="entry.expanded"
                                :selected="isSelected(entry.node.key)"
                            />
                            <template v-else>{{ formatCellValue(entry.node, column) }}</template>
                        </div>
                        <template v-else>
                            <slot
                                v-if="$slots[`cell-${column.field}`]"
                                :name="`cell-${column.field}`"
                                :node="entry.node"
                                :column="column"
                                :value="getCellValue(entry.node, column)"
                                :level="entry.level"
                                :expanded="entry.expanded"
                                :selected="isSelected(entry.node.key)"
                            />
                            <template v-else>{{ formatCellValue(entry.node, column) }}</template>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Align = 'left' | 'center' | 'right';
type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
export type TreeTableValue = string | number;
type ModelValue = TreeTableValue | Array<TreeTableValue> | undefined;

export interface TreeTableColumn {
    field: string;
    header?: string;
    width?: string;
    align?: Align;
    formatter?: (node: TreeTableNode, value: unknown, column: TreeTableColumn) => string | number;
}

export interface TreeTableNode {
    key: TreeTableValue;
    label?: string;
    disabled?: boolean;
    data?: Record<string, unknown>;
    children?: Array<TreeTableNode>;
}

interface FlattenedNode {
    node: TreeTableNode;
    level: number;
    hasChildren: boolean;
    expanded: boolean;
    parentKey: TreeTableValue | null;
}

interface Props {
    items?: Array<TreeTableNode>;
    columns?: Array<TreeTableColumn>;
    modelValue?: ModelValue;
    expandedKeys?: Array<TreeTableValue>;
    multiple?: boolean;
    selectable?: boolean;
    expandOnClick?: boolean;
    disabled?: boolean;
    striped?: boolean;
    hover?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
    emptyText?: string;
    expandLabel?: string;
    collapseLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    columns: () => [{ field: 'label', header: 'Name' }],
    modelValue: undefined,
    expandedKeys: () => [],
    multiple: false,
    selectable: true,
    expandOnClick: false,
    disabled: false,
    striped: false,
    hover: true,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Tree table',
    emptyText: 'No data',
    expandLabel: 'Expand row',
    collapseLabel: 'Collapse row',
});

const emits = defineEmits(['update:modelValue', 'change', 'update:expandedKeys', 'toggle', 'rowClick']);

const focusedKey = ref<TreeTableValue | null>(null);

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

const flattenNodes = (
    nodes: Array<TreeTableNode>,
    level: number,
    parentKey: TreeTableValue | null = null,
): Array<FlattenedNode> => {
    return nodes.flatMap(node => {
        const children = node.children ?? [];
        const hasChildren = children.length > 0;
        const expanded = hasChildren && expandedSet.value.has(node.key);
        const current: FlattenedNode = {
            node,
            level,
            hasChildren,
            expanded,
            parentKey,
        };

        if (!expanded) {
            return [current];
        }

        return [current, ...flattenNodes(children, level + 1, node.key)];
    });
};

const visibleRows = computed(() => flattenNodes(props.items, 1));

const rootClass = computed(() => {
    const classes = ['vf-treetable', `vf-treetable_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-treetable_${props.size}`);
    }
    if (props.striped) {
        classes.push('vf-treetable_striped');
    }
    if (props.hover) {
        classes.push('vf-treetable_hover');
    }
    if (props.disabled) {
        classes.push('vf-treetable_disabled');
    }

    return classes;
});

watch(
    visibleRows,
    rows => {
        if (!rows.length) {
            focusedKey.value = null;

            return;
        }

        if (focusedKey.value == null || !rows.some(entry => entry.node.key === focusedKey.value)) {
            focusedKey.value = rows[0].node.key;
        }
    },
    { immediate: true },
);

const isNodeDisabled = (node: TreeTableNode) => props.disabled || !!node.disabled;
const isSelected = (key: TreeTableValue) => selectedSet.value.has(key);

const getRowClass = (entry: FlattenedNode, index: number) => {
    const classes = [];

    if (isSelected(entry.node.key)) {
        classes.push('vf-treetable__row_selected');
    }
    if (isNodeDisabled(entry.node)) {
        classes.push('vf-treetable__row_disabled');
    }
    if (props.striped && index % 2 === 1) {
        classes.push('vf-treetable__row_striped');
    }

    return classes;
};

const getCellValue = (node: TreeTableNode, column: TreeTableColumn) => {
    if (column.field === 'label' && node.label != null) {
        return node.label;
    }

    return node.data?.[column.field];
};

const formatCellValue = (node: TreeTableNode, column: TreeTableColumn) => {
    const value = getCellValue(node, column);

    if (column.formatter) {
        return column.formatter(node, value, column);
    }

    return value == null ? '' : String(value);
};

const setExpanded = (node: TreeTableNode, expanded: boolean, event: Event) => {
    if (isNodeDisabled(node) || !(node.children?.length ?? 0)) {
        return;
    }

    const current = props.expandedKeys;
    const exists = current.includes(node.key);

    if (expanded === exists) {
        return;
    }

    const next = expanded ? [...current, node.key] : current.filter(value => value !== node.key);
    emits('update:expandedKeys', next);
    emits('toggle', node.key, expanded, node, event);
};

const toggleNode = (node: TreeTableNode, event: Event) => {
    setExpanded(node, !expandedSet.value.has(node.key), event);
};

const selectNode = (entry: FlattenedNode, event: Event) => {
    if (!props.selectable || isNodeDisabled(entry.node)) {
        return;
    }

    if (props.multiple) {
        const current = selectedValues.value;
        const exists = current.includes(entry.node.key);
        const next = exists ? current.filter(value => value !== entry.node.key) : [...current, entry.node.key];

        emits('update:modelValue', next);
        emits('change', next, entry.node, event);

        return;
    }

    const next = props.modelValue === entry.node.key ? undefined : entry.node.key;
    emits('update:modelValue', next);
    emits('change', next, entry.node, event);
};

const onRowClick = (entry: FlattenedNode, event: MouseEvent) => {
    focusedKey.value = entry.node.key;
    emits('rowClick', entry.node, event);

    if (props.expandOnClick && entry.hasChildren) {
        toggleNode(entry.node, event);
    }

    selectNode(entry, event);
};

const onRowFocus = (key: TreeTableValue) => {
    focusedKey.value = key;
};

const focusByIndex = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(visibleRows.value.length - 1, nextIndex));
    const next = visibleRows.value[boundedIndex];

    if (next) {
        focusedKey.value = next.node.key;
    }
};

const getParentIndex = (entry: FlattenedNode) => {
    if (entry.parentKey == null) {
        return -1;
    }

    return visibleRows.value.findIndex(candidate => candidate.node.key === entry.parentKey);
};

const onRowKeydown = (entry: FlattenedNode, index: number, event: KeyboardEvent) => {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            focusByIndex(index + 1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            focusByIndex(index - 1);
            break;
        case 'Home':
            event.preventDefault();
            focusByIndex(0);
            break;
        case 'End':
            event.preventDefault();
            focusByIndex(visibleRows.value.length - 1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            if (entry.hasChildren && !entry.expanded) {
                setExpanded(entry.node, true, event);
            } else if (entry.hasChildren && entry.expanded) {
                focusByIndex(index + 1);
            }
            break;
        case 'ArrowLeft':
            event.preventDefault();
            if (entry.hasChildren && entry.expanded) {
                setExpanded(entry.node, false, event);
            } else {
                const parentIndex = getParentIndex(entry);

                if (parentIndex >= 0) {
                    focusByIndex(parentIndex);
                }
            }
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            selectNode(entry, event);
            break;
        default:
            break;
    }
};
</script>

<style lang="scss">
.vf-treetable {
    border: var(--vf-border-width) solid var(--vf-treetable-border-color);
    border-radius: var(--vf-treetable-border-radius);
    background-color: var(--vf-treetable-background-color);
    color: var(--vf-treetable-text-color);
    overflow: auto;
}

.vf-treetable__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--vf-treetable-font-size);
}

.vf-treetable__header {
    padding: var(--vf-treetable-cell-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-treetable-header-border-color);
    background-color: var(--vf-treetable-header-background-color);
    color: var(--vf-treetable-header-text-color);
    font-weight: var(--vf-treetable-header-font-weight);
    text-align: left;
}

.vf-treetable__header_center,
.vf-treetable__cell_center {
    text-align: center;
}

.vf-treetable__header_right,
.vf-treetable__cell_right {
    text-align: right;
}

.vf-treetable__cell {
    padding: var(--vf-treetable-cell-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-treetable-row-border-color);
    background-color: var(--vf-treetable-row-background-color);
}

.vf-treetable__cell-tree {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-treetable-cell-gap);
    min-height: 1.5rem;
}

.vf-treetable__indent {
    display: inline-block;
    width: calc(var(--vf-treetable-indent-step) * var(--vf-treetable-level, 0));
    flex: 0 0 auto;
}

.vf-treetable__toggle,
.vf-treetable__toggle-spacer {
    width: var(--vf-treetable-toggle-size);
    height: var(--vf-treetable-toggle-size);
    flex: 0 0 auto;
}

.vf-treetable__toggle {
    border: var(--vf-border-width) solid var(--vf-treetable-toggle-border-color);
    border-radius: var(--vf-treetable-toggle-border-radius);
    background-color: var(--vf-treetable-toggle-background-color);
    color: var(--vf-treetable-toggle-text-color);
    line-height: 1;
}

.vf-treetable_hover .vf-treetable__row:hover .vf-treetable__cell {
    background-color: var(--vf-treetable-row-hover-background-color);
}

.vf-treetable__row_selected .vf-treetable__cell {
    background-color: var(--vf-treetable-row-selected-background-color);
    color: var(--vf-treetable-row-selected-text-color);
}

.vf-treetable__row:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--vf-treetable-focus-ring-color);
}

.vf-treetable_striped .vf-treetable__row_striped .vf-treetable__cell {
    background-color: var(--vf-treetable-row-striped-background-color);
}

.vf-treetable__row_disabled {
    opacity: var(--vf-treetable-disabled-opacity);
}

.vf-treetable__cell_state {
    text-align: center;
    padding: var(--vf-treetable-state-padding);
    color: var(--vf-treetable-state-text-color);
}

.vf-treetable_small .vf-treetable__table {
    font-size: var(--vf-treetable-small-font-size);
}

.vf-treetable_small .vf-treetable__header,
.vf-treetable_small .vf-treetable__cell {
    padding: var(--vf-treetable-small-cell-padding);
}

.vf-treetable_large .vf-treetable__table {
    font-size: var(--vf-treetable-large-font-size);
}

.vf-treetable_large .vf-treetable__header,
.vf-treetable_large .vf-treetable__cell {
    padding: var(--vf-treetable-large-cell-padding);
}

.vf-treetable__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
