<template>
    <aside class="vf-resizable-sidebar" :class="rootClass" :style="sidebarStyle" :aria-label="ariaLabel">
        <div v-if="$slots.header" class="vf-resizable-sidebar__header">
            <slot name="header" :collapsed="currentCollapsed" :toggle="toggleCollapsed" :width="currentWidth" />
        </div>

        <button
            v-if="showToggle"
            type="button"
            class="vf-resizable-sidebar__toggle"
            :aria-label="currentCollapsed ? expandLabel : collapseLabel"
            :aria-pressed="currentCollapsed ? 'true' : 'false'"
            @click="toggleCollapsed"
        >
            {{ currentCollapsed ? expandIcon : collapseIcon }}
        </button>

        <div class="vf-resizable-sidebar__content" :aria-hidden="currentCollapsed ? 'true' : 'false'">
            <slot :collapsed="currentCollapsed" :width="currentWidth" />
        </div>

        <div v-if="$slots.footer" class="vf-resizable-sidebar__footer">
            <slot name="footer" :collapsed="currentCollapsed" :toggle="toggleCollapsed" :width="currentWidth" />
        </div>

        <div
            v-if="resizable && !currentCollapsed"
            class="vf-resizable-sidebar__resizer"
            role="separator"
            aria-orientation="vertical"
            :aria-valuemin="minWidth"
            :aria-valuemax="maxWidth"
            :aria-valuenow="Math.round(currentWidth)"
            :tabindex="disabled ? -1 : 0"
            @mousedown.prevent="onResizeStart"
            @keydown="onResizerKeydown"
        />
    </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

interface Props {
    modelValue?: number;
    collapsed?: boolean;
    minWidth?: number;
    maxWidth?: number;
    collapsedWidth?: number;
    side?: 'left' | 'right';
    resizable?: boolean;
    disabled?: boolean;
    showToggle?: boolean;
    persistence?: 'none' | 'local' | 'session';
    persistenceKey?: string;
    ariaLabel?: string;
    collapseLabel?: string;
    expandLabel?: string;
    collapseIcon?: string;
    expandIcon?: string;
}

defineOptions({ name: 'VfResizableSidebar' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: 280,
    collapsed: false,
    minWidth: 200,
    maxWidth: 480,
    collapsedWidth: 56,
    side: 'left',
    resizable: true,
    disabled: false,
    showToggle: true,
    persistence: 'none',
    persistenceKey: '',
    ariaLabel: 'Sidebar',
    collapseLabel: 'Collapse sidebar',
    expandLabel: 'Expand sidebar',
    collapseIcon: '<',
    expandIcon: '>',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: number): void;
    (event: 'update:collapsed', value: boolean): void;
    (event: 'resize-end', value: number): void;
}>();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const currentWidth = ref(clamp(props.modelValue, props.minWidth, props.maxWidth));
const currentCollapsed = ref(Boolean(props.collapsed));

const rootClass = computed(() => [
    `vf-resizable-sidebar_${props.side}`,
    currentCollapsed.value ? 'vf-resizable-sidebar_collapsed' : null,
    props.disabled ? 'vf-resizable-sidebar_disabled' : null,
]);

const sidebarStyle = computed(() => ({
    '--vf-resizable-sidebar-width-prop': `${currentWidth.value}px`,
    '--vf-resizable-sidebar-collapsed-width-prop': `${props.collapsedWidth}px`,
}));

const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (props.persistence === 'local') {
        return window.localStorage;
    }
    if (props.persistence === 'session') {
        return window.sessionStorage;
    }

    return null;
};

const getStorageKey = () => {
    if (!props.persistenceKey) {
        return '';
    }

    return `vf-resizable-sidebar:${props.persistenceKey}`;
};

const persistState = () => {
    const storage = getStorage();
    const key = getStorageKey();

    if (!storage || !key) {
        return;
    }

    try {
        storage.setItem(
            key,
            JSON.stringify({
                width: currentWidth.value,
                collapsed: currentCollapsed.value,
            }),
        );
    } catch {
        // ignore quota/private mode errors
    }
};

const restoreState = () => {
    const storage = getStorage();
    const key = getStorageKey();

    if (!storage || !key) {
        return;
    }

    try {
        const raw = storage.getItem(key);
        if (!raw) {
            return;
        }

        const parsed = JSON.parse(raw) as { width?: number; collapsed?: boolean };
        if (typeof parsed.width === 'number' && Number.isFinite(parsed.width)) {
            currentWidth.value = clamp(parsed.width, props.minWidth, props.maxWidth);
        }
        if (typeof parsed.collapsed === 'boolean') {
            currentCollapsed.value = parsed.collapsed;
        }
    } catch {
        // ignore malformed storage state
    }
};

watch(
    () => props.modelValue,
    value => {
        currentWidth.value = clamp(value, props.minWidth, props.maxWidth);
    },
);

watch(
    () => props.collapsed,
    value => {
        currentCollapsed.value = Boolean(value);
    },
);

const toggleCollapsed = () => {
    if (props.disabled) {
        return;
    }

    currentCollapsed.value = !currentCollapsed.value;
    emits('update:collapsed', currentCollapsed.value);
    persistState();
};

let startX = 0;
let startWidth = 0;
let resizing = false;

const applyResizeFromPointer = (clientX: number) => {
    const direction = props.side === 'right' ? -1 : 1;
    const delta = (clientX - startX) * direction;
    const nextWidth = clamp(startWidth + delta, props.minWidth, props.maxWidth);

    currentWidth.value = nextWidth;
    emits('update:modelValue', nextWidth);
};

const onResizeMove = (event: MouseEvent) => {
    if (!resizing) {
        return;
    }

    applyResizeFromPointer(event.clientX);
};

const onResizeEnd = () => {
    if (!resizing) {
        return;
    }

    resizing = false;
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeEnd);
    emits('resize-end', currentWidth.value);
    persistState();
};

const onResizeStart = (event: MouseEvent) => {
    if (!props.resizable || props.disabled) {
        return;
    }

    resizing = true;
    startX = event.clientX;
    startWidth = currentWidth.value;
    window.addEventListener('mousemove', onResizeMove);
    window.addEventListener('mouseup', onResizeEnd);
};

const onResizerKeydown = (event: KeyboardEvent) => {
    if (!props.resizable || props.disabled) {
        return;
    }

    const decrementKeys = props.side === 'right' ? ['ArrowRight'] : ['ArrowLeft'];
    const incrementKeys = props.side === 'right' ? ['ArrowLeft'] : ['ArrowRight'];

    if (![...decrementKeys, ...incrementKeys, 'Home', 'End'].includes(event.key)) {
        return;
    }

    event.preventDefault();

    if (event.key === 'Home') {
        currentWidth.value = props.minWidth;
    } else if (event.key === 'End') {
        currentWidth.value = props.maxWidth;
    } else if (incrementKeys.includes(event.key)) {
        currentWidth.value = clamp(currentWidth.value + 12, props.minWidth, props.maxWidth);
    } else {
        currentWidth.value = clamp(currentWidth.value - 12, props.minWidth, props.maxWidth);
    }

    emits('update:modelValue', currentWidth.value);
    emits('resize-end', currentWidth.value);
    persistState();
};

restoreState();

onBeforeUnmount(() => {
    onResizeEnd();
});
</script>

<style lang="scss">
.vf-resizable-sidebar {
    width: var(--vf-resizable-sidebar-width-prop);
    min-width: var(--vf-resizable-sidebar-width-prop);
    max-width: var(--vf-resizable-sidebar-width-prop);
    background-color: var(--vf-resizable-sidebar-background-color);
    color: var(--vf-resizable-sidebar-text-color);
    border-inline-end: var(--vf-border-width) solid var(--vf-resizable-sidebar-border-color);
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    position: relative;
}

.vf-resizable-sidebar_right {
    border-inline-end: none;
    border-inline-start: var(--vf-border-width) solid var(--vf-resizable-sidebar-border-color);
}

.vf-resizable-sidebar_collapsed {
    width: var(--vf-resizable-sidebar-collapsed-width-prop);
    min-width: var(--vf-resizable-sidebar-collapsed-width-prop);
    max-width: var(--vf-resizable-sidebar-collapsed-width-prop);
}

.vf-resizable-sidebar_disabled {
    opacity: var(--vf-resizable-sidebar-disabled-opacity);
}

.vf-resizable-sidebar__header,
.vf-resizable-sidebar__footer {
    padding: var(--vf-resizable-sidebar-section-padding);
}

.vf-resizable-sidebar__content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    padding: var(--vf-resizable-sidebar-content-padding);
}

.vf-resizable-sidebar_collapsed .vf-resizable-sidebar__content,
.vf-resizable-sidebar_collapsed .vf-resizable-sidebar__footer {
    display: none;
}

.vf-resizable-sidebar__toggle {
    margin: var(--vf-resizable-sidebar-toggle-margin);
    width: var(--vf-resizable-sidebar-toggle-size);
    height: var(--vf-resizable-sidebar-toggle-size);
    border: var(--vf-border-width) solid var(--vf-resizable-sidebar-toggle-border-color);
    border-radius: var(--vf-resizable-sidebar-toggle-border-radius);
    background-color: var(--vf-resizable-sidebar-toggle-background-color);
    color: var(--vf-resizable-sidebar-toggle-text-color);
    cursor: pointer;
}

.vf-resizable-sidebar__resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(var(--vf-resizable-sidebar-resizer-size) * -0.5);
    width: var(--vf-resizable-sidebar-resizer-size);
    cursor: col-resize;
    border-radius: 999px;
}

.vf-resizable-sidebar_right .vf-resizable-sidebar__resizer {
    right: auto;
    left: calc(var(--vf-resizable-sidebar-resizer-size) * -0.5);
}

.vf-resizable-sidebar__resizer:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-primary-color);
}
</style>
