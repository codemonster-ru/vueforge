<template>
    <div :class="getClass">
        <table class="vf-datatable__table" :aria-label="ariaLabel">
            <thead v-if="showHeader" class="vf-datatable__head">
                <tr class="vf-datatable__row">
                    <th
                        v-for="column in columns"
                        :key="column.field"
                        class="vf-datatable__header"
                        :class="getHeaderClass(column)"
                        :style="getColumnStyle(column)"
                        :aria-sort="getAriaSort(column)"
                        scope="col"
                    >
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
                    <td
                        v-for="column in columns"
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
import { computed, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Align = 'left' | 'center' | 'right';
type SortOrder = 'asc' | 'desc' | null;
type DataTableFilters = Record<string, unknown>;

export interface DataTableColumn {
    field: string;
    header?: string;
    sortable?: boolean;
    align?: Align;
    width?: string;
    minWidth?: string;
    formatter?: (row: Record<string, unknown>, value: unknown, column: DataTableColumn) => string | number;
}

export interface DataTableQuery {
    sortField: string | null;
    sortOrder: SortOrder;
    page: number;
    pageSize: number;
    filters: DataTableFilters;
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
]);

const internalSortField = ref<string | null>(props.sortField ?? null);
const internalSortOrder = ref<SortOrder>(props.sortOrder ?? null);
const internalPage = ref<number>(Math.max(1, props.page ?? 1));
const internalPageSize = ref<number>(Math.max(1, props.pageSize ?? 10));
const internalFilters = ref<DataTableFilters>({ ...(props.filters ?? {}) });

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

const effectiveSortField = computed(() => internalSortField.value);
const effectiveSortOrder = computed(() => internalSortOrder.value);
const effectivePage = computed(() => internalPage.value);
const effectivePageSize = computed(() => internalPageSize.value);
const effectiveFilters = computed(() => internalFilters.value);
const stateColspan = computed(() => Math.max(1, props.columns.length));

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

const getHeaderClass = (column: DataTableColumn) => {
    const classes: Array<string> = [];

    if (column.align) {
        classes.push(`vf-datatable__cell_${column.align}`);
    }

    if (isColumnSortable(column)) {
        classes.push('vf-datatable__header_sortable');
    }

    return classes;
};

const getCellClass = (column: DataTableColumn) => {
    const classes: Array<string> = [];

    if (column.align) {
        classes.push(`vf-datatable__cell_${column.align}`);
    }

    return classes;
};

const getColumnStyle = (column: DataTableColumn) => {
    const styles: Record<string, string> = {};

    if (column.width) {
        styles.width = column.width;
    }

    if (column.minWidth) {
        styles.minWidth = column.minWidth;
    }

    return styles;
};

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

defineExpose({
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    getQuery: getRequestPayload,
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

.vf-datatable__header {
    font-weight: var(--vf-datatable-header-font-weight);
    font-size: var(--vf-datatable-header-font-size);
    color: var(--vf-datatable-header-text-color);
    border-bottom: var(--vf-border-width) solid var(--vf-datatable-header-border-color);
}

.vf-datatable__header-text {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-datatable-header-gap);
}

.vf-datatable__header_sortable {
    cursor: pointer;
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
