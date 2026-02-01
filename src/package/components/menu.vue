<template>
    <div class="vf-menu" :class="`vf-menu_${orientation}`">
        <ul class="vf-menu__list" role="menu">
            <li v-for="(item, index) in localItems" :key="getKey(item, index)" class="vf-menu__item" role="none">
                <slot
                    v-if="$slots[getKey(item, index)]"
                    :name="getKey(item, index)"
                    :item="{ ...item, ...{ class: 'vf-menu__link' } }"
                />
                <hr v-else-if="item.separator" class="vf-menu__separator" role="separator" />
                <template v-else-if="item.items && item.items.length">
                    <div
                        class="vf-menu__parent"
                        :class="{ 'vf-menu__parent_active': item.active }"
                        role="menuitem"
                        tabindex="0"
                        :aria-expanded="item.subMenuVisible ? 'true' : 'false'"
                        @click="onClick(item)"
                        @keydown.enter.prevent="onClick(item)"
                        @keydown.space.prevent="onClick(item)"
                    >
                        <v-icon v-if="item.icon" :icon="item.icon" class="vf-menu__icon" />
                        {{ item.label }}
                        <v-icon icon="chevronDown" />
                    </div>
                    <VfMenu
                        v-if="item.items"
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
import { ref, watch } from 'vue';

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
const onActive = (item: Item) => {
    for (const index in localItems.value) {
        const loopItem = localItems.value[index];

        if (Object.prototype.hasOwnProperty.call(loopItem, 'items')) {
            if (loopItem.items?.some(x => x === item)) {
                loopItem.active = true;
                loopItem.subMenuVisible = true;
            } else {
                loopItem.active = false;
                loopItem.subMenuVisible = false;
            }
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

    &:hover {
        color: var(--vf-menu-link-hover-color);
    }
}

.vf-menu__parent {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

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

.vf-menu__submenu {
    &.vf-menu__submenu_visible {
        margin-top: var(--vf-menu-submenu-offset);
        margin-left: var(--vf-menu-submenu-offset);
    }

    &:not(.vf-menu__submenu_visible) {
        height: 0;
    }
}
</style>
