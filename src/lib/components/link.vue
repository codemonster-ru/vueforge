<template>
    <a
        v-if='type === "a"'
        :href='url'
        class='cm-link'
        :class='{ "cm-link_active": active, "cm-link_disabled": disabled }'
    >
        <template v-if='$slots.default'>
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </a>
    <router-link
        v-else
        ref='link'
        :to='to'
        class='cm-link'
        :class='{ "cm-link_active": getActive }'
        :disabled='disabled'
        active-class='cm-link_partially-active'
        exact-active-class='cm-link_active'
    >
        <template v-if='$slots.default'>
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </router-link>
</template>

<script setup lang='ts'>
import { useRoute, RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router';
import { computed, defineProps, ref } from 'vue';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    url?: string,
    type: string,
    label?: string,
    active?: boolean,
    disabled?: boolean,
}

const emits = defineEmits(['onActive']);
const props = withDefaults(defineProps<Props>(), {
    to: '',
    url: undefined,
    type: 'a',
    label: '',
});
const route = useRoute();
const link = ref(null);
const getActive = computed(() => {
    if (props.type === 'router-link') {
        if (route.matched.some(({ name }) => props.to.name === name)) {
            emits('onActive');
        }
    }

    return props.active;
});
</script>

<style lang='scss'>
.cm-link {
    color: inherit;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        color: var(--cm-link-color-hover);
    }

    &:active {
        color: var(--cm-link-color-active);
    }

    &.cm-link_disabled {
        cursor: not-allowed;
    }
}

.cm-link_active,
.cm-link_partially-active {
    color: var(--cm-link-color-active);
}

//Theme
@import "../styles/colors";

:root {
    --cm-link-color-hover: var(--cm-brand-1);
    --cm-link-color-active: var(--cm-brand-1);
}
</style>