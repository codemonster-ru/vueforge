<template>
    <div class='cm-logo'>
        <template v-if='type.length'>
            <cm-link :type='type' :to='to' :url='url'>
                <img :src='getSrc' :width='width' :height='height' :alt='alt'>
            </cm-link>
        </template>
        <template v-else>
            <img :src='getSrc' :width='width' :height='height' :alt='alt'>
        </template>
    </div>
</template>

<script setup lang='ts'>
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

import('./logo.scss');
import { CmLink } from '@/lib';
import { computed, defineProps } from 'vue';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    url?: string,
    src: string | Array<string>,
    alt?: string,
    type?: string,
    dark?: boolean,
    width?: string,
    height?: string,
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    alt: undefined,
    url: undefined,
    type: '',
    width: undefined,
    height: undefined,
});

const getSrc = computed(() => {
    if (Array.isArray(props.src)) {
        return props.dark ? props.src[1] : props.src[0];
    } else {
        return props.src;
    }
});
</script>