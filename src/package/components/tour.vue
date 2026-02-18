<template>
    <Teleport to="body">
        <div v-show="modelValue" class="vf-tour" role="presentation">
            <div class="vf-tour__overlay" @click="onOverlayClick"></div>
            <div v-if="mask && hasResolvedTarget" class="vf-tour__spotlight" :style="spotlightStyle"></div>
            <div
                ref="panel"
                class="vf-tour__panel"
                role="dialog"
                aria-modal="true"
                :aria-label="ariaLabel || undefined"
                :data-placement="currentPlacement"
            >
                <div v-if="currentStep?.title || $slots.title" class="vf-tour__title">
                    <slot name="title" :step="currentStep" :index="activeIndex">
                        {{ currentStep?.title }}
                    </slot>
                </div>
                <div v-if="currentStep?.content || $slots.default" class="vf-tour__content">
                    <slot :step="currentStep" :index="activeIndex">
                        {{ currentStep?.content }}
                    </slot>
                </div>
                <div v-if="showProgress" class="vf-tour__progress">{{ activeIndex + 1 }} / {{ totalSteps }}</div>
                <div class="vf-tour__actions">
                    <slot
                        name="actions"
                        :step="currentStep"
                        :index="activeIndex"
                        :is-first="isFirst"
                        :is-last="isLast"
                        :prev="goPrev"
                        :next="goNext"
                        :skip="skipTour"
                    >
                        <button
                            v-if="showSkip"
                            class="vf-tour__button vf-tour__button_secondary"
                            type="button"
                            @click="skipTour"
                        >
                            {{ skipLabel }}
                        </button>
                        <button
                            class="vf-tour__button vf-tour__button_secondary"
                            type="button"
                            :disabled="isFirst"
                            @click="goPrev"
                        >
                            {{ prevLabel }}
                        </button>
                        <button class="vf-tour__button vf-tour__button_primary" type="button" @click="goNext">
                            {{ isLast ? finishLabel : nextLabel }}
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset as floatingOffset, shift } from '@codemonster-ru/floater.js';

type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface TourStep {
    target?: string | HTMLElement;
    title?: string;
    content?: string;
    placement?: Placement;
    offset?: number;
}

interface Props {
    modelValue?: boolean;
    steps?: Array<TourStep>;
    startIndex?: number;
    placement?: Placement;
    offset?: number;
    mask?: boolean;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showSkip?: boolean;
    showProgress?: boolean;
    spotlightPadding?: number;
    nextLabel?: string;
    prevLabel?: string;
    finishLabel?: string;
    skipLabel?: string;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'open', 'close', 'stepChange', 'next', 'prev', 'complete', 'skip']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    steps: () => [],
    startIndex: 0,
    placement: 'bottom',
    offset: 10,
    mask: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    showSkip: true,
    showProgress: true,
    spotlightPadding: 6,
    nextLabel: 'Next',
    prevLabel: 'Back',
    finishLabel: 'Finish',
    skipLabel: 'Skip',
    ariaLabel: 'Tour',
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const panel = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const currentPlacement = ref<Placement>('bottom');
const spotlightStyle = ref<Record<string, string>>({});
const resolvedTarget = ref<HTMLElement | null>(null);
let floater: FloaterInstance = null;

const totalSteps = computed(() => props.steps.length);
const currentStep = computed(() => {
    if (!totalSteps.value) {
        return undefined;
    }

    return props.steps[activeIndex.value];
});
const isFirst = computed(() => activeIndex.value <= 0);
const isLast = computed(() => activeIndex.value >= totalSteps.value - 1);
const hasResolvedTarget = computed(() => !!resolvedTarget.value);

const clampIndex = (index: number) => {
    if (!totalSteps.value) {
        return 0;
    }

    return Math.min(totalSteps.value - 1, Math.max(0, index));
};

const resolveTargetElement = (target?: string | HTMLElement) => {
    if (!target || typeof document === 'undefined') {
        return null;
    }

    if (typeof target === 'string') {
        return document.querySelector<HTMLElement>(target);
    }

    return target;
};

const updateSpotlight = () => {
    if (!resolvedTarget.value) {
        spotlightStyle.value = {};

        return;
    }

    const rect = resolvedTarget.value.getBoundingClientRect();
    const padding = props.spotlightPadding;

    spotlightStyle.value = {
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
    };
};

const centerPanel = () => {
    if (!panel.value || typeof window === 'undefined') {
        return;
    }

    const panelRect = panel.value.getBoundingClientRect();
    const left = Math.max(12, (window.innerWidth - panelRect.width) / 2);
    const top = Math.max(12, (window.innerHeight - panelRect.height) / 2);

    panel.value.style.left = `${left}px`;
    panel.value.style.top = `${top}px`;
    currentPlacement.value = props.placement;
};

const mountFloater = () => {
    if (!panel.value || !resolvedTarget.value) {
        centerPanel();

        return;
    }

    const reference = resolvedTarget.value;
    const floating = panel.value;
    const getPlacement = () => currentStep.value?.placement ?? props.placement;
    const getOffset = () => currentStep.value?.offset ?? props.offset;
    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: getPlacement(),
            strategy: 'fixed',
            middleware: [floatingOffset(getOffset()), flip(), shift()],
        });

        currentPlacement.value = (resolvedPlacement as Placement) ?? getPlacement();
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };
    const update = async () => {
        updateSpotlight();
        await applyPosition();
    };

    const cleanup = autoUpdate(reference, () => {
        void update();
    });
    const onScrollOrResize = () => {
        void update();
    };

    document.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, false);

    floater = {
        update,
        destroy: () => {
            cleanup();
            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize, false);
        },
    };

    void floater.update();
};

const refreshPosition = async () => {
    floater?.destroy();
    floater = null;

    resolvedTarget.value = resolveTargetElement(currentStep.value?.target);
    await nextTick();
    mountFloater();
};

const closeTour = (reason: 'overlay' | 'esc' | 'complete' | 'skip') => {
    emits('update:modelValue', false);
    emits('close', reason);
};

const goToStep = (nextIndex: number, eventName: 'next' | 'prev' | 'stepChange') => {
    const clamped = clampIndex(nextIndex);

    if (clamped === activeIndex.value) {
        return;
    }

    activeIndex.value = clamped;
    emits(eventName, clamped, currentStep.value);
    emits('stepChange', clamped, currentStep.value);
};

const goNext = () => {
    if (isLast.value) {
        emits('complete', currentStep.value);
        closeTour('complete');

        return;
    }

    goToStep(activeIndex.value + 1, 'next');
};

const goPrev = () => {
    if (isFirst.value) {
        return;
    }

    goToStep(activeIndex.value - 1, 'prev');
};

const skipTour = () => {
    emits('skip', currentStep.value);
    closeTour('skip');
};

const onOverlayClick = () => {
    if (props.closeOnOverlay) {
        closeTour('overlay');
    }
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!props.modelValue || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeTour('esc');
    }
};

watch(
    () => props.modelValue,
    async value => {
        if (value) {
            activeIndex.value = clampIndex(props.startIndex);
            emits('open');
            emits('stepChange', activeIndex.value, currentStep.value);

            await refreshPosition();
            document.addEventListener('keydown', onDocumentKeydown, false);
        } else {
            floater?.destroy();
            floater = null;
            spotlightStyle.value = {};
            resolvedTarget.value = null;
            document.removeEventListener('keydown', onDocumentKeydown, false);
        }
    },
    { immediate: true },
);

watch(
    () => [activeIndex.value, props.steps],
    async () => {
        if (!props.modelValue) {
            return;
        }

        await refreshPosition();
    },
    { deep: true },
);

onBeforeUnmount(() => {
    floater?.destroy();
    floater = null;
    if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onDocumentKeydown, false);
    }
});
</script>

<style lang="scss">
.vf-tour {
    position: fixed;
    inset: 0;
    z-index: var(--vf-tour-z-index);
}

.vf-tour__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--vf-tour-overlay-background-color);
}

.vf-tour__spotlight {
    position: fixed;
    z-index: 1;
    border-radius: var(--vf-tour-spotlight-radius);
    border: var(--vf-tour-spotlight-border-width) solid var(--vf-tour-spotlight-border-color);
    box-shadow: 0 0 0 9999px var(--vf-tour-overlay-background-color);
    pointer-events: none;
}

.vf-tour__panel {
    position: fixed;
    z-index: 2;
    width: var(--vf-tour-width);
    max-width: var(--vf-tour-max-width);
    padding: var(--vf-tour-padding);
    border: var(--vf-border-width) solid var(--vf-tour-border-color);
    border-radius: var(--vf-tour-border-radius);
    background-color: var(--vf-tour-background-color);
    color: var(--vf-tour-text-color);
    box-shadow: var(--vf-tour-shadow);
}

.vf-tour__title {
    margin-bottom: var(--vf-tour-title-gap);
    font-size: var(--vf-tour-title-font-size);
    line-height: var(--vf-tour-title-line-height);
    font-weight: var(--vf-tour-title-font-weight);
}

.vf-tour__content {
    margin-bottom: var(--vf-tour-content-gap);
    font-size: var(--vf-tour-content-font-size);
    line-height: var(--vf-tour-content-line-height);
    color: var(--vf-tour-content-color);
}

.vf-tour__progress {
    margin-bottom: var(--vf-tour-progress-gap);
    font-size: var(--vf-tour-progress-font-size);
    color: var(--vf-tour-progress-color);
}

.vf-tour__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--vf-tour-actions-gap);
}

.vf-tour__button {
    min-width: var(--vf-tour-button-min-width);
    padding: var(--vf-tour-button-padding);
    border-radius: var(--vf-tour-button-radius);
    border: var(--vf-border-width) solid var(--vf-tour-button-border-color);
    background-color: var(--vf-tour-button-background-color);
    color: var(--vf-tour-button-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-tour__button:hover:not(:disabled) {
    background-color: var(--vf-tour-button-hover-background-color);
}

.vf-tour__button:disabled {
    opacity: var(--vf-tour-disabled-opacity);
    cursor: not-allowed;
}

.vf-tour__button_secondary {
    border-color: var(--vf-tour-secondary-button-border-color);
    background-color: var(--vf-tour-secondary-button-background-color);
    color: var(--vf-tour-secondary-button-text-color);
}

.vf-tour__button_secondary:hover:not(:disabled) {
    background-color: var(--vf-tour-secondary-button-hover-background-color);
}
</style>
