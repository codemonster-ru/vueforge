<template>
    <div class="vf-menu" :class="`vf-menu_${orientation}`">
        <ul
            class="vf-menu__list"
            role="menu"
            :aria-orientation="orientation === 'horizontal' ? 'horizontal' : 'vertical'"
        >
            <li v-for="(item, index) in localItems" :key="getKey(item, index)" class="vf-menu__item" role="none">
                <slot
                    v-if="$slots[getKey(item, index)]"
                    :name="getKey(item, index)"
                    :item="{ ...item, ...{ class: 'vf-menu__link' } }"
                />
                <hr v-else-if="item.separator" class="vf-menu__separator" role="separator" />
                <template v-else-if="item.items && item.items.length">
                    <button
                        class="vf-menu__parent"
                        :id="getParentId(item, index)"
                        :class="{ 'vf-menu__parent_active': item.active }"
                        type="button"
                        role="menuitem"
                        tabindex="0"
                        aria-haspopup="menu"
                        :aria-expanded="item.subMenuVisible ? 'true' : 'false'"
                        :aria-controls="getSubmenuId(item, index)"
                        @click="onClick(item)"
                        @keydown="onParentKeydown($event, item, index)"
                    >
                        <v-icon v-if="item.icon" :icon="item.icon" class="vf-menu__icon" />
                        {{ item.label }}
                        <v-icon icon="chevronDown" class="vf-menu__chevron" />
                    </button>
                    <VfMenu
                        v-if="item.items"
                        :id="getSubmenuId(item, index)"
                        :items="item.items"
                        class="vf-menu__submenu"
                        :class="{ 'vf-menu__submenu_visible': item.subMenuVisible }"
                        @on-active="onActive"
                    />
                </template>
                <Link
                    v-else
                    :to="item.to"
                    :href="item.href ?? item.url"
                    :as="getType(item)"
                    class="vf-menu__link"
                    :active="item.active"
                    :disabled="item.disabled"
                    role="menuitem"
                    :aria-disabled="item.disabled ? 'true' : 'false'"
                    :aria-current="item.active ? 'page' : undefined"
                    @click="onClick(item)"
                    @active="onActive(item)"
                >
                    <v-icon v-if="item.icon" :icon="item.icon" class="vf-menu__icon"></v-icon>
                    {{ item.label }}
                </Link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';
import Link from '@/package/components/link.vue';
import { nextTick, ref, watch } from 'vue';

interface Item {
    to?: string;
    href?: string;
    url?: string;
    icon?: string;
    items?: Array<Item>;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    subMenuVisible?: boolean;
    command?: () => void;
}

interface Props {
    items: Array<Item>;
    orientation?: string;
}

const emits = defineEmits(['active', 'onActive']);
defineOptions({ name: 'VfMenu' });
const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' });
const localItems = ref<Array<Item>>([]);
const getKey = (item: Item, index: number) => {
    const base = item.label ?? item.to ?? item.href ?? item.url ?? 'item';
    return `${base}_${index.toString()}`;
};
const toDomId = (value: string) => value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
const getParentId = (item: Item, index: number) => `vf-menu-parent-${toDomId(getKey(item, index))}`;
const getSubmenuId = (item: Item, index: number) => `vf-menu-submenu-${toDomId(getKey(item, index))}`;
const getType = (item: Item) => (item.to ? 'router-link' : 'a');
const cloneItems = (source: Array<Item>): Array<Item> => {
    return source.map(item => {
        return {
            ...item,
            items: item.items ? cloneItems(item.items) : undefined,
        };
    });
};
const onClick = (item: Item) => {
    if (item.items && item.items.length) {
        localItems.value.map(x => {
            if (x !== item) {
                x.subMenuVisible = false;
            }
        });
        item.subMenuVisible = !item.subMenuVisible;
    } else if (Object.prototype.hasOwnProperty.call(item, 'command')) {
        if (typeof item.command === 'function') {
            item.command();
        }
    }
};
const findFirstFocusable = (containerId: string) => {
    const submenu = typeof document !== 'undefined' ? document.getElementById(containerId) : null;
    const candidate = submenu?.querySelector<HTMLElement>('[role="menuitem"]');

    if (candidate) {
        candidate.focus();
    }
};
const onParentKeydown = async (event: KeyboardEvent, item: Item, index: number) => {
    if (!(item.items && item.items.length)) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(item);

        return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();

        if (!item.subMenuVisible) {
            onClick(item);
        }

        await nextTick();
        findFirstFocusable(getSubmenuId(item, index));

        return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
        if (item.subMenuVisible) {
            event.preventDefault();
            item.subMenuVisible = false;
        }
    }
};
const itemIdentity = (item: Item) => `${item.label ?? ''}|${item.to ?? ''}|${item.href ?? ''}|${item.url ?? ''}`;
const hasNestedMatch = (source: Item, target: Item): boolean => {
    if (!(source.items && source.items.length)) {
        return false;
    }

    return source.items.some(child => itemIdentity(child) === itemIdentity(target) || hasNestedMatch(child, target));
};
const onActive = (item: Item) => {
    for (const loopItem of localItems.value) {
        if (loopItem.items?.length) {
            const active = hasNestedMatch(loopItem, item);

            loopItem.active = active;
            loopItem.subMenuVisible = active;
        }
    }

    emits('active', item);
    emits('onActive', item);
};

watch(
    () => props.items,
    value => {
        localItems.value = cloneItems(value);
    },
    { deep: true, immediate: true },
);
</script>

<style lang="scss">
.vf-menu {
    display: flex;
}

.vf-menu_horizontal {
    > .vf-menu__list {
        flex-direction: row;

        > .vf-menu__item {
            align-items: center;
            position: relative;

            &:not(:first-child) {
                margin-left: var(--vf-menu-item-margin-left);
            }

            &:not(:last-child) {
                margin-right: var(--vf-menu-item-margin-right);
            }

            > .vf-menu__separator {
                height: var(--vf-menu-separator-height);
                border-top: none;
                border-right: none;
                border-left: var(--vf-menu-separator-thickness) solid var(--vf-menu-separator-color);
                border-bottom: none;
            }

            > .vf-menu__submenu {
                position: absolute;
                top: calc(100% + var(--vf-menu-submenu-offset));
                left: 0;
                z-index: 2;
                min-width: 12rem;
                padding: 0.5rem;
                border: var(--vf-border-width) solid var(--vf-border-color);
                border-radius: var(--vf-radii-md);
                background-color: var(--vf-bg-color);
                box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
                margin: 0;
                overflow: visible;
                transition:
                    opacity 0.14s ease,
                    transform 0.14s ease,
                    visibility 0.14s ease;
            }

            > .vf-menu__submenu.vf-menu__submenu_visible {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transform: translateY(0);
                height: auto;
            }

            > .vf-menu__submenu:not(.vf-menu__submenu_visible) {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: translateY(-4px);
                height: auto;
            }
        }
    }
}

.vf-menu_vertical {
    > .vf-menu__list {
        width: 100%;
        flex-direction: column;

        > .vf-menu__item {
            flex-direction: column;

            &:not(:first-child) {
                margin-top: var(--vf-menu-item-margin-top);
            }

            &:not(:last-child) {
                margin-bottom: var(--vf-menu-item-margin-bottom);
            }

            > .vf-menu {
                overflow: hidden;
            }
        }
    }
}

.vf-menu__list {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
}

.vf-menu__separator {
    width: 100%;
    height: var(--vf-menu-separator-thickness);
    border: none;
    margin: 0;
    background-color: var(--vf-menu-separator-color);
}

.vf-menu__item {
    display: flex;
    font-weight: 500;
}

.vf-menu__link {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);

    &:hover {
        color: var(--vf-menu-link-hover-color);
    }
}

.vf-menu__parent {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);

    &:hover {
        color: var(--vf-menu-parent-hover-color);
    }
}

//.vf-menu__parent_active {
//    color: var(--vf-menu-parent-active-color);
//}

.vf-menu__icon {
    margin-right: var(--vf-menu-icon-gap);
}

.vf-menu__chevron {
    margin-left: 0.375rem;
}

.vf-menu__submenu {
    overflow: hidden;

    &.vf-menu__submenu_visible {
        margin-top: var(--vf-menu-submenu-offset);
        margin-left: var(--vf-menu-submenu-offset);
        height: auto;
        pointer-events: auto;
    }

    &:not(.vf-menu__submenu_visible) {
        height: 0;
        margin: 0;
        pointer-events: none;
    }
}
</style>
