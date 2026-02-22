<template>
    <a
        v-if="resolvedType === 'a'"
        :href="disabled ? undefined : resolvedHref"
        class="vf-link"
        :class="{ 'vf-link_active': getActive, 'vf-link_disabled': disabled }"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled ? -1 : undefined"
        @click="onClick"
        @keydown="onKeydown"
    >
        <template v-if="$slots.default">
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </a>
    <router-link
        v-else
        ref="link"
        :to="routerLinkTo"
        class="vf-link"
        :class="{ 'vf-link_active': getActive }"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled ? -1 : undefined"
        active-class="vf-link_partially-active"
        exact-active-class="vf-link_active"
        @click="onClick"
        @keydown="onKeydown"
    >
        <template v-if="$slots.default">
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </router-link>
</template>

<script setup lang="ts">
import {
    RouteLocationAsRelativeGeneric,
    RouteLocationAsPathGeneric,
    RouteLocationRaw,
    routeLocationKey,
    routerKey,
    Router,
    RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import { computed, inject, ref, watch } from 'vue';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    as?: 'a' | 'router-link';
    type?: string;
    label?: string;
    active?: boolean;
    disabled?: boolean;
}

const emits = defineEmits(['click', 'active', 'update:active', 'onActive']);
const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    href: undefined,
    url: undefined,
    as: undefined,
    type: undefined,
    label: '',
});
const route = inject<RouteLocationNormalizedLoadedGeneric | null>(routeLocationKey, null);
const router = inject<Router | null>(routerKey, null);
const link = ref(null);
const resolvedHref = computed(() => props.href ?? props.url);
const resolvedType = computed(() => {
    if (props.as) {
        return props.as === 'router-link' && !props.to ? 'a' : props.as;
    }
    if (props.type === 'router-link' || props.type === 'a') {
        return props.type === 'router-link' && !props.to ? 'a' : props.type;
    }
    if (props.to) {
        return 'router-link';
    }
    return 'a';
});
const routerLinkTo = computed<RouteLocationRaw>(() => {
    return props.to as RouteLocationRaw;
});
const resolvedTo = computed(() => {
    if (!props.to || !router) {
        return null;
    }
    return router.resolve(props.to);
});
const isRouteActive = computed(() => {
    if (resolvedType.value !== 'router-link') {
        return false;
    }

    const resolved = resolvedTo.value;
    if (!resolved) {
        return false;
    }
    if (!route) {
        return false;
    }

    if (resolved.name) {
        return route.matched.some(({ name }) => name === resolved.name);
    }

    if (resolved.fullPath) {
        return route.fullPath === resolved.fullPath;
    }

    return route.path === resolved.path;
});
const getActive = computed(() => {
    if (props.active === undefined) {
        return isRouteActive.value;
    }
    return props.active;
});

const onClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emits('click', event);
        return;
    }

    event.preventDefault();
    event.stopPropagation();
};

const onKeydown = (event: KeyboardEvent) => {
    if (!props.disabled) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
    }
};

watch(isRouteActive, value => {
    if (value) {
        emits('active');
        emits('onActive');
    }
    emits('update:active', value);
});
</script>

<style lang="scss">
.vf-link {
    color: inherit;
    cursor: pointer;
    text-decoration: none;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);

    &:hover {
        color: var(--vf-link-hover-color);
    }

    &:active {
        color: var(--vf-link-active-color);
    }

    &.vf-link_disabled {
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: none;
        border-radius: var(--vf-radii-sm);
        box-shadow: 0 0 0 2px var(--vf-primary-color);
    }
}

.vf-link_active,
.vf-link_partially-active {
    color: var(--vf-link-active-color);
}
</style>
