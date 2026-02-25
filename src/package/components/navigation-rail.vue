<template>
    <nav class="vf-navigation-rail" :class="rootClass" :aria-label="ariaLabel">
        <div v-if="$slots.header" class="vf-navigation-rail__header">
            <slot name="header" :collapsed="collapsed" :toggle="onToggle" />
        </div>

        <button
            v-if="showToggle"
            type="button"
            class="vf-navigation-rail__toggle"
            :aria-label="collapsed ? expandLabel : collapseLabel"
            :aria-pressed="collapsed ? 'true' : 'false'"
            @click="onToggle"
        >
            {{ collapsed ? expandIcon : collapseIcon }}
        </button>

        <ul class="vf-navigation-rail__list" role="menu" aria-orientation="vertical">
            <li v-for="(item, index) in items" :key="getItemKey(item, index)" role="none">
                <Link
                    ref="itemRefs"
                    class="vf-navigation-rail__item"
                    :class="{
                        'vf-navigation-rail__item_active': isItemActive(item, index),
                        'vf-navigation-rail__item_disabled': isItemDisabled(item),
                    }"
                    :to="item.to"
                    :href="item.href ?? item.url"
                    :as="item.to ? 'router-link' : 'a'"
                    :active="isItemActive(item, index)"
                    :disabled="disabled || !!item.disabled"
                    role="menuitem"
                    :tabindex="isItemDisabled(item) ? -1 : 0"
                    :aria-label="collapsed ? item.label : undefined"
                    :aria-current="isItemActive(item, index) ? 'page' : undefined"
                    :aria-disabled="isItemDisabled(item) ? 'true' : 'false'"
                    @click="onSelect(item, index, $event)"
                    @keydown="onItemKeydown(index, $event)"
                >
                    <slot
                        name="item"
                        :item="item"
                        :index="index"
                        :active="isItemActive(item, index)"
                        :collapsed="collapsed"
                    >
                        <Icon v-if="item.icon" :icon="item.icon" class="vf-navigation-rail__icon" decorative />
                        <span v-if="!collapsed" class="vf-navigation-rail__label">{{ item.label }}</span>
                    </slot>
                </Link>
            </li>
        </ul>

        <div v-if="$slots.footer" class="vf-navigation-rail__footer">
            <slot name="footer" :collapsed="collapsed" :toggle="onToggle" />
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import {
    routeLocationKey,
    routerKey,
    type RouteLocationAsPathGeneric,
    type RouteLocationAsRelativeGeneric,
    type RouteLocationNormalizedLoadedGeneric,
    type Router,
} from 'vue-router';
import Link from './link.vue';
import Icon from './icon.vue';

type NavigationRailSide = 'left' | 'right';
type NavigationRailKey = string | number;

export interface NavigationRailItem {
    key?: NavigationRailKey;
    label: string;
    icon?: string;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    active?: boolean;
    exact?: boolean;
    disabled?: boolean;
    command?: () => void;
}

interface Props {
    items?: Array<NavigationRailItem>;
    modelValue?: NavigationRailKey | null;
    collapsed?: boolean;
    side?: NavigationRailSide;
    disabled?: boolean;
    showToggle?: boolean;
    ariaLabel?: string;
    collapseLabel?: string;
    expandLabel?: string;
    collapseIcon?: string;
    expandIcon?: string;
    syncActiveFromRoute?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: null,
    collapsed: false,
    side: 'left',
    disabled: false,
    showToggle: true,
    ariaLabel: 'Primary navigation',
    collapseLabel: 'Collapse navigation',
    expandLabel: 'Expand navigation',
    collapseIcon: '<',
    expandIcon: '>',
    syncActiveFromRoute: true,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: NavigationRailKey): void;
    (event: 'update:collapsed', value: boolean): void;
    (
        event: 'select',
        payload: {
            item: NavigationRailItem;
            index: number;
            key: NavigationRailKey;
            event: MouseEvent | KeyboardEvent;
        },
    ): void;
    (event: 'toggle', payload: { collapsed: boolean }): void;
}>();

defineSlots<{
    header?: (props: { collapsed: boolean; toggle: () => void }) => unknown;
    footer?: (props: { collapsed: boolean; toggle: () => void }) => unknown;
    item?: (props: { item: NavigationRailItem; index: number; active: boolean; collapsed: boolean }) => unknown;
}>();

defineOptions({ name: 'VfNavigationRail' });

const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);
const itemRefs = ref<Array<InstanceType<typeof Link>>>([]);

const rootClass = computed(() => [
    `vf-navigation-rail_${props.side}`,
    props.collapsed ? 'vf-navigation-rail_collapsed' : null,
    props.disabled ? 'vf-navigation-rail_disabled' : null,
]);

const getItemKey = (item: NavigationRailItem, index: number): NavigationRailKey => item.key ?? item.label ?? index;
const isItemDisabled = (item: NavigationRailItem) => props.disabled || !!item.disabled;

const isRouteMatch = (item: NavigationRailItem) => {
    if (!props.syncActiveFromRoute || !route) {
        return false;
    }

    if (item.to && router) {
        const resolved = router.resolve(item.to);
        if (item.exact) {
            return route.path === resolved.path;
        }

        return route.path === resolved.path || route.path.startsWith(`${resolved.path}/`);
    }

    const href = item.href ?? item.url;
    if (!href || href.startsWith('http://') || href.startsWith('https://')) {
        return false;
    }

    if (item.exact) {
        return route.path === href;
    }

    return route.path === href || route.path.startsWith(`${href}/`);
};

const isItemActive = (item: NavigationRailItem, index: number) => {
    const key = getItemKey(item, index);
    if (props.modelValue != null) {
        return props.modelValue === key;
    }

    if (typeof item.active === 'boolean') {
        return item.active;
    }

    return isRouteMatch(item);
};

const moveFocus = (index: number, step: 1 | -1) => {
    const enabledIndices = props.items
        .map((item, itemIndex) => ({ item, itemIndex }))
        .filter(({ item }) => !isItemDisabled(item))
        .map(({ itemIndex }) => itemIndex);

    if (enabledIndices.length === 0) {
        return;
    }

    const current = enabledIndices.indexOf(index);
    const start = current === -1 ? (step > 0 ? -1 : enabledIndices.length) : current;
    const nextPosition = (start + step + enabledIndices.length) % enabledIndices.length;
    const targetIndex = enabledIndices[nextPosition];
    const target = itemRefs.value[targetIndex];
    (target?.$el as HTMLElement | undefined)?.focus();
};

const onSelect = (item: NavigationRailItem, index: number, event: MouseEvent | KeyboardEvent) => {
    if (isItemDisabled(item)) {
        return;
    }

    if (typeof item.command === 'function') {
        item.command();
    }

    emits('update:modelValue', getItemKey(item, index));
    emits('select', {
        item,
        index,
        key: getItemKey(item, index),
        event,
    });
};

const onItemKeydown = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Home') {
        event.preventDefault();
        moveFocus(-1, 1);
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        moveFocus(props.items.length, -1);
        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(index, 1);
        return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(index, -1);
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const item = props.items[index];
        if (item) {
            onSelect(item, index, event);
        }
    }
};

const onToggle = () => {
    const next = !props.collapsed;
    emits('update:collapsed', next);
    emits('toggle', { collapsed: next });
};
</script>

<style lang="scss">
.vf-navigation-rail {
    width: var(--vf-navigation-rail-width);
    min-width: var(--vf-navigation-rail-width);
    padding: var(--vf-navigation-rail-padding);
    border-inline-end: var(--vf-border-width) solid var(--vf-navigation-rail-border-color);
    background-color: var(--vf-navigation-rail-background-color);
    color: var(--vf-navigation-rail-text-color);
    display: flex;
    flex-direction: column;
    gap: var(--vf-navigation-rail-gap);
}

.vf-navigation-rail_right {
    border-inline-end: none;
    border-inline-start: var(--vf-border-width) solid var(--vf-navigation-rail-border-color);
}

.vf-navigation-rail_collapsed {
    width: var(--vf-navigation-rail-collapsed-width);
    min-width: var(--vf-navigation-rail-collapsed-width);
}

.vf-navigation-rail_disabled {
    opacity: var(--vf-navigation-rail-disabled-opacity);
}

.vf-navigation-rail__header,
.vf-navigation-rail__footer {
    min-width: 0;
}

.vf-navigation-rail__toggle {
    width: var(--vf-navigation-rail-toggle-size);
    height: var(--vf-navigation-rail-toggle-size);
    border: var(--vf-border-width) solid var(--vf-navigation-rail-toggle-border-color);
    border-radius: var(--vf-navigation-rail-toggle-radius);
    background-color: var(--vf-navigation-rail-toggle-background-color);
    color: var(--vf-navigation-rail-toggle-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-navigation-rail__toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-primary-color);
}

.vf-navigation-rail__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-navigation-rail-item-gap);
}

.vf-navigation-rail__item {
    min-height: var(--vf-navigation-rail-item-min-height);
    padding: var(--vf-navigation-rail-item-padding);
    border-radius: var(--vf-navigation-rail-item-border-radius);
    color: var(--vf-navigation-rail-item-color);
    display: flex;
    align-items: center;
    gap: var(--vf-navigation-rail-item-content-gap);
    text-decoration: none;
}

.vf-navigation-rail__item:hover {
    background-color: var(--vf-navigation-rail-item-hover-background-color);
}

.vf-navigation-rail__item_active {
    background-color: var(--vf-navigation-rail-item-active-background-color);
    color: var(--vf-navigation-rail-item-active-color);
}

.vf-navigation-rail__item_disabled {
    pointer-events: none;
}

.vf-navigation-rail__icon {
    flex: 0 0 auto;
    font-size: var(--vf-navigation-rail-icon-size);
}

.vf-navigation-rail_collapsed .vf-navigation-rail__item {
    justify-content: center;
    padding: var(--vf-navigation-rail-collapsed-item-padding);
}

.vf-navigation-rail__label {
    min-width: 0;
    font-size: var(--vf-navigation-rail-label-font-size);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
