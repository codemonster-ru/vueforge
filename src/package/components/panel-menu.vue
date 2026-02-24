<template>
    <nav class="vf-panelmenu" :aria-label="ariaLabel">
        <ul class="vf-panelmenu__list" role="tree">
            <PanelMenuNode
                v-for="(item, index) in items"
                :key="`${item.label}-${index}`"
                :item="item"
                :level="1"
                :expanded-keys="expandedSet"
                :disabled="disabled"
                @toggle="onToggle"
                @item-click="onItemClick"
            />
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { routeLocationKey, routerKey, type RouteLocationNormalizedLoadedGeneric, type Router } from 'vue-router';
import PanelMenuNode from './panel-menu-node.vue';

export interface PanelMenuItem {
    key?: string;
    label: string;
    to?: string;
    href?: string;
    url?: string;
    active?: boolean;
    exact?: boolean;
    disabled?: boolean;
    lazy?: boolean;
    loading?: boolean;
    items?: Array<PanelMenuItem>;
}

interface Props {
    items?: Array<PanelMenuItem>;
    expandedKeys?: Array<string>;
    multiple?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    syncActiveFromRoute?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    expandedKeys: () => [],
    multiple: true,
    disabled: false,
    ariaLabel: 'Panel menu',
    syncActiveFromRoute: true,
});

const emits = defineEmits(['update:expandedKeys', 'toggle', 'itemClick', 'lazyLoad']);
const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);

const isRouteMatch = (item: PanelMenuItem) => {
    if (typeof item.active === 'boolean') {
        return item.active;
    }

    if (!route) {
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

const collectRouteExpanded = (items: Array<PanelMenuItem>, keys: Set<string>) => {
    for (const item of items) {
        const nodeKey = item.key ?? item.label;
        const children = item.items ?? [];
        const childHasActive =
            children.some(child => isRouteMatch(child)) || children.some(child => hasRouteActiveDescendant(child));

        if (childHasActive) {
            keys.add(nodeKey);
            collectRouteExpanded(children, keys);
        }
    }
};

const hasRouteActiveDescendant = (item: PanelMenuItem): boolean => {
    const children = item.items ?? [];
    if (children.length === 0) {
        return isRouteMatch(item);
    }

    return children.some(child => isRouteMatch(child) || hasRouteActiveDescendant(child));
};

const routeExpandedSet = computed(() => {
    if (!props.syncActiveFromRoute) {
        return new Set<string>();
    }

    const keys = new Set<string>();
    collectRouteExpanded(props.items, keys);

    return keys;
});

const expandedSet = computed(() => new Set([...props.expandedKeys, ...routeExpandedSet.value]));
const findItemByKey = (items: Array<PanelMenuItem>, key: string): PanelMenuItem | null => {
    for (const item of items) {
        const nodeKey = item.key ?? item.label;
        if (nodeKey === key) {
            return item;
        }

        const nested = findItemByKey(item.items ?? [], key);
        if (nested) {
            return nested;
        }
    }

    return null;
};

const onToggle = (key: string, event: Event) => {
    if (props.disabled) {
        return;
    }

    const exists = expandedSet.value.has(key);

    if (exists) {
        const next = props.expandedKeys.filter(value => value !== key);
        emits('update:expandedKeys', next);
        emits('toggle', key, false, event);

        return;
    }

    const next = props.multiple ? [...props.expandedKeys, key] : [key];
    emits('update:expandedKeys', next);
    emits('toggle', key, true, event);

    const item = findItemByKey(props.items, key);
    if (item?.lazy && (item.items?.length ?? 0) === 0) {
        emits('lazyLoad', {
            key,
            item,
        });
    }
};

const onItemClick = (item: PanelMenuItem, event: Event) => {
    emits('itemClick', item, event);
};
</script>

<style lang="scss">
.vf-panelmenu {
    border: var(--vf-border-width) solid var(--vf-panelmenu-border-color);
    border-radius: var(--vf-panelmenu-border-radius);
    background: var(--vf-panelmenu-background-color);
    padding: var(--vf-panelmenu-padding);
}

.vf-panelmenu__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-panelmenu-gap);
}
</style>
