<template>
    <nav class="vf-tab-menu" :aria-label="ariaLabel || undefined">
        <ul ref="listRef" class="vf-tab-menu__list" role="tablist" @keydown="onKeydown">
            <li
                v-for="(item, index) in items"
                :key="getItemKey(item, index)"
                class="vf-tab-menu__item"
                role="presentation"
            >
                <Link
                    :to="item.to"
                    :href="item.href ?? item.url"
                    :as="item.to ? 'router-link' : 'a'"
                    class="vf-tab-menu__tab"
                    :class="{ 'vf-tab-menu__tab_active': isActive(item), 'vf-tab-menu__tab_disabled': item.disabled }"
                    :disabled="item.disabled"
                    role="tab"
                    :aria-selected="isActive(item) ? 'true' : 'false'"
                    :aria-disabled="item.disabled ? 'true' : undefined"
                    :tabindex="getTabIndex(item)"
                    @click="onItemClick(item, $event)"
                >
                    {{ item.label }}
                </Link>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import {
    RouteLocationNormalizedLoadedGeneric,
    RouteLocationRaw,
    routeLocationKey,
    routerKey,
    Router,
} from 'vue-router';
import Link from '@/package/components/link.vue';

type TabMenuValue = string | number;

interface TabMenuItem {
    label: string;
    value?: TabMenuValue;
    to?: RouteLocationRaw;
    href?: string;
    url?: string;
    disabled?: boolean;
}

interface Props {
    modelValue?: TabMenuValue | null;
    items?: Array<TabMenuItem>;
    syncActiveFromRoute?: boolean;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    items: () => [],
    syncActiveFromRoute: true,
    ariaLabel: 'Tab menu',
});

const emit = defineEmits(['update:modelValue', 'change', 'active']);

const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);
const listRef = ref<HTMLElement | null>(null);

const normalizeValue = (item: TabMenuItem, index: number): TabMenuValue => {
    if (item.value !== undefined) {
        return item.value;
    }

    if (typeof item.to === 'string') {
        return item.to;
    }

    if (item.href || item.url) {
        return item.href || item.url || `tab-${index.toString()}`;
    }

    return `${item.label}-${index.toString()}`;
};

const getItemKey = (item: TabMenuItem, index: number) =>
    String(normalizeValue(item, index))
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');

const routeMatchedValue = computed<TabMenuValue | null>(() => {
    if (!props.syncActiveFromRoute || !route) {
        return null;
    }

    for (let index = 0; index < props.items.length; index += 1) {
        const item = props.items[index];

        if (!item || item.disabled) {
            continue;
        }

        if (item.to && router) {
            const resolved = router.resolve(item.to);

            if (resolved.fullPath === route.fullPath || resolved.path === route.path) {
                return normalizeValue(item, index);
            }
        }

        const href = item.href ?? item.url;
        if (href && (href === route.fullPath || href === route.path)) {
            return normalizeValue(item, index);
        }
    }

    return null;
});

const activeValue = computed<TabMenuValue | null>(() => {
    if (props.modelValue !== null && props.modelValue !== undefined) {
        return props.modelValue;
    }

    if (routeMatchedValue.value !== null) {
        return routeMatchedValue.value;
    }

    return null;
});

const isActive = (item: TabMenuItem) => {
    const index = props.items.indexOf(item);
    return normalizeValue(item, index) === activeValue.value;
};

const getTabIndex = (item: TabMenuItem) => {
    if (item.disabled) {
        return -1;
    }

    return isActive(item) ? 0 : -1;
};

const selectItem = (item: TabMenuItem, event: Event) => {
    const index = props.items.indexOf(item);
    const value = normalizeValue(item, index);

    emit('update:modelValue', value);
    emit('change', value, event);
    emit('active', item);
};

const onItemClick = (item: TabMenuItem, event: Event) => {
    if (item.disabled) {
        return;
    }

    selectItem(item, event);
};

const onKeydown = (event: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        return;
    }

    const tabs = listRef.value ? Array.from(listRef.value.querySelectorAll<HTMLElement>('[role="tab"]')) : [];
    const enabledTabs = tabs.filter(tab => tab.getAttribute('aria-disabled') !== 'true');

    if (!enabledTabs.length) {
        return;
    }

    const current = document.activeElement as HTMLElement | null;
    const currentIndex = Math.max(
        enabledTabs.findIndex(tab => tab === current),
        0,
    );
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (event.key === 'Home') {
        nextIndex = 0;
    } else if (event.key === 'End') {
        nextIndex = enabledTabs.length - 1;
    }

    event.preventDefault();
    enabledTabs[nextIndex].focus();
    enabledTabs[nextIndex].click();
};
</script>

<style lang="scss">
.vf-tab-menu {
    display: block;
}

.vf-tab-menu__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-tab-menu-gap);
    margin: 0;
    padding: 0;
    list-style: none;
    border-bottom: var(--vf-tab-menu-border-width) solid var(--vf-tab-menu-border-color);
}

.vf-tab-menu__tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--vf-tab-menu-tab-padding);
    border: var(--vf-border-width) solid transparent;
    border-radius: var(--vf-tab-menu-tab-border-radius);
    color: var(--vf-tab-menu-tab-text-color);
    text-decoration: none;
}

.vf-tab-menu__tab:hover:not(.vf-tab-menu__tab_disabled),
.vf-tab-menu__tab:focus-visible {
    color: var(--vf-tab-menu-tab-hover-text-color);
    background-color: var(--vf-tab-menu-tab-hover-background-color);
    outline: none;
}

.vf-tab-menu__tab_active {
    color: var(--vf-tab-menu-tab-active-text-color);
    border-color: var(--vf-tab-menu-tab-active-border-color);
}

.vf-tab-menu__tab_disabled {
    opacity: var(--vf-tab-menu-disabled-opacity);
}
</style>
