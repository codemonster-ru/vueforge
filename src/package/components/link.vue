<template>
    <a
        v-if="type === 'a'"
        :href="url"
        class="vf-link"
        :class="{ 'vf-link_active': active, 'vf-link_disabled': disabled }"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : undefined"
        @click="onClick"
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
        :to="to"
        class="vf-link"
        :class="{ 'vf-link_active': getActive }"
        :disabled="disabled"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : undefined"
        active-class="vf-link_partially-active"
        exact-active-class="vf-link_active"
        @click="onClick"
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
import { useRoute, RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router';
import { computed, ref } from 'vue';

interface Props {
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    url?: string;
    type: string;
    label?: string;
    active?: boolean;
    disabled?: boolean;
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
        const to = props.to;

        if (to && typeof to === 'object' && 'name' in to) {
            const targetName = to.name;

            if (route.matched.some(({ name }) => targetName === name)) {
                emits('onActive');
            }
        }
    }

    return props.active;
});

const onClick = (event: MouseEvent) => {
    if (!props.disabled) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
};
</script>

<style lang="scss">
.vf-link {
    color: inherit;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        color: var(--vf-link-hover-color);
    }

    &:active {
        color: var(--vf-link-active-color);
    }

    &.vf-link_disabled {
        cursor: not-allowed;
    }
}

.vf-link_active,
.vf-link_partially-active {
    color: var(--vf-link-active-color);
}
</style>
