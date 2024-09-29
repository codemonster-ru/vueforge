<template>
    <div class='cm-menu' :class='`cm-menu_${orientation}`'>
        <ul class='cm-menu__list'>
            <li v-for='(item, index) in items' :key='getKey(item, index)' class='cm-menu__item'>
                <slot
                    v-if='$slots[getKey(item, index)]'
                    :name='getKey(item, index)'
                    :item='{ ...item, ...{class: "cm-menu__link"} }'
                />
                <cm-link v-else :type='getType(item)' :to='item.to' :url='item.url' class='cm-menu__link'>
                    {{ item.label }}
                </cm-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import('./menu.scss');
import('./menuTheme.scss');
import { CmLink } from '@/lib';
import { defineProps } from 'vue';

interface Item {
    label: string,
    to?: string,
    url?: string,
}

interface Props {
    items: Array<Item>,
    orientation?: string,
}

withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
});

function getKey(item: Item, index: number) {
    return `${item.label}_${index.toString()}`;
}

function getType(item: Item) {
    return Object.prototype.hasOwnProperty.call(item, 'to') ? 'router-link' : 'a';
}
</script>