<template>
    <div class="vf-picklist" :class="{ 'vf-picklist_disabled': disabled }">
        <section class="vf-picklist__column">
            <header class="vf-picklist__header">{{ sourceHeader }}</header>
            <ul
                class="vf-picklist__list"
                role="listbox"
                :aria-label="sourceAriaLabel"
                :aria-multiselectable="multiple ? 'true' : 'false'"
            >
                <li
                    v-for="(item, index) in source"
                    :key="`src-${String(getItemKey(item, index))}`"
                    class="vf-picklist__item"
                    :class="{ 'vf-picklist__item_selected': isSelected('source', getItemKey(item, index)) }"
                    role="option"
                    :aria-selected="isSelected('source', getItemKey(item, index))"
                    :tabindex="disabled ? -1 : 0"
                    :draggable="!disabled"
                    @click="onItemClick('source', getItemKey(item, index), $event)"
                    @keydown="onItemKeydown('source', index, getItemKey(item, index), $event)"
                    @dragstart="onDragStart('source', index)"
                    @dragover.prevent
                    @drop.prevent="onDrop('source', index)"
                >
                    <slot name="source-item" :item="item" :index="index">
                        {{ getItemLabel(item) }}
                    </slot>
                </li>
            </ul>
            <div class="vf-picklist__reorder">
                <button type="button" class="vf-picklist__btn" :disabled="disabled" @click="moveUp('source')">
                    Up
                </button>
                <button type="button" class="vf-picklist__btn" :disabled="disabled" @click="moveDown('source')">
                    Down
                </button>
            </div>
        </section>

        <div class="vf-picklist__transfer">
            <button
                type="button"
                class="vf-picklist__btn"
                :disabled="disabled || !selectedSourceKeys.length"
                @click="moveToTarget"
            >
                &gt;
            </button>
            <button
                type="button"
                class="vf-picklist__btn"
                :disabled="disabled || !selectedTargetKeys.length"
                @click="moveToSource"
            >
                &lt;
            </button>
        </div>

        <section class="vf-picklist__column">
            <header class="vf-picklist__header">{{ targetHeader }}</header>
            <ul
                class="vf-picklist__list"
                role="listbox"
                :aria-label="targetAriaLabel"
                :aria-multiselectable="multiple ? 'true' : 'false'"
            >
                <li
                    v-for="(item, index) in target"
                    :key="`tgt-${String(getItemKey(item, index))}`"
                    class="vf-picklist__item"
                    :class="{ 'vf-picklist__item_selected': isSelected('target', getItemKey(item, index)) }"
                    role="option"
                    :aria-selected="isSelected('target', getItemKey(item, index))"
                    :tabindex="disabled ? -1 : 0"
                    :draggable="!disabled"
                    @click="onItemClick('target', getItemKey(item, index), $event)"
                    @keydown="onItemKeydown('target', index, getItemKey(item, index), $event)"
                    @dragstart="onDragStart('target', index)"
                    @dragover.prevent
                    @drop.prevent="onDrop('target', index)"
                >
                    <slot name="target-item" :item="item" :index="index">
                        {{ getItemLabel(item) }}
                    </slot>
                </li>
            </ul>
            <div class="vf-picklist__reorder">
                <button type="button" class="vf-picklist__btn" :disabled="disabled" @click="moveUp('target')">
                    Up
                </button>
                <button type="button" class="vf-picklist__btn" :disabled="disabled" @click="moveDown('target')">
                    Down
                </button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type ListName = 'source' | 'target';
type ItemKey = string | number;

interface Props {
    source?: Array<Record<string, unknown>>;
    target?: Array<Record<string, unknown>>;
    itemKey?: string;
    itemLabel?: string;
    sourceHeader?: string;
    targetHeader?: string;
    sourceAriaLabel?: string;
    targetAriaLabel?: string;
    multiple?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    source: () => [],
    target: () => [],
    itemKey: 'id',
    itemLabel: 'label',
    sourceHeader: 'Available',
    targetHeader: 'Selected',
    sourceAriaLabel: 'Available items',
    targetAriaLabel: 'Selected items',
    multiple: true,
    disabled: false,
});

const emits = defineEmits(['update:source', 'update:target', 'transfer', 'reorder']);

const selectedSourceKeys = ref<Array<ItemKey>>([]);
const selectedTargetKeys = ref<Array<ItemKey>>([]);
const dragState = ref<{ list: ListName; index: number } | null>(null);

const getItemKey = (item: Record<string, unknown>, index: number): ItemKey => {
    const value = item?.[props.itemKey];

    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    }

    return index;
};

const getItemLabel = (item: Record<string, unknown>) => {
    const value = item?.[props.itemLabel];

    return value == null ? '' : String(value);
};

const getSelectedKeys = (list: ListName) => (list === 'source' ? selectedSourceKeys.value : selectedTargetKeys.value);

const setSelectedKeys = (list: ListName, keys: Array<ItemKey>) => {
    if (list === 'source') {
        selectedSourceKeys.value = keys;
    } else {
        selectedTargetKeys.value = keys;
    }
};

const isSelected = (list: ListName, key: ItemKey) => getSelectedKeys(list).includes(key);

const onItemClick = (list: ListName, key: ItemKey, event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    const selected = [...getSelectedKeys(list)];
    const index = selected.indexOf(key);

    if (!props.multiple) {
        setSelectedKeys(list, index >= 0 ? [] : [key]);

        return;
    }

    if (event.ctrlKey || event.metaKey) {
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            selected.push(key);
        }
    } else if (index >= 0) {
        selected.splice(index, 1);
    } else {
        selected.push(key);
    }

    setSelectedKeys(list, selected);
};

const emitLists = (source: Array<Record<string, unknown>>, target: Array<Record<string, unknown>>) => {
    emits('update:source', source);
    emits('update:target', target);
};

const moveToTarget = () => {
    if (props.disabled || !selectedSourceKeys.value.length) {
        return;
    }

    const selectedSet = new Set(selectedSourceKeys.value);
    const movedItems = props.source.filter((item, index) => selectedSet.has(getItemKey(item, index)));
    const nextSource = props.source.filter((item, index) => !selectedSet.has(getItemKey(item, index)));
    const nextTarget = [...props.target, ...movedItems];

    selectedSourceKeys.value = [];
    emitLists(nextSource, nextTarget);
    emits('transfer', {
        direction: 'toTarget',
        items: movedItems,
        source: nextSource,
        target: nextTarget,
    });
};

const moveToSource = () => {
    if (props.disabled || !selectedTargetKeys.value.length) {
        return;
    }

    const selectedSet = new Set(selectedTargetKeys.value);
    const movedItems = props.target.filter((item, index) => selectedSet.has(getItemKey(item, index)));
    const nextTarget = props.target.filter((item, index) => !selectedSet.has(getItemKey(item, index)));
    const nextSource = [...props.source, ...movedItems];

    selectedTargetKeys.value = [];
    emitLists(nextSource, nextTarget);
    emits('transfer', {
        direction: 'toSource',
        items: movedItems,
        source: nextSource,
        target: nextTarget,
    });
};

const reorderList = (list: ListName, nextItems: Array<Record<string, unknown>>) => {
    if (list === 'source') {
        emits('update:source', nextItems);
        emits('reorder', { list, items: nextItems });

        return;
    }

    emits('update:target', nextItems);
    emits('reorder', { list, items: nextItems });
};

const moveUp = (list: ListName) => {
    if (props.disabled) {
        return;
    }

    const items = list === 'source' ? [...props.source] : [...props.target];
    const selected = new Set(getSelectedKeys(list));

    for (let index = 1; index < items.length; index += 1) {
        const key = getItemKey(items[index], index);
        if (selected.has(key)) {
            const prev = items[index - 1];

            items[index - 1] = items[index];
            items[index] = prev;
        }
    }

    reorderList(list, items);
};

const moveDown = (list: ListName) => {
    if (props.disabled) {
        return;
    }

    const items = list === 'source' ? [...props.source] : [...props.target];
    const selected = new Set(getSelectedKeys(list));

    for (let index = items.length - 2; index >= 0; index -= 1) {
        const key = getItemKey(items[index], index);
        if (selected.has(key)) {
            const next = items[index + 1];

            items[index + 1] = items[index];
            items[index] = next;
        }
    }

    reorderList(list, items);
};

const onItemKeydown = (list: ListName, index: number, key: ItemKey, event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onItemClick(list, key, new MouseEvent('click', { ctrlKey: props.multiple }));

        return;
    }

    if (event.key === 'ArrowUp' && event.ctrlKey) {
        event.preventDefault();
        moveUp(list);

        return;
    }

    if (event.key === 'ArrowDown' && event.ctrlKey) {
        event.preventDefault();
        moveDown(list);

        return;
    }

    if (event.key === 'ArrowRight' && list === 'source') {
        event.preventDefault();
        setSelectedKeys('source', [key]);
        moveToTarget();

        return;
    }

    if (event.key === 'ArrowLeft' && list === 'target') {
        event.preventDefault();
        setSelectedKeys('target', [key]);
        moveToSource();

        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1;
        const listItems = Array.from(
            (event.currentTarget as HTMLElement)
                .closest('.vf-picklist__list')
                ?.querySelectorAll<HTMLElement>('.vf-picklist__item') ?? [],
        );

        if (nextIndex >= 0 && nextIndex < listItems.length) {
            listItems[nextIndex].focus();
        }
    }
};

const onDragStart = (list: ListName, index: number) => {
    if (props.disabled) {
        return;
    }

    dragState.value = { list, index };
};

const onDrop = (toList: ListName, toIndex: number) => {
    if (props.disabled || !dragState.value) {
        return;
    }

    const { list: fromList, index: fromIndex } = dragState.value;
    dragState.value = null;

    const sourceItems = [...props.source];
    const targetItems = [...props.target];
    const fromItems = fromList === 'source' ? sourceItems : targetItems;
    const toItems = toList === 'source' ? sourceItems : targetItems;
    const [moved] = fromItems.splice(fromIndex, 1);

    if (!moved) {
        return;
    }

    const insertionIndex = Math.max(0, Math.min(toIndex, toItems.length));
    toItems.splice(insertionIndex, 0, moved);
    emitLists(sourceItems, targetItems);
    emits('reorder', {
        list: toList,
        items: toItems,
    });
};
</script>

<style lang="scss">
.vf-picklist {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--vf-picklist-gap);
}

.vf-picklist__column {
    display: grid;
    gap: 0.5rem;
}

.vf-picklist__header {
    font-weight: 600;
    color: var(--vf-picklist-header-color);
}

.vf-picklist__list {
    list-style: none;
    margin: 0;
    padding: var(--vf-picklist-list-padding);
    min-height: var(--vf-picklist-list-min-height);
    border: var(--vf-border-width) solid var(--vf-picklist-border-color);
    border-radius: var(--vf-picklist-border-radius);
    background-color: var(--vf-picklist-background-color);
    overflow: auto;
}

.vf-picklist__item {
    padding: var(--vf-picklist-item-padding);
    border-radius: var(--vf-picklist-item-radius);
    cursor: pointer;
    user-select: none;
}

.vf-picklist__item + .vf-picklist__item {
    margin-top: 0.2rem;
}

.vf-picklist__item:hover {
    background-color: var(--vf-picklist-item-hover-background-color);
}

.vf-picklist__item_selected {
    background-color: var(--vf-picklist-item-selected-background-color);
    color: var(--vf-picklist-item-selected-color);
}

.vf-picklist__item:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-picklist-focus-ring-color);
}

.vf-picklist__transfer,
.vf-picklist__reorder {
    display: inline-flex;
    flex-direction: column;
    gap: 0.35rem;
    justify-content: center;
}

.vf-picklist__btn {
    border: var(--vf-border-width) solid var(--vf-picklist-button-border-color);
    border-radius: var(--vf-picklist-button-radius);
    background-color: var(--vf-picklist-button-background-color);
    color: var(--vf-picklist-button-color);
    min-width: 2rem;
    min-height: 2rem;
    cursor: pointer;
}

.vf-picklist__btn:disabled {
    opacity: var(--vf-picklist-disabled-opacity);
    cursor: not-allowed;
}

.vf-picklist_disabled {
    opacity: var(--vf-picklist-disabled-opacity);
}
</style>
