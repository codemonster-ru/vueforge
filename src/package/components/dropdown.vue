<template>
    <div ref="root" class="vf-dropdown" :class="{ 'vf-dropdown_disabled': disabled }">
        <div
            ref="trigger"
            class="vf-dropdown__trigger"
            role="button"
            tabindex="0"
            aria-haspopup="menu"
            :aria-expanded="open"
            :aria-controls="panelId"
            :aria-disabled="disabled ? 'true' : 'false'"
            @click="onTriggerClick"
            @keydown.enter.prevent="onTriggerClick"
            @keydown.space.prevent="onTriggerClick"
            @keydown.down.prevent="openAndFocus('first')"
            @keydown.up.prevent="openAndFocus('last')"
        >
            <slot name="trigger" />
        </div>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-dropdown__panel"
                role="menu"
                :data-placement="currentPlacement"
                @click="onPanelClick"
                @keydown="onPanelKeydown"
            >
                <slot>
                    <Menu v-if="props.items.length" :items="props.items" />
                </slot>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset as offsetMiddleware } from '@codemonster-ru/floater.js';

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top';

export interface Item {
    to?: string;
    href?: string;
    url?: string;
    icon?: string;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    command?: () => void;
}

export interface Props {
    modelValue?: boolean;
    items?: Array<Item>;
    placement?: Placement;
    offset?: number;
    disabled?: boolean;
    closeOnSelect?: boolean;
    closeOnEsc?: boolean;
    matchTriggerWidth?: boolean;
}

const emits = defineEmits(['update:modelValue', 'open', 'close', 'select']);
defineOptions({ name: 'VfDropdown' });
const Menu = defineAsyncComponent(() => import('@/package/components/menu.vue'));

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    items: () => [],
    placement: 'bottom-start',
    offset: 6,
    disabled: false,
    closeOnSelect: true,
    closeOnEsc: true,
    matchTriggerWidth: true,
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const DROPDOWN_COUNTER_KEY = '__vf_dropdown_id_counter__';
const getGlobalObject = (): Record<string, unknown> => globalThis as Record<string, unknown>;
const nextDropdownId = () => {
    const globalObject = getGlobalObject();
    const current =
        typeof globalObject[DROPDOWN_COUNTER_KEY] === 'number' ? (globalObject[DROPDOWN_COUNTER_KEY] as number) : 0;
    const next = current + 1;

    globalObject[DROPDOWN_COUNTER_KEY] = next;

    return next;
};

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const basePlacement = ref<Placement>(props.placement);
const currentPlacement = ref<Placement>(props.placement);
const panelId = `vf-dropdown-panel-${nextDropdownId()}`;
let floater: FloaterInstance = null;

const isControlled = computed(() => props.modelValue !== undefined);

const setOpen = (value: boolean) => {
    if (props.disabled) {
        return;
    }

    emits('update:modelValue', value);

    if (!isControlled.value) {
        open.value = value;
    }
};

const openPanel = () => {
    basePlacement.value = props.placement;
    currentPlacement.value = props.placement;

    setOpen(true);
};

const closePanel = () => {
    setOpen(false);
};

const toggle = () => {
    if (open.value) {
        closePanel();
    } else {
        openPanel();
    }
};

const onTriggerClick = () => {
    if (props.disabled) {
        return;
    }

    toggle();
};

const getFocusableMenuItems = () => {
    if (!panel.value) {
        return [];
    }

    return Array.from(
        panel.value.querySelectorAll<HTMLElement>('.vf-menu__link, .vf-menu__parent, [data-dropdown-item]'),
    ).filter(item => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true');
};

const focusMenuItem = (index: number) => {
    const items = getFocusableMenuItems();

    if (!items.length) {
        return;
    }

    const nextIndex = Math.min(Math.max(index, 0), items.length - 1);

    items[nextIndex].focus();
};

const moveFocus = (delta: 1 | -1) => {
    const items = getFocusableMenuItems();

    if (!items.length) {
        return;
    }

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = items.findIndex(item => item === active);
    const baseIndex = currentIndex === -1 ? (delta > 0 ? -1 : items.length) : currentIndex;
    const nextIndex = (baseIndex + delta + items.length) % items.length;

    items[nextIndex].focus();
};

const openAndFocus = async (target: 'first' | 'last') => {
    if (props.disabled) {
        return;
    }

    if (!open.value) {
        openPanel();
        await nextTick();
    }

    await nextTick();

    focusMenuItem(target === 'first' ? 0 : getFocusableMenuItems().length - 1);
};

const onPanelClick = (event: MouseEvent) => {
    emits('select', event);

    if (!props.closeOnSelect) {
        return;
    }

    const target = event.target as HTMLElement | null;

    if (!target) {
        return;
    }

    if (target.closest('.vf-menu__parent')) {
        return;
    }

    if (target.closest('.vf-menu__link') || target.closest('[data-dropdown-close]')) {
        closePanel();
        trigger.value?.focus();
    }
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    const target = event.target as Node;

    if (root.value.contains(target) || panel.value?.contains(target)) {
        return;
    }

    closePanel();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open.value || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();

        closePanel();
        trigger.value?.focus();
    }
};

const onPanelKeydown = (event: KeyboardEvent) => {
    if (!open.value) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveFocus(1);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocus(-1);

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        focusMenuItem(0);

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        focusMenuItem(getFocusableMenuItems().length - 1);
    }
};

const fallbackPlacements = (placement: Placement): Array<Placement> => {
    switch (placement) {
        case 'bottom-start':
            return ['top-start'];
        case 'bottom-end':
            return ['top-end'];
        case 'top-start':
            return ['bottom-start'];
        case 'top-end':
            return ['bottom-end'];
        case 'top':
            return ['bottom'];
        case 'bottom':
        default:
            return ['top'];
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
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offsetMiddleware(props.offset), flip({ placements: fallbackPlacements(basePlacement.value) })],
        });

        currentPlacement.value = (resolvedPlacement as Placement) ?? basePlacement.value;

        if (props.matchTriggerWidth) {
            floating.style.minWidth = `${reference.getBoundingClientRect().width}px`;
        }

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

watch(
    () => props.modelValue,
    value => {
        if (!isControlled.value) {
            return;
        }

        open.value = !!value;
    },
    { immediate: true },
);

watch(
    () => props.placement,
    value => {
        basePlacement.value = value;
        currentPlacement.value = value;
    },
);

watch(open, async value => {
    if (value) {
        emits('open');
    } else {
        emits('close');
    }

    if (!value) {
        if (floater) {
            floater.destroy();
            floater = null;
        }

        return;
    }

    await nextTick();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    floater?.destroy();
    floater = null;
});

defineExpose({ open: openPanel, close: closePanel, toggle });
</script>

<style lang="scss">
.vf-dropdown {
    display: inline-block;
    position: relative;
}

.vf-dropdown__trigger {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.vf-dropdown__panel {
    position: fixed;
    z-index: var(--vf-dropdown-z-index);
    padding: var(--vf-dropdown-panel-padding);
    border-radius: var(--vf-dropdown-panel-border-radius);
    border: var(--vf-border-width) solid var(--vf-dropdown-panel-border-color);
    background-color: var(--vf-dropdown-panel-background-color);
    box-shadow: var(--vf-dropdown-panel-shadow);
}

.vf-dropdown__panel .vf-menu__item {
    padding: var(--vf-dropdown-item-padding);
}

.vf-dropdown_disabled {
    opacity: var(--vf-dropdown-disabled-opacity);

    .vf-dropdown__trigger {
        cursor: not-allowed;
    }
}
</style>
