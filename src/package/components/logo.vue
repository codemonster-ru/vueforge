<template>
    <div class="vf-logo">
        <template v-if="linkAs">
            <Link :as="linkAs" :to="to" :href="href ?? url">
                <img :src="getSrc" :width="width" :height="height" :alt="alt" />
            </Link>
        </template>
        <template v-else>
            <img :src="getSrc" :width="width" :height="height" :alt="alt" />
        </template>
    </div>
</template>

<script setup lang="ts">
import Link from '@/package/components/link.vue';
import { computed } from 'vue';
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    src: string | Array<string>;
    alt?: string;
    as?: 'a' | 'router-link';
    type?: string;
    dark?: boolean;
    width?: string;
    height?: string;
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    alt: undefined,
    href: undefined,
    url: undefined,
    as: undefined,
    type: undefined,
    width: undefined,
    height: undefined,
});

const linkAs = computed(() => {
    if (props.as) {
        return props.as;
    }
    if (props.type === 'router-link' || props.type === 'a') {
        return props.type;
    }
    if (props.to) {
        return 'router-link';
    }
    if (props.href || props.url) {
        return 'a';
    }
    return '';
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
