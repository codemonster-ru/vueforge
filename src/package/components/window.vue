<template>
    <section
        class="vf-window"
        :class="{ 'vf-window_disabled': disabled }"
        role="region"
        :aria-label="ariaLabel || undefined"
        tabindex="0"
        @keydown="onKeydown"
    >
        <div v-if="showControls" class="vf-window__controls" role="group" :aria-label="controlsAriaLabel || undefined">
            <slot
                name="controls"
                :index="activeIndex"
                :item="activeItem"
                :can-prev="canPrev"
                :can-next="canNext"
                :prev="goPrev"
                :next="goNext"
            >
                <button type="button" class="vf-window__control" :disabled="!canPrev" @click="goPrev">
                    {{ prevLabel }}
                </button>
                <button type="button" class="vf-window__control" :disabled="!canNext" @click="goNext">
                    {{ nextLabel }}
                </button>
            </slot>
        </div>

        <div class="vf-window__viewport">
            <Transition :name="transitionName" mode="out-in">
                <div :key="String(activeValue ?? '__empty__')" class="vf-window__panel" :aria-label="panelAriaLabel">
                    <slot name="item" :item="activeItem" :index="activeIndex" :value="activeValue">
                        <slot />
                    </slot>
                </div>
            </Transition>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type WindowValue = string | number;
type WindowDirection = 'forward' | 'backward';
type WindowTransition = 'slide-horizontal' | 'slide-vertical' | 'fade' | 'none';

export interface WindowItem {
    value: WindowValue;
    label?: string;
    disabled?: boolean;
}

interface Props {
    modelValue?: WindowValue | null;
    items?: Array<WindowItem>;
    loop?: boolean;
    disabled?: boolean;
    showControls?: boolean;
    keyboard?: boolean;
    transition?: WindowTransition;
    ariaLabel?: string;
    controlsAriaLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
}

defineOptions({ name: 'VfWindow' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    items: () => [],
    loop: true,
    disabled: false,
    showControls: true,
    keyboard: true,
    transition: 'slide-horizontal',
    ariaLabel: 'Window',
    controlsAriaLabel: 'Window controls',
    prevLabel: 'Previous',
    nextLabel: 'Next',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: WindowValue): void;
    (
        event: 'change',
        payload: {
            value: WindowValue;
            item: WindowItem;
            index: number;
            direction: WindowDirection;
        },
    ): void;
    (event: 'prev', payload: { value: WindowValue; item: WindowItem; index: number }): void;
    (event: 'next', payload: { value: WindowValue; item: WindowItem; index: number }): void;
}>();

const direction = ref<WindowDirection>('forward');

const findFirstEnabledValue = () => props.items.find(item => !item.disabled)?.value ?? null;

const activeValue = ref<WindowValue | null>(props.modelValue ?? findFirstEnabledValue());

const activeIndex = computed(() =>
    props.items.findIndex(item => activeValue.value !== null && item.value === activeValue.value),
);
const activeItem = computed(() => (activeIndex.value >= 0 ? props.items[activeIndex.value] : null));
const enabledIndices = computed(() =>
    props.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled)
        .map(({ index }) => index),
);

const canPrev = computed(() => {
    if (props.disabled || enabledIndices.value.length <= 1 || activeIndex.value < 0) {
        return false;
    }

    if (props.loop) {
        return true;
    }

    return activeIndex.value > enabledIndices.value[0];
});

const canNext = computed(() => {
    if (props.disabled || enabledIndices.value.length <= 1 || activeIndex.value < 0) {
        return false;
    }

    if (props.loop) {
        return true;
    }

    return activeIndex.value < enabledIndices.value[enabledIndices.value.length - 1];
});

const panelAriaLabel = computed(() => {
    if (!activeItem.value) {
        return 'Window panel';
    }

    const label = activeItem.value.label || `Panel ${activeIndex.value + 1}`;

    return `${label} (${activeIndex.value + 1}/${props.items.length})`;
});

const transitionName = computed(() => {
    if (props.transition === 'none') {
        return 'vf-window-none';
    }
    if (props.transition === 'fade') {
        return 'vf-window-fade';
    }
    if (props.transition === 'slide-vertical') {
        return direction.value === 'forward' ? 'vf-window-slide-y-forward' : 'vf-window-slide-y-backward';
    }

    return direction.value === 'forward' ? 'vf-window-slide-x-forward' : 'vf-window-slide-x-backward';
});

const moveTo = (targetIndex: number, moveDirection: WindowDirection) => {
    const nextItem = props.items[targetIndex];

    if (!nextItem || nextItem.disabled || props.disabled) {
        return;
    }

    direction.value = moveDirection;
    activeValue.value = nextItem.value;
    emits('update:modelValue', nextItem.value);
    emits('change', {
        value: nextItem.value,
        item: nextItem,
        index: targetIndex,
        direction: moveDirection,
    });
    if (moveDirection === 'forward') {
        emits('next', {
            value: nextItem.value,
            item: nextItem,
            index: targetIndex,
        });
    } else {
        emits('prev', {
            value: nextItem.value,
            item: nextItem,
            index: targetIndex,
        });
    }
};

const moveBy = (step: 1 | -1) => {
    if (props.disabled || enabledIndices.value.length <= 1 || activeIndex.value < 0) {
        return;
    }

    const currentEnabledIndex = enabledIndices.value.indexOf(activeIndex.value);

    if (currentEnabledIndex < 0) {
        return;
    }

    const targetEnabledIndex = currentEnabledIndex + step;

    if (!props.loop && (targetEnabledIndex < 0 || targetEnabledIndex >= enabledIndices.value.length)) {
        return;
    }

    const boundedIndex = (targetEnabledIndex + enabledIndices.value.length) % enabledIndices.value.length;
    const targetIndex = enabledIndices.value[boundedIndex];
    const moveDirection: WindowDirection = step === 1 ? 'forward' : 'backward';

    moveTo(targetIndex, moveDirection);
};

const goPrev = () => moveBy(-1);
const goNext = () => moveBy(1);

const onKeydown = (event: KeyboardEvent) => {
    if (!props.keyboard || props.disabled) {
        return;
    }

    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
        return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrev();
        return;
    }

    if (event.key === 'Home' && enabledIndices.value.length > 0) {
        event.preventDefault();
        moveTo(enabledIndices.value[0], 'backward');
        return;
    }

    if (event.key === 'End' && enabledIndices.value.length > 0) {
        event.preventDefault();
        moveTo(enabledIndices.value[enabledIndices.value.length - 1], 'forward');
    }
};

watch(
    () => props.modelValue,
    value => {
        if (value == null) {
            return;
        }

        const index = props.items.findIndex(item => item.value === value && !item.disabled);
        if (index >= 0) {
            activeValue.value = value;
        }
    },
);

watch(
    () => props.items,
    items => {
        if (!items.some(item => item.value === activeValue.value && !item.disabled)) {
            activeValue.value = findFirstEnabledValue();
        }
    },
    { deep: true },
);
</script>

<style lang="scss">
.vf-window {
    display: grid;
    gap: var(--vf-window-gap);
    padding: var(--vf-window-padding);
    border: var(--vf-border-width) solid var(--vf-window-border-color);
    border-radius: var(--vf-window-border-radius);
    background-color: var(--vf-window-background-color);
    color: var(--vf-window-text-color);
    min-height: var(--vf-window-min-height);
}

.vf-window:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-primary-color);
}

.vf-window_disabled {
    opacity: var(--vf-window-disabled-opacity);
}

.vf-window__controls {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--vf-window-controls-gap);
}

.vf-window__control {
    padding: var(--vf-window-control-padding);
    border-radius: var(--vf-window-control-radius);
    border: var(--vf-border-width) solid var(--vf-window-control-border-color);
    background-color: var(--vf-window-control-background-color);
    color: var(--vf-window-control-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-window__control:hover:not(:disabled) {
    background-color: var(--vf-window-control-hover-background-color);
}

.vf-window__control:disabled {
    opacity: var(--vf-window-disabled-opacity);
    cursor: not-allowed;
}

.vf-window__viewport {
    position: relative;
    overflow: hidden;
}

.vf-window__panel {
    min-width: 0;
}

.vf-window-fade-enter-active,
.vf-window-fade-leave-active,
.vf-window-slide-x-forward-enter-active,
.vf-window-slide-x-forward-leave-active,
.vf-window-slide-x-backward-enter-active,
.vf-window-slide-x-backward-leave-active,
.vf-window-slide-y-forward-enter-active,
.vf-window-slide-y-forward-leave-active,
.vf-window-slide-y-backward-enter-active,
.vf-window-slide-y-backward-leave-active {
    transition:
        opacity var(--vf-window-transition-duration) var(--vf-window-transition-timing),
        transform var(--vf-window-transition-duration) var(--vf-window-transition-timing);
}

.vf-window-fade-enter-from,
.vf-window-fade-leave-to {
    opacity: 0;
}

.vf-window-slide-x-forward-enter-from,
.vf-window-slide-x-backward-leave-to {
    transform: translateX(0.75rem);
    opacity: 0;
}

.vf-window-slide-x-forward-leave-to,
.vf-window-slide-x-backward-enter-from {
    transform: translateX(-0.75rem);
    opacity: 0;
}

.vf-window-slide-y-forward-enter-from,
.vf-window-slide-y-backward-leave-to {
    transform: translateY(0.75rem);
    opacity: 0;
}

.vf-window-slide-y-forward-leave-to,
.vf-window-slide-y-backward-enter-from {
    transform: translateY(-0.75rem);
    opacity: 0;
}

.vf-window-none-enter-active,
.vf-window-none-leave-active {
    transition: none;
}
</style>
