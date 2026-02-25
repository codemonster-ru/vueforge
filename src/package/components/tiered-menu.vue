<template>
    <Menu
        class="vf-tiered-menu"
        :class="`vf-tiered-menu_${resolvedMode}`"
        :items="items"
        :orientation="resolvedOrientation"
        @active="onActive"
        @on-active="onOnActive"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Menu from '@/package/components/menu.vue';

type TieredMenuOrientation = 'vertical' | 'horizontal';
type TieredMenuMode = 'sidebar-nav' | 'top-nav';

interface Item {
    to?: string;
    href?: string;
    url?: string;
    icon?: string;
    items?: Array<Item>;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    subMenuVisible?: boolean;
    command?: () => void;
}

interface Props {
    items?: Array<Item>;
    mode?: TieredMenuMode;
    orientation?: TieredMenuOrientation;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    mode: 'sidebar-nav',
    orientation: undefined,
});

const emits = defineEmits(['active', 'onActive', 'itemSelect']);

const resolvedMode = computed(() => props.mode);
const resolvedOrientation = computed<TieredMenuOrientation>(() => {
    if (props.orientation) {
        return props.orientation;
    }

    return props.mode === 'top-nav' ? 'horizontal' : 'vertical';
});

const onActive = (item: Item) => {
    emits('active', item);
    emits('itemSelect', item);
};

const onOnActive = (item: Item) => {
    emits('onActive', item);
};
</script>

<style lang="scss">
.vf-tiered-menu {
    display: flex;
}
</style>
