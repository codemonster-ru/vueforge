<template>
    <span
        ref="trigger"
        class="vf-tooltip__trigger"
        :aria-describedby="tooltipId"
        :aria-disabled="disabled ? 'true' : 'false'"
        @mouseenter="open"
        @mouseleave="close"
        @focusin="open"
        @focusout="close"
    >
        <slot />
    </span>
    <Teleport to="body">
        <div
            v-show="visible"
            :id="tooltipId"
            ref="panel"
            class="vf-tooltip"
            role="tooltip"
            :data-placement="currentPlacement"
        >
            <span class="vf-tooltip__content">
                <slot name="content">
                    {{ text }}
                </slot>
            </span>
            <span v-if="arrow" class="vf-tooltip__arrow" aria-hidden="true"></span>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset, shift } from '@codemonster-ru/floater.js';

interface Props {
    text?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    disabled?: boolean;
    arrow?: boolean;
    showDelay?: number;
    hideDelay?: number;
    closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    text: '',
    placement: 'top',
    disabled: false,
    arrow: false,
    showDelay: 0,
    hideDelay: 0,
    closeOnEsc: true,
});

const TOOLTIP_COUNTER_KEY = '__vf_tooltip_id_counter__';
const getGlobalObject = (): Record<string, unknown> => globalThis as Record<string, unknown>;
const nextTooltipId = () => {
    const globalObject = getGlobalObject();
    const current =
        typeof globalObject[TOOLTIP_COUNTER_KEY] === 'number' ? (globalObject[TOOLTIP_COUNTER_KEY] as number) : 0;
    const next = current + 1;

    globalObject[TOOLTIP_COUNTER_KEY] = next;

    return next;
};

const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const visible = ref(false);
const currentPlacement = ref<'top' | 'bottom' | 'left' | 'right'>('top');
const tooltipId = `vf-tooltip-${nextTooltipId()}`;
const slots = useSlots();
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

let floater: FloaterInstance = null;

const clearTimers = () => {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }

    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
};

const hasContent = computed(() => {
    return props.text.trim().length > 0 || !!slots.content;
});

const open = () => {
    if (props.disabled || !hasContent.value) {
        return;
    }

    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }

    const openNow = () => {
        visible.value = true;
    };

    if (props.showDelay > 0) {
        showTimer = setTimeout(openNow, props.showDelay);
        return;
    }

    openNow();
};
const close = () => {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }

    const closeNow = () => {
        visible.value = false;
    };

    if (props.hideDelay > 0) {
        hideTimer = setTimeout(closeNow, props.hideDelay);
        return;
    }

    closeNow();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!visible.value || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();
    }
};

const mountFloater = () => {
    if (!trigger.value || !panel.value) {
        return;
    }
    const reference = trigger.value;
    const floating = panel.value;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: props.placement,
            strategy: 'fixed',
            middleware: [offset(8), flip(), shift()],
        });
        currentPlacement.value = (resolvedPlacement as typeof currentPlacement.value) ?? props.placement;
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };

    const update = async () => {
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

watch(visible, async value => {
    if (!value) {
        if (floater) {
            floater.destroy();
            floater = null;
        }
        return;
    }
    if (!floater) {
        mountFloater();
    }
    void floater?.update();
});

onMounted(() => {
    if (visible.value) {
        mountFloater();
    }

    document.addEventListener('keydown', onDocumentKeydown);
});

onBeforeUnmount(() => {
    clearTimers();
    floater?.destroy();
    floater = null;
    document.removeEventListener('keydown', onDocumentKeydown);
});

watch(hasContent, value => {
    if (!value) {
        clearTimers();
        visible.value = false;
    }
});
</script>

<style lang="scss">
.vf-tooltip__trigger {
    display: inline-flex;
}

.vf-tooltip {
    position: fixed;
    z-index: var(--vf-tooltip-z-index);
    padding: var(--vf-tooltip-padding);
    border-radius: var(--vf-tooltip-border-radius);
    background-color: var(--vf-tooltip-background-color);
    color: var(--vf-tooltip-text-color);
    font-size: var(--vf-tooltip-font-size);
    line-height: var(--vf-tooltip-line-height);
    box-shadow: none;
    filter: drop-shadow(var(--vf-tooltip-shadow));
    max-width: var(--vf-tooltip-max-width);
}

.vf-tooltip__content {
    position: relative;
    z-index: 1;
}

.vf-tooltip__arrow {
    position: absolute;
    z-index: 0;
    --vf-tooltip-arrow-rendered-height: var(--vf-tooltip-arrow-size);
    --vf-tooltip-arrow-half-width: calc(var(--vf-tooltip-arrow-size) * 0.8);
    width: 0;
    height: 0;
    border-style: solid;
    pointer-events: none;
}

.vf-tooltip[data-placement^='top'] .vf-tooltip__arrow {
    bottom: calc(var(--vf-tooltip-arrow-rendered-height) * -1);
    left: 50%;
    transform: translateX(-50%);
    border-width: var(--vf-tooltip-arrow-rendered-height) var(--vf-tooltip-arrow-half-width) 0
        var(--vf-tooltip-arrow-half-width);
    border-color: var(--vf-tooltip-background-color) transparent transparent transparent;
}

.vf-tooltip[data-placement^='bottom'] .vf-tooltip__arrow {
    top: calc(var(--vf-tooltip-arrow-rendered-height) * -1);
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 var(--vf-tooltip-arrow-half-width) var(--vf-tooltip-arrow-rendered-height)
        var(--vf-tooltip-arrow-half-width);
    border-color: transparent transparent var(--vf-tooltip-background-color) transparent;
}

.vf-tooltip[data-placement^='left'] .vf-tooltip__arrow {
    right: calc(var(--vf-tooltip-arrow-half-width) * -2);
    top: 50%;
    transform: translateY(-50%);
    border-width: var(--vf-tooltip-arrow-half-width) var(--vf-tooltip-arrow-rendered-height)
        var(--vf-tooltip-arrow-half-width) 0;
    border-color: transparent var(--vf-tooltip-background-color) transparent transparent;
}

.vf-tooltip[data-placement^='right'] .vf-tooltip__arrow {
    left: calc(var(--vf-tooltip-arrow-half-width) * -2);
    top: 50%;
    transform: translateY(-50%);
    border-width: var(--vf-tooltip-arrow-half-width) 0 var(--vf-tooltip-arrow-half-width)
        var(--vf-tooltip-arrow-rendered-height);
    border-color: transparent transparent transparent var(--vf-tooltip-background-color);
}
</style>
