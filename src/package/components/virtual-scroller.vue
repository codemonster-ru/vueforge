<template>
    <div
        ref="viewport"
        :class="rootClass"
        :style="viewportStyle"
        role="list"
        :aria-label="ariaLabel || undefined"
        @scroll="onScroll"
    >
        <div v-if="!itemsCount" class="vf-virtual-scroller__empty">
            <slot name="empty">{{ emptyText }}</slot>
        </div>
        <template v-else-if="virtual">
            <div class="vf-virtual-scroller__spacer" :style="spacerStyle">
                <div class="vf-virtual-scroller__content" :style="contentStyle">
                    <div
                        v-for="entry in visibleItems"
                        :key="entry.key"
                        class="vf-virtual-scroller__item"
                        :style="itemStyle"
                        role="listitem"
                    >
                        <slot :item="entry.item" :index="entry.index">
                            {{ entry.item }}
                        </slot>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="vf-virtual-scroller__content vf-virtual-scroller__content_static">
            <div
                v-for="(item, index) in normalizedItems"
                :key="getItemKey(item, index)"
                class="vf-virtual-scroller__item"
                :style="itemStyle"
                role="listitem"
            >
                <slot :item="item" :index="index">
                    {{ item }}
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
    items?: Array<unknown>;
    itemHeight?: number;
    height?: string;
    overscan?: number;
    keyField?: string;
    virtual?: boolean;
    ariaLabel?: string;
    emptyText?: string;
}

const emits = defineEmits(['scroll', 'rangeChange', 'reachEnd']);

defineOptions({ name: 'VfVirtualScroller' });

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    itemHeight: 36,
    height: '18rem',
    overscan: 4,
    keyField: 'id',
    virtual: true,
    ariaLabel: 'Virtual list',
    emptyText: 'No items',
});

const viewport = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const lastRange = ref({ start: -1, end: -1 });
const endNotified = ref(false);

const normalizedItems = computed(() => props.items ?? []);
const itemsCount = computed(() => normalizedItems.value.length);
const safeItemHeight = computed(() =>
    Number.isFinite(props.itemHeight) && props.itemHeight > 0 ? props.itemHeight : 36,
);
const safeOverscan = computed(() =>
    Number.isFinite(props.overscan) && props.overscan >= 0 ? Math.floor(props.overscan) : 4,
);

const parseCssLength = (value: string) => {
    const match = /^(\d+(?:\.\d+)?)px$/i.exec(value.trim());

    if (!match) {
        return null;
    }

    return Number(match[1]);
};

const viewportHeight = computed(() => {
    const elementHeight = viewport.value?.clientHeight ?? 0;

    if (elementHeight > 0) {
        return elementHeight;
    }

    const parsed = parseCssLength(props.height);

    if (parsed && parsed > 0) {
        return parsed;
    }

    return safeItemHeight.value * 6;
});

const startIndex = computed(() => {
    if (!props.virtual) {
        return 0;
    }

    const index = Math.floor(scrollTop.value / safeItemHeight.value) - safeOverscan.value;

    return Math.max(0, index);
});

const visibleCount = computed(() => {
    if (!props.virtual) {
        return itemsCount.value;
    }

    const viewportRows = Math.ceil(viewportHeight.value / safeItemHeight.value);

    return viewportRows + safeOverscan.value * 2;
});

const endIndex = computed(() => {
    if (!props.virtual) {
        return itemsCount.value;
    }

    return Math.min(itemsCount.value, startIndex.value + visibleCount.value);
});

const visibleItems = computed(() => {
    const output: Array<{ item: unknown; index: number; key: string | number }> = [];

    for (let index = startIndex.value; index < endIndex.value; index += 1) {
        const item = normalizedItems.value[index];

        output.push({
            item,
            index,
            key: getItemKey(item, index),
        });
    }

    return output;
});

const topOffset = computed(() => (props.virtual ? startIndex.value * safeItemHeight.value : 0));
const totalHeight = computed(() => itemsCount.value * safeItemHeight.value);

const rootClass = computed(() => ['vf-virtual-scroller']);
const viewportStyle = computed(() => ({ height: props.height }));
const spacerStyle = computed(() => ({ height: `${totalHeight.value}px` }));
const contentStyle = computed(() => ({ transform: `translateY(${topOffset.value}px)` }));
const itemStyle = computed(() => ({ minHeight: `${safeItemHeight.value}px` }));

const getItemKey = (item: unknown, index: number): string | number => {
    if (item && typeof item === 'object') {
        const candidate = (item as Record<string, unknown>)[props.keyField];

        if (typeof candidate === 'string' || typeof candidate === 'number') {
            return candidate;
        }
    }

    return index;
};

const emitRange = () => {
    const range = { start: startIndex.value, end: Math.max(startIndex.value, endIndex.value - 1) };

    if (lastRange.value.start !== range.start || lastRange.value.end !== range.end) {
        lastRange.value = range;

        emits('rangeChange', range);
    }
};

const emitReachEndIfNeeded = () => {
    const reached = endIndex.value >= itemsCount.value && itemsCount.value > 0;

    if (reached && !endNotified.value) {
        endNotified.value = true;

        emits('reachEnd');
    }
    if (!reached) {
        endNotified.value = false;
    }
};

const onScroll = (event: Event) => {
    const element = event.target as HTMLElement;

    scrollTop.value = element.scrollTop;

    emits('scroll', event);
    emitRange();
    emitReachEndIfNeeded();
};

watch(
    () => [props.items, props.virtual, props.itemHeight, props.overscan],
    () => {
        emitRange();
        emitReachEndIfNeeded();
    },
    { immediate: true },
);
</script>

<style lang="scss">
.vf-virtual-scroller {
    overflow: auto;
    border: 1px solid var(--vf-virtual-scroller-border-color);
    border-radius: var(--vf-virtual-scroller-border-radius);
    background-color: var(--vf-virtual-scroller-background-color);
    color: var(--vf-virtual-scroller-text-color);
    font-size: var(--vf-virtual-scroller-font-size);
    box-shadow: inset 0 0 0 0 transparent;
}

.vf-virtual-scroller:focus-within {
    box-shadow: var(--vf-virtual-scroller-focus-ring-shadow);
}

.vf-virtual-scroller__spacer {
    position: relative;
    width: 100%;
}

.vf-virtual-scroller__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.vf-virtual-scroller__content_static {
    position: static;
}

.vf-virtual-scroller__item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: var(--vf-virtual-scroller-item-padding);
    border-bottom: 1px solid var(--vf-virtual-scroller-item-border-color);
}

.vf-virtual-scroller__item:last-child {
    border-bottom: none;
}

.vf-virtual-scroller__empty {
    padding: var(--vf-virtual-scroller-empty-padding);
    color: var(--vf-virtual-scroller-empty-color);
}
</style>
