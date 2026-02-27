<template>
    <nav class="vf-bottom-navigation" :class="rootClass" :aria-label="ariaLabel">
        <ul class="vf-bottom-navigation__list" role="menubar" aria-orientation="horizontal">
            <li
                v-for="(item, index) in items"
                :key="getItemKey(item, index)"
                class="vf-bottom-navigation__item"
                role="none"
            >
                <Link
                    ref="itemRefs"
                    class="vf-bottom-navigation__action"
                    :class="{
                        'vf-bottom-navigation__action_active': isItemActive(item, index),
                        'vf-bottom-navigation__action_disabled': isItemDisabled(item),
                    }"
                    :to="item.to"
                    :href="item.href ?? item.url"
                    :as="item.to ? 'router-link' : 'a'"
                    :active="isItemActive(item, index)"
                    :disabled="disabled || !!item.disabled"
                    role="menuitem"
                    :tabindex="isItemDisabled(item) ? -1 : 0"
                    :aria-current="isItemActive(item, index) ? 'page' : undefined"
                    :aria-disabled="isItemDisabled(item) ? 'true' : 'false'"
                    :aria-label="item.ariaLabel ?? item.label"
                    @click="onSelect(item, index, $event)"
                    @keydown="onItemKeydown(index, $event)"
                >
                    <Icon v-if="item.icon" :icon="item.icon" class="vf-bottom-navigation__icon" decorative />
                    <span v-if="showLabels" class="vf-bottom-navigation__label">{{ item.label }}</span>
                    <span
                        v-if="item.badge != null"
                        class="vf-bottom-navigation__badge"
                        :aria-hidden="item.badgeAriaLabel ? 'true' : undefined"
                    >
                        {{ item.badge }}
                    </span>
                    <span v-if="item.badgeAriaLabel" class="vf-bottom-navigation__sr-only">{{
                        item.badgeAriaLabel
                    }}</span>
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
import Icon from '@/package/components/icon.vue';
import Link from '@/package/components/link.vue';

type BottomNavigationKey = string | number;

export interface BottomNavigationItem {
    key?: BottomNavigationKey;
    label: string;
    icon?: string;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    active?: boolean;
    exact?: boolean;
    disabled?: boolean;
    badge?: string | number;
    badgeAriaLabel?: string;
    ariaLabel?: string;
    command?: () => void;
}

interface Props {
    items?: Array<BottomNavigationItem>;
    modelValue?: BottomNavigationKey | null;
    disabled?: boolean;
    fixed?: boolean;
    mobileOnly?: boolean;
    showLabels?: boolean;
    ariaLabel?: string;
    syncActiveFromRoute?: boolean;
}

defineOptions({ name: 'VfBottomNavigation' });

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: null,
    disabled: false,
    fixed: true,
    mobileOnly: true,
    showLabels: true,
    ariaLabel: 'Bottom navigation',
    syncActiveFromRoute: true,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: BottomNavigationKey): void;
    (
        event: 'select',
        payload: {
            item: BottomNavigationItem;
            index: number;
            key: BottomNavigationKey;
            event: MouseEvent | KeyboardEvent;
        },
    ): void;
}>();

const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);
const itemRefs = ref<Array<InstanceType<typeof Link>>>([]);

const rootClass = computed(() => [
    {
        'vf-bottom-navigation_fixed': props.fixed,
        'vf-bottom-navigation_mobile-only': props.mobileOnly,
        'vf-bottom-navigation_disabled': props.disabled,
        'vf-bottom-navigation_no-labels': !props.showLabels,
    },
]);

const getItemKey = (item: BottomNavigationItem, index: number): BottomNavigationKey => item.key ?? item.label ?? index;
const isItemDisabled = (item: BottomNavigationItem) => props.disabled || !!item.disabled;

const isRouteMatch = (item: BottomNavigationItem) => {
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

const isItemActive = (item: BottomNavigationItem, index: number) => {
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

const onSelect = (item: BottomNavigationItem, index: number, event: MouseEvent | KeyboardEvent) => {
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

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(index, 1);
        return;
    }

    if (event.key === 'ArrowLeft') {
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
</script>

<style lang="scss">
.vf-bottom-navigation {
    min-height: var(--vf-bottom-navigation-height);
    padding: var(--vf-bottom-navigation-padding);
    border-top: var(--vf-border-width) solid var(--vf-bottom-navigation-border-color);
    background-color: var(--vf-bottom-navigation-background-color);
    color: var(--vf-bottom-navigation-text-color);
    z-index: var(--vf-bottom-navigation-z-index);
}

.vf-bottom-navigation_fixed {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
}

.vf-bottom-navigation_mobile-only {
    display: block;
}

.vf-bottom-navigation_disabled {
    opacity: var(--vf-bottom-navigation-disabled-opacity);
}

.vf-bottom-navigation__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: var(--vf-bottom-navigation-gap);
}

.vf-bottom-navigation__action {
    min-height: var(--vf-bottom-navigation-item-min-height);
    border-radius: var(--vf-bottom-navigation-item-border-radius);
    color: var(--vf-bottom-navigation-item-color);
    display: grid;
    place-items: center;
    gap: var(--vf-bottom-navigation-item-content-gap);
    padding: var(--vf-bottom-navigation-item-padding);
    text-decoration: none;
    position: relative;
}

.vf-bottom-navigation__action:hover {
    background-color: var(--vf-bottom-navigation-item-hover-background-color);
}

.vf-bottom-navigation__action:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-primary-color);
}

.vf-bottom-navigation__action_active {
    background-color: var(--vf-bottom-navigation-item-active-background-color);
    color: var(--vf-bottom-navigation-item-active-color);
}

.vf-bottom-navigation__action_disabled {
    pointer-events: none;
}

.vf-bottom-navigation__icon {
    font-size: var(--vf-bottom-navigation-icon-size);
}

.vf-bottom-navigation__label {
    font-size: var(--vf-bottom-navigation-label-font-size);
    line-height: 1;
}

.vf-bottom-navigation__badge {
    position: absolute;
    inset-block-start: 0.2rem;
    inset-inline-end: 0.45rem;
    min-width: 1rem;
    padding: 0 0.2rem;
    border-radius: 999px;
    font-size: 0.625rem;
    line-height: 1rem;
    text-align: center;
    color: var(--vf-bottom-navigation-badge-text-color);
    background: var(--vf-bottom-navigation-badge-background-color);
}

.vf-bottom-navigation__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.vf-bottom-navigation_no-labels .vf-bottom-navigation__label {
    display: none;
}

@media (min-width: 769px) {
    .vf-bottom-navigation_mobile-only {
        display: none;
    }
}
</style>
