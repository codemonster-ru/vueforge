<template>
    <section class="vf-file-manager" :aria-label="ariaLabel">
        <header v-if="showToolbar" class="vf-file-manager__toolbar">
            <div class="vf-file-manager__toolbar-left">
                <label v-if="selectable && multi && hasItems" class="vf-file-manager__select-all">
                    <input type="checkbox" :checked="allSelected" :disabled="disabled" @change="toggleSelectAll" />
                    <span>{{ selectedCount }} selected</span>
                </label>
                <span v-else class="vf-file-manager__summary">{{ selectedCount }} selected</span>
            </div>
            <div class="vf-file-manager__toolbar-right">
                <div class="vf-file-manager__view-switch" role="group" aria-label="View mode">
                    <button
                        type="button"
                        class="vf-file-manager__view-btn"
                        :class="{ 'vf-file-manager__view-btn_active': currentView === 'list' }"
                        :disabled="disabled"
                        :aria-pressed="currentView === 'list'"
                        @click="setView('list')"
                    >
                        List
                    </button>
                    <button
                        type="button"
                        class="vf-file-manager__view-btn"
                        :class="{ 'vf-file-manager__view-btn_active': currentView === 'grid' }"
                        :disabled="disabled"
                        :aria-pressed="currentView === 'grid'"
                        @click="setView('grid')"
                    >
                        Grid
                    </button>
                </div>
                <button
                    v-for="action in bulkActions"
                    :key="action.id"
                    type="button"
                    class="vf-file-manager__bulk-btn"
                    :disabled="disabled || !selectedCount || !!action.disabled"
                    @click="emitBulkAction(action.id)"
                >
                    {{ action.label }}
                </button>
            </div>
        </header>

        <div
            class="vf-file-manager__content"
            :class="`vf-file-manager__content_${currentView}`"
            :role="currentView === 'grid' ? 'grid' : 'list'"
        >
            <div v-if="loading" class="vf-file-manager__state">
                <slot name="loading">{{ loadingText }}</slot>
            </div>
            <div v-else-if="!items.length" class="vf-file-manager__state">
                <slot name="empty">{{ emptyText }}</slot>
            </div>
            <article
                v-for="(item, index) in items"
                v-else
                :key="getItemKey(item, index)"
                class="vf-file-manager__item"
                :class="{
                    'vf-file-manager__item_selected': isSelected(item, index),
                    'vf-file-manager__item_disabled': isItemDisabled(item),
                }"
                :role="currentView === 'grid' ? 'gridcell' : 'listitem'"
                @click="onItemClick(item)"
            >
                <label v-if="selectable" class="vf-file-manager__check" @click.stop>
                    <input
                        type="checkbox"
                        :checked="isSelected(item, index)"
                        :disabled="disabled || isItemDisabled(item)"
                        @change="toggleItem(item, index)"
                    />
                </label>
                <div class="vf-file-manager__thumb" :data-kind="item.kind ?? 'file'">
                    <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.name" />
                    <span v-else>{{ item.kind === 'folder' ? 'Folder' : 'File' }}</span>
                </div>
                <div class="vf-file-manager__meta">
                    <div class="vf-file-manager__name">{{ item.name }}</div>
                    <div class="vf-file-manager__details">
                        <span v-if="item.size != null">{{ formatSize(item.size) }}</span>
                        <span v-if="item.updatedAt">{{ item.updatedAt }}</span>
                    </div>
                </div>
                <button
                    v-if="previewable && item.thumbnail"
                    type="button"
                    class="vf-file-manager__preview-btn"
                    :disabled="disabled || isItemDisabled(item)"
                    @click.stop="openPreview(item)"
                >
                    Preview
                </button>
            </article>
        </div>

        <div
            v-if="previewItem"
            class="vf-file-manager__preview-overlay"
            role="dialog"
            aria-modal="true"
            :aria-label="previewAriaLabel"
            @click="closePreview"
        >
            <div class="vf-file-manager__preview-dialog" @click.stop>
                <button type="button" class="vf-file-manager__preview-close" @click="closePreview">Close</button>
                <img
                    v-if="previewItem.thumbnail"
                    :src="previewItem.thumbnail"
                    :alt="previewItem.name"
                    class="vf-file-manager__preview-image"
                />
                <p class="vf-file-manager__preview-title">{{ previewItem.name }}</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type FileManagerView = 'list' | 'grid';
type FileManagerId = string | number;

export interface FileManagerItem {
    id?: FileManagerId;
    name: string;
    kind?: 'file' | 'folder';
    size?: number;
    thumbnail?: string;
    updatedAt?: string;
    disabled?: boolean;
}

interface FileManagerBulkAction {
    id: string;
    label: string;
    disabled?: boolean;
}

interface Props {
    items?: Array<FileManagerItem>;
    modelValue?: Array<FileManagerId>;
    view?: FileManagerView;
    rowKey?: string | ((item: FileManagerItem, index: number) => FileManagerId);
    selectable?: boolean;
    multi?: boolean;
    previewable?: boolean;
    showToolbar?: boolean;
    bulkActions?: Array<FileManagerBulkAction>;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    disabled?: boolean;
    ariaLabel?: string;
    previewAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: () => [],
    view: 'list',
    rowKey: 'id',
    selectable: true,
    multi: true,
    previewable: true,
    showToolbar: true,
    bulkActions: () => [],
    loading: false,
    loadingText: 'Loading assets...',
    emptyText: 'No assets found.',
    disabled: false,
    ariaLabel: 'File manager',
    previewAriaLabel: 'Asset preview',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: Array<FileManagerId>): void;
    (event: 'update:view', value: FileManagerView): void;
    (event: 'change', value: Array<FileManagerId>): void;
    (event: 'itemClick', item: FileManagerItem): void;
    (event: 'preview', item: FileManagerItem): void;
    (
        event: 'bulkAction',
        payload: { actionId: string; items: Array<FileManagerItem>; ids: Array<FileManagerId> },
    ): void;
}>();

const currentView = ref<FileManagerView>(props.view);
const selectedIds = ref<Array<FileManagerId>>([...props.modelValue]);
const previewItem = ref<FileManagerItem | null>(null);

watch(
    () => props.view,
    value => {
        currentView.value = value;
    },
);
watch(
    () => props.modelValue,
    value => {
        selectedIds.value = [...value];
    },
);

const hasItems = computed(() => props.items.length > 0);
const selectedCount = computed(() => selectedIds.value.length);
const selectedItems = computed(() => {
    const selectedSet = new Set(selectedIds.value.map(value => String(value)));
    return props.items.filter((item, index) => selectedSet.has(String(getItemKey(item, index))));
});
const allSelectableIds = computed(() =>
    props.items.filter(item => !isItemDisabled(item)).map((item, index) => getItemKey(item, index)),
);
const allSelected = computed(
    () => allSelectableIds.value.length > 0 && allSelectableIds.value.every(id => selectedIds.value.includes(id)),
);

const getItemKey = (item: FileManagerItem, index: number): FileManagerId => {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(item, index);
    }

    return (item[props.rowKey as keyof FileManagerItem] as FileManagerId | undefined) ?? index;
};

const isItemDisabled = (item: FileManagerItem) => !!item.disabled;
const isSelected = (item: FileManagerItem, index: number) => selectedIds.value.includes(getItemKey(item, index));

const emitSelection = (next: Array<FileManagerId>) => {
    selectedIds.value = next;
    emits('update:modelValue', next);
    emits('change', next);
};

const setView = (view: FileManagerView) => {
    if (props.disabled || currentView.value === view) {
        return;
    }

    currentView.value = view;
    emits('update:view', view);
};

const toggleItem = (item: FileManagerItem, index: number) => {
    if (!props.selectable || props.disabled || isItemDisabled(item)) {
        return;
    }

    const id = getItemKey(item, index);
    const exists = selectedIds.value.includes(id);

    if (!props.multi) {
        emitSelection(exists ? [] : [id]);
        return;
    }

    if (exists) {
        emitSelection(selectedIds.value.filter(value => value !== id));
    } else {
        emitSelection(selectedIds.value.concat([id]));
    }
};

const toggleSelectAll = () => {
    if (!props.selectable || props.disabled || !props.multi) {
        return;
    }

    if (allSelected.value) {
        emitSelection([]);
        return;
    }

    emitSelection([...allSelectableIds.value]);
};

const onItemClick = (item: FileManagerItem) => {
    if (props.disabled || isItemDisabled(item)) {
        return;
    }

    emits('itemClick', item);
};

const openPreview = (item: FileManagerItem) => {
    previewItem.value = item;
    emits('preview', item);
};

const closePreview = () => {
    previewItem.value = null;
};

const emitBulkAction = (actionId: string) => {
    emits('bulkAction', {
        actionId,
        items: selectedItems.value,
        ids: [...selectedIds.value],
    });
};

const formatSize = (value: number) => {
    if (!Number.isFinite(value) || value < 0) {
        return '';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = value;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    const digits = size < 10 && unitIndex > 0 ? 1 : 0;
    return `${size.toFixed(digits)} ${units[unitIndex]}`;
};
</script>

<style lang="scss">
.vf-file-manager {
    display: grid;
    gap: var(--vf-file-manager-gap);
}

.vf-file-manager__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--vf-file-manager-toolbar-gap);
}

.vf-file-manager__toolbar-left,
.vf-file-manager__toolbar-right {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-file-manager-toolbar-controls-gap);
}

.vf-file-manager__view-switch {
    display: inline-flex;
    gap: var(--vf-file-manager-view-gap);
}

.vf-file-manager__view-btn,
.vf-file-manager__bulk-btn,
.vf-file-manager__preview-btn,
.vf-file-manager__preview-close {
    border: var(--vf-border-width) solid var(--vf-file-manager-control-border-color);
    border-radius: var(--vf-file-manager-control-border-radius);
    background-color: var(--vf-file-manager-control-background-color);
    color: var(--vf-file-manager-control-text-color);
    font-size: var(--vf-file-manager-control-font-size);
    padding: var(--vf-file-manager-control-padding);
}

.vf-file-manager__view-btn_active {
    background-color: var(--vf-file-manager-control-active-background-color);
    border-color: var(--vf-file-manager-control-active-border-color);
    color: var(--vf-file-manager-control-active-text-color);
}

.vf-file-manager__content_list {
    display: grid;
    gap: var(--vf-file-manager-list-gap);
}

.vf-file-manager__content_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--vf-file-manager-grid-min-width), 1fr));
    gap: var(--vf-file-manager-grid-gap);
}

.vf-file-manager__item {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--vf-file-manager-item-gap);
    border: var(--vf-border-width) solid var(--vf-file-manager-item-border-color);
    border-radius: var(--vf-file-manager-item-border-radius);
    background-color: var(--vf-file-manager-item-background-color);
    color: var(--vf-file-manager-item-text-color);
    padding: var(--vf-file-manager-item-padding);
}

.vf-file-manager__item_selected {
    border-color: var(--vf-file-manager-item-selected-border-color);
    background-color: var(--vf-file-manager-item-selected-background-color);
}

.vf-file-manager__item_disabled {
    opacity: var(--vf-file-manager-disabled-opacity);
}

.vf-file-manager__thumb {
    width: var(--vf-file-manager-thumb-size);
    height: var(--vf-file-manager-thumb-size);
    border-radius: var(--vf-file-manager-thumb-radius);
    border: var(--vf-border-width) solid var(--vf-file-manager-thumb-border-color);
    background-color: var(--vf-file-manager-thumb-background-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--vf-file-manager-thumb-font-size);
    color: var(--vf-file-manager-thumb-text-color);
    overflow: hidden;
}

.vf-file-manager__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vf-file-manager__meta {
    min-width: 0;
    display: grid;
    gap: 0.2rem;
}

.vf-file-manager__name {
    font-size: var(--vf-file-manager-name-font-size);
    font-weight: var(--vf-file-manager-name-font-weight);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.vf-file-manager__details {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--vf-file-manager-details-gap);
    font-size: var(--vf-file-manager-details-font-size);
    color: var(--vf-file-manager-details-color);
}

.vf-file-manager__state {
    padding: var(--vf-file-manager-state-padding);
    border: var(--vf-border-width) dashed var(--vf-file-manager-state-border-color);
    border-radius: var(--vf-file-manager-state-border-radius);
    color: var(--vf-file-manager-state-color);
    text-align: center;
}

.vf-file-manager__preview-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--vf-file-manager-preview-z-index);
    background: var(--vf-file-manager-preview-overlay-background-color);
    display: grid;
    place-items: center;
    padding: var(--vf-file-manager-preview-padding);
}

.vf-file-manager__preview-dialog {
    width: min(92vw, var(--vf-file-manager-preview-max-width));
    border: var(--vf-border-width) solid var(--vf-file-manager-preview-border-color);
    border-radius: var(--vf-file-manager-preview-border-radius);
    background: var(--vf-file-manager-preview-background-color);
    color: var(--vf-file-manager-preview-text-color);
    padding: var(--vf-file-manager-preview-dialog-padding);
    display: grid;
    gap: var(--vf-file-manager-preview-gap);
}

.vf-file-manager__preview-image {
    width: 100%;
    max-height: var(--vf-file-manager-preview-max-height);
    object-fit: contain;
    border-radius: var(--vf-file-manager-preview-image-radius);
}

.vf-file-manager__preview-title {
    margin: 0;
    font-size: var(--vf-file-manager-name-font-size);
    font-weight: var(--vf-file-manager-name-font-weight);
}
</style>
