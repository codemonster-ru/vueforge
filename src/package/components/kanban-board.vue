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
                    <slot name="column-header" :column="column" :items="getItemsByColumn(column.id)">
                        <h3 class="vf-kanban-board__column-title">{{ column.title }}</h3>
                        <span class="vf-kanban-board__column-count">{{ getItemsByColumn(column.id).length }}</span>
                    </slot>
                </header>

                <ul class="vf-kanban-board__list" @dragover.prevent @drop.prevent="onColumnDrop(column.id, $event)">
                    <li
                        v-for="(item, index) in getItemsByColumn(column.id)"
                        :key="String(item.id)"
                        class="vf-kanban-board__item"
                        :class="{
                            'is-dragging': draggingItemId === item.id,
                            'priority-low': item.priority === 'low',
                            'priority-medium': item.priority === 'medium',
                            'priority-high': item.priority === 'high',
                        }"
                        draggable="true"
                        @click="onCardClick(item)"
                        @dragstart="onCardDragStart(item, $event)"
                        @dragend="onCardDragEnd"
                        @dragover.prevent
                        @drop.prevent.stop="onCardDrop(column.id, index, $event)"
                    >
                        <slot name="card" :item="item" :column="column" :index="index">
                            <div class="vf-kanban-board__card">
                                <p class="vf-kanban-board__card-title">{{ item.title }}</p>
                                <p v-if="item.description" class="vf-kanban-board__card-description">
                                    {{ item.description }}
                                </p>
                                <div v-if="item.tags?.length" class="vf-kanban-board__tags">
                                    <span v-for="tag in item.tags" :key="tag" class="vf-kanban-board__tag">
                                        {{ tag }}
                                    </span>
                                </div>
                                <p v-if="item.assignee" class="vf-kanban-board__assignee">{{ item.assignee }}</p>
                            </div>
                        </slot>
                    </li>
                    <li v-if="!getItemsByColumn(column.id).length" class="vf-kanban-board__empty">
                        <slot name="empty-column" :column="column">{{ emptyColumnText }}</slot>
                    </li>
                </ul>

                <footer class="vf-kanban-board__column-footer">
                    <slot name="column-footer" :column="column" :items="getItemsByColumn(column.id)" />
                </footer>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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
}

const emits = defineEmits(['update:items', 'move', 'click']);

const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    items: () => [],
    ariaLabel: 'Kanban board',
    emptyColumnText: 'Drop cards here',
});

const localItems = ref<Array<KanbanBoardItem>>([]);
const draggingItemId = ref<KanbanId | null>(null);
const draggingFromColumnId = ref<KanbanId | null>(null);

const normalizedColumns = computed(() => props.columns ?? []);

const normalizeItems = (items: Array<KanbanBoardItem>) =>
    items.map(item => ({
        ...item,
        tags: item.tags ? [...item.tags] : [],
    }));

const getItemsByColumn = (columnId: KanbanId) =>
    localItems.value.filter(item => String(item.columnId) === String(columnId));

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
    draggingFromColumnId.value = item.columnId;

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(item.id));
    }
};

const onCardDragEnd = () => {
    draggingItemId.value = null;
    draggingFromColumnId.value = null;
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

watch(
    () => props.items,
    value => {
        localItems.value = normalizeItems(value);
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

.vf-kanban-board__item.is-dragging {
    opacity: var(--vf-kanban-board-drag-opacity);
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

.vf-kanban-board__column-footer {
    padding: var(--vf-kanban-board-column-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-kanban-board-column-footer-border-color);
}
</style>
