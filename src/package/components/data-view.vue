<template>
    <div :class="rootClass">
        <div class="vf-dataview__toolbar">
            <div class="vf-dataview__layout">
                <button
                    type="button"
                    class="vf-dataview__layout-btn"
                    :class="{ 'vf-dataview__layout-btn_active': effectiveLayout === 'list' }"
                    :aria-pressed="effectiveLayout === 'list'"
                    :disabled="disabled"
                    @click="setLayout('list')"
                >
                    List
                </button>
                <button
                    type="button"
                    class="vf-dataview__layout-btn"
                    :class="{ 'vf-dataview__layout-btn_active': effectiveLayout === 'grid' }"
                    :aria-pressed="effectiveLayout === 'grid'"
                    :disabled="disabled"
                    @click="setLayout('grid')"
                >
                    Grid
                </button>
            </div>
            <button
                v-if="sortable"
                type="button"
                class="vf-dataview__sort-btn"
                :disabled="disabled"
                @click="toggleSort"
            >
                Sort: {{ effectiveSortField ?? 'none' }} {{ effectiveSortOrder ?? '' }}
            </button>
        </div>

        <div
            class="vf-dataview__content"
            :class="`vf-dataview__content_${effectiveLayout}`"
            :role="effectiveLayout === 'grid' ? 'grid' : 'list'"
            :aria-label="ariaLabel"
        >
            <div v-if="loading" class="vf-dataview__state">
                <slot name="loading">{{ loadingText }}</slot>
            </div>
            <div v-else-if="!displayItems.length" class="vf-dataview__state">
                <slot name="empty">{{ emptyText }}</slot>
            </div>
            <template v-else>
                <div
                    v-for="(item, index) in displayItems"
                    :key="getItemKey(item, index)"
                    class="vf-dataview__item"
                    :role="effectiveLayout === 'grid' ? 'gridcell' : 'listitem'"
                >
                    <slot name="item" :item="item" :index="index" :layout="effectiveLayout">
                        {{ item }}
                    </slot>
                </div>
            </template>
        </div>

        <div class="vf-dataview__pagination">
            <button
                type="button"
                class="vf-dataview__page-btn"
                :disabled="disabled || currentPage <= 1"
                @click="setPage(currentPage - 1)"
            >
                Prev
            </button>
            <span class="vf-dataview__page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button
                type="button"
                class="vf-dataview__page-btn"
                :disabled="disabled || currentPage >= totalPages"
                @click="setPage(currentPage + 1)"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Layout = 'list' | 'grid';
type SortOrder = 'asc' | 'desc' | null;

interface Props {
    items?: Array<Record<string, unknown>>;
    layout?: Layout;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    disabled?: boolean;
    ariaLabel?: string;
    rowKey?: string | ((item: Record<string, unknown>, index: number) => string | number);
    sortable?: boolean;
    sortField?: string | null;
    sortOrder?: SortOrder;
    defaultSortField?: string | null;
    page?: number;
    pageSize?: number;
    total?: number;
    server?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    layout: 'list',
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No items',
    disabled: false,
    ariaLabel: 'Data view',
    rowKey: 'id',
    sortable: false,
    sortField: null,
    sortOrder: null,
    defaultSortField: null,
    page: 1,
    pageSize: 12,
    total: undefined,
    server: false,
});

const emits = defineEmits([
    'update:layout',
    'update:sortField',
    'update:sortOrder',
    'sort',
    'update:page',
    'update:pageSize',
    'page',
    'request',
]);

const internalLayout = ref<Layout>(props.layout);
const internalSortField = ref<string | null>(props.sortField ?? props.defaultSortField ?? null);
const internalSortOrder = ref<SortOrder>(props.sortOrder ?? null);
const internalPage = ref<number>(Math.max(1, props.page));
const internalPageSize = ref<number>(Math.max(1, props.pageSize));

watch(
    () => props.layout,
    value => {
        internalLayout.value = value;
    },
);
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
        internalPage.value = Math.max(1, value);
    },
);
watch(
    () => props.pageSize,
    value => {
        internalPageSize.value = Math.max(1, value);
    },
);

const rootClass = computed(() =>
    ['vf-dataview', `vf-dataview_${internalLayout.value}`, props.disabled ? 'vf-dataview_disabled' : null].filter(
        Boolean,
    ),
);

const effectiveLayout = computed(() => internalLayout.value);
const effectiveSortField = computed(() => internalSortField.value);
const effectiveSortOrder = computed(() => internalSortOrder.value);
const currentPage = computed(() => internalPage.value);
const currentPageSize = computed(() => internalPageSize.value);
const totalItems = computed(() => (props.total == null ? props.items.length : Math.max(props.total, 0)));
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / currentPageSize.value)));

const sortedItems = computed(() => {
    if (props.server || !props.sortable || !effectiveSortField.value || !effectiveSortOrder.value) {
        return props.items;
    }

    const field = effectiveSortField.value;
    const direction = effectiveSortOrder.value === 'asc' ? 1 : -1;

    return [...props.items].sort((a, b) => {
        const left = a[field];
        const right = b[field];

        if (left == null && right == null) {
            return 0;
        }
        if (left == null) {
            return -1 * direction;
        }
        if (right == null) {
            return 1 * direction;
        }

        return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' }) * direction;
    });
});

const displayItems = computed(() => {
    if (props.server) {
        return props.items;
    }

    const start = (currentPage.value - 1) * currentPageSize.value;
    const end = start + currentPageSize.value;

    return sortedItems.value.slice(start, end);
});

const emitRequest = () => {
    emits('request', {
        sortField: effectiveSortField.value,
        sortOrder: effectiveSortOrder.value,
        page: currentPage.value,
        pageSize: currentPageSize.value,
        layout: effectiveLayout.value,
    });
};

const setLayout = (layout: Layout) => {
    if (props.disabled || effectiveLayout.value === layout) {
        return;
    }

    internalLayout.value = layout;
    emits('update:layout', layout);
    emitRequest();
};

const toggleSort = () => {
    if (props.disabled || !props.sortable) {
        return;
    }

    if (!effectiveSortField.value) {
        internalSortField.value = props.defaultSortField ?? 'name';
        internalSortOrder.value = 'asc';
    } else if (effectiveSortOrder.value === 'asc') {
        internalSortOrder.value = 'desc';
    } else if (effectiveSortOrder.value === 'desc') {
        internalSortField.value = null;
        internalSortOrder.value = null;
    } else {
        internalSortOrder.value = 'asc';
    }

    emits('update:sortField', internalSortField.value);
    emits('update:sortOrder', internalSortOrder.value);
    emits('sort', {
        sortField: internalSortField.value,
        sortOrder: internalSortOrder.value,
    });
    emitRequest();
};

const setPage = (page: number) => {
    if (props.disabled) {
        return;
    }

    const next = Math.min(totalPages.value, Math.max(1, page));

    if (next === currentPage.value) {
        return;
    }

    internalPage.value = next;
    emits('update:page', next);
    emits('page', {
        page: next,
        pageSize: currentPageSize.value,
    });
    emitRequest();
};

const setPageSize = (pageSize: number) => {
    if (props.disabled) {
        return;
    }

    const next = Math.max(1, pageSize);

    if (next === currentPageSize.value) {
        return;
    }

    internalPageSize.value = next;
    emits('update:pageSize', next);
    emitRequest();
};

const getItemKey = (item: Record<string, unknown>, index: number) => {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(item, index);
    }

    return (item[props.rowKey] as string | number | undefined) ?? index;
};

defineExpose({
    setPage,
    setPageSize,
    setLayout,
    toggleSort,
});
</script>

<style lang="scss">
.vf-dataview {
    display: grid;
    gap: var(--vf-dataview-gap);
}

.vf-dataview__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--vf-dataview-toolbar-gap);
}

.vf-dataview__layout {
    display: inline-flex;
    gap: var(--vf-dataview-layout-gap);
}

.vf-dataview__layout-btn,
.vf-dataview__sort-btn,
.vf-dataview__page-btn {
    border: var(--vf-border-width) solid var(--vf-dataview-control-border-color);
    border-radius: var(--vf-dataview-control-border-radius);
    background: var(--vf-dataview-control-background-color);
    color: var(--vf-dataview-control-text-color);
    padding: var(--vf-dataview-control-padding);
    font-size: var(--vf-dataview-control-font-size);
}

.vf-dataview__layout-btn_active {
    background: var(--vf-dataview-control-active-background-color);
    border-color: var(--vf-dataview-control-active-border-color);
    color: var(--vf-dataview-control-active-text-color);
}

.vf-dataview__content_list {
    display: grid;
    gap: var(--vf-dataview-list-gap);
}

.vf-dataview__content_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--vf-dataview-grid-min-width), 1fr));
    gap: var(--vf-dataview-grid-gap);
}

.vf-dataview__item {
    border: var(--vf-border-width) solid var(--vf-dataview-item-border-color);
    border-radius: var(--vf-dataview-item-border-radius);
    background: var(--vf-dataview-item-background-color);
    color: var(--vf-dataview-item-text-color);
    padding: var(--vf-dataview-item-padding);
}

.vf-dataview__state {
    padding: var(--vf-dataview-state-padding);
    color: var(--vf-dataview-state-text-color);
    text-align: center;
}

.vf-dataview__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-dataview-pagination-gap);
}

.vf-dataview_disabled {
    opacity: var(--vf-dataview-disabled-opacity);
}
</style>
