<template>
    <div :class="rootClass">
        <table class="vf-treetable__table" role="treegrid" :aria-label="ariaLabel">
            <thead class="vf-treetable__head">
                <tr class="vf-treetable__row vf-treetable__row_header" role="row">
                    <th
                        v-for="(column, index) in orderedColumns"
                        :key="column.field"
                        class="vf-treetable__header"
                        :class="getHeaderClass(column)"
                        :style="getColumnStyle(column)"
                        scope="col"
                        role="columnheader"
                        @dragover.prevent
                        @drop.prevent="onHeaderDrop(column.field)"
                    >
                        <span
                            v-if="columnReorder"
                            class="vf-treetable__reorder-handle"
                            role="button"
                            tabindex="0"
                            aria-label="Reorder column"
                            draggable="true"
                            @dragstart="onColumnDragStart(column.field)"
                            @dragend="onColumnDragEnd"
                        >
                            ::
                        </span>
                        <slot
                            v-if="$slots[`header-${column.field}`]"
                            :name="`header-${column.field}`"
                            :column="column"
                        />
                        <template v-else>{{ column.header ?? column.field }}</template>
                        <span v-if="index === 0" class="vf-treetable__sr-only">Hierarchy column</span>
                        <span
                            v-if="isColumnResizable(column)"
                            class="vf-treetable__resize-handle"
                            role="separator"
                            aria-orientation="vertical"
                            :aria-label="`Resize ${column.header ?? column.field} column`"
                            @mousedown="startColumnResize($event, column)"
                        />
                    </th>
                </tr>
            </thead>
            <tbody class="vf-treetable__body">
                <tr v-if="!visibleRows.length" class="vf-treetable__row vf-treetable__row_state" role="row">
                    <td
                        class="vf-treetable__cell vf-treetable__cell_state"
                        :colspan="Math.max(1, orderedColumns.length)"
                    >
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
                        v-for="(column, columnIndex) in orderedColumns"
                        :key="column.field"
                        class="vf-treetable__cell"
                        :class="`vf-treetable__cell_${column.align ?? 'left'}`"
                        :style="getColumnStyle(column)"
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
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Align = 'left' | 'center' | 'right';
type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
export type TreeTableValue = string | number;
type ModelValue = TreeTableValue | Array<TreeTableValue> | undefined;
type TreeTableRequestReason = 'expand' | 'collapse' | 'lazy-load';

export interface TreeTableColumn {
    field: string;
    header?: string;
    width?: string;
    minWidth?: string;
    align?: Align;
    resizable?: boolean;
    formatter?: (node: TreeTableNode, value: unknown, column: TreeTableColumn) => string | number;
}

export interface TreeTableNode {
    key: TreeTableValue;
    label?: string;
    disabled?: boolean;
    leaf?: boolean;
    hasChildren?: boolean;
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
    lazy?: boolean;
    loadingKeys?: Array<TreeTableValue>;
    server?: boolean;
    columnResize?: boolean;
    minColumnWidth?: number;
    columnReorder?: boolean;
    columnOrder?: Array<string>;
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
    lazy: false,
    loadingKeys: () => [],
    server: false,
    columnResize: false,
    minColumnWidth: 80,
    columnReorder: false,
    columnOrder: () => [],
    ariaLabel: 'Tree table',
    emptyText: 'No data',
    expandLabel: 'Expand row',
    collapseLabel: 'Collapse row',
});

const emits = defineEmits([
    'update:modelValue',
    'change',
    'update:expandedKeys',
    'toggle',
    'rowClick',
    'lazyLoad',
    'request',
    'columnResize',
    'update:columnOrder',
    'columnReorder',
]);

const focusedKey = ref<TreeTableValue | null>(null);
const resizedColumnWidths = ref<Record<string, number>>({});
const internalColumnOrder = ref<Array<string>>([]);
const draggingColumnField = ref<string | null>(null);
const requestedLazyKeys = ref(new Set<TreeTableValue>());
let stopResizeListeners: (() => void) | null = null;

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
const loadingSet = computed(() => new Set(props.loadingKeys));

const normalizeColumnOrder = (fields: Array<string>, preferred?: Array<string>) => {
    const allowed = new Set(fields);
    const normalized: Array<string> = [];

    (preferred ?? []).forEach(field => {
        if (allowed.has(field) && !normalized.includes(field)) {
            normalized.push(field);
        }
    });

    fields.forEach(field => {
        if (!normalized.includes(field)) {
            normalized.push(field);
        }
    });

    return normalized;
};

watch(
    () => [props.columns, props.columnOrder] as const,
    ([columns, externalOrder]) => {
        const fields = (columns ?? []).map(column => column.field);
        const preferred = externalOrder && externalOrder.length ? externalOrder : internalColumnOrder.value;

        internalColumnOrder.value = normalizeColumnOrder(fields, preferred);
    },
    { deep: true, immediate: true },
);

const orderedColumns = computed(() => {
    const byField = new Map(props.columns.map(column => [column.field, column]));

    return internalColumnOrder.value
        .map(field => byField.get(field))
        .filter((column): column is TreeTableColumn => Boolean(column));
});

const flattenNodes = (
    nodes: Array<TreeTableNode>,
    level: number,
    parentKey: TreeTableValue | null = null,
): Array<FlattenedNode> => {
    return nodes.flatMap(node => {
        const children = node.children ?? [];
        const hasChildren = node.hasChildren === true || children.length > 0;
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
const isNodeLoading = (key: TreeTableValue) => loadingSet.value.has(key);
const canNodeExpand = (node: TreeTableNode) =>
    node.hasChildren === true || (node.children?.length ?? 0) > 0 || (props.lazy && !node.leaf);

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
    if (isNodeDisabled(node) || !canNodeExpand(node)) {
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

    if (!expanded) {
        requestedLazyKeys.value.delete(node.key);
        if (props.server) {
            emits('request', {
                reason: 'collapse' as TreeTableRequestReason,
                key: node.key,
                node,
                expandedKeys: next,
            });
        }

        return;
    }

    const shouldLazyLoad =
        props.lazy &&
        !node.leaf &&
        (node.children?.length ?? 0) === 0 &&
        !requestedLazyKeys.value.has(node.key) &&
        !isNodeLoading(node.key);

    if (shouldLazyLoad) {
        requestedLazyKeys.value.add(node.key);
        emits('lazyLoad', { key: node.key, node });

        if (props.server) {
            emits('request', {
                reason: 'lazy-load' as TreeTableRequestReason,
                key: node.key,
                node,
                expandedKeys: next,
            });
        }

        return;
    }

    if (props.server) {
        emits('request', {
            reason: 'expand' as TreeTableRequestReason,
            key: node.key,
            node,
            expandedKeys: next,
        });
    }
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

const parsePixelWidth = (value?: string) => {
    if (!value || !value.endsWith('px')) {
        return null;
    }

    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const getResolvedColumnWidth = (column: TreeTableColumn) => {
    const resized = resizedColumnWidths.value[column.field];
    if (Number.isFinite(resized)) {
        return resized;
    }

    const fromWidth = parsePixelWidth(column.width);
    if (fromWidth != null) {
        return fromWidth;
    }

    return parsePixelWidth(column.minWidth);
};

const getResolvedMinColumnWidth = (column: TreeTableColumn) => {
    const columnMin = parsePixelWidth(column.minWidth);
    const propMin = Number.isFinite(props.minColumnWidth) ? props.minColumnWidth : 80;

    return Math.max(24, columnMin ?? propMin);
};

const isColumnResizable = (column: TreeTableColumn) => {
    if (column.resizable === false) {
        return false;
    }

    if (column.resizable === true) {
        return true;
    }

    return props.columnResize;
};

const getHeaderClass = (column: TreeTableColumn) => {
    const classes = [`vf-treetable__header_${column.align ?? 'left'}`];

    if (isColumnResizable(column)) {
        classes.push('vf-treetable__header_resizable');
    }

    return classes;
};

const getColumnStyle = (column: TreeTableColumn) => {
    const styles: Record<string, string> = {};
    const resolvedWidth = getResolvedColumnWidth(column);

    if (resolvedWidth != null) {
        styles.width = `${resolvedWidth}px`;
    } else if (column.width) {
        styles.width = column.width;
    }

    if (column.minWidth) {
        styles.minWidth = column.minWidth;
    }

    return styles;
};

const stopColumnResize = () => {
    if (stopResizeListeners) {
        stopResizeListeners();
        stopResizeListeners = null;
    }
};

const startColumnResize = (event: MouseEvent, column: TreeTableColumn) => {
    if (!isColumnResizable(column) || event.button !== 0) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const headerElement = (event.currentTarget as HTMLElement | null)?.closest('th');
    const measuredWidth = headerElement?.getBoundingClientRect().width;
    const fallbackWidth = getResolvedColumnWidth(column) ?? getResolvedMinColumnWidth(column);
    const startWidth =
        Number.isFinite(measuredWidth) && (measuredWidth ?? 0) > 0 ? (measuredWidth as number) : fallbackWidth;
    const startX = event.clientX;
    const minWidth = getResolvedMinColumnWidth(column);

    const onMouseMove = (moveEvent: MouseEvent) => {
        const nextWidth = Math.max(minWidth, Math.round(startWidth + (moveEvent.clientX - startX)));
        resizedColumnWidths.value = {
            ...resizedColumnWidths.value,
            [column.field]: nextWidth,
        };
    };

    const onMouseUp = () => {
        const finalWidth = resizedColumnWidths.value[column.field] ?? startWidth;
        emits('columnResize', {
            field: column.field,
            width: `${Math.round(finalWidth)}px`,
            widthPx: Math.round(finalWidth),
        });
        stopColumnResize();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    stopResizeListeners = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };
};

const emitColumnOrder = (nextOrder: Array<string>, fromField: string, toField: string) => {
    internalColumnOrder.value = nextOrder;
    emits('update:columnOrder', [...nextOrder]);
    emits('columnReorder', {
        fromField,
        toField,
        order: [...nextOrder],
    });
};

const onColumnDragStart = (field: string) => {
    if (!props.columnReorder) {
        return;
    }

    draggingColumnField.value = field;
};

const onColumnDragEnd = () => {
    draggingColumnField.value = null;
};

const onHeaderDrop = (targetField: string) => {
    if (!props.columnReorder || !draggingColumnField.value) {
        return;
    }

    const fromField = draggingColumnField.value;
    draggingColumnField.value = null;

    if (fromField === targetField) {
        return;
    }

    const nextOrder = [...internalColumnOrder.value];
    const fromIndex = nextOrder.indexOf(fromField);
    const toIndex = nextOrder.indexOf(targetField);

    if (fromIndex === -1 || toIndex === -1) {
        return;
    }

    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, fromField);
    emitColumnOrder(nextOrder, fromField, targetField);
};

watch(
    () => props.columns.map(column => column.field),
    fields => {
        const allowed = new Set(fields);
        const next: Record<string, number> = {};

        Object.entries(resizedColumnWidths.value).forEach(([field, width]) => {
            if (allowed.has(field)) {
                next[field] = width;
            }
        });

        resizedColumnWidths.value = next;
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    stopColumnResize();
});

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
    position: relative;
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

.vf-treetable__header_resizable {
    padding-right: 0.8rem;
}

.vf-treetable__reorder-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.35rem;
    color: var(--vf-treetable-toggle-text-color);
    cursor: grab;
    user-select: none;
}

.vf-treetable__reorder-handle:active {
    cursor: grabbing;
}

.vf-treetable__resize-handle {
    position: absolute;
    top: 0;
    right: -2px;
    width: 8px;
    height: 100%;
    cursor: col-resize;
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
