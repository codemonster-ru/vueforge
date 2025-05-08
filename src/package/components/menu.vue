<template>
    <div class="vf-menu" :class="`vf-menu_${orientation}`">
        <ul class="vf-menu__list">
            <li v-for="(item, index) in items" :key="getKey(item, index)" class="vf-menu__item">
                <slot
                    v-if="$slots[getKey(item, index)]"
                    :name="getKey(item, index)"
                    :item="{ ...item, ...{ class: 'vf-menu__link' } }"
                />
                <hr v-else-if="item.separator" class="vf-menu__separator" />
                <template v-else-if="item.hasOwnProperty('items')">
                    <div
                        class="vf-menu__parent"
                        :class="{ 'vf-menu__parent_active': item.active }"
                        @click="onClick(item)"
                    >
                        <v-icon v-if="item.icon" :icon="item.icon" class="vf-menu__icon" />
                        {{ item.label }}
                        <v-icon icon="chevronDown" />
                    </div>
                    <Menu
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
                    :url="item.url"
                    :type="getType(item)"
                    class="vf-menu__link"
                    :active="item.active"
                    :disabled="item.disabled"
                    @click="onClick(item)"
                    @on-active="onActive(item)"
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
import { Menu, Link } from '@/index';
import { defineProps } from 'vue';

interface Item {
    to?: string;
    url?: string;
    icon?: string;
    items?: Array<Item>;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    subMenuVisible?: boolean;
}

interface Props {
    items: Array<Item>;
    orientation?: string;
}

const emits = defineEmits(['onActive']);
const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' });
const getKey = (item: Item, index: number) => `${item.label}_${index.toString()}`;
const getType = (item: Item) => (Object.prototype.hasOwnProperty.call(item, 'to') ? 'router-link' : 'a');
const onClick = item => {
    if (Object.prototype.hasOwnProperty.call(item, 'items')) {
        props.items.map(x => {
            if (x !== item) {
                x.subMenuVisible = false;
            }
        });
        item.subMenuVisible = !item.subMenuVisible;
    } else if (Object.prototype.hasOwnProperty.call(item, 'command')) {
        item.command();
    }
};
const onActive = item => {
    for (const index in props.items) {
        const loopItem = props.items[index];

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

    emits('onActive', item);
};
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
                height: 1rem;
                border-top: none;
                border-right: none;
                border-left: 1px solid var(--vf-menu-separator-color);
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
    margin-right: 6px;
}

.vf-menu__submenu {
    &.vf-menu__submenu_visible {
        margin-top: 12px;
        margin-left: 12px;
    }

    &:not(.vf-menu__submenu_visible) {
        height: 0;
    }
}
</style>
