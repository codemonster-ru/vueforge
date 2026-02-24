<template>
    <nav v-bind="rootAttrs" :aria-label="ariaLabel">
        <ul v-bind="listAttrs" role="menubar" :aria-orientation="isVertical ? 'vertical' : 'horizontal'">
            <li v-for="(item, index) in items" :key="getItemKey(item, index)" role="none">
                <Link
                    ref="itemRefs"
                    v-bind="itemAttrs(item, index)"
                    class="vf-dock__item"
                    :class="{
                        'vf-dock__item_active': isItemActive(item, index),
                        'vf-dock__item_disabled': isItemDisabled(item),
                    }"
                    :to="item.to"
                    :href="item.href ?? item.url"
                    :active="isItemActive(item, index)"
                    :disabled="disabled || !!item.disabled"
                    role="menuitem"
                    :aria-current="isItemActive(item, index) ? 'page' : undefined"
                    @click="onSelect(item, index, $event)"
                    @keydown="onItemKeydown(index, $event)"
                >
                    <slot name="item" :item="item" :index="index" :active="isItemActive(item, index)">
                        <Icon v-if="item.icon" v-bind="iconAttrs(item, index)" :icon="item.icon" decorative />
                        <span v-bind="labelAttrs(item, index)">{{ item.label }}</span>
                    </slot>
                </Link>
            </li>
        </ul>
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
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

type DockPosition = 'bottom' | 'top' | 'left' | 'right';
type DockKey = string | number;

export interface DockItem {
    key?: DockKey;
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
    items?: Array<DockItem>;
    modelValue?: DockKey | null;
    position?: DockPosition;
    disabled?: boolean;
    ariaLabel?: string;
    syncActiveFromRoute?: boolean;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: null,
    position: 'bottom',
    disabled: false,
    ariaLabel: 'Application launcher',
    syncActiveFromRoute: true,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: DockKey): void;
    (
        event: 'select',
        payload: { item: DockItem; index: number; key: DockKey; event: MouseEvent | KeyboardEvent },
    ): void;
}>();

defineSlots<{
    item?: (props: { item: DockItem; index: number; active: boolean }) => unknown;
}>();

const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);
const itemRefs = ref<Array<InstanceType<typeof Link>>>([]);

const isVertical = computed(() => props.position === 'left' || props.position === 'right');
const getItemKey = (item: DockItem, index: number): DockKey => item.key ?? item.label ?? index;
const isItemDisabled = (item: DockItem) => props.disabled || !!item.disabled;

const isRouteMatch = (item: DockItem) => {
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

const isItemActive = (item: DockItem, index: number) => {
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

const onSelect = (item: DockItem, index: number, event: MouseEvent | KeyboardEvent) => {
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

    const forward = isVertical.value ? 'ArrowDown' : 'ArrowRight';
    const backward = isVertical.value ? 'ArrowUp' : 'ArrowLeft';

    if (event.key === forward) {
        event.preventDefault();
        moveFocus(index, 1);
        return;
    }

    if (event.key === backward) {
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

const ptContext = computed(() => ({
    disabled: props.disabled,
    position: props.position,
}));
const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        ['vf-dock', `vf-dock_${props.position}`, props.disabled ? 'vf-dock_disabled' : null].filter(Boolean).join(' '),
        props.unstyled,
    ),
);
const listAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'list', ptContext.value), 'vf-dock__list', props.unstyled),
);
const itemAttrs = (item: DockItem, index: number) =>
    resolvePassThrough(props.pt, 'item', {
        ...ptContext.value,
        item,
        index,
        active: isItemActive(item, index),
    });
const iconAttrs = (item: DockItem, index: number) =>
    withPartClass(
        resolvePassThrough(props.pt, 'icon', {
            ...ptContext.value,
            item,
            index,
        }),
        'vf-dock__icon',
        props.unstyled,
    );
const labelAttrs = (item: DockItem, index: number) =>
    withPartClass(
        resolvePassThrough(props.pt, 'label', {
            ...ptContext.value,
            item,
            index,
        }),
        'vf-dock__label',
        props.unstyled,
    );
</script>

<style lang="scss">
.vf-dock {
    border: var(--vf-border-width) solid var(--vf-dock-border-color);
    border-radius: var(--vf-dock-border-radius);
    background: var(--vf-dock-background-color);
    box-shadow: var(--vf-dock-shadow);
    padding: var(--vf-dock-padding);
}

.vf-dock__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: var(--vf-dock-gap);
}

.vf-dock_left .vf-dock__list,
.vf-dock_right .vf-dock__list {
    flex-direction: column;
}

.vf-dock__item {
    min-width: var(--vf-dock-item-size);
    min-height: var(--vf-dock-item-size);
    border-radius: var(--vf-dock-item-border-radius);
    color: var(--vf-dock-item-color);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
}

.vf-dock__item:hover {
    background: var(--vf-dock-item-hover-background-color);
}

.vf-dock__item_active {
    background: var(--vf-dock-item-active-background-color);
    color: var(--vf-dock-item-active-color);
}

.vf-dock__item_disabled {
    opacity: var(--vf-dock-disabled-opacity);
}

.vf-dock__icon {
    font-size: var(--vf-dock-icon-size);
}

.vf-dock__label {
    font-size: var(--vf-dock-label-font-size);
    line-height: 1;
}
</style>
