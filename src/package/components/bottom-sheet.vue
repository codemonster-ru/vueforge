<template>
    <Teleport to="body">
        <Transition name="vf-bottom-sheet" :duration="{ enter: 260, leave: 220 }">
            <div v-show="modelValue" class="vf-bottom-sheet" role="presentation">
                <div v-if="overlay" class="vf-bottom-sheet__overlay" @click="onOverlayClick" />
                <div
                    ref="panel"
                    class="vf-bottom-sheet__panel"
                    :class="[`vf-bottom-sheet__panel_${size}`]"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="hasHeader ? labelId : undefined"
                    :aria-describedby="hasBody ? bodyId : undefined"
                    tabindex="-1"
                    @keydown="onPanelKeydown"
                >
                    <div class="vf-bottom-sheet__handle" aria-hidden="true" />
                    <div v-if="hasHeader" class="vf-bottom-sheet__header">
                        <div :id="labelId" class="vf-bottom-sheet__header-content">
                            <slot name="header">
                                <h3 v-if="title" class="vf-bottom-sheet__title">{{ title }}</h3>
                            </slot>
                        </div>
                        <template v-if="showClose">
                            <slot name="close" :close="close">
                                <button type="button" class="vf-bottom-sheet__close" aria-label="Close" @click="close">
                                    &times;
                                </button>
                            </slot>
                        </template>
                    </div>
                    <div v-if="$slots.body || $slots.default" :id="bodyId" class="vf-bottom-sheet__body">
                        <slot name="body" />
                        <slot v-if="!$slots.body" />
                    </div>
                    <div v-if="$slots.footer" class="vf-bottom-sheet__footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import type { Slots } from 'vue';

interface Props {
    modelValue?: boolean;
    title?: string;
    overlay?: boolean;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    overlay: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
    size: 'md',
});

const emits = defineEmits(['update:modelValue', 'open', 'close']);

let lastActiveElement: HTMLElement | null = null;

type ScrollLockState = {
    count: number;
    previousOverflow: string;
};

const SHEET_COUNTER_KEY = '__vf_bottom_sheet_id_counter__';
const SHEET_SCROLL_LOCK_KEY = '__vf_bottom_sheet_scroll_lock_state__';

const getGlobalObject = (): Record<string, unknown> => globalThis as Record<string, unknown>;
const nextSheetId = () => {
    const globalObject = getGlobalObject();
    const current =
        typeof globalObject[SHEET_COUNTER_KEY] === 'number' ? (globalObject[SHEET_COUNTER_KEY] as number) : 0;
    const next = current + 1;

    globalObject[SHEET_COUNTER_KEY] = next;

    return next;
};

const getScrollLockState = (): ScrollLockState => {
    const globalObject = getGlobalObject();
    const existing = globalObject[SHEET_SCROLL_LOCK_KEY];

    if (existing && typeof existing === 'object') {
        return existing as ScrollLockState;
    }

    const state: ScrollLockState = {
        count: 0,
        previousOverflow: '',
    };

    globalObject[SHEET_SCROLL_LOCK_KEY] = state;

    return state;
};

const panel = ref<HTMLElement | null>(null);
const slots: Slots = useSlots();
const sheetId = nextSheetId();
const labelId = `vf-bottom-sheet-title-${sheetId}`;
const bodyId = `vf-bottom-sheet-body-${sheetId}`;
const hasHeader = computed<boolean>(() => !!props.title || !!slots.header);
const hasBody = computed<boolean>(() => !!slots.body || !!slots.default);

const open = () => emits('update:modelValue', true);
const close = () => {
    emits('update:modelValue', false);
    emits('close');
};

const onOverlayClick = () => {
    if (!props.overlay || !props.closeOnOverlay) {
        return;
    }

    close();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!props.modelValue || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();
    }
};

const getFocusableElements = () => {
    if (!panel.value) {
        return [];
    }

    const selectors =
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

    return Array.from(panel.value.querySelectorAll<HTMLElement>(selectors)).filter(element => {
        return !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden');
    });
};

const focusFirst = () => {
    const focusable = getFocusableElements();
    if (focusable.length) {
        focusable[0].focus();
    } else {
        panel.value?.focus();
    }
};

const onPanelKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
        return;
    }

    const focusable = getFocusableElements();
    if (!focusable.length) {
        event.preventDefault();
        panel.value?.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
    }

    if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
};

const lockBodyScroll = () => {
    if (!props.lockScroll || typeof document === 'undefined') {
        return;
    }

    const state = getScrollLockState();
    if (state.count === 0) {
        state.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    state.count += 1;
};

const unlockBodyScroll = () => {
    if (!props.lockScroll || typeof document === 'undefined') {
        return;
    }

    const state = getScrollLockState();
    state.count = Math.max(0, state.count - 1);

    if (state.count === 0) {
        document.body.style.overflow = state.previousOverflow;
    }
};

watch(
    () => props.modelValue,
    async value => {
        if (value) {
            if (typeof document !== 'undefined') {
                lastActiveElement = document.activeElement as HTMLElement | null;
            }

            lockBodyScroll();
            emits('open');

            await nextTick();
            focusFirst();

            if (typeof document !== 'undefined') {
                document.addEventListener('keydown', onDocumentKeydown);
            }
        } else {
            unlockBodyScroll();

            if (typeof document !== 'undefined') {
                document.removeEventListener('keydown', onDocumentKeydown);
                lastActiveElement?.focus();
            }
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    unlockBodyScroll();
    if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onDocumentKeydown);
    }
});

defineExpose({ open, close });
</script>

<style lang="scss">
.vf-bottom-sheet {
    position: fixed;
    inset: 0;
    z-index: var(--vf-bottom-sheet-z-index);
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.vf-bottom-sheet__overlay {
    position: absolute;
    inset: 0;
    background: var(--vf-bottom-sheet-overlay-background-color);
}

.vf-bottom-sheet__panel {
    position: relative;
    z-index: 1;
    width: min(var(--vf-bottom-sheet-max-width), 100%);
    max-height: min(var(--vf-bottom-sheet-max-height), 100vh);
    border-top-left-radius: var(--vf-bottom-sheet-border-radius);
    border-top-right-radius: var(--vf-bottom-sheet-border-radius);
    background: var(--vf-bottom-sheet-background-color);
    color: var(--vf-bottom-sheet-text-color);
    box-shadow: var(--vf-bottom-sheet-shadow);
    overflow: auto;
    padding-bottom: max(var(--vf-bottom-sheet-safe-area-bottom), env(safe-area-inset-bottom));
    outline: none;
}

.vf-bottom-sheet__panel_sm {
    min-height: var(--vf-bottom-sheet-min-height-sm);
}

.vf-bottom-sheet__panel_md {
    min-height: var(--vf-bottom-sheet-min-height);
}

.vf-bottom-sheet__panel_lg {
    min-height: var(--vf-bottom-sheet-min-height-lg);
}

.vf-bottom-sheet__handle {
    width: var(--vf-bottom-sheet-handle-width);
    height: var(--vf-bottom-sheet-handle-height);
    border-radius: 999px;
    background: var(--vf-bottom-sheet-handle-color);
    margin: var(--vf-bottom-sheet-handle-margin);
}

.vf-bottom-sheet__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--vf-bottom-sheet-header-gap);
    padding: var(--vf-bottom-sheet-header-padding);
}

.vf-bottom-sheet__title {
    margin: 0;
    font-size: var(--vf-bottom-sheet-title-font-size);
    line-height: var(--vf-bottom-sheet-title-line-height);
    font-weight: var(--vf-bottom-sheet-title-font-weight);
}

.vf-bottom-sheet__close {
    border: none;
    border-radius: var(--vf-bottom-sheet-close-radius);
    width: var(--vf-bottom-sheet-close-size);
    height: var(--vf-bottom-sheet-close-size);
    background: transparent;
    color: var(--vf-bottom-sheet-close-color);
    font-size: var(--vf-bottom-sheet-close-font-size);
    line-height: 1;
}

.vf-bottom-sheet__close:hover {
    background: var(--vf-bottom-sheet-close-hover-background-color);
}

.vf-bottom-sheet__body {
    padding: var(--vf-bottom-sheet-body-padding);
}

.vf-bottom-sheet__footer {
    padding: var(--vf-bottom-sheet-footer-padding);
    display: flex;
    justify-content: flex-end;
    gap: var(--vf-bottom-sheet-footer-gap);
}

.vf-bottom-sheet-enter-active .vf-bottom-sheet__panel,
.vf-bottom-sheet-leave-active .vf-bottom-sheet__panel {
    transition:
        transform 0.25s ease,
        opacity 0.2s ease;
}

.vf-bottom-sheet-enter-from .vf-bottom-sheet__panel,
.vf-bottom-sheet-leave-to .vf-bottom-sheet__panel {
    transform: translateY(100%);
    opacity: 0;
}

.vf-bottom-sheet-enter-active .vf-bottom-sheet__overlay,
.vf-bottom-sheet-leave-active .vf-bottom-sheet__overlay {
    transition: opacity 0.2s ease;
}

.vf-bottom-sheet-enter-from .vf-bottom-sheet__overlay,
.vf-bottom-sheet-leave-to .vf-bottom-sheet__overlay {
    opacity: 0;
}
</style>
