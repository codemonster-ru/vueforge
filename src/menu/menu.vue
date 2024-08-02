<template>
    <div class='cm-menu' :class='`cm-menu_${orientation}`'>
        <ul class='cm-menu__list'>
            <li v-for='(item, index) in items' :key='getKey(item, index)' class='cm-menu__item'>
                <slot
                    v-if='$slots[getKey(item, index)]'
                    :name='getKey(item, index)'
                    :item='{ ...item, ...{class: "cm-menu__link"} }'
                />
                <a v-else class='cm-menu__link' :href='item.url'>{{ item.label }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import('@/menu/menu.scss');
import('@/menu/menuTheme.scss');
import { defineProps } from 'vue';

interface Item {
    label: string,
    url: string,
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
</script>