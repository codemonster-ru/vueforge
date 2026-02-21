<template>
    <div
        ref="root"
        class="vf-context-menu"
        :class="{ 'vf-context-menu_disabled': disabled }"
        tabindex="0"
        @contextmenu.prevent="onContextMenu"
        @keydown="onTriggerKeydown"
    >
        <slot />
    </div>
    <Teleport to="body">
        <div
            v-show="open"
            :id="panelId"
            ref="panel"
            class="vf-context-menu__panel"
            role="menu"
            :style="panelStyle"
            @click="onPanelClick"
        >
            <slot name="menu">
                <Menu v-if="props.items.length" :items="props.items" />
            </slot>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Menu from '@/package/components/menu.vue';

interface Item {
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

interface Point {
    x: number;
    y: number;
}

interface Props {
    modelValue?: boolean;
    items?: Array<Item>;
    disabled?: boolean;
    closeOnSelect?: boolean;
    closeOnEsc?: boolean;
    offset?: number;
}

const emits = defineEmits(['update:modelValue', 'open', 'close', 'select', 'contextmenu']);
defineOptions({ name: 'VfContextMenu' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    items: () => [],
    disabled: false,
    closeOnSelect: true,
    closeOnEsc: true,
    offset: 2,
});

const CONTEXT_MENU_COUNTER_KEY = '__vf_context_menu_id_counter__';
const getGlobalObject = (): Record<string, unknown> => globalThis as Record<string, unknown>;
const nextContextMenuId = () => {
    const globalObject = getGlobalObject();
    const current =
        typeof globalObject[CONTEXT_MENU_COUNTER_KEY] === 'number'
            ? (globalObject[CONTEXT_MENU_COUNTER_KEY] as number)
            : 0;
    const next = current + 1;

    globalObject[CONTEXT_MENU_COUNTER_KEY] = next;

    return next;
};

const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const panelStyle = ref<Record<string, string>>({});
const panelId = `vf-context-menu-panel-${nextContextMenuId()}`;
const lastPoint = ref<Point>({ x: 0, y: 0 });
let lastActiveElement: HTMLElement | null = null;

const isControlled = computed(() => props.modelValue !== undefined);

const getFallbackPoint = (): Point => {
    if (!root.value) {
        return { x: 0, y: 0 };
    }

    const rect = root.value.getBoundingClientRect();

    return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
    };
};

const setOpen = (value: boolean) => {
    if (props.disabled) {
        return;
    }

    emits('update:modelValue', value);

    if (!isControlled.value) {
        open.value = value;
    }
};

const updatePosition = () => {
    if (!panel.value) {
        return;
    }

    const floating = panel.value;
    const rect = floating.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8;
    let left = lastPoint.value.x + props.offset;
    let top = lastPoint.value.y + props.offset;

    if (left + rect.width > viewportWidth - padding) {
        left = Math.max(padding, viewportWidth - rect.width - padding);
    }

    if (top + rect.height > viewportHeight - padding) {
        top = Math.max(padding, viewportHeight - rect.height - padding);
    }

    panelStyle.value = {
        left: `${left}px`,
        top: `${top}px`,
        minWidth: 'var(--vf-context-menu-min-width)',
    };
};

const openAt = async (point: Point) => {
    lastPoint.value = point;
    if (typeof document !== 'undefined') {
        lastActiveElement = document.activeElement as HTMLElement | null;
    }

    setOpen(true);

    await nextTick();

    updatePosition();
};

const closeMenu = (restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
        const fallbackTarget = root.value;

        if (lastActiveElement && document.contains(lastActiveElement)) {
            lastActiveElement.focus();
        } else {
            fallbackTarget?.focus();
        }
    }
};

const onContextMenu = (event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    event.preventDefault();

    emits('contextmenu', event);

    void openAt({ x: event.clientX, y: event.clientY });
};

const onTriggerKeydown = (event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
        event.preventDefault();

        void openAt(getFallbackPoint());
    }
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

    if (target.closest('.vf-menu__link') || target.closest('[data-context-menu-close]')) {
        closeMenu(true);
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

    closeMenu(true);
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open.value || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();

        closeMenu(true);
    }
};

const onWindowResize = () => {
    if (!open.value) {
        return;
    }

    updatePosition();
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

watch(open, async value => {
    if (value) {
        if (!lastPoint.value.x && !lastPoint.value.y) {
            lastPoint.value = getFallbackPoint();
        }

        emits('open');

        await nextTick();

        updatePosition();
    } else {
        emits('close');
    }
});

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
    window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    window.removeEventListener('resize', onWindowResize);
});

defineExpose({ openAt, close: closeMenu });
</script>

<style lang="scss">
.vf-context-menu {
    display: block;
    position: relative;
    outline: none;
}

.vf-context-menu__panel {
    position: fixed;
    z-index: var(--vf-context-menu-z-index);
    padding: var(--vf-context-menu-panel-padding);
    border-radius: var(--vf-context-menu-panel-border-radius);
    border: var(--vf-border-width) solid var(--vf-context-menu-panel-border-color);
    background-color: var(--vf-context-menu-panel-background-color);
    box-shadow: var(--vf-context-menu-panel-shadow);
}

.vf-context-menu__panel .vf-menu__item {
    padding: var(--vf-context-menu-item-padding);
}

.vf-context-menu_disabled {
    opacity: var(--vf-context-menu-disabled-opacity);
}
</style>
