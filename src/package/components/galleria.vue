<template>
    <div
        class="vf-galleria"
        :class="{ 'vf-galleria_disabled': disabled }"
        role="region"
        aria-roledescription="carousel"
        :aria-label="ariaLabel"
        :tabindex="disabled ? -1 : 0"
        @keydown="onKeydown"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <div class="vf-galleria__stage">
            <button
                type="button"
                class="vf-galleria__nav vf-galleria__nav_prev"
                :disabled="disabled || !canGoPrev"
                aria-label="Previous media"
                @click="goPrev('button')"
            >
                &#8249;
            </button>

            <figure class="vf-galleria__figure">
                <img
                    class="vf-galleria__image"
                    :src="currentItem?.src"
                    :alt="currentItem?.alt ?? ''"
                    :aria-label="`${currentIndex + 1} of ${items.length}`"
                    @click="onItemClick($event)"
                />
                <figcaption v-if="showCaption && currentItem?.caption" class="vf-galleria__caption">
                    {{ currentItem.caption }}
                </figcaption>
            </figure>

            <button
                type="button"
                class="vf-galleria__nav vf-galleria__nav_next"
                :disabled="disabled || !canGoNext"
                aria-label="Next media"
                @click="goNext('button')"
            >
                &#8250;
            </button>
        </div>

        <div
            v-if="showIndicators && items.length > 1"
            class="vf-galleria__indicators"
            role="tablist"
            aria-label="Media selector"
        >
            <button
                v-for="(item, index) in items"
                :key="`indicator-${getItemKey(item, index)}`"
                type="button"
                class="vf-galleria__indicator"
                :class="{ 'vf-galleria__indicator_active': index === currentIndex }"
                role="tab"
                :disabled="disabled"
                :aria-selected="index === currentIndex"
                :aria-current="index === currentIndex ? 'true' : undefined"
                :aria-label="`Go to media ${index + 1}`"
                @click="goTo(index, 'indicator')"
            />
        </div>

        <ul v-if="showThumbnails && items.length > 1" class="vf-galleria__thumbnails" role="list">
            <li v-for="(item, index) in items" :key="`thumb-${getItemKey(item, index)}`" role="none">
                <button
                    type="button"
                    class="vf-galleria__thumbnail"
                    :class="{ 'vf-galleria__thumbnail_active': index === currentIndex }"
                    :disabled="disabled || !!item.disabled"
                    role="tab"
                    :aria-selected="index === currentIndex"
                    :aria-current="index === currentIndex ? 'true' : undefined"
                    :aria-label="item.alt || item.caption || `Media ${index + 1}`"
                    @click="goTo(index, 'thumbnail')"
                >
                    <img
                        class="vf-galleria__thumbnail-image"
                        :src="item.thumbnailSrc ?? item.src"
                        :alt="item.alt ?? ''"
                    />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type ChangeSource = 'button' | 'thumbnail' | 'indicator' | 'keyboard' | 'autoplay';

export interface GalleriaItem {
    src: string;
    thumbnailSrc?: string;
    alt?: string;
    caption?: string;
    disabled?: boolean;
    key?: string | number;
}

interface Props {
    modelValue?: number;
    items?: Array<GalleriaItem>;
    showThumbnails?: boolean;
    showIndicators?: boolean;
    showCaption?: boolean;
    circular?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    pauseOnHover?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    items: () => [],
    showThumbnails: true,
    showIndicators: true,
    showCaption: true,
    circular: true,
    autoPlay: false,
    autoPlayInterval: 5000,
    pauseOnHover: true,
    disabled: false,
    ariaLabel: 'Media gallery',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: number): void;
    (event: 'change', payload: { index: number; previousIndex: number; source: ChangeSource }): void;
    (event: 'itemClick', payload: { item: GalleriaItem; index: number; event: MouseEvent }): void;
}>();

const internalIndex = ref(0);
const isHovered = ref(false);
const timer = ref<ReturnType<typeof setInterval> | null>(null);

const normalizeIndex = (value: number) => {
    if (props.items.length === 0) {
        return 0;
    }

    if (props.circular) {
        return ((value % props.items.length) + props.items.length) % props.items.length;
    }

    return Math.min(Math.max(0, value), props.items.length - 1);
};

const currentIndex = computed(() => normalizeIndex(internalIndex.value));
const currentItem = computed(() => props.items[currentIndex.value]);
const canGoPrev = computed(() => props.items.length > 1 && (props.circular || currentIndex.value > 0));
const canGoNext = computed(
    () => props.items.length > 1 && (props.circular || currentIndex.value < props.items.length - 1),
);
const getItemKey = (item: GalleriaItem, index: number) => item.key ?? item.src ?? index;

const setIndex = (nextIndex: number, source: ChangeSource) => {
    if (props.disabled || props.items.length === 0) {
        return;
    }

    const normalized = normalizeIndex(nextIndex);
    if (normalized === currentIndex.value) {
        return;
    }

    const previousIndex = currentIndex.value;
    internalIndex.value = normalized;
    emits('update:modelValue', normalized);
    emits('change', {
        index: normalized,
        previousIndex,
        source,
    });
};

const goTo = (index: number, source: ChangeSource) => {
    const item = props.items[index];
    if (!item || item.disabled) {
        return;
    }

    setIndex(index, source);
};

const goPrev = (source: ChangeSource) => setIndex(currentIndex.value - 1, source);
const goNext = (source: ChangeSource) => setIndex(currentIndex.value + 1, source);

const onItemClick = (event: MouseEvent) => {
    if (!currentItem.value || props.disabled) {
        return;
    }

    emits('itemClick', {
        item: currentItem.value,
        index: currentIndex.value,
        event,
    });
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        setIndex(0, 'keyboard');
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        setIndex(props.items.length - 1, 'keyboard');
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev('keyboard');
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext('keyboard');
    }
};

const clearTimer = () => {
    if (!timer.value) {
        return;
    }

    clearInterval(timer.value);
    timer.value = null;
};

const setupTimer = () => {
    clearTimer();

    if (!props.autoPlay || props.disabled || props.items.length <= 1) {
        return;
    }

    timer.value = setInterval(
        () => {
            if (props.pauseOnHover && isHovered.value) {
                return;
            }

            goNext('autoplay');
        },
        Math.max(500, props.autoPlayInterval),
    );
};

watch(
    () => props.modelValue,
    value => {
        internalIndex.value = normalizeIndex(value ?? 0);
    },
    { immediate: true },
);

watch(
    () => [props.autoPlay, props.autoPlayInterval, props.disabled, props.items.length, props.pauseOnHover],
    () => {
        setupTimer();
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    clearTimer();
});
</script>

<style lang="scss">
.vf-galleria {
    border: var(--vf-border-width) solid var(--vf-galleria-border-color);
    border-radius: var(--vf-galleria-border-radius);
    background: var(--vf-galleria-background-color);
    padding: var(--vf-galleria-padding);
    color: var(--vf-galleria-text-color);
}

.vf-galleria__stage {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--vf-galleria-stage-gap);
}

.vf-galleria__figure {
    margin: 0;
    display: grid;
    gap: var(--vf-galleria-caption-gap);
}

.vf-galleria__image {
    width: 100%;
    max-height: var(--vf-galleria-max-height);
    object-fit: contain;
    border-radius: var(--vf-galleria-image-radius);
    background: var(--vf-galleria-image-background-color);
}

.vf-galleria__caption {
    font-size: var(--vf-galleria-caption-font-size);
    color: var(--vf-galleria-caption-color);
}

.vf-galleria__nav {
    width: var(--vf-galleria-nav-size);
    height: var(--vf-galleria-nav-size);
    border: var(--vf-border-width) solid var(--vf-galleria-nav-border-color);
    border-radius: 999px;
    background: var(--vf-galleria-nav-background-color);
    color: var(--vf-galleria-nav-text-color);
}

.vf-galleria__indicators {
    margin-top: var(--vf-galleria-indicators-gap);
    display: flex;
    justify-content: center;
    gap: 0.35rem;
}

.vf-galleria__indicator {
    width: 0.6rem;
    height: 0.6rem;
    border: 0;
    border-radius: 999px;
    background: var(--vf-galleria-indicator-color);
}

.vf-galleria__indicator_active {
    background: var(--vf-galleria-indicator-active-color);
}

.vf-galleria__thumbnails {
    margin: var(--vf-galleria-thumbnails-gap) 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: var(--vf-galleria-thumbnails-item-gap);
    overflow-x: auto;
}

.vf-galleria__thumbnail {
    border: var(--vf-border-width) solid var(--vf-galleria-thumbnail-border-color);
    border-radius: var(--vf-galleria-thumbnail-radius);
    background: transparent;
    padding: 0;
    display: inline-flex;
}

.vf-galleria__thumbnail_active {
    border-color: var(--vf-galleria-thumbnail-active-border-color);
}

.vf-galleria__thumbnail-image {
    width: var(--vf-galleria-thumbnail-size);
    height: var(--vf-galleria-thumbnail-size);
    object-fit: cover;
    border-radius: inherit;
}

.vf-galleria_disabled {
    opacity: var(--vf-galleria-disabled-opacity);
}
</style>
