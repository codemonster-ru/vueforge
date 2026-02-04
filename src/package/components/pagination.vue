<template>
    <nav :class="getClass" aria-label="Pagination">
        <button
            class="vf-pagination__item vf-pagination__item_nav"
            type="button"
            :disabled="isControlDisabled || isFirstPage"
            aria-label="Previous page"
            @click="goToPage(currentPage - 1, $event)"
        >
            {{ prevLabel }}
        </button>

        <button
            v-for="item in pageItems"
            :key="item.key"
            class="vf-pagination__item"
            :class="{
                'is-current': item.type === 'page' && item.page === currentPage,
                'is-ellipsis': item.type === 'ellipsis',
            }"
            type="button"
            :disabled="isControlDisabled || item.type === 'ellipsis'"
            :aria-current="item.type === 'page' && item.page === currentPage ? 'page' : undefined"
            :aria-label="item.type === 'page' ? `Page ${item.page}` : undefined"
            @click="item.type === 'page' && goToPage(item.page, $event)"
        >
            <template v-if="item.type === 'page'">{{ item.page }}</template>
            <template v-else>{{ ellipsisLabel }}</template>
        </button>

        <button
            class="vf-pagination__item vf-pagination__item_nav"
            type="button"
            :disabled="isControlDisabled || isLastPage"
            aria-label="Next page"
            @click="goToPage(currentPage + 1, $event)"
        >
            {{ nextLabel }}
        </button>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface PageItem {
    key: string;
    type: 'page' | 'ellipsis';
    page: number;
}

interface Props {
    modelValue?: number;
    totalItems?: number;
    pageSize?: number;
    totalPages?: number;
    siblingCount?: number;
    boundaryCount?: number;
    disabled?: boolean;
    size?: Size;
    variant?: Variant;
    prevLabel?: string;
    nextLabel?: string;
    ellipsisLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 1,
    totalItems: 0,
    pageSize: 10,
    totalPages: undefined,
    siblingCount: 1,
    boundaryCount: 1,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    prevLabel: 'Prev',
    nextLabel: 'Next',
    ellipsisLabel: '...',
});
const emits = defineEmits(['update:modelValue', 'change']);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const range = (start: number, end: number) => {
    if (end < start) {
        return [] as Array<number>;
    }

    const result: Array<number> = [];

    for (let page = start; page <= end; page += 1) {
        result.push(page);
    }

    return result;
};

const pageCount = computed(() => {
    if (typeof props.totalPages === 'number' && Number.isFinite(props.totalPages)) {
        return Math.max(1, Math.floor(props.totalPages));
    }

    const size = Math.max(1, Math.floor(props.pageSize));

    return Math.max(1, Math.ceil(Math.max(0, props.totalItems) / size));
});
const currentPage = computed(() => clamp(Math.floor(props.modelValue), 1, pageCount.value));
const isFirstPage = computed(() => currentPage.value <= 1);
const isLastPage = computed(() => currentPage.value >= pageCount.value);
const isControlDisabled = computed(() => props.disabled || pageCount.value <= 1);

const pageItems = computed(() => {
    const total = pageCount.value;
    const current = currentPage.value;
    const sibling = Math.max(0, Math.floor(props.siblingCount));
    const boundary = Math.max(0, Math.floor(props.boundaryCount));
    const totalNumbers = sibling * 2 + boundary * 2 + 3;
    const items: Array<PageItem> = [];

    if (total <= totalNumbers) {
        return range(1, total).map(page => ({ key: `page-${page}`, type: 'page', page }));
    }

    const startPages = range(1, boundary);
    const endPages = range(total - boundary + 1, total);
    const siblingsStart = Math.max(Math.min(current - sibling, total - boundary - sibling * 2 - 1), boundary + 2);
    const siblingsEnd = Math.min(Math.max(current + sibling, boundary + sibling * 2 + 2), total - boundary - 1);

    for (const page of startPages) {
        items.push({ key: `page-${page}`, type: 'page', page });
    }

    if (siblingsStart > boundary + 2) {
        items.push({ key: 'ellipsis-start', type: 'ellipsis', page: -1 });
    } else if (boundary + 1 <= total - boundary) {
        items.push({ key: `page-${boundary + 1}`, type: 'page', page: boundary + 1 });
    }

    for (const page of range(siblingsStart, siblingsEnd)) {
        items.push({ key: `page-${page}`, type: 'page', page });
    }

    if (siblingsEnd < total - boundary - 1) {
        items.push({ key: 'ellipsis-end', type: 'ellipsis', page: -2 });
    } else if (total - boundary > boundary) {
        items.push({ key: `page-${total - boundary}`, type: 'page', page: total - boundary });
    }

    for (const page of endPages) {
        items.push({ key: `page-${page}`, type: 'page', page });
    }

    return items;
});

const getClass = computed(() => {
    const classes = ['vf-pagination', `vf-pagination_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-pagination_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-pagination_disabled');
    }

    return classes;
});

const goToPage = (page: number, event: Event) => {
    if (isControlDisabled.value) {
        return;
    }

    const nextPage = clamp(page, 1, pageCount.value);

    if (nextPage === props.modelValue) {
        return;
    }

    emits('update:modelValue', nextPage);
    emits('change', nextPage, event);
};
</script>

<style lang="scss">
.vf-pagination {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 100%;
    gap: var(--vf-pagination-gap);
}

.vf-pagination__item {
    flex: 0 0 auto;
    min-width: var(--vf-pagination-item-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: var(--vf-border-width) solid var(--vf-pagination-border-color);
    border-radius: var(--vf-pagination-border-radius);
    background-color: var(--vf-pagination-background-color);
    color: var(--vf-pagination-text-color);
    padding: var(--vf-pagination-padding);
    font-size: var(--vf-pagination-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-pagination__item:hover:not(:disabled):not(.is-current):not(.is-ellipsis) {
    background-color: var(--vf-pagination-hover-background-color);
}

.vf-pagination__item:focus-visible {
    outline: none;
    border-color: var(--vf-pagination-focus-border-color);
    box-shadow: var(--vf-pagination-focus-ring-shadow);
}

.vf-pagination__item.is-current {
    border-color: var(--vf-pagination-active-border-color);
    background-color: var(--vf-pagination-active-background-color);
    color: var(--vf-pagination-active-text-color);
}

.vf-pagination__item.is-ellipsis {
    cursor: default;
    padding: var(--vf-pagination-ellipsis-padding);
}

.vf-pagination__item:disabled {
    opacity: var(--vf-pagination-disabled-opacity);
    cursor: not-allowed;
}

.vf-pagination_outlined {
    .vf-pagination__item {
        background-color: transparent;
    }
}

.vf-pagination_small {
    .vf-pagination__item {
        font-size: var(--vf-pagination-small-font-size);
        padding: var(--vf-pagination-small-padding);
    }
}

.vf-pagination_large {
    .vf-pagination__item {
        font-size: var(--vf-pagination-large-font-size);
        padding: var(--vf-pagination-large-padding);
    }
}

.vf-pagination_disabled {
    opacity: var(--vf-pagination-disabled-opacity);
}
</style>
