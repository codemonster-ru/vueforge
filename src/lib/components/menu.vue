<template>
    <div class='cm-menu' :class='`cm-menu_${orientation}`'>
        <ul class='cm-menu__list'>
            <li v-for='(item, index) in items' :key='getKey(item, index)' class='cm-menu__item'>
                <slot
                    v-if='$slots[getKey(item, index)]'
                    :name='getKey(item, index)'
                    :item='{ ...item, ...{class: "cm-menu__link"} }'
                />
                <hr v-else-if='item.separator' class='cm-menu__separator' />
                <template v-else-if='item.hasOwnProperty("items")'>
                    <div
                        class='cm-menu__parent'
                        :class='{ "cm-menu__parent_active": item.active }'
                        @click='onClick(item)'
                    >
                        <cm-icon v-if='item.icon' :icon='item.icon' class='cm-menu__icon' />
                        {{ item.label }}
                        <cm-icon icon='chevronDown' />
                    </div>
                    <cm-menu
                        v-if='item.items'
                        :items='item.items'
                        class='cm-menu__submenu'
                        :class='{ "cm-menu__submenu_visible": item.subMenuVisible }'
                        @on-active='onActive'
                    />
                </template>
                <cm-link
                    v-else
                    :to='item.to'
                    :url='item.url'
                    :type='getType(item)'
                    class='cm-menu__link'
                    :active='item.active'
                    :disabled='item.disabled'
                    @click='onClick(item)'
                    @on-active='onActive(item)'
                >
                    <cm-icon v-if='item.icon' :icon='item.icon' class='cm-menu__icon'></cm-icon>
                    {{ item.label }}
                </cm-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { CmIcon } from '@codemonster-ru/icons';
import { CmMenu, CmLink } from '@/lib';
import { defineProps } from 'vue';

interface Item {
    to?: string,
    url?: string,
    icon?: string,
    items?: Array<Item>
    label?: string,
    active?: boolean,
    disabled?: boolean,
    separator?: boolean,
    subMenuVisible?: boolean
}

interface Props {
    items: Array<Item>,
    orientation?: string,
}

const emits = defineEmits(['onActive']);
const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' });
const getKey = (item: Item, index: number) => `${item.label}_${index.toString()}`;
const getType = (item: Item) => Object.prototype.hasOwnProperty.call(item, 'to') ? 'router-link' : 'a';
const onClick = (item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'items')) {
        props.items.map((x) => {
            if (x !== item) {
                x.subMenuVisible = false;
            }
        });
        item.subMenuVisible = !item.subMenuVisible;
    } else if (Object.prototype.hasOwnProperty.call(item, 'command')) {
        item.command();
    }
};
const onActive = (item) => {
    for (const index in props.items) {
        const loopItem = props.items[index];

        if (Object.prototype.hasOwnProperty.call(loopItem, 'items')) {
            if (loopItem.items?.some((x) => x === item)) {
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

<style lang='scss'>
.cm-menu {
    display: flex;
}

.cm-menu_horizontal {
    > .cm-menu__list {
        flex-direction: row;

        > .cm-menu__item {
            align-items: center;

            &:not(:first-child) {
                margin-left: var(--cm-menu-item-margin-left);
            }

            &:not(:last-child) {
                margin-right: var(--cm-menu-item-margin-right);
            }

            > .cm-menu__separator {
                height: 1rem;
                border-top: none;
                border-right: none;
                border-left: 1px solid var(--cm-menu-separator-color);
                border-bottom: none;
            }
        }
    }
}

.cm-menu_vertical {
    > .cm-menu__list {
        width: 100%;
        flex-direction: column;

        > .cm-menu__item {
            flex-direction: column;

            &:not(:first-child) {
                margin-top: var(--cm-menu-item-margin-top);
            }

            &:not(:last-child) {
                margin-bottom: var(--cm-menu-item-margin-bottom);
            }

            > .cm-menu {
                overflow: hidden;
            }
        }
    }
}

.cm-menu__list {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
}

.cm-menu__item {
    display: flex;
    font-weight: 500;
}

.cm-menu__link {
    display: flex;
    align-items: center;
    text-decoration: none;

    &:hover {
        color: var(--cm-menu-link-hover-color);
    }
}

.cm-menu__parent {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        color: var(--cm-menu-parent-hover-color);
    }
}

//.cm-menu__parent_active {
//    color: var(--cm-menu-parent-active-color);
//}

.cm-menu__icon {
    margin-right: 6px;
}

.cm-menu__submenu {
    &.cm-menu__submenu_visible {
        margin-top: 12px;
        margin-left: 12px;
    }

    &:not(.cm-menu__submenu_visible) {
        height: 0;
    }
}

//Theme
@import "../styles/colors";

:root {
    --cm-menu-item-margin-top: .5rem;
    --cm-menu-item-margin-right: .5rem;
    --cm-menu-item-margin-bottom: .5rem;
    --cm-menu-item-margin-left: .5rem;

    --cm-menu-separator-color: var(--cm-border);
    --cm-menu-link-hover-color: var(--cm-brand-1);
    --cm-menu-link-active-color: var(--cm-brand-1);
    --cm-menu-parent-hover-color: var(--cm-text-2);
    --cm-menu-parent-active-color: var(--cm-brand-1);
}
</style>