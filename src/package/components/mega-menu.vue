<template>
    <nav class="vf-megamenu" :aria-label="ariaLabel">
        <ul class="vf-megamenu__root" role="menubar">
            <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="vf-megamenu__item" role="none">
                <button
                    :id="getTriggerId(index)"
                    type="button"
                    class="vf-megamenu__trigger"
                    :disabled="disabled || item.disabled"
                    role="menuitem"
                    :aria-expanded="activeIndex === index"
                    :aria-controls="getPanelId(index)"
                    @click="toggle(index)"
                    @keydown="onTriggerKeydown($event, index)"
                >
                    {{ item.label }}
                </button>
                <div
                    v-if="activeIndex === index"
                    :id="getPanelId(index)"
                    class="vf-megamenu__panel"
                    role="menu"
                    :aria-labelledby="getTriggerId(index)"
                >
                    <div
                        class="vf-megamenu__columns"
                        :style="{ '--vf-megamenu-columns': String(Math.max(1, getSections(item).length)) }"
                    >
                        <section
                            v-for="(section, sectionIndex) in getSections(item)"
                            :key="`${section.label ?? 'section'}-${sectionIndex}`"
                            class="vf-megamenu__section"
                        >
                            <h3 v-if="section.label" class="vf-megamenu__section-title">{{ section.label }}</h3>
                            <ul class="vf-megamenu__links">
                                <li
                                    v-for="(link, linkIndex) in section.items"
                                    :key="`${link.label}-${linkIndex}`"
                                    class="vf-megamenu__link-item"
                                >
                                    <a
                                        class="vf-megamenu__link"
                                        :class="{ 'is-active': isLinkActive(link), 'is-disabled': link.disabled }"
                                        :href="getLinkHref(link)"
                                        :aria-disabled="link.disabled ? 'true' : undefined"
                                        :aria-current="isLinkActive(link) ? 'page' : undefined"
                                        @click="onLinkClick(link, $event)"
                                    >
                                        {{ link.label }}
                                    </a>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import {
    type RouteLocationAsPathGeneric,
    type RouteLocationAsRelativeGeneric,
    type RouteLocationNormalizedLoadedGeneric,
    routeLocationKey,
    routerKey,
    type Router,
} from 'vue-router';

export interface MegaMenuLink {
    label: string;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    disabled?: boolean;
    active?: boolean;
    exact?: boolean;
    command?: () => void;
}

export interface MegaMenuSection {
    label?: string;
    items: Array<MegaMenuLink>;
}

export interface MegaMenuItem {
    key?: string;
    label: string;
    disabled?: boolean;
    sections?: Array<MegaMenuSection>;
    items?: Array<MegaMenuLink>;
    lazy?: boolean;
    loading?: boolean;
}

interface Props {
    items?: Array<MegaMenuItem>;
    modelValue?: number | null;
    disabled?: boolean;
    ariaLabel?: string;
    syncActiveFromRoute?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: null,
    disabled: false,
    ariaLabel: 'Mega menu',
    syncActiveFromRoute: true,
});

const emits = defineEmits(['update:modelValue', 'open', 'close', 'linkClick', 'navigate', 'lazyLoad']);
const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);

const internalActiveIndex = ref<number | null>(props.modelValue);

watch(
    () => props.modelValue,
    value => {
        internalActiveIndex.value = value;
    },
);

const activeIndex = computed(() => internalActiveIndex.value);

const getTriggerId = (index: number) => `vf-megamenu-trigger-${index}`;
const getPanelId = (index: number) => `vf-megamenu-panel-${index}`;
const resolveToPath = (to: MegaMenuLink['to']) => {
    if (!to || !router) {
        return null;
    }

    const resolved = router.resolve(to);
    return resolved.path;
};
const isLinkActive = (link: MegaMenuLink) => {
    if (typeof link.active === 'boolean') {
        return link.active;
    }

    if (!route) {
        return false;
    }

    if (link.to && router) {
        const path = resolveToPath(link.to);
        if (!path) {
            return false;
        }

        if (link.exact) {
            return route.path === path;
        }

        return route.path === path || route.path.startsWith(`${path}/`);
    }

    const href = link.href ?? link.url;
    if (!href || href.startsWith('http://') || href.startsWith('https://')) {
        return false;
    }

    if (link.exact) {
        return route.path === href;
    }

    return route.path === href || route.path.startsWith(`${href}/`);
};
const getLinkHref = (link: MegaMenuLink) => {
    if (link.href || link.url) {
        return link.href ?? link.url ?? '#';
    }

    if (link.to && router) {
        return router.resolve(link.to).href;
    }

    if (typeof link.to === 'string') {
        return link.to;
    }

    return '#';
};
const findActiveRootIndex = () => {
    if (!props.syncActiveFromRoute) {
        return null;
    }

    for (let index = 0; index < props.items.length; index += 1) {
        const sections = getSections(props.items[index]);
        const hasActive = sections.some(section => section.items.some(link => isLinkActive(link)));

        if (hasActive) {
            return index;
        }
    }

    return null;
};

const getSections = (item: MegaMenuItem): Array<MegaMenuSection> => {
    if (item.sections?.length) {
        return item.sections;
    }

    if (item.items?.length) {
        return [{ items: item.items }];
    }

    return [];
};

const open = (index: number) => {
    if (index < 0 || index >= props.items.length) {
        return;
    }

    internalActiveIndex.value = index;
    emits('update:modelValue', index);
    emits('open', index);

    const item = props.items[index];
    if (item.lazy && getSections(item).length === 0) {
        emits('lazyLoad', {
            index,
            item,
        });
    }
};

const close = () => {
    if (internalActiveIndex.value == null) {
        return;
    }

    internalActiveIndex.value = null;
    emits('update:modelValue', null);
    emits('close');
};

const toggle = (index: number) => {
    if (props.disabled || props.items[index]?.disabled) {
        return;
    }

    if (activeIndex.value === index) {
        close();

        return;
    }

    open(index);
};

const onTriggerKeydown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle(index);

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();

        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = (index + 1) % props.items.length;
        open(next);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = (index - 1 + props.items.length) % props.items.length;
        open(next);
    }
};

const onLinkClick = (link: MegaMenuLink, event: MouseEvent) => {
    event.preventDefault();

    if (link.disabled) {
        return;
    }

    if (typeof link.command === 'function') {
        link.command();
    }

    if (link.to && router) {
        event.preventDefault();
        void router.push(link.to);
        emits('navigate', {
            to: link.to,
            href: getLinkHref(link),
            link,
        });
    }

    emits('linkClick', link, event);
    close();
};

watch(
    () => props.items,
    () => {
        if (props.modelValue != null) {
            return;
        }

        internalActiveIndex.value = findActiveRootIndex();
    },
    { deep: true, immediate: true },
);

watch(
    () => route?.path,
    () => {
        if (props.modelValue != null) {
            return;
        }

        internalActiveIndex.value = findActiveRootIndex();
    },
);
</script>

<style lang="scss">
.vf-megamenu {
    border: var(--vf-border-width) solid var(--vf-megamenu-border-color);
    border-radius: var(--vf-megamenu-border-radius);
    background: var(--vf-megamenu-background-color);
    padding: var(--vf-megamenu-padding);
}

.vf-megamenu__root {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--vf-megamenu-root-gap);
}

.vf-megamenu__item {
    position: relative;
}

.vf-megamenu__trigger {
    border: 0;
    background: transparent;
    color: var(--vf-megamenu-trigger-text-color);
    padding: var(--vf-megamenu-trigger-padding);
    border-radius: var(--vf-megamenu-trigger-border-radius);
}

.vf-megamenu__trigger[aria-expanded='true'] {
    background: var(--vf-megamenu-trigger-active-background-color);
}

.vf-megamenu__panel {
    position: absolute;
    top: calc(100% + var(--vf-megamenu-panel-offset));
    left: 0;
    z-index: var(--vf-megamenu-z-index);
    min-width: var(--vf-megamenu-panel-min-width);
    border: var(--vf-border-width) solid var(--vf-megamenu-panel-border-color);
    border-radius: var(--vf-megamenu-panel-border-radius);
    background: var(--vf-megamenu-panel-background-color);
    box-shadow: var(--vf-megamenu-panel-shadow);
    padding: var(--vf-megamenu-panel-padding);
}

.vf-megamenu__columns {
    display: grid;
    grid-template-columns: repeat(var(--vf-megamenu-columns), minmax(0, 1fr));
    gap: var(--vf-megamenu-columns-gap);
}

.vf-megamenu__section-title {
    margin: 0 0 var(--vf-megamenu-section-title-gap) 0;
    font-size: var(--vf-megamenu-section-title-font-size);
    color: var(--vf-megamenu-section-title-color);
}

.vf-megamenu__links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-megamenu-link-gap);
}

.vf-megamenu__link {
    color: var(--vf-megamenu-link-color);
    text-decoration: none;
}

.vf-megamenu__link:hover {
    color: var(--vf-megamenu-link-hover-color);
}

.vf-megamenu__link.is-active {
    color: var(--vf-link-active-color);
}

.vf-megamenu__link.is-disabled {
    pointer-events: none;
    opacity: 0.6;
}
</style>
