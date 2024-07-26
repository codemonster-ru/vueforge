<template>
    <a v-if='type === "a"' :href='url' class='cm-link'>
        <template v-if='$slots.default'>
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </a>
    <router-link v-else :to='to' class='cm-link'>
        <template v-if='$slots.default'>
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </router-link>
</template>

<script setup lang='ts'>
import('./link.scss');

import { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router';
import { defineProps } from 'vue';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    url?: string,
    type: string,
    label?: string,
}

withDefaults(defineProps<Props>(), {
    to: '',
    url: undefined,
    type: 'a',
    label: '',
});
</script>