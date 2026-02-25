<template>
    <div class="vf-kanban-board" role="region" :aria-label="ariaLabel || undefined">
        <div class="vf-kanban-board__columns">
            <section
                v-for="column in normalizedColumns"
                :key="String(column.id)"
                class="vf-kanban-board__column"
                :data-column-id="String(column.id)"
            >
                <header class="vf-kanban-board__column-header">
                    <slot name="column-header" :column="column" :items="getRenderState(column.id).items">
                        <h3 class="vf-kanban-board__column-title">{{ column.title }}</h3>
                        <span class="vf-kanban-board__column-count">{{ getRenderState(column.id).items.length }}</span>
                    </slot>
                </header>

                <ul
                    class="vf-kanban-board__list"
                    :style="getListStyle(column.id)"
                    @dragover.prevent
                    @drop.prevent="onColumnDrop(column.id, $event)"
                    @scroll="onLaneScroll(column.id, $event)"
                >
                    <li
                        v-if="getRenderState(column.id).topSpacer > 0"
                        class="vf-kanban-board__spacer"
                        aria-hidden="true"
                        :style="{ height: `${getRenderState(column.id).topSpacer.toString()}px` }"
                    ></li>
                    <li
                        v-for="entry in getRenderState(column.id).visibleEntries"
                        :key="String(entry.item.id)"
                        :data-item-id="String(entry.item.id)"
                        :data-column-id="String(column.id)"
                        role="listitem"
                        :tabindex="keyboardDnD ? 0 : undefined"
                        :aria-grabbed="keyboardDraggingItemId === entry.item.id ? 'true' : 'false'"
                        :aria-keyshortcuts="
                            keyboardDnD ? 'Space Enter ArrowUp ArrowDown ArrowLeft ArrowRight Escape' : undefined
                        "
                        :draggable="true"
                        :class="{
                            'is-dragging': draggingItemId === entry.item.id,
                            'is-keyboard-dragging': keyboardDraggingItemId === entry.item.id,
                            'priority-low': entry.item.priority === 'low',
                            'priority-medium': entry.item.priority === 'medium',
                            'priority-high': entry.item.priority === 'high',
                        }"
                        class="vf-kanban-board__item"
                        @click="onCardClick(entry.item)"
                        @keydown="onCardKeyDown(entry.item, $event)"
                        @dragstart="onCardDragStart(entry.item, $event)"
                        @dragend="onCardDragEnd"
                        @dragover.prevent
                        @drop.prevent.stop="onCardDrop(column.id, entry.absoluteIndex, $event)"
                    >
                        <slot name="card" :item="entry.item" :column="column" :index="entry.absoluteIndex">
                            <div class="vf-kanban-board__card">
                                <p class="vf-kanban-board__card-title">{{ entry.item.title }}</p>
                                <p v-if="entry.item.description" class="vf-kanban-board__card-description">
                                    {{ entry.item.description }}
                                </p>
                                <div v-if="entry.item.tags?.length" class="vf-kanban-board__tags">
                                    <span v-for="tag in entry.item.tags" :key="tag" class="vf-kanban-board__tag">
                                        {{ tag }}
                                    </span>
                                </div>
                                <p v-if="entry.item.assignee" class="vf-kanban-board__assignee">
                                    {{ entry.item.assignee }}
                                </p>
                            </div>
                        </slot>
                    </li>
                    <li
                        v-if="getRenderState(column.id).bottomSpacer > 0"
                        class="vf-kanban-board__spacer"
                        aria-hidden="true"
                        :style="{ height: `${getRenderState(column.id).bottomSpacer.toString()}px` }"
                    ></li>
                    <li v-if="!getRenderState(column.id).items.length" class="vf-kanban-board__empty">
                        <slot name="empty-column" :column="column">{{ emptyColumnText }}</slot>
                    </li>
                </ul>

                <footer class="vf-kanban-board__column-footer">
                    <slot name="column-footer" :column="column" :items="getRenderState(column.id).items" />
                </footer>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';

type KanbanId = string | number;
type KanbanPriority = 'low' | 'medium' | 'high';

export interface KanbanColumn {
    id: KanbanId;
    title: string;
}

export interface KanbanBoardItem {
    id: KanbanId;
    columnId: KanbanId;
    title: string;
    description?: string;
    assignee?: string;
    priority?: KanbanPriority;
    tags?: Array<string>;
}

interface Props {
    columns?: Array<KanbanColumn>;
    items?: Array<KanbanBoardItem>;
    ariaLabel?: string;
    emptyColumnText?: string;
    virtualization?: boolean;
    virtualizationThreshold?: number;
    itemHeight?: number;
    swimlaneHeight?: number;
    overscan?: number;
    keyboardDnD?: boolean;
}

const emits = defineEmits(['update:items', 'move', 'click']);

const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    items: () => [],
    ariaLabel: 'Kanban board',
    emptyColumnText: 'Drop cards here',
    virtualization: false,
    virtualizationThreshold: 40,
    itemHeight: 72,
    swimlaneHeight: 420,
    overscan: 3,
    keyboardDnD: true,
});

const localItems = ref<Array<KanbanBoardItem>>([]);
const draggingItemId = ref<KanbanId | null>(null);
const keyboardDraggingItemId = ref<KanbanId | null>(null);
const laneScrollOffsets = ref<Record<string, number>>({});

const normalizedColumns = computed(() => props.columns ?? []);

const normalizeItems = (items: Array<KanbanBoardItem>) =>
    items.map(item => ({
        ...item,
        tags: item.tags ? [...item.tags] : [],
    }));

const columnItemsMap = computed(() => {
    const grouped: Record<string, Array<KanbanBoardItem>> = {};
    for (const column of normalizedColumns.value) {
        grouped[String(column.id)] = [];
    }
    for (const item of localItems.value) {
        const key = String(item.columnId);
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    }
    return grouped;
});

interface KanbanRenderEntry {
    item: KanbanBoardItem;
    absoluteIndex: number;
}

interface KanbanColumnRenderState {
    items: Array<KanbanBoardItem>;
    visibleEntries: Array<KanbanRenderEntry>;
    topSpacer: number;
    bottomSpacer: number;
    virtualized: boolean;
}

const buildColumnRenderState = (columnId: KanbanId): KanbanColumnRenderState => {
    const items = columnItemsMap.value[String(columnId)] ?? [];
    const shouldVirtualize = props.virtualization && items.length >= props.virtualizationThreshold;

    if (!shouldVirtualize) {
        return {
            items,
            visibleEntries: items.map((item, index) => ({ item, absoluteIndex: index })),
            topSpacer: 0,
            bottomSpacer: 0,
            virtualized: false,
        };
    }

    const laneKey = String(columnId);
    const laneOffset = laneScrollOffsets.value[laneKey] ?? 0;
    const visibleCount = Math.max(1, Math.ceil(props.swimlaneHeight / props.itemHeight));
    const start = Math.max(0, Math.floor(laneOffset / props.itemHeight) - props.overscan);
    const end = Math.min(items.length, start + visibleCount + props.overscan * 2);

    return {
        items,
        visibleEntries: items.slice(start, end).map((item, index) => ({
            item,
            absoluteIndex: start + index,
        })),
        topSpacer: start * props.itemHeight,
        bottomSpacer: Math.max(0, (items.length - end) * props.itemHeight),
        virtualized: true,
    };
};

const columnRenderStateMap = computed<Record<string, KanbanColumnRenderState>>(() => {
    const result: Record<string, KanbanColumnRenderState> = {};

    for (const column of normalizedColumns.value) {
        result[String(column.id)] = buildColumnRenderState(column.id);
    }

    return result;
});

const getRenderState = (columnId: KanbanId): KanbanColumnRenderState =>
    columnRenderStateMap.value[String(columnId)] ?? {
        items: [],
        visibleEntries: [],
        topSpacer: 0,
        bottomSpacer: 0,
        virtualized: false,
    };

const resolveInsertIndex = (items: Array<KanbanBoardItem>, columnId: KanbanId, position?: number) => {
    const targetIndexes: Array<number> = [];

    items.forEach((item, index) => {
        if (String(item.columnId) === String(columnId)) {
            targetIndexes.push(index);
        }
    });

    if (!targetIndexes.length) {
        return items.length;
    }

    if (position === undefined || position >= targetIndexes.length) {
        return targetIndexes[targetIndexes.length - 1] + 1;
    }

    return targetIndexes[Math.max(0, position)];
};

const moveItem = (itemId: KanbanId, toColumnId: KanbanId, toIndex?: number) => {
    const next = [...localItems.value];
    const fromIndex = next.findIndex(item => String(item.id) === String(itemId));

    if (fromIndex < 0) {
        return;
    }

    const currentItem = next[fromIndex];
    const fromColumnId = currentItem.columnId;
    const [moved] = next.splice(fromIndex, 1);
    const insertAt = resolveInsertIndex(next, toColumnId, toIndex);
    const updated: KanbanBoardItem = {
        ...moved,
        columnId: toColumnId,
    };

    next.splice(insertAt, 0, updated);
    localItems.value = next;
    emits(
        'update:items',
        next.map(item => ({
            ...item,
            tags: item.tags ? [...item.tags] : [],
        })),
    );
    emits('move', updated, fromColumnId, toColumnId);
};

const onCardClick = (item: KanbanBoardItem) => {
    emits('click', item);
};

const onCardDragStart = (item: KanbanBoardItem, event: DragEvent) => {
    draggingItemId.value = item.id;

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(item.id));
    }
};

const onCardDragEnd = () => {
    draggingItemId.value = null;
};

const onCardDrop = (columnId: KanbanId, index: number, event: DragEvent) => {
    const raw = event.dataTransfer?.getData('text/plain');
    const itemId = raw || (draggingItemId.value !== null ? String(draggingItemId.value) : '');

    if (!itemId) {
        return;
    }

    moveItem(itemId, columnId, index);
    onCardDragEnd();
};

const onColumnDrop = (columnId: KanbanId, event: DragEvent) => {
    const raw = event.dataTransfer?.getData('text/plain');
    const itemId = raw || (draggingItemId.value !== null ? String(draggingItemId.value) : '');

    if (!itemId) {
        return;
    }

    moveItem(itemId, columnId);
    onCardDragEnd();
};

const getListStyle = (columnId: KanbanId): CSSProperties | undefined => {
    if (!getRenderState(columnId).virtualized) {
        return undefined;
    }

    return {
        maxHeight: `${props.swimlaneHeight.toString()}px`,
        overflowY: 'auto' as const,
    };
};

const onLaneScroll = (columnId: KanbanId, event: Event) => {
    if (!props.virtualization) {
        return;
    }

    const lane = event.target;

    if (!(lane instanceof HTMLElement)) {
        return;
    }

    laneScrollOffsets.value = {
        ...laneScrollOffsets.value,
        [String(columnId)]: lane.scrollTop,
    };
};

const focusCard = async (itemId: KanbanId) => {
    await nextTick();

    const cards = Array.from(document.querySelectorAll<HTMLElement>('.vf-kanban-board__item'));
    const card = cards.find(candidate => candidate.dataset.itemId === String(itemId));

    card?.focus();
};

const onCardKeyDown = async (item: KanbanBoardItem, event: KeyboardEvent) => {
    if (!props.keyboardDnD) {
        return;
    }

    const id = item.id;
    const key = event.key;
    const isGrabToggle = key === ' ' || key === 'Enter';

    if (isGrabToggle) {
        event.preventDefault();
        keyboardDraggingItemId.value = keyboardDraggingItemId.value === id ? null : id;
        return;
    }

    if (key === 'Escape' && keyboardDraggingItemId.value === id) {
        event.preventDefault();
        keyboardDraggingItemId.value = null;
        return;
    }

    if (keyboardDraggingItemId.value !== id) {
        return;
    }

    const latest = localItems.value.find(candidate => String(candidate.id) === String(id));

    if (!latest) {
        keyboardDraggingItemId.value = null;
        return;
    }

    const currentColumnId = latest.columnId;
    const currentColumnKey = String(currentColumnId);
    const currentColumnItems = columnItemsMap.value[currentColumnKey] ?? [];
    const currentIndex = currentColumnItems.findIndex(candidate => String(candidate.id) === String(id));

    if (currentIndex < 0) {
        return;
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        const offset = key === 'ArrowUp' ? -1 : 1;
        const targetIndex = Math.max(0, Math.min(currentColumnItems.length - 1, currentIndex + offset));

        if (targetIndex !== currentIndex) {
            moveItem(id, currentColumnId, targetIndex);
            await focusCard(id);
        }
        return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault();
        const currentColumnIndex = normalizedColumns.value.findIndex(
            column => String(column.id) === String(currentColumnId),
        );
        const columnOffset = key === 'ArrowLeft' ? -1 : 1;
        const targetColumn = normalizedColumns.value[currentColumnIndex + columnOffset];

        if (!targetColumn) {
            return;
        }

        const targetItems = columnItemsMap.value[String(targetColumn.id)] ?? [];
        const targetIndex = Math.min(currentIndex, targetItems.length);

        moveItem(id, targetColumn.id, targetIndex);
        await focusCard(id);
    }
};

watch(
    () => props.items,
    value => {
        localItems.value = normalizeItems(value);
        laneScrollOffsets.value = {};
        keyboardDraggingItemId.value = null;
    },
    { immediate: true, deep: true },
);
</script>

<style lang="scss">
.vf-kanban-board {
    width: 100%;
}

.vf-kanban-board__columns {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(var(--vf-kanban-board-column-min-width), 1fr);
    gap: var(--vf-kanban-board-column-gap);
    overflow: auto;
    padding-bottom: 0.25rem;
}

.vf-kanban-board__column {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    border: var(--vf-border-width) solid var(--vf-kanban-board-column-border-color);
    border-radius: var(--vf-kanban-board-column-border-radius);
    background-color: var(--vf-kanban-board-column-background-color);
    min-height: 14rem;
}

.vf-kanban-board__column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-kanban-board-gap);
    padding: var(--vf-kanban-board-column-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-kanban-board-column-header-border-color);
}

.vf-kanban-board__column-title {
    margin: 0;
    font-size: var(--vf-kanban-board-column-title-font-size);
    font-weight: var(--vf-kanban-board-column-title-font-weight);
}

.vf-kanban-board__column-count {
    font-size: var(--vf-kanban-board-column-count-font-size);
    color: var(--vf-kanban-board-column-count-color);
}

.vf-kanban-board__list {
    margin: 0;
    padding: var(--vf-kanban-board-body-padding);
    list-style: none;
    display: grid;
    gap: var(--vf-kanban-board-card-gap);
    min-height: 7rem;
    align-content: start;
    overflow-x: hidden;
}

.vf-kanban-board__item {
    border-radius: var(--vf-kanban-board-card-border-radius);
    border: var(--vf-border-width) solid var(--vf-kanban-board-card-border-color);
    background-color: var(--vf-kanban-board-card-background-color);
    cursor: grab;
}

.vf-kanban-board__item:hover {
    border-color: var(--vf-kanban-board-card-hover-border-color);
}

.vf-kanban-board__item:focus-visible {
    outline: 2px solid var(--vf-kanban-board-card-hover-border-color);
    outline-offset: 1px;
}

.vf-kanban-board__item.is-dragging {
    opacity: var(--vf-kanban-board-drag-opacity);
}

.vf-kanban-board__item.is-keyboard-dragging {
    border-color: var(--vf-kanban-board-card-hover-border-color);
}

.vf-kanban-board__item.priority-low {
    box-shadow: inset 0.2rem 0 0 0 var(--vf-kanban-board-priority-low-color);
}

.vf-kanban-board__item.priority-medium {
    box-shadow: inset 0.2rem 0 0 0 var(--vf-kanban-board-priority-medium-color);
}

.vf-kanban-board__item.priority-high {
    box-shadow: inset 0.2rem 0 0 0 var(--vf-kanban-board-priority-high-color);
}

.vf-kanban-board__card {
    display: grid;
    gap: var(--vf-kanban-board-gap);
    padding: var(--vf-kanban-board-card-padding);
}

.vf-kanban-board__card-title {
    margin: 0;
    font-size: var(--vf-kanban-board-card-title-font-size);
    font-weight: var(--vf-kanban-board-card-title-font-weight);
}

.vf-kanban-board__card-description {
    margin: 0;
    font-size: var(--vf-kanban-board-card-description-font-size);
    color: var(--vf-kanban-board-card-description-color);
}

.vf-kanban-board__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-kanban-board-tag-gap);
}

.vf-kanban-board__tag {
    display: inline-flex;
    align-items: center;
    padding: var(--vf-kanban-board-tag-padding);
    border-radius: var(--vf-kanban-board-tag-border-radius);
    background-color: var(--vf-kanban-board-tag-background-color);
    color: var(--vf-kanban-board-tag-text-color);
    font-size: 0.75rem;
    line-height: 1;
}

.vf-kanban-board__assignee {
    margin: 0;
    font-size: var(--vf-kanban-board-assignee-font-size);
    color: var(--vf-kanban-board-assignee-color);
}

.vf-kanban-board__empty {
    padding: var(--vf-kanban-board-empty-padding);
    text-align: center;
    color: var(--vf-kanban-board-empty-color);
    border-radius: var(--vf-kanban-board-card-border-radius);
    border: var(--vf-border-width) dashed var(--vf-kanban-board-card-border-color);
}

.vf-kanban-board__spacer {
    pointer-events: none;
}

.vf-kanban-board__column-footer {
    padding: var(--vf-kanban-board-column-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-kanban-board-column-footer-border-color);
}
</style>
