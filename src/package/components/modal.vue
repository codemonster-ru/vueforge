<template>
    <Teleport to="body">
        <div v-show="modelValue" v-bind="attrs" :class="getClass" role="presentation">
            <div class="vf-modal__overlay" @click="onOverlayClick"></div>
            <div
                ref="panel"
                class="vf-modal__panel"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="hasHeader ? labelId : undefined"
                :aria-describedby="hasBody ? bodyId : undefined"
                tabindex="-1"
                @keydown="onPanelKeydown"
            >
                <div v-if="hasHeader" class="vf-modal__header">
                    <div :id="labelId" class="vf-modal__header-content">
                        <slot name="header">
                            <h3 v-if="title" class="vf-modal__title">
                                {{ title }}
                            </h3>
                        </slot>
                    </div>
                </div>
                <template v-if="showClose">
                    <slot name="close" :close="close">
                        <button type="button" class="vf-modal__close" aria-label="Close" @click="close">&times;</button>
                    </slot>
                </template>
                <div v-if="$slots.body || $slots.default" :id="bodyId" class="vf-modal__body">
                    <slot name="body" />
                    <slot v-if="!$slots.body" />
                </div>
                <div v-if="$slots.footer" class="vf-modal__footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue';
import type { Slots } from 'vue';

interface Props {
    modelValue?: boolean;
    title?: string;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const emits = defineEmits(['update:modelValue', 'open', 'close']);
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
    size: 'md',
});

let modalIdCounter = 0;
let scrollLockCount = 0;
let previousBodyOverflow = '';
let lastActiveElement: HTMLElement | null = null;

const panel = ref<HTMLElement | null>(null);
const attrs = useAttrs();
const slots: Slots = useSlots();
const labelId = `vf-modal-title-${++modalIdCounter}`;
const bodyId = `vf-modal-body-${modalIdCounter}`;
const hasHeader = computed<boolean>(() => !!props.title || !!slots.header);
const hasBody = computed<boolean>(() => !!slots.body || !!slots.default);
const getClass = computed<string[]>(() => {
    const classes = ['vf-modal'];

    if (props.size !== 'md') {
        classes.push(`vf-modal_${props.size}`);
    }

    return classes;
});

const open = () => emits('update:modelValue', true);
const close = () => {
    emits('update:modelValue', false);
    emits('close');
};

const onOverlayClick = () => {
    if (props.closeOnOverlay) {
        close();
    }
};

const onKeydown = (event: KeyboardEvent) => {
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

    if (scrollLockCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    scrollLockCount += 1;
};

const unlockBodyScroll = () => {
    if (!props.lockScroll || typeof document === 'undefined') {
        return;
    }

    scrollLockCount = Math.max(0, scrollLockCount - 1);

    if (scrollLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
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
                document.addEventListener('keydown', onKeydown);
            }
        } else {
            unlockBodyScroll();

            if (typeof document !== 'undefined') {
                document.removeEventListener('keydown', onKeydown);

                lastActiveElement?.focus();
            }
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    unlockBodyScroll();

    if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeydown);
    }
});

defineExpose({ open, close });
</script>

<style lang="scss">
.vf-modal {
    position: fixed;
    inset: 0;
    z-index: var(--vf-modal-z-index);
    display: flex;
    align-items: center;
    justify-content: center;
}

.vf-modal__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--vf-modal-overlay-background-color);
}

.vf-modal__panel {
    position: relative;
    z-index: 1;
    width: var(--vf-modal-width);
    max-width: var(--vf-modal-max-width);
    max-height: var(--vf-modal-max-height);
    padding: var(--vf-modal-padding);
    border-radius: var(--vf-modal-border-radius);
    background-color: var(--vf-modal-background-color);
    color: var(--vf-modal-text-color);
    box-shadow: var(--vf-modal-shadow);
    overflow: auto;
    outline: none;
}

.vf-modal_sm .vf-modal__panel {
    width: var(--vf-modal-width-sm);
    max-width: var(--vf-modal-max-width-sm);
}

.vf-modal_lg .vf-modal__panel {
    width: var(--vf-modal-width-lg);
    max-width: var(--vf-modal-max-width-lg);
}

.vf-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--vf-modal-header-gap);
}

.vf-modal__title {
    margin: 0;
    font-size: var(--vf-modal-title-font-size);
    line-height: var(--vf-modal-title-line-height);
    font-weight: var(--vf-modal-title-font-weight);
}

.vf-modal__body {
    margin-bottom: var(--vf-modal-body-gap);
}

.vf-modal__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--vf-modal-footer-gap);
}

.vf-modal__close {
    position: absolute;
    top: var(--vf-modal-close-offset);
    right: var(--vf-modal-close-offset);
    width: var(--vf-modal-close-size);
    height: var(--vf-modal-close-size);
    border-radius: var(--vf-modal-close-radius);
    border: none;
    background: transparent;
    color: var(--vf-modal-close-color);
    cursor: pointer;
    font-size: var(--vf-modal-close-font-size);
    line-height: 1;
}

.vf-modal__close:hover {
    background-color: var(--vf-modal-close-hover-background-color);
}
</style>
