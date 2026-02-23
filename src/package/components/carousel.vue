<template>
    <div
        v-bind="rootAttrs"
        role="region"
        aria-roledescription="carousel"
        :aria-label="ariaLabel"
        :tabindex="disabled || !keyboard ? -1 : 0"
        @keydown="onKeydown"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <button
            v-if="showArrows"
            type="button"
            v-bind="prevArrowAttrs"
            :disabled="disabled || !canGoPrev"
            aria-label="Previous slide"
            @click="goPrev()"
        >
            <slot name="prevIcon">&#8249;</slot>
        </button>

        <div v-bind="viewportAttrs" @touchstart="onTouchStart" @touchend="onTouchEnd">
            <div v-bind="trackAttrs" :style="trackStyle" :aria-live="liveMode">
                <div
                    v-for="(item, index) in items"
                    :key="getSlideKey(item, index)"
                    :class="slideClass(index)"
                    v-bind="slideAttrs(index, item)"
                    role="group"
                    aria-roledescription="slide"
                    :aria-label="`${index + 1} of ${slideCount}`"
                    :aria-hidden="index === currentIndex ? 'false' : 'true'"
                >
                    <slot name="item" :item="item" :index="index" :active="index === currentIndex">
                        {{ getSlideText(item) }}
                    </slot>
                </div>
            </div>
        </div>

        <button
            v-if="showArrows"
            type="button"
            v-bind="nextArrowAttrs"
            :disabled="disabled || !canGoNext"
            aria-label="Next slide"
            @click="goNext()"
        >
            <slot name="nextIcon">&#8250;</slot>
        </button>

        <div
            v-if="showIndicators && slideCount > 1"
            v-bind="indicatorsAttrs"
            role="tablist"
            aria-label="Slide selector"
        >
            <button
                v-for="(_, index) in items"
                :key="`indicator-${index}`"
                type="button"
                :class="indicatorClass(index)"
                v-bind="indicatorAttrs(index)"
                role="tab"
                :aria-selected="index === currentIndex"
                :aria-current="index === currentIndex ? 'true' : undefined"
                :disabled="disabled"
                :aria-label="`Go to slide ${index + 1}`"
                @click="goTo(index, 'indicator')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

type ChangeSource = 'next' | 'prev' | 'indicator' | 'autoplay' | 'keyboard' | 'swipe';

interface CarouselChangePayload {
    index: number;
    previousIndex: number;
    source: ChangeSource;
}

interface Props {
    modelValue?: number;
    items?: Array<unknown>;
    autoplay?: boolean;
    autoplayInterval?: number;
    loop?: boolean;
    keyboard?: boolean;
    swipe?: boolean;
    pauseOnHover?: boolean;
    showArrows?: boolean;
    showIndicators?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    slideKey?: string | ((item: unknown, index: number) => string | number);
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

let carouselIdSeed = 0;

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    items: () => [],
    autoplay: false,
    autoplayInterval: 5000,
    loop: true,
    keyboard: true,
    swipe: true,
    pauseOnHover: true,
    showArrows: true,
    showIndicators: true,
    disabled: false,
    ariaLabel: 'Carousel',
    slideKey: undefined,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'update:modelValue', index: number): void;
    (event: 'change', payload: CarouselChangePayload): void;
}>();

defineSlots<{
    item?: (props: { item: unknown; index: number; active: boolean }) => unknown;
    prevIcon?: () => unknown;
    nextIcon?: () => unknown;
}>();

const rootId = `vf-carousel-${++carouselIdSeed}`;
const internalIndex = ref(0);
const isHovered = ref(false);
const intervalId = ref<ReturnType<typeof setInterval> | null>(null);
const touchStartX = ref<number | null>(null);

const slideCount = computed(() => props.items.length);

const normalizeIndex = (value: number) => {
    if (!slideCount.value) {
        return 0;
    }

    if (props.loop) {
        return ((value % slideCount.value) + slideCount.value) % slideCount.value;
    }

    return Math.max(0, Math.min(slideCount.value - 1, value));
};

const currentIndex = computed(() => normalizeIndex(internalIndex.value));
const canGoPrev = computed(() => slideCount.value > 1 && (props.loop || currentIndex.value > 0));
const canGoNext = computed(() => slideCount.value > 1 && (props.loop || currentIndex.value < slideCount.value - 1));
const liveMode = computed(() => (props.autoplay ? 'off' : 'polite'));

const ptContext = computed(() => ({
    disabled: props.disabled,
    open: true,
    index: currentIndex.value,
    count: slideCount.value,
}));
const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        ['vf-carousel', props.disabled ? 'vf-carousel_disabled' : null].filter(Boolean).join(' '),
        props.unstyled,
    ),
);
const viewportAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'viewport', ptContext.value), 'vf-carousel__viewport', props.unstyled),
);
const trackAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'track', ptContext.value), 'vf-carousel__track', props.unstyled),
);
const prevArrowAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'prevArrow', ptContext.value),
        'vf-carousel__arrow vf-carousel__arrow_prev',
        props.unstyled,
    ),
);
const nextArrowAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'nextArrow', ptContext.value),
        'vf-carousel__arrow vf-carousel__arrow_next',
        props.unstyled,
    ),
);
const indicatorsAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'indicators', ptContext.value),
        'vf-carousel__indicators',
        props.unstyled,
    ),
);
const slideClass = (index: number) =>
    props.unstyled
        ? undefined
        : ['vf-carousel__slide', index === currentIndex.value ? 'vf-carousel__slide_active' : null];
const slideAttrs = (index: number, item: unknown) =>
    resolvePassThrough(props.pt, 'slide', {
        ...ptContext.value,
        slideIndex: index,
        slide: item,
        active: index === currentIndex.value,
    });
const indicatorClass = (index: number) =>
    props.unstyled
        ? undefined
        : ['vf-carousel__indicator', index === currentIndex.value ? 'vf-carousel__indicator_active' : null];
const indicatorAttrs = (index: number) =>
    resolvePassThrough(props.pt, 'indicator', {
        ...ptContext.value,
        slideIndex: index,
        active: index === currentIndex.value,
    });
const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * 100}%)`,
}));

const shouldAutoplay = computed(
    () => props.autoplay && !props.disabled && slideCount.value > 1 && (!props.pauseOnHover || !isHovered.value),
);

const stopAutoplay = () => {
    if (!intervalId.value) {
        return;
    }

    clearInterval(intervalId.value);
    intervalId.value = null;
};

const startAutoplay = () => {
    stopAutoplay();

    if (!shouldAutoplay.value) {
        return;
    }

    intervalId.value = setInterval(
        () => {
            if (!goNext('autoplay', true)) {
                stopAutoplay();
            }
        },
        Math.max(250, props.autoplayInterval),
    );
};

const syncModelValue = (value: number) => {
    internalIndex.value = normalizeIndex(value);
};

const goTo = (index: number, source: ChangeSource, keepTimer = false) => {
    if (props.disabled || slideCount.value < 2) {
        return false;
    }

    if (!props.loop && (index < 0 || index >= slideCount.value)) {
        return false;
    }

    const previousIndex = currentIndex.value;
    const nextIndex = normalizeIndex(index);

    if (nextIndex === previousIndex) {
        return false;
    }

    internalIndex.value = nextIndex;
    emits('update:modelValue', nextIndex);
    emits('change', { index: nextIndex, previousIndex, source });

    if (!keepTimer) {
        startAutoplay();
    }

    return true;
};

const goPrev = (source: ChangeSource = 'prev', keepTimer = false) => goTo(currentIndex.value - 1, source, keepTimer);
const goNext = (source: ChangeSource = 'next', keepTimer = false) => goTo(currentIndex.value + 1, source, keepTimer);

const onMouseEnter = () => {
    isHovered.value = true;
    startAutoplay();
};

const onMouseLeave = () => {
    isHovered.value = false;
    startAutoplay();
};

const onTouchStart = (event: TouchEvent) => {
    if (!props.swipe || props.disabled || slideCount.value < 2) {
        return;
    }

    touchStartX.value = event.changedTouches[0]?.clientX ?? null;
};

const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.value == null) {
        return;
    }

    const endX = event.changedTouches[0]?.clientX;

    if (typeof endX !== 'number') {
        touchStartX.value = null;

        return;
    }

    const delta = endX - touchStartX.value;
    touchStartX.value = null;

    if (Math.abs(delta) < 36) {
        return;
    }

    if (delta > 0) {
        goPrev('swipe');

        return;
    }

    goNext('swipe');
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled || !props.keyboard || slideCount.value < 2) {
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

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        goTo(0, 'keyboard');

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        goTo(slideCount.value - 1, 'keyboard');
    }
};

const getSlideKey = (item: unknown, index: number) => {
    if (typeof props.slideKey === 'function') {
        return props.slideKey(item, index);
    }

    if (typeof props.slideKey === 'string' && item && typeof item === 'object') {
        const record = item as Record<string, unknown>;

        if (record[props.slideKey] != null) {
            return record[props.slideKey] as string | number;
        }
    }

    return `${rootId}-slide-${index}`;
};

const getSlideText = (item: unknown) => {
    if (typeof item === 'string' || typeof item === 'number') {
        return String(item);
    }

    return '';
};

watch(
    () => props.modelValue,
    value => {
        syncModelValue(value);
    },
    { immediate: true },
);
watch(
    () => slideCount.value,
    () => {
        syncModelValue(currentIndex.value);
        startAutoplay();
    },
);
watch(
    () => [props.autoplay, props.autoplayInterval, props.pauseOnHover, props.disabled] as const,
    () => {
        startAutoplay();
    },
);

onMounted(() => {
    startAutoplay();
});

onBeforeUnmount(() => {
    stopAutoplay();
});

defineExpose({
    goTo: (index: number) => goTo(index, 'indicator'),
    next: () => goNext(),
    prev: () => goPrev(),
    pause: () => {
        isHovered.value = true;
        startAutoplay();
    },
    resume: () => {
        isHovered.value = false;
        startAutoplay();
    },
});
</script>

<style lang="scss">
.vf-carousel {
    position: relative;
    display: grid;
    gap: var(--vf-carousel-gap);
    width: 100%;
}

.vf-carousel__viewport {
    overflow: hidden;
    border: var(--vf-border-width) solid var(--vf-carousel-border-color);
    border-radius: var(--vf-carousel-border-radius);
    background: var(--vf-carousel-background-color);
    color: var(--vf-carousel-text-color);
}

.vf-carousel__track {
    display: flex;
    transition: transform var(--vf-carousel-transition-duration) var(--vf-carousel-transition-easing);
    will-change: transform;
}

.vf-carousel__slide {
    flex: 0 0 100%;
    min-height: var(--vf-carousel-slide-min-height);
    padding: var(--vf-carousel-slide-padding);
}

.vf-carousel__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: var(--vf-carousel-arrow-size);
    height: var(--vf-carousel-arrow-size);
    border: var(--vf-border-width) solid var(--vf-carousel-arrow-border-color);
    border-radius: var(--vf-carousel-arrow-border-radius);
    background: var(--vf-carousel-arrow-background-color);
    color: var(--vf-carousel-arrow-text-color);
    z-index: 1;
}

.vf-carousel__arrow_prev {
    left: var(--vf-carousel-arrow-offset);
}

.vf-carousel__arrow_next {
    right: var(--vf-carousel-arrow-offset);
}

.vf-carousel__indicators {
    display: flex;
    justify-content: center;
    gap: var(--vf-carousel-indicators-gap);
}

.vf-carousel__indicator {
    width: var(--vf-carousel-indicator-size);
    height: var(--vf-carousel-indicator-size);
    border: var(--vf-border-width) solid var(--vf-carousel-indicator-border-color);
    border-radius: 999px;
    background: var(--vf-carousel-indicator-background-color);
}

.vf-carousel__indicator_active {
    background: var(--vf-carousel-indicator-active-background-color);
    border-color: var(--vf-carousel-indicator-active-border-color);
}

.vf-carousel:focus-visible {
    outline: none;
}

.vf-carousel:focus-visible .vf-carousel__viewport {
    box-shadow: var(--vf-carousel-focus-ring-shadow);
    border-color: var(--vf-carousel-focus-border-color);
}

.vf-carousel_disabled {
    opacity: var(--vf-carousel-disabled-opacity);
}

@media (max-width: 767px) {
    .vf-carousel__arrow {
        width: var(--vf-carousel-arrow-size-mobile);
        height: var(--vf-carousel-arrow-size-mobile);
    }
}
</style>
