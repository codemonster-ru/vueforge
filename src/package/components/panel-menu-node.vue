<template>
    <li
        class="vf-panelmenu-node"
        role="treeitem"
        :aria-level="level"
        :aria-expanded="hasChildren ? expanded : undefined"
    >
        <button
            v-if="hasChildren"
            :id="triggerId"
            type="button"
            class="vf-panelmenu-node__trigger"
            :disabled="resolvedDisabled"
            :aria-controls="panelId"
            :aria-expanded="expanded"
            @click="emitToggle"
            @keydown.enter.prevent="emitToggle"
            @keydown.space.prevent="emitToggle"
        >
            <span>{{ item.label }}</span>
            <span class="vf-panelmenu-node__chevron" aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
        </button>
        <a
            v-else
            class="vf-panelmenu-node__link"
            :href="item.to ?? item.href ?? '#'"
            :aria-disabled="resolvedDisabled ? 'true' : undefined"
            @click.prevent="emitItemClick"
        >
            {{ item.label }}
        </a>

        <ul
            v-if="hasChildren && expanded"
            :id="panelId"
            class="vf-panelmenu-node__group"
            role="group"
            :aria-labelledby="triggerId"
        >
            <PanelMenuNode
                v-for="(child, childIndex) in item.items"
                :key="`${child.label}-${childIndex}`"
                :item="child"
                :level="level + 1"
                :expanded-keys="expandedKeys"
                :disabled="resolvedDisabled"
                @toggle="onToggle"
                @item-click="onItemClick"
            />
        </ul>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PanelMenuItem } from './panel-menu.vue';

interface Props {
    item: PanelMenuItem;
    level: number;
    expandedKeys: Set<string>;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emits = defineEmits(['toggle', 'itemClick']);

const nodeKey = computed(() => props.item.key ?? props.item.label);
const hasChildren = computed(() => !!props.item.items?.length);
const expanded = computed(() => props.expandedKeys.has(nodeKey.value));
const resolvedDisabled = computed(() => props.disabled || !!props.item.disabled);
const triggerId = computed(() => `vf-panelmenu-trigger-${nodeKey.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}`);
const panelId = computed(() => `vf-panelmenu-panel-${nodeKey.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}`);

const emitToggle = (event: Event) => {
    if (resolvedDisabled.value) {
        return;
    }

    emits('toggle', nodeKey.value, event);
};

const emitItemClick = (event: Event) => {
    if (resolvedDisabled.value) {
        return;
    }

    emits('itemClick', props.item, event);
};

const onToggle = (key: string, event: Event) => emits('toggle', key, event);
const onItemClick = (item: PanelMenuItem, event: Event) => emits('itemClick', item, event);
</script>

<style lang="scss">
.vf-panelmenu-node__trigger,
.vf-panelmenu-node__link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border: 0;
    background: transparent;
    color: var(--vf-panelmenu-item-text-color);
    border-radius: var(--vf-panelmenu-item-border-radius);
    padding: var(--vf-panelmenu-item-padding);
    text-decoration: none;
}

.vf-panelmenu-node__trigger:hover,
.vf-panelmenu-node__link:hover {
    background: var(--vf-panelmenu-item-hover-background-color);
}

.vf-panelmenu-node__group {
    list-style: none;
    margin: 0;
    padding: 0 0 0 var(--vf-panelmenu-indent);
    display: grid;
    gap: var(--vf-panelmenu-gap);
}
</style>
