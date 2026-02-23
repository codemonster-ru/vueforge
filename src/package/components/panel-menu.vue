<template>
    <nav class="vf-panelmenu" :aria-label="ariaLabel">
        <ul class="vf-panelmenu__list" role="tree">
            <PanelMenuNode
                v-for="(item, index) in items"
                :key="`${item.label}-${index}`"
                :item="item"
                :level="1"
                :expanded-keys="expandedSet"
                :disabled="disabled"
                @toggle="onToggle"
                @item-click="onItemClick"
            />
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PanelMenuNode from './panel-menu-node.vue';

export interface PanelMenuItem {
    key?: string;
    label: string;
    to?: string;
    href?: string;
    disabled?: boolean;
    items?: Array<PanelMenuItem>;
}

interface Props {
    items?: Array<PanelMenuItem>;
    expandedKeys?: Array<string>;
    multiple?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    expandedKeys: () => [],
    multiple: true,
    disabled: false,
    ariaLabel: 'Panel menu',
});

const emits = defineEmits(['update:expandedKeys', 'toggle', 'itemClick']);

const expandedSet = computed(() => new Set(props.expandedKeys));

const onToggle = (key: string, event: Event) => {
    if (props.disabled) {
        return;
    }

    const exists = expandedSet.value.has(key);

    if (exists) {
        const next = props.expandedKeys.filter(value => value !== key);
        emits('update:expandedKeys', next);
        emits('toggle', key, false, event);

        return;
    }

    const next = props.multiple ? [...props.expandedKeys, key] : [key];
    emits('update:expandedKeys', next);
    emits('toggle', key, true, event);
};

const onItemClick = (item: PanelMenuItem, event: Event) => {
    emits('itemClick', item, event);
};
</script>

<style lang="scss">
.vf-panelmenu {
    border: var(--vf-border-width) solid var(--vf-panelmenu-border-color);
    border-radius: var(--vf-panelmenu-border-radius);
    background: var(--vf-panelmenu-background-color);
    padding: var(--vf-panelmenu-padding);
}

.vf-panelmenu__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-panelmenu-gap);
}
</style>
