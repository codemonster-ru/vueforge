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
                        <cm-icon :icon='CmChevronDownIcon' />
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
import('./menu.scss');
import('./menuTheme.scss');
import { CmIcon, CmChevronDownIcon } from '@codemonster-ru/icons';
import { CmMenu, CmLink } from '@/lib';
import { Component, defineProps } from 'vue';

interface Item {
    to?: string,
    url?: string,
    icon?: Component,
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