<template>
    <div :class="getClass">
        <div v-if="showBulkActions" class="vf-datatable__bulk">
            <slot
                name="bulk-actions"
                :selected-keys="selectedKeys"
                :selected-rows="selectedRows"
                :clear-selection="clearSelection"
                :apply-action="applyBulkAction"
            >
                <div class="vf-datatable__bulk-default">
                    <span class="vf-datatable__bulk-count">{{ selectedKeys.length }} selected</span>
                    <button
                        v-for="action in bulkActions"
                        :key="action.value"
                        type="button"
                        class="vf-datatable__bulk-action"
                        :disabled="action.disabled"
                        @click="applyBulkAction(action.value)"
                    >
                        {{ action.label }}
                    </button>
                    <button type="button" class="vf-datatable__bulk-clear" @click="clearSelection">Clear</button>
                </div>
            </slot>
        </div>
        <table class="vf-datatable__table" :aria-label="ariaLabel">
            <thead v-if="showHeader" class="vf-datatable__head">
                <tr class="vf-datatable__row">
                    <th
                        v-if="hasSelectionColumn"
                        class="vf-datatable__header vf-datatable__header_selection"
                        scope="col"
                    >
                        <input
                            v-if="selectionMode === 'multiple'"
                            type="checkbox"
                            class="vf-datatable__selection-control"
                            :checked="allVisibleSelected"
                            :aria-label="selectAllAriaLabel"
                            @change="toggleSelectAll"
                        />
                    </th>
                    <th
                        v-for="column in orderedColumns"
                        :key="column.field"
                        class="vf-datatable__header"
                        :class="getHeaderClass(column)"
                        :style="getColumnStyle(column)"
                        :aria-sort="getAriaSort(column)"
                        scope="col"
                        @dragover.prevent
                        @drop.prevent="onHeaderDrop(column.field)"
                    >
                        <span
                            v-if="columnReorder"
                            class="vf-datatable__reorder-handle"
                            role="button"
                            tabindex="0"
                            aria-label="Reorder column"
                            draggable="true"
                            @dragstart="onColumnDragStart(column.field)"
                            @dragend="onColumnDragEnd"
                        >
                            ::
                        </span>
                        <button
                            v-if="isColumnSortable(column)"
                            type="button"
                            class="vf-datatable__sort-button"
                            @click="toggleSort(column)"
                        >
                            <span class="vf-datatable__header-text">
                                <slot
                                    v-if="$slots[`header-${column.field}`]"
                                    :name="`header-${column.field}`"
                                    :column="column"
                                />
                                <template v-else>{{ column.header ?? column.field }}</template>
                            </span>
                            <span class="vf-datatable__sort-icon" :class="getSortIconClass(column)">
                                {{ getSortIcon(column) }}
                            </span>
                        </button>
                        <span v-else class="vf-datatable__header-text">
                            <slot
                                v-if="$slots[`header-${column.field}`]"
                                :name="`header-${column.field}`"
                                :column="column"
                            />
                            <template v-else>{{ column.header ?? column.field }}</template>
                        </span>
                        <span
                            v-if="isColumnResizable(column)"
                            class="vf-datatable__resize-handle"
                            role="separator"
                            aria-orientation="vertical"
                            :aria-label="`Resize ${column.header ?? column.field} column`"
                            @mousedown="startColumnResize($event, column)"
                        />
                    </th>
                </tr>
            </thead>
            <tbody class="vf-datatable__body">
                <tr v-if="loading" class="vf-datatable__row vf-datatable__row_state">
                    <td class="vf-datatable__cell vf-datatable__cell_state" :colspan="stateColspan">
                        <slot name="loading">{{ loadingText }}</slot>
                    </td>
                </tr>
                <tr v-else-if="!sortedRows.length" class="vf-datatable__row vf-datatable__row_state">
                    <td class="vf-datatable__cell vf-datatable__cell_state" :colspan="stateColspan">
                        <slot name="empty">{{ emptyText }}</slot>
                    </td>
                </tr>
                <tr
                    v-for="(row, rowIndex) in sortedRows"
                    v-else
                    :key="getRowKey(row, rowIndex)"
                    class="vf-datatable__row"
                    :class="getRowClass(rowIndex)"
                    @click="onRowClick(row, rowIndex, $event)"
                >
                    <td v-if="hasSelectionColumn" class="vf-datatable__cell vf-datatable__cell_selection">
                        <input
                            :type="selectionMode === 'multiple' ? 'checkbox' : 'radio'"
                            name="vf-datatable-selection"
                            class="vf-datatable__selection-control"
                            :checked="isRowSelected(row, rowIndex)"
                            :aria-label="getSelectRowAriaLabel(row, rowIndex)"
                            @click.stop
                            @change="toggleRowSelection(row, rowIndex)"
                        />
                    </td>
                    <td
                        v-for="column in orderedColumns"
                        :key="column.field"
                        class="vf-datatable__cell"
                        :class="getCellClass(column)"
                        :style="getColumnStyle(column)"
                    >
                        <slot
                            v-if="$slots[`cell-${column.field}`]"
                            :name="`cell-${column.field}`"
                            :row="row"
                            :column="column"
                            :value="getCellValue(row, column)"
                            :index="rowIndex"
                        />
                        <template v-else>
                            {{ formatCellValue(row, column) }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Align = 'left' | 'center' | 'right';
type SortOrder = 'asc' | 'desc' | null;
type DataTableFilters = Record<string, unknown>;
type DataTableSelectionMode = 'single' | 'multiple' | null;
type DataTableRowKey = string | number;

export interface DataTableColumn {
    field: string;
    header?: string;
    sortable?: boolean;
    resizable?: boolean;
    align?: Align;
    width?: string;
    minWidth?: string;
    sticky?: 'left' | 'right';
    formatter?: (row: Record<string, unknown>, value: unknown, column: DataTableColumn) => string | number;
}

export interface DataTableQuery {
    sortField: string | null;
    sortOrder: SortOrder;
    page: number;
    pageSize: number;
    filters: DataTableFilters;
}

export interface DataTableBulkAction {
    label: string;
    value: string;
    disabled?: boolean;
}

interface Props {
    rows?: Array<Record<string, unknown>>;
    columns?: Array<DataTableColumn>;
    rowKey?: string | ((row: Record<string, unknown>, index: number) => string | number);
    sortable?: boolean;
    sortField?: string | null;
    sortOrder?: SortOrder;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    striped?: boolean;
    hover?: boolean;
    size?: Size;
    variant?: Variant;
    showHeader?: boolean;
    ariaLabel?: string;
    server?: boolean;
    page?: number;
    pageSize?: number;
    filters?: DataTableFilters;
    selectionMode?: DataTableSelectionMode;
    selection?: DataTableRowKey | Array<DataTableRowKey> | null;
    bulkActions?: Array<DataTableBulkAction>;
    selectAllAriaLabel?: string;
    selectRowAriaLabel?: string;
    stickyHeader?: boolean;
    columnResize?: boolean;
    minColumnWidth?: number;
    columnReorder?: boolean;
    columnOrder?: Array<string>;
}

const props = withDefaults(defineProps<Props>(), {
    rows: () => [],
    columns: () => [],
    rowKey: 'id',
    sortable: false,
    sortField: null,
    sortOrder: null,
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No data',
    striped: false,
    hover: true,
    size: 'normal',
    variant: 'filled',
    showHeader: true,
    ariaLabel: 'Data table',
    server: false,
    page: 1,
    pageSize: 10,
    filters: () => ({}),
    selectionMode: null,
    selection: null,
    bulkActions: () => [],
    selectAllAriaLabel: 'Select all rows',
    selectRowAriaLabel: 'Select row',
    stickyHeader: false,
    columnResize: false,
    minColumnWidth: 80,
    columnReorder: false,
    columnOrder: () => [],
});

const emits = defineEmits([
    'update:sortField',
    'update:sortOrder',
    'sort',
    'rowClick',
    'update:page',
    'update:pageSize',
    'update:filters',
    'page',
    'filter',
    'request',
    'update:selection',
    'selectionChange',
    'bulkAction',
    'columnResize',
    'update:columnOrder',
    'columnReorder',
]);

const internalSortField = ref<string | null>(props.sortField ?? null);
const internalSortOrder = ref<SortOrder>(props.sortOrder ?? null);
const internalPage = ref<number>(Math.max(1, props.page ?? 1));
const internalPageSize = ref<number>(Math.max(1, props.pageSize ?? 10));
const internalFilters = ref<DataTableFilters>({ ...(props.filters ?? {}) });
const internalSelection = ref<DataTableRowKey | Array<DataTableRowKey> | null>(props.selection ?? null);
const resizedColumnWidths = ref<Record<string, number>>({});
const internalColumnOrder = ref<Array<string>>([]);
const draggingColumnField = ref<string | null>(null);
let stopResizeListeners: (() => void) | null = null;

watch(
    () => props.sortField,
    value => {
        internalSortField.value = value ?? null;
    },
);
watch(
    () => props.sortOrder,
    value => {
        internalSortOrder.value = value ?? null;
    },
);
watch(
    () => props.page,
    value => {
        internalPage.value = Math.max(1, value ?? 1);
    },
);
watch(
    () => props.pageSize,
    value => {
        internalPageSize.value = Math.max(1, value ?? 10);
    },
);
watch(
    () => props.filters,
    value => {
        internalFilters.value = { ...(value ?? {}) };
    },
    { deep: true },
);
watch(
    () => props.selection,
    value => {
        internalSelection.value = value ?? null;
    },
    { deep: true },
);
watch(
    () => [props.columns, props.columnOrder] as const,
    ([columns, externalOrder]) => {
        const fields = (columns ?? []).map(column => column.field);
        const preferred = externalOrder && externalOrder.length ? externalOrder : internalColumnOrder.value;

        internalColumnOrder.value = normalizeColumnOrder(fields, preferred);
    },
    { deep: true, immediate: true },
);

const effectiveSortField = computed(() => internalSortField.value);
const effectiveSortOrder = computed(() => internalSortOrder.value);
const effectivePage = computed(() => internalPage.value);
const effectivePageSize = computed(() => internalPageSize.value);
const effectiveFilters = computed(() => internalFilters.value);
const hasSelectionColumn = computed(() => props.selectionMode === 'single' || props.selectionMode === 'multiple');
const stateColspan = computed(() => Math.max(1, props.columns.length + (hasSelectionColumn.value ? 1 : 0)));
const selectedKeys = computed<Array<DataTableRowKey>>(() => {
    if (props.selectionMode === 'single') {
        return internalSelection.value == null ? [] : [internalSelection.value as DataTableRowKey];
    }

    if (props.selectionMode === 'multiple') {
        return Array.isArray(internalSelection.value) ? internalSelection.value : [];
    }

    return [];
});
const selectedRows = computed(() => {
    const selected = new Set(selectedKeys.value);

    return (props.rows ?? []).filter((row, index) => {
        const rowKey = getRowKey(row, index);

        return selected.has(rowKey);
    });
});
const allVisibleSelected = computed(() => {
    if (props.selectionMode !== 'multiple' || !sortedRows.value.length) {
        return false;
    }

    const selected = new Set(selectedKeys.value);

    return sortedRows.value.every((row, index) => selected.has(getRowKey(row, index)));
});
function normalizeColumnOrder(fields: Array<string>, preferred?: Array<string>) {
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
}

const orderedColumns = computed(() => {
    const byField = new Map(props.columns.map(column => [column.field, column]));

    return internalColumnOrder.value
        .map(field => byField.get(field))
        .filter((column): column is DataTableColumn => Boolean(column));
});
const showBulkActions = computed(() => {
    if (props.selectionMode !== 'multiple' || selectedKeys.value.length === 0) {
        return false;
    }

    return true;
});

const isColumnSortable = (column: DataTableColumn) => {
    if (column.sortable === false) {
        return false;
    }

    if (column.sortable === true) {
        return true;
    }

    return props.sortable;
};

const compareValues = (a: unknown, b: unknown) => {
    if (a == null && b == null) {
        return 0;
    }

    if (a == null) {
        return -1;
    }

    if (b == null) {
        return 1;
    }

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    return String(a).localeCompare(String(b));
};

const sortedRows = computed(() => {
    const rows = props.rows ?? [];
    if (props.server) {
        return rows;
    }

    const sortField = effectiveSortField.value;
    const sortOrder = effectiveSortOrder.value;

    if (!sortField || !sortOrder) {
        return rows;
    }

    return [...rows].sort((left, right) => {
        const leftValue = left?.[sortField];
        const rightValue = right?.[sortField];
        const result = compareValues(leftValue, rightValue);

        return sortOrder === 'asc' ? result : -result;
    });
});

const getRequestPayload = (): DataTableQuery => ({
    sortField: effectiveSortField.value,
    sortOrder: effectiveSortOrder.value,
    page: effectivePage.value,
    pageSize: effectivePageSize.value,
    filters: { ...effectiveFilters.value },
});

const getClass = computed(() => {
    const classes = ['vf-datatable', `vf-datatable_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-datatable_${props.size}`);
    }

    if (props.striped) {
        classes.push('vf-datatable_striped');
    }

    if (props.hover) {
        classes.push('vf-datatable_hover');
    }

    if (props.stickyHeader) {
        classes.push('vf-datatable_sticky-header');
    }

    return classes;
});

const getRowKey = (row: Record<string, unknown>, index: number) => {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(row, index);
    }

    if (props.rowKey && typeof props.rowKey === 'string') {
        const value = row?.[props.rowKey];

        return typeof value === 'string' || typeof value === 'number' ? value : index;
    }

    return index;
};

const emitSelection = (value: DataTableRowKey | Array<DataTableRowKey> | null) => {
    internalSelection.value = value;
    emits('update:selection', value);
    emits('selectionChange', value, selectedRows.value);
};

const isRowSelected = (row: Record<string, unknown>, index: number) => {
    const rowKey = getRowKey(row, index);

    if (props.selectionMode === 'single') {
        return internalSelection.value === rowKey;
    }

    if (props.selectionMode === 'multiple') {
        const selected = Array.isArray(internalSelection.value) ? internalSelection.value : [];

        return selected.includes(rowKey);
    }

    return false;
};

const getSelectRowAriaLabel = (row: Record<string, unknown>, index: number) => {
    const key = getRowKey(row, index);

    return `${props.selectRowAriaLabel} ${String(key)}`;
};

const toggleRowSelection = (row: Record<string, unknown>, index: number) => {
    const rowKey = getRowKey(row, index);

    if (props.selectionMode === 'single') {
        const nextValue = internalSelection.value === rowKey ? null : rowKey;

        emitSelection(nextValue);

        return;
    }

    if (props.selectionMode === 'multiple') {
        const current = Array.isArray(internalSelection.value) ? [...internalSelection.value] : [];
        const selectedIndex = current.indexOf(rowKey);

        if (selectedIndex >= 0) {
            current.splice(selectedIndex, 1);
        } else {
            current.push(rowKey);
        }

        emitSelection(current);
    }
};

const toggleSelectAll = () => {
    if (props.selectionMode !== 'multiple') {
        return;
    }

    if (allVisibleSelected.value) {
        emitSelection([]);

        return;
    }

    const allKeys = sortedRows.value.map((row, index) => getRowKey(row, index));
    emitSelection(allKeys);
};

const getCellValue = (row: Record<string, unknown>, column: DataTableColumn) => {
    return row?.[column.field];
};

const formatCellValue = (row: Record<string, unknown>, column: DataTableColumn) => {
    const value = getCellValue(row, column);

    if (column.formatter) {
        return column.formatter(row, value, column);
    }

    return value ?? '';
};

const toggleSort = (column: DataTableColumn) => {
    if (!isColumnSortable(column)) {
        return;
    }

    let nextField: string | null = column.field;
    let nextOrder: SortOrder = 'asc';

    if (effectiveSortField.value === column.field) {
        if (effectiveSortOrder.value === 'asc') {
            nextOrder = 'desc';
        } else if (effectiveSortOrder.value === 'desc') {
            nextField = null;
            nextOrder = null;
        } else {
            nextOrder = 'asc';
        }
    }

    internalSortField.value = nextField;
    internalSortOrder.value = nextOrder;

    emits('update:sortField', nextField);
    emits('update:sortOrder', nextOrder);
    emits('sort', nextField, nextOrder);

    if (props.server) {
        emits('request', getRequestPayload());
    }
};

const getSortIcon = (column: DataTableColumn) => {
    if (effectiveSortField.value !== column.field) {
        return '\u2195';
    }

    return effectiveSortOrder.value === 'asc' ? '\u2191' : '\u2193';
};

const getSortIconClass = (column: DataTableColumn) => {
    if (effectiveSortField.value !== column.field) {
        return '';
    }

    return 'is-active';
};

const getAriaSort = (column: DataTableColumn) => {
    if (!isColumnSortable(column)) {
        return undefined;
    }

    if (effectiveSortField.value !== column.field) {
        return 'none';
    }

    return effectiveSortOrder.value === 'asc' ? 'ascending' : 'descending';
};

const getRowClass = (index: number) => {
    const classes: Array<string> = [];

    if (props.striped && index % 2 === 1) {
        classes.push('vf-datatable__row_striped');
    }

    return classes;
};

const parsePixelWidth = (value?: string) => {
    if (!value || !value.endsWith('px')) {
        return null;
    }

    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const getResolvedColumnWidth = (column: DataTableColumn) => {
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

const getResolvedMinColumnWidth = (column: DataTableColumn) => {
    const columnMin = parsePixelWidth(column.minWidth);
    const propMin = Number.isFinite(props.minColumnWidth) ? props.minColumnWidth : 80;

    return Math.max(24, columnMin ?? propMin);
};

const isColumnResizable = (column: DataTableColumn) => {
    if (column.resizable === false) {
        return false;
    }

    if (column.resizable === true) {
        return true;
    }

    return props.columnResize;
};

const stopColumnResize = () => {
    if (stopResizeListeners) {
        stopResizeListeners();
        stopResizeListeners = null;
    }
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

const startColumnResize = (event: MouseEvent, column: DataTableColumn) => {
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

const getHeaderClass = (column: DataTableColumn) => {
    const classes: Array<string> = [];

    if (column.align) {
        classes.push(`vf-datatable__cell_${column.align}`);
    }

    if (isColumnSortable(column)) {
        classes.push('vf-datatable__header_sortable');
    }

    if (column.sticky) {
        classes.push(`vf-datatable__cell_sticky-${column.sticky}`);
    }

    if (isColumnResizable(column)) {
        classes.push('vf-datatable__header_resizable');
    }

    return classes;
};

const getCellClass = (column: DataTableColumn) => {
    const classes: Array<string> = [];

    if (column.align) {
        classes.push(`vf-datatable__cell_${column.align}`);
    }

    if (column.sticky) {
        classes.push(`vf-datatable__cell_sticky-${column.sticky}`);
    }

    return classes;
};

const getColumnStyle = (column: DataTableColumn) => {
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

    if (column.sticky) {
        styles.position = 'sticky';
        styles.backgroundColor = 'var(--vf-datatable-row-background-color)';
        styles.zIndex = '1';

        const stickyColumns = orderedColumns.value.filter(item => item.sticky === column.sticky);
        const currentIndex = stickyColumns.findIndex(item => item.field === column.field);
        const before =
            column.sticky === 'left' ? stickyColumns.slice(0, currentIndex) : stickyColumns.slice(currentIndex + 1);
        const offset = before.reduce((acc, item) => {
            const width = getResolvedColumnWidth(item);
            if (width == null) {
                return acc;
            }

            return acc + width;
        }, 0);

        if (column.sticky === 'left') {
            styles.left = `${offset}px`;
        } else {
            styles.right = `${offset}px`;
        }
    }

    return styles;
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

const onRowClick = (row: Record<string, unknown>, index: number, event: Event) => {
    emits('rowClick', row, index, event);
};

const setPage = (value: number) => {
    const nextPage = Math.max(1, Number(value) || 1);

    internalPage.value = nextPage;
    emits('update:page', nextPage);
    emits('page', nextPage);

    if (props.server) {
        emits('request', getRequestPayload());
    }
};

const setPageSize = (value: number) => {
    const nextPageSize = Math.max(1, Number(value) || 1);

    internalPageSize.value = nextPageSize;
    emits('update:pageSize', nextPageSize);
    emits('page', effectivePage.value);

    if (props.server) {
        emits('request', getRequestPayload());
    }
};

const setFilters = (value: DataTableFilters) => {
    internalFilters.value = { ...(value ?? {}) };
    emits('update:filters', { ...internalFilters.value });
    emits('filter', { ...internalFilters.value });

    if (props.server) {
        emits('request', getRequestPayload());
    }
};

const clearFilters = () => {
    setFilters({});
};

const clearSelection = () => {
    emitSelection(props.selectionMode === 'multiple' ? [] : null);
};

const applyBulkAction = (value: string) => {
    emits('bulkAction', value, selectedKeys.value, selectedRows.value);
};

const setColumnOrder = (value: Array<string>) => {
    const fields = props.columns.map(column => column.field);
    const nextOrder = normalizeColumnOrder(fields, value);

    internalColumnOrder.value = nextOrder;
    emits('update:columnOrder', [...nextOrder]);
};

defineExpose({
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    getQuery: getRequestPayload,
    clearSelection,
    getSelectedKeys: () => [...selectedKeys.value],
    getSelectedRows: () => [...selectedRows.value],
    applyBulkAction,
    setColumnOrder,
    getColumnOrder: () => [...internalColumnOrder.value],
});
</script>

<style lang="scss">
.vf-datatable {
    width: 100%;
    border: var(--vf-border-width) solid var(--vf-datatable-border-color);
    border-radius: var(--vf-datatable-border-radius);
    background-color: var(--vf-datatable-background-color);
    overflow: hidden;
}

.vf-datatable__bulk {
    padding: 0.75rem;
    border-bottom: var(--vf-border-width) solid var(--vf-datatable-row-border-color);
    background-color: var(--vf-datatable-header-background-color);
}

.vf-datatable__bulk-default {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.vf-datatable__bulk-count {
    font-weight: 600;
}

.vf-datatable__bulk-action,
.vf-datatable__bulk-clear {
    border: var(--vf-border-width) solid var(--vf-datatable-header-border-color);
    background-color: var(--vf-datatable-background-color);
    color: inherit;
    border-radius: var(--vf-radii-sm);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font: inherit;
}

.vf-datatable__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--vf-datatable-font-size);
    color: var(--vf-datatable-text-color);
}

.vf-datatable__head {
    background-color: var(--vf-datatable-header-background-color);
}

.vf-datatable__row {
    border-bottom: var(--vf-border-width) solid var(--vf-datatable-row-border-color);
}

.vf-datatable__body .vf-datatable__row:last-child {
    border-bottom: none;
}

.vf-datatable__header,
.vf-datatable__cell {
    text-align: left;
    padding: var(--vf-datatable-cell-padding);
}

.vf-datatable__header_selection,
.vf-datatable__cell_selection {
    width: 2.25rem;
    text-align: center;
}

.vf-datatable__selection-control {
    cursor: pointer;
}

.vf-datatable__header {
    position: relative;
    font-weight: var(--vf-datatable-header-font-weight);
    font-size: var(--vf-datatable-header-font-size);
    color: var(--vf-datatable-header-text-color);
    border-bottom: var(--vf-border-width) solid var(--vf-datatable-header-border-color);
}

.vf-datatable_sticky-header .vf-datatable__header {
    position: sticky;
    top: 0;
    z-index: 2;
}

.vf-datatable__header-text {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-datatable-header-gap);
}

.vf-datatable__header_sortable {
    cursor: pointer;
}

.vf-datatable__header_resizable {
    padding-right: 0.875rem;
}

.vf-datatable__reorder-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.375rem;
    color: var(--vf-datatable-header-text-color);
    cursor: grab;
    user-select: none;
}

.vf-datatable__reorder-handle:active {
    cursor: grabbing;
}

.vf-datatable__sort-button {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-datatable-header-gap);
    border: none;
    background: transparent;
    padding: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.vf-datatable__resize-handle {
    position: absolute;
    top: 0;
    right: -0.25rem;
    width: 0.5rem;
    height: 100%;
    cursor: col-resize;
    user-select: none;
}

.vf-datatable__sort-icon {
    font-size: var(--vf-datatable-sort-icon-size);
    color: var(--vf-datatable-sort-icon-color);
    line-height: 1;
}

.vf-datatable__sort-icon.is-active {
    color: var(--vf-datatable-sort-icon-active-color);
}

.vf-datatable__cell {
    color: var(--vf-datatable-row-text-color);
    background-color: var(--vf-datatable-row-background-color);
}

.vf-datatable__header.vf-datatable__cell_sticky-left,
.vf-datatable__header.vf-datatable__cell_sticky-right {
    background-color: var(--vf-datatable-header-background-color);
    z-index: 3;
}

.vf-datatable__cell.vf-datatable__cell_sticky-left,
.vf-datatable__cell.vf-datatable__cell_sticky-right {
    z-index: 1;
}

.vf-datatable__cell_state {
    text-align: center;
    padding: var(--vf-datatable-state-padding);
    color: var(--vf-datatable-state-text-color);
}

.vf-datatable__row_state {
    border-bottom: none;
}

.vf-datatable__row_striped .vf-datatable__cell {
    background-color: var(--vf-datatable-striped-background-color);
}

.vf-datatable_hover .vf-datatable__row:not(.vf-datatable__row_state):hover .vf-datatable__cell {
    background-color: var(--vf-datatable-hover-background-color);
}

.vf-datatable__cell_left {
    text-align: left;
}

.vf-datatable__cell_center {
    text-align: center;
}

.vf-datatable__cell_right {
    text-align: right;
}

.vf-datatable_outlined {
    background-color: transparent;
}

.vf-datatable_outlined {
    .vf-datatable__head {
        background-color: transparent;
    }

    .vf-datatable__cell {
        background-color: transparent;
    }
}

.vf-datatable_small {
    .vf-datatable__table {
        font-size: var(--vf-datatable-small-font-size);
    }

    .vf-datatable__header,
    .vf-datatable__cell {
        padding: var(--vf-datatable-small-cell-padding);
    }
}

.vf-datatable_large {
    .vf-datatable__table {
        font-size: var(--vf-datatable-large-font-size);
    }

    .vf-datatable__header,
    .vf-datatable__cell {
        padding: var(--vf-datatable-large-cell-padding);
    }
}
</style>
