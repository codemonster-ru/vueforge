<template>
    <li class="vf-org-chart__node" role="none">
        <div
            class="vf-org-chart__card"
            :class="cardClass"
            :style="cardStyle"
            role="treeitem"
            :aria-level="level"
            :aria-expanded="hasChildren ? expanded : undefined"
            :aria-selected="selected"
            :aria-disabled="disabledNode ? 'true' : undefined"
            :tabindex="disabledNode ? -1 : 0"
            @click="onNodeClick"
            @keydown="onNodeKeydown"
        >
            <button
                v-if="hasChildren && collapsible"
                type="button"
                class="vf-org-chart__toggle"
                :aria-label="expanded ? 'Collapse node' : 'Expand node'"
                :disabled="disabledNode"
                tabindex="-1"
                @click.stop="onToggleClick"
            >
                {{ expanded ? '-' : '+' }}
            </button>
            <div class="vf-org-chart__content">
                <slot
                    name="node"
                    :node="node"
                    :level="level"
                    :selected="selected"
                    :expanded="expanded"
                    :disabled="disabledNode"
                >
                    <strong class="vf-org-chart__label">{{ node.label }}</strong>
                    <span v-if="node.title" class="vf-org-chart__title">{{ node.title }}</span>
                </slot>
            </div>
        </div>
        <ul v-if="hasChildren && expanded" class="vf-org-chart__children" role="group">
            <OrgChartNode
                v-for="child in node.children"
                :key="child.key"
                :node="child"
                :level="level + 1"
                :disabled="disabled"
                :size="size"
                :variant="variant"
                :collapsible="collapsible"
                :is-selected="isSelected"
                :is-expanded="isExpanded"
                :is-disabled="isDisabled"
                :on-select="onSelect"
                :on-toggle="onToggle"
            >
                <template #node="slotProps">
                    <slot name="node" v-bind="slotProps" />
                </template>
            </OrgChartNode>
        </ul>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OrgChartNodeItem, OrgChartValue } from './org-chart.vue';

interface Props {
    node: OrgChartNodeItem;
    level: number;
    disabled: boolean;
    size: 'small' | 'normal' | 'large';
    variant: 'filled' | 'outlined';
    collapsible: boolean;
    isSelected: (key: OrgChartValue) => boolean;
    isExpanded: (key: OrgChartValue) => boolean;
    isDisabled: (node: OrgChartNodeItem) => boolean;
    onSelect: (node: OrgChartNodeItem, event: Event) => void;
    onToggle: (node: OrgChartNodeItem, event: Event) => void;
}

type OrgChartSlotProps = {
    node: OrgChartNodeItem;
    level: number;
    selected: boolean;
    expanded: boolean;
    disabled: boolean;
};

const props = defineProps<Props>();
defineSlots<{
    node?: (props: OrgChartSlotProps) => unknown;
}>();

const hasChildren = computed(() => !!props.node.children?.length);
const selected = computed(() => props.isSelected(props.node.key));
const expanded = computed(() => props.isExpanded(props.node.key));
const disabledNode = computed(() => props.isDisabled(props.node));

const cardClass = computed(() => {
    const classes = [`vf-org-chart__card_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-org-chart__card_${props.size}`);
    }
    if (selected.value) {
        classes.push('is-selected');
    }
    if (disabledNode.value) {
        classes.push('is-disabled');
    }

    return classes;
});

const cardStyle = computed(() => ({
    '--vf-org-chart-level': String(props.level),
}));

const getVisibleItems = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    const root = element?.closest('[role="tree"]');

    if (!root) {
        return [];
    }

    return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
};

const getEnabledItems = (items: Array<HTMLElement>) => {
    return items.filter(item => item.getAttribute('aria-disabled') !== 'true');
};

const focusItemAt = (items: Array<HTMLElement>, index: number) => {
    if (index < 0 || index >= items.length) {
        return;
    }

    items[index].focus();
};

const focusFirstChild = (element: HTMLElement) => {
    const group = element.parentElement?.nextElementSibling;
    if (!(group instanceof HTMLElement) || group.getAttribute('role') !== 'group') {
        return;
    }

    const firstChild = group.querySelector<HTMLElement>('[role="treeitem"]:not([aria-disabled="true"])');
    firstChild?.focus();
};

const focusParent = (element: HTMLElement) => {
    const group = element.closest('[role="group"]');

    if (!group) {
        return;
    }

    const parent = group.previousElementSibling;

    if (parent instanceof HTMLElement && parent.getAttribute('role') === 'treeitem') {
        parent.focus();
    }
};

const onNodeClick = (event: Event) => {
    if (disabledNode.value) {
        return;
    }

    props.onSelect(props.node, event);
};

const onToggleClick = (event: MouseEvent) => {
    if (disabledNode.value || !hasChildren.value) {
        return;
    }

    props.onToggle(props.node, event);
};

const onNodeKeydown = (event: KeyboardEvent) => {
    if (disabledNode.value) {
        return;
    }

    const current = event.currentTarget as HTMLElement;
    const items = getEnabledItems(getVisibleItems(event.target));
    const index = items.indexOf(current);

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onNodeClick(event);

        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();

        if (hasChildren.value && props.collapsible && !expanded.value) {
            props.onToggle(props.node, event);

            return;
        }

        if (hasChildren.value && expanded.value) {
            focusFirstChild(current);
        }

        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();

        if (hasChildren.value && props.collapsible && expanded.value) {
            props.onToggle(props.node, event);

            return;
        }

        focusParent(current);

        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusItemAt(items, index + 1);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusItemAt(items, index - 1);

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        focusItemAt(items, 0);

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        focusItemAt(items, items.length - 1);
    }
};
</script>
