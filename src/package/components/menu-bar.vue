<template>
    <nav class="vf-menubar" :aria-label="ariaLabel">
        <Menu
            class="vf-menubar__menu"
            :items="items"
            orientation="horizontal"
            @active="onActive"
            @on-active="onOnActive"
        />
    </nav>
</template>

<script setup lang="ts">
import Menu from '@/package/components/menu.vue';

interface MenuBarItem {
    to?: string;
    href?: string;
    url?: string;
    icon?: string;
    items?: Array<MenuBarItem>;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    command?: () => void;
}

interface Props {
    items?: Array<MenuBarItem>;
    ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: 'Main navigation',
});

const emits = defineEmits(['active', 'onActive']);

const onActive = (item: MenuBarItem) => emits('active', item);
const onOnActive = (item: MenuBarItem) => emits('onActive', item);
</script>

<style lang="scss">
.vf-menubar {
    border: var(--vf-border-width) solid var(--vf-menubar-border-color);
    border-radius: var(--vf-menubar-border-radius);
    background: var(--vf-menubar-background-color);
    padding: var(--vf-menubar-padding);
}

.vf-menubar__menu {
    width: 100%;
}
</style>
