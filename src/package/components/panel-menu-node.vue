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
            :class="{ 'is-active': isNodeActive }"
            :disabled="resolvedDisabled"
            :aria-controls="panelId"
            :aria-expanded="expanded"
            @click="emitToggle"
            @keydown.enter.prevent="emitToggle"
            @keydown.space.prevent="emitToggle"
        >
            <span>{{ item.label }}</span>
            <span v-if="item.loading" class="vf-panelmenu-node__loading" aria-hidden="true">...</span>
            <span class="vf-panelmenu-node__chevron" aria-hidden="true">{{ expanded ? '-' : '+' }}</span>
        </button>
        <Link
            v-else
            class="vf-panelmenu-node__link"
            :class="{ 'is-active': isNodeActive }"
            :to="item.to"
            :href="item.href ?? item.url"
            :active="item.active"
            :disabled="resolvedDisabled"
            role="treeitem"
            :aria-current="isNodeActive ? 'page' : undefined"
            @click="emitItemClick"
            @active="emitActive"
        >
            {{ item.label }}
        </Link>

        <Transition
            name="vf-panelmenu-expand"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
        >
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
        </Transition>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PanelMenuItem } from './panel-menu.vue';
import Link from './link.vue';

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
const hasChildren = computed(() => Boolean(props.item.lazy) || !!props.item.items?.length);
const expanded = computed(() => props.expandedKeys.has(nodeKey.value));
const resolvedDisabled = computed(() => props.disabled || !!props.item.disabled);
const isNodeActive = computed(() => Boolean(props.item.active) || expanded.value);
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

    if (!props.item.to && event instanceof MouseEvent) {
        event.preventDefault();
    }

    emits('itemClick', props.item, event);
};

const emitActive = () => emits('itemClick', props.item, new Event('active'));
const onToggle = (key: string, event: Event) => emits('toggle', key, event);
const onItemClick = (item: PanelMenuItem, event: Event) => emits('itemClick', item, event);

const onEnter = (element: Element) => {
    const target = element as HTMLElement;
    target.style.height = '0px';
    target.style.overflow = 'hidden';
    target.style.opacity = '0';

    void target.offsetHeight;

    target.style.height = `${target.scrollHeight}px`;
    target.style.opacity = '1';
};

const onAfterEnter = (element: Element) => {
    const target = element as HTMLElement;
    target.style.height = 'auto';
    target.style.overflow = '';
    target.style.opacity = '';
};

const onLeave = (element: Element) => {
    const target = element as HTMLElement;
    target.style.height = `${target.scrollHeight}px`;
    target.style.overflow = 'hidden';
    target.style.opacity = '1';

    void target.offsetHeight;

    target.style.height = '0px';
    target.style.opacity = '0';
};

const onAfterLeave = (element: Element) => {
    const target = element as HTMLElement;
    target.style.height = '';
    target.style.overflow = '';
    target.style.opacity = '';
};
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

.vf-panelmenu-node__trigger.is-active,
.vf-panelmenu-node__link.is-active {
    color: var(--vf-link-active-color);
    background: var(--vf-panelmenu-item-hover-background-color);
}

.vf-panelmenu-node__loading {
    margin-left: auto;
    margin-right: 0.25rem;
}

.vf-panelmenu-node__group {
    list-style: none;
    margin: 0;
    padding: 0 0 0 var(--vf-panelmenu-indent);
    display: grid;
    gap: var(--vf-panelmenu-gap);
    will-change: height, opacity;
}

.vf-panelmenu-expand-enter-active,
.vf-panelmenu-expand-leave-active {
    transition:
        height 180ms ease,
        opacity 140ms ease;
}
</style>
