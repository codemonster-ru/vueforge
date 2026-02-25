<template>
    <TreeSelect
        :items="localItems"
        :model-value="modelValue"
        :expanded-keys="expandedKeys"
        :multiple="multiple"
        :selectable="selectable"
        :expand-on-click="expandOnClick"
        :disabled="disabled"
        :readonly="readonly"
        :loading="loading"
        :loading-text="loadingText"
        :empty-text="emptyText"
        :placeholder="placeholder"
        :search-placeholder="searchPlaceholder"
        :filter="filter"
        :clearable="clearable"
        :variant="variant"
        :size="size"
        class="vf-cascadeselect"
        @update:model-value="value => emit('update:modelValue', value)"
        @change="(value, node, event) => emit('change', value, node, event)"
        @update:expanded-keys="onExpandedKeysUpdate"
        @toggle="onToggle"
        @node-click="(node, event) => emit('nodeClick', node, event)"
        @search="value => emit('search', value)"
        @focus="event => emit('focus', event)"
        @blur="event => emit('blur', event)"
    >
        <template #label="slotProps">
            <slot name="label" v-bind="{ ...slotProps, loading: isBranchLoading(slotProps.node.key) }">
                <span>{{ slotProps.node.label }}</span>
                <span v-if="isBranchLoading(slotProps.node.key)" class="vf-cascadeselect__loading-suffix">
                    {{ loadingBranchText }}
                </span>
            </slot>
        </template>
    </TreeSelect>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TreeSelect from './tree-select.vue';
import type { TreeValue } from './tree.vue';
import type { CascadeSelectItem } from './cascade-select-types';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type CascadeModelValue = TreeValue | Array<TreeValue> | undefined;

interface Props {
    items?: Array<CascadeSelectItem>;
    modelValue?: CascadeModelValue;
    expandedKeys?: Array<TreeValue>;
    multiple?: boolean;
    selectable?: boolean;
    expandOnClick?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;
    loadingText?: string;
    loadingBranchText?: string;
    emptyText?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    filter?: boolean;
    clearable?: boolean;
    variant?: Variant;
    size?: Size;
    autoLoadOnExpand?: boolean;
    loadChildren?: (node: CascadeSelectItem) => Promise<Array<CascadeSelectItem>>;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    modelValue: undefined,
    expandedKeys: () => [],
    multiple: false,
    selectable: true,
    expandOnClick: true,
    disabled: false,
    readonly: false,
    loading: false,
    loadingText: undefined,
    loadingBranchText: ' (loading...)',
    emptyText: undefined,
    placeholder: '',
    searchPlaceholder: undefined,
    filter: true,
    clearable: false,
    variant: 'filled',
    size: 'normal',
    autoLoadOnExpand: true,
    loadChildren: undefined,
});

const emit = defineEmits([
    'update:modelValue',
    'change',
    'update:expandedKeys',
    'toggle',
    'nodeClick',
    'search',
    'focus',
    'blur',
    'branchLoadStart',
    'branchLoad',
    'branchLoadError',
]);

const localItems = ref<Array<CascadeSelectItem>>([]);
const loadingBranchKeys = ref<Array<TreeValue>>([]);
const loadedBranchKeys = ref<Array<TreeValue>>([]);

const cloneItems = (items: Array<CascadeSelectItem>) => JSON.parse(JSON.stringify(items)) as Array<CascadeSelectItem>;

watch(
    () => props.items,
    value => {
        localItems.value = cloneItems(value);
    },
    { deep: true, immediate: true },
);

const isBranchLoading = (key: TreeValue) => loadingBranchKeys.value.includes(key);
const isBranchLoaded = (key: TreeValue) => loadedBranchKeys.value.includes(key);

const findNode = (items: Array<CascadeSelectItem>, key: TreeValue): CascadeSelectItem | null => {
    for (const item of items) {
        if (item.key === key) {
            return item;
        }

        if (item.children?.length) {
            const nested = findNode(item.children, key);

            if (nested) {
                return nested;
            }
        }
    }

    return null;
};

const replaceChildrenByKey = (
    items: Array<CascadeSelectItem>,
    key: TreeValue,
    children: Array<CascadeSelectItem>,
): Array<CascadeSelectItem> =>
    items.map((item): CascadeSelectItem => {
        if (item.key === key) {
            return {
                ...item,
                hasChildren: children.length > 0,
                children,
            };
        }

        if (item.children?.length) {
            return {
                ...item,
                children: replaceChildrenByKey(item.children, key, children),
            };
        }

        return item;
    });

const onExpandedKeysUpdate = (keys: Array<TreeValue>) => {
    emit('update:expandedKeys', keys);
};

const onToggle = async (key: TreeValue, expanded: boolean, node: CascadeSelectItem, event: Event) => {
    emit('toggle', key, expanded, node, event);

    if (!expanded || !props.autoLoadOnExpand || !props.loadChildren || props.readonly || props.disabled) {
        return;
    }

    const localNode = findNode(localItems.value, key) || node;
    const needsLoad = Boolean(localNode?.hasChildren) && !(localNode?.children && localNode.children.length);

    if (!needsLoad || isBranchLoading(key) || isBranchLoaded(key)) {
        return;
    }

    loadingBranchKeys.value = [...loadingBranchKeys.value, key];
    emit('branchLoadStart', localNode);

    try {
        const children = await props.loadChildren(localNode);
        const nextChildren = cloneItems(children || []);

        localItems.value = replaceChildrenByKey(localItems.value, key, nextChildren);
        loadedBranchKeys.value = [...loadedBranchKeys.value, key];

        emit('branchLoad', localNode, nextChildren);
    } catch (error) {
        emit('branchLoadError', localNode, error);
    } finally {
        loadingBranchKeys.value = loadingBranchKeys.value.filter(value => value !== key);
    }
};
</script>

<style lang="scss">
.vf-cascadeselect__loading-suffix {
    color: var(--vf-secondary-text-color);
    font-size: 0.875em;
}
</style>
