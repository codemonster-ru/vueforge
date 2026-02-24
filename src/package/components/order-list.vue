<template>
    <div class="vf-orderlist" :class="{ 'vf-orderlist_disabled': disabled }">
        <header class="vf-orderlist__header">{{ header }}</header>
        <ul
            class="vf-orderlist__list"
            role="listbox"
            :aria-label="ariaLabel"
            :aria-multiselectable="multiple ? 'true' : 'false'"
        >
            <li
                v-for="(item, index) in modelValue"
                :key="String(getItemKey(item, index))"
                class="vf-orderlist__item"
                :class="{ 'vf-orderlist__item_selected': isSelected(getItemKey(item, index)) }"
                role="option"
                :aria-selected="isSelected(getItemKey(item, index))"
                :tabindex="disabled ? -1 : 0"
                :draggable="!disabled"
                @click="onItemClick(getItemKey(item, index), $event)"
                @keydown="onItemKeydown(index, getItemKey(item, index), $event)"
                @dragstart="onDragStart(index)"
                @dragover.prevent
                @drop.prevent="onDrop(index)"
            >
                <slot name="item" :item="item" :index="index">
                    {{ getItemLabel(item) }}
                </slot>
            </li>
        </ul>
        <div class="vf-orderlist__controls">
            <button type="button" class="vf-orderlist__btn" :disabled="disabled" @click="moveUp">Up</button>
            <button type="button" class="vf-orderlist__btn" :disabled="disabled" @click="moveDown">Down</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type ItemKey = string | number;

interface Props {
    modelValue?: Array<Record<string, unknown>>;
    itemKey?: string;
    itemLabel?: string;
    header?: string;
    ariaLabel?: string;
    multiple?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    itemKey: 'id',
    itemLabel: 'label',
    header: 'Order',
    ariaLabel: 'Order list',
    multiple: true,
    disabled: false,
});

const emits = defineEmits(['update:modelValue', 'reorder']);

const selectedKeys = ref<Array<ItemKey>>([]);
const dragIndex = ref<number | null>(null);

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

const isSelected = (key: ItemKey) => selectedKeys.value.includes(key);

const emitList = (items: Array<Record<string, unknown>>) => {
    emits('update:modelValue', items);
    emits('reorder', items);
};

const onItemClick = (key: ItemKey, event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    const selected = [...selectedKeys.value];
    const index = selected.indexOf(key);

    if (!props.multiple) {
        selectedKeys.value = index >= 0 ? [] : [key];

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

    selectedKeys.value = selected;
};

const moveUp = () => {
    if (props.disabled) {
        return;
    }

    const items = [...props.modelValue];
    const selected = new Set(selectedKeys.value);

    for (let index = 1; index < items.length; index += 1) {
        const key = getItemKey(items[index], index);
        if (selected.has(key)) {
            const prev = items[index - 1];

            items[index - 1] = items[index];
            items[index] = prev;
        }
    }

    emitList(items);
};

const moveDown = () => {
    if (props.disabled) {
        return;
    }

    const items = [...props.modelValue];
    const selected = new Set(selectedKeys.value);

    for (let index = items.length - 2; index >= 0; index -= 1) {
        const key = getItemKey(items[index], index);
        if (selected.has(key)) {
            const next = items[index + 1];

            items[index + 1] = items[index];
            items[index] = next;
        }
    }

    emitList(items);
};

const onItemKeydown = (index: number, key: ItemKey, event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onItemClick(key, new MouseEvent('click', { ctrlKey: props.multiple }));

        return;
    }

    if (event.key === 'ArrowUp' && event.ctrlKey) {
        event.preventDefault();
        moveUp();

        return;
    }

    if (event.key === 'ArrowDown' && event.ctrlKey) {
        event.preventDefault();
        moveDown();

        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1;
        const items = Array.from(
            (event.currentTarget as HTMLElement)
                .closest('.vf-orderlist__list')
                ?.querySelectorAll<HTMLElement>('.vf-orderlist__item') ?? [],
        );

        if (nextIndex >= 0 && nextIndex < items.length) {
            items[nextIndex].focus();
        }
    }
};

const onDragStart = (index: number) => {
    if (props.disabled) {
        return;
    }

    dragIndex.value = index;
};

const onDrop = (index: number) => {
    if (props.disabled || dragIndex.value == null || dragIndex.value === index) {
        return;
    }

    const items = [...props.modelValue];
    const [item] = items.splice(dragIndex.value, 1);

    if (!item) {
        dragIndex.value = null;

        return;
    }

    const insertionIndex = Math.max(0, Math.min(index, items.length));
    items.splice(insertionIndex, 0, item);
    dragIndex.value = null;
    emitList(items);
};
</script>

<style lang="scss">
.vf-orderlist {
    display: grid;
    gap: var(--vf-orderlist-gap);
}

.vf-orderlist__header {
    font-weight: 600;
    color: var(--vf-orderlist-header-color);
}

.vf-orderlist__list {
    list-style: none;
    margin: 0;
    padding: var(--vf-orderlist-list-padding);
    min-height: var(--vf-orderlist-list-min-height);
    border: var(--vf-border-width) solid var(--vf-orderlist-border-color);
    border-radius: var(--vf-orderlist-border-radius);
    background-color: var(--vf-orderlist-background-color);
    overflow: auto;
}

.vf-orderlist__item {
    padding: var(--vf-orderlist-item-padding);
    border-radius: var(--vf-orderlist-item-radius);
    cursor: pointer;
    user-select: none;
}

.vf-orderlist__item + .vf-orderlist__item {
    margin-top: 0.2rem;
}

.vf-orderlist__item:hover {
    background-color: var(--vf-orderlist-item-hover-background-color);
}

.vf-orderlist__item_selected {
    background-color: var(--vf-orderlist-item-selected-background-color);
    color: var(--vf-orderlist-item-selected-color);
}

.vf-orderlist__item:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-orderlist-focus-ring-color);
}

.vf-orderlist__controls {
    display: inline-flex;
    gap: 0.35rem;
}

.vf-orderlist__btn {
    border: var(--vf-border-width) solid var(--vf-orderlist-button-border-color);
    border-radius: var(--vf-orderlist-button-radius);
    background-color: var(--vf-orderlist-button-background-color);
    color: var(--vf-orderlist-button-color);
    min-width: 2.5rem;
    min-height: 2rem;
    cursor: pointer;
}

.vf-orderlist__btn:disabled {
    opacity: var(--vf-orderlist-disabled-opacity);
    cursor: not-allowed;
}

.vf-orderlist_disabled {
    opacity: var(--vf-orderlist-disabled-opacity);
}
</style>
