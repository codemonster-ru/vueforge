<template>
    <Teleport to="body">
        <Transition name="vf-drawer" :duration="{ enter: 320, leave: 320 }">
            <div v-show="modelValue" :class="getClass" :style="drawerStyle" role="presentation">
                <div v-if="overlay" class="vf-drawer__overlay" @click="onOverlayClick"></div>
                <div
                    ref="panel"
                    class="vf-drawer__panel"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="hasHeader ? labelId : undefined"
                    :aria-describedby="hasBody ? bodyId : undefined"
                    tabindex="-1"
                    @keydown="onPanelKeydown"
                >
                    <div v-if="hasHeader" class="vf-drawer__header">
                        <div :id="labelId" class="vf-drawer__header-content">
                            <slot name="header">
                                <h3 v-if="title" class="vf-drawer__title">
                                    {{ title }}
                                </h3>
                            </slot>
                        </div>
                    </div>
                    <template v-if="showClose">
                        <slot name="close" :close="close">
                            <button type="button" class="vf-drawer__close" aria-label="Close" @click="close">
                                &times;
                            </button>
                        </slot>
                    </template>
                    <div v-if="$slots.body || $slots.default" :id="bodyId" class="vf-drawer__body">
                        <slot name="body" />
                        <slot v-if="!$slots.body" />
                    </div>
                    <div v-if="$slots.footer" class="vf-drawer__footer">
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
    position?: 'left' | 'right' | 'top' | 'bottom';
    overlay?: boolean;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const emits = defineEmits(['update:modelValue', 'open', 'close']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    position: 'right',
    overlay: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
    size: 'md',
});

let drawerIdCounter = 0;
let scrollLockCount = 0;
let previousBodyOverflow = '';
let lastActiveElement: HTMLElement | null = null;

const panel = ref<HTMLElement | null>(null);
const slots: Slots = useSlots();
const labelId = `vf-drawer-title-${++drawerIdCounter}`;
const bodyId = `vf-drawer-body-${drawerIdCounter}`;
const hasHeader = computed<boolean>(() => !!props.title || !!slots.header);
const hasBody = computed<boolean>(() => !!slots.body || !!slots.default);
const transformFrom = computed<string>(() => {
    switch (props.position) {
        case 'left':
            return 'translate3d(-100%, 0, 0)';
        case 'right':
            return 'translate3d(100%, 0, 0)';
        case 'top':
            return 'translate3d(0, -100%, 0)';
        case 'bottom':
            return 'translate3d(0, 100%, 0)';
        default:
            return 'translate3d(100%, 0, 0)';
    }
});
const getClass = computed<string[]>(() => {
    const classes = ['vf-drawer', `vf-drawer_${props.position}`];

    if (props.size !== 'md') {
        classes.push(`vf-drawer_${props.size}`);
    }

    return classes;
});
const drawerStyle = computed<Record<string, string>>(() => ({
    '--vf-drawer-transform-from': transformFrom.value,
}));

const open = () => emits('update:modelValue', true);
const close = () => {
    emits('update:modelValue', false);
    emits('close');
};

const onOverlayClick = () => {
    if (!props.overlay) {
        return;
    }

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
.vf-drawer {
    position: fixed;
    inset: 0;
    z-index: var(--vf-drawer-z-index);
}

.vf-drawer__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--vf-drawer-overlay-background-color);
}

.vf-drawer__panel {
    position: absolute;
    padding: var(--vf-drawer-padding);
    border-radius: var(--vf-drawer-border-radius);
    background-color: var(--vf-drawer-background-color);
    color: var(--vf-drawer-text-color);
    box-shadow: var(--vf-drawer-shadow);
    overflow: auto;
    outline: none;
    transform: translate3d(0, 0, 0);
    transition:
        transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.2s ease;
}

.vf-drawer_left .vf-drawer__panel {
    top: 0;
    left: 0;
    width: var(--vf-drawer-width);
    height: 100%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.vf-drawer_right .vf-drawer__panel {
    top: 0;
    right: 0;
    width: var(--vf-drawer-width);
    height: 100%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.vf-drawer_top .vf-drawer__panel {
    top: 0;
    left: 0;
    width: 100%;
    height: var(--vf-drawer-height);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.vf-drawer_bottom .vf-drawer__panel {
    left: 0;
    bottom: 0;
    width: 100%;
    height: var(--vf-drawer-height);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.vf-drawer_sm.vf-drawer_left .vf-drawer__panel,
.vf-drawer_sm.vf-drawer_right .vf-drawer__panel {
    width: var(--vf-drawer-width-sm);
}

.vf-drawer_lg.vf-drawer_left .vf-drawer__panel,
.vf-drawer_lg.vf-drawer_right .vf-drawer__panel {
    width: var(--vf-drawer-width-lg);
}

.vf-drawer_sm.vf-drawer_top .vf-drawer__panel,
.vf-drawer_sm.vf-drawer_bottom .vf-drawer__panel {
    height: var(--vf-drawer-height-sm);
}

.vf-drawer_lg.vf-drawer_top .vf-drawer__panel,
.vf-drawer_lg.vf-drawer_bottom .vf-drawer__panel {
    height: var(--vf-drawer-height-lg);
}

.vf-drawer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--vf-drawer-header-gap);
}

.vf-drawer__title {
    margin: 0;
    font-size: var(--vf-drawer-title-font-size);
    line-height: var(--vf-drawer-title-line-height);
    font-weight: var(--vf-drawer-title-font-weight);
}

.vf-drawer__body {
    margin-bottom: var(--vf-drawer-body-gap);
}

.vf-drawer__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--vf-drawer-footer-gap);
}

.vf-drawer__close {
    position: absolute;
    top: var(--vf-drawer-close-offset);
    right: var(--vf-drawer-close-offset);
    width: var(--vf-drawer-close-size);
    height: var(--vf-drawer-close-size);
    border-radius: var(--vf-drawer-close-radius);
    border: none;
    background: transparent;
    color: var(--vf-drawer-close-color);
    cursor: pointer;
    font-size: var(--vf-drawer-close-font-size);
    line-height: 1;
}

.vf-drawer__close:hover {
    background-color: var(--vf-drawer-close-hover-background-color);
}

.vf-drawer-enter-active .vf-drawer__panel,
.vf-drawer-leave-active .vf-drawer__panel {
    will-change: transform, opacity;
}

.vf-drawer-enter-from .vf-drawer__panel,
.vf-drawer-leave-to .vf-drawer__panel {
    transform: var(--vf-drawer-transform-from);
    opacity: 0;
}

.vf-drawer-enter-active .vf-drawer__overlay,
.vf-drawer-leave-active .vf-drawer__overlay {
    transition: opacity 0.2s ease;
}

.vf-drawer-enter-from .vf-drawer__overlay,
.vf-drawer-leave-to .vf-drawer__overlay {
    opacity: 0;
}
</style>
