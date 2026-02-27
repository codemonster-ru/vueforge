<template>
    <div class="vf-slide-group" :class="{ 'vf-slide-group_disabled': disabled }">
        <button
            v-if="showControls"
            type="button"
            class="vf-slide-group__control vf-slide-group__control_prev"
            :aria-label="prevLabel"
            :disabled="disabled"
            @click="scrollPrev"
        >
            <slot name="prev">&lsaquo;</slot>
        </button>

        <div
            ref="viewportRef"
            class="vf-slide-group__viewport"
            role="group"
            :aria-label="ariaLabel || undefined"
            tabindex="0"
            @keydown="onViewportKeydown"
        >
            <div class="vf-slide-group__track" :class="{ 'vf-slide-group__track_snap': snap }">
                <button
                    v-for="(item, index) in items"
                    :key="item.key ?? `${String(item.value)}-${index.toString()}`"
                    :ref="element => setItemRef(element, index)"
                    type="button"
                    class="vf-slide-group__item"
                    :class="{ 'vf-slide-group__item_active': isActive(item.value) }"
                    :disabled="disabled || !!item.disabled"
                    :aria-pressed="isActive(item.value) ? 'true' : 'false'"
                    @click="select(item, index, $event)"
                    @keydown="onItemKeydown(index, $event)"
                >
                    <slot name="item" :item="item" :index="index" :active="isActive(item.value)">
                        {{ item.label }}
                    </slot>
                </button>
            </div>
        </div>

        <button
            v-if="showControls"
            type="button"
            class="vf-slide-group__control vf-slide-group__control_next"
            :aria-label="nextLabel"
            :disabled="disabled"
            @click="scrollNext"
        >
            <slot name="next">&rsaquo;</slot>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type SlideGroupValue = string | number;

export interface SlideGroupItem {
    key?: string | number;
    label: string;
    value: SlideGroupValue;
    disabled?: boolean;
}

interface Props {
    modelValue?: SlideGroupValue | null;
    items?: Array<SlideGroupItem>;
    disabled?: boolean;
    showControls?: boolean;
    scrollStep?: number;
    snap?: boolean;
    ariaLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
}

defineOptions({ name: 'VfSlideGroup' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    items: () => [],
    disabled: false,
    showControls: true,
    scrollStep: 180,
    snap: true,
    ariaLabel: 'Slide group',
    prevLabel: 'Scroll left',
    nextLabel: 'Scroll right',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: SlideGroupValue): void;
    (event: 'change', value: SlideGroupValue, item: SlideGroupItem, index: number, sourceEvent: Event): void;
}>();

const viewportRef = ref<HTMLElement | null>(null);
const itemRefs = ref<Array<HTMLButtonElement | null>>([]);

const enabledIndices = computed(() =>
    props.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled)
        .map(({ index }) => index),
);

const setItemRef = (element: unknown, index: number) => {
    itemRefs.value[index] = element instanceof HTMLButtonElement ? element : null;
};

const isActive = (value: SlideGroupValue) => props.modelValue === value;

const scrollViewportBy = (delta: number) => {
    const viewport = viewportRef.value;

    if (!viewport) {
        return;
    }

    if (typeof viewport.scrollBy === 'function') {
        viewport.scrollBy({ left: delta, behavior: 'smooth' });
        return;
    }

    viewport.scrollLeft += delta;
};

const ensureItemVisible = (index: number) => {
    const element = itemRefs.value[index];
    element?.scrollIntoView?.({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
};

const scrollPrev = () => {
    if (props.disabled) {
        return;
    }

    scrollViewportBy(-props.scrollStep);
};

const scrollNext = () => {
    if (props.disabled) {
        return;
    }

    scrollViewportBy(props.scrollStep);
};

const select = (item: SlideGroupItem, index: number, sourceEvent: Event) => {
    if (props.disabled || item.disabled) {
        return;
    }

    emits('update:modelValue', item.value);
    emits('change', item.value, item, index, sourceEvent);
};

const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    if (!enabledIndices.value.length) {
        return;
    }

    const enabledPosition = enabledIndices.value.indexOf(currentIndex);
    const startPosition = enabledPosition >= 0 ? enabledPosition : 0;
    const nextPosition = (startPosition + direction + enabledIndices.value.length) % enabledIndices.value.length;
    const nextIndex = enabledIndices.value[nextPosition];
    const nextItem = props.items[nextIndex];
    const nextButton = itemRefs.value[nextIndex];

    nextButton?.focus();
    ensureItemVisible(nextIndex);

    if (nextItem) {
        select(nextItem, nextIndex, new KeyboardEvent('keydown', { key: direction > 0 ? 'ArrowRight' : 'ArrowLeft' }));
    }
};

const focusIndex = (index: number) => {
    const nextButton = itemRefs.value[index];
    const nextItem = props.items[index];

    nextButton?.focus();
    ensureItemVisible(index);

    if (nextItem) {
        select(nextItem, index, new KeyboardEvent('keydown', { key: 'Home' }));
    }
};

const onItemKeydown = (index: number, event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
        moveFocus(index, 1);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        moveFocus(index, -1);
        return;
    }

    if (event.key === 'Home' && enabledIndices.value.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        focusIndex(enabledIndices.value[0]);
        return;
    }

    if (event.key === 'End' && enabledIndices.value.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        focusIndex(enabledIndices.value[enabledIndices.value.length - 1]);
    }
};

const onViewportKeydown = (event: KeyboardEvent) => {
    if (props.disabled || !enabledIndices.value.length) {
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusIndex(enabledIndices.value[0]);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusIndex(enabledIndices.value[enabledIndices.value.length - 1]);
    }
};
</script>

<style lang="scss">
.vf-slide-group {
    display: flex;
    align-items: center;
    gap: var(--vf-slide-group-controls-gap);
}

.vf-slide-group__control {
    width: var(--vf-slide-group-control-size);
    height: var(--vf-slide-group-control-size);
    border: var(--vf-border-width) solid var(--vf-slide-group-control-border-color);
    border-radius: var(--vf-slide-group-control-radius);
    background-color: var(--vf-slide-group-control-background-color);
    color: var(--vf-slide-group-control-text-color);
    cursor: pointer;
}

.vf-slide-group__control:hover:not(:disabled) {
    background-color: var(--vf-slide-group-control-hover-background-color);
}

.vf-slide-group__viewport {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    flex: 1 1 auto;
    min-width: 0;
}

.vf-slide-group__track {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-slide-group-gap);
    min-width: 100%;
}

.vf-slide-group__track_snap > .vf-slide-group__item {
    scroll-snap-align: start;
}

.vf-slide-group__item {
    border: var(--vf-border-width) solid var(--vf-slide-group-item-border-color);
    border-radius: var(--vf-slide-group-item-border-radius);
    background-color: var(--vf-slide-group-item-background-color);
    color: var(--vf-slide-group-item-text-color);
    padding: var(--vf-slide-group-item-padding);
    white-space: nowrap;
    cursor: pointer;
}

.vf-slide-group__item:hover:not(:disabled),
.vf-slide-group__item:focus-visible {
    background-color: var(--vf-slide-group-item-hover-background-color);
    outline: none;
}

.vf-slide-group__item_active {
    background-color: var(--vf-slide-group-item-active-background-color);
    color: var(--vf-slide-group-item-active-text-color);
    border-color: var(--vf-slide-group-item-active-border-color);
}

.vf-slide-group_disabled {
    opacity: var(--vf-slide-group-disabled-opacity);
}
</style>
