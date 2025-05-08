<template>
    <div class="vf-logo">
        <template v-if="type.length">
            <Link :type="type" :to="to" :url="url">
                <img :src="getSrc" :width="width" :height="height" :alt="alt" />
            </Link>
        </template>
        <template v-else>
            <img :src="getSrc" :width="width" :height="height" :alt="alt" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Link } from '@/index';
import { computed, defineProps } from 'vue';
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    url?: string;
    src: string | Array<string>;
    alt?: string;
    type?: string;
    dark?: boolean;
    width?: string;
    height?: string;
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

<style lang="scss">
.vf-logo {
    position: relative;
}
</style>
