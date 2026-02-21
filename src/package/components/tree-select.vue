<template>
    <div ref="root" :class="getClass">
        <button
            ref="trigger"
            class="vf-treeselect__control"
            type="button"
            :disabled="disabled"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="tree"
            @click="togglePanel"
            @keydown.down.prevent="openPanel"
            @keydown.enter.prevent="togglePanel"
            @keydown.esc.prevent="close"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-treeselect__label" :class="{ 'vf-treeselect__label_placeholder': !displayLabel }">
                {{ displayLabel || placeholder }}
            </span>
            <span class="vf-treeselect__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <button
            v-if="clearable && hasValue && !disabled && !readonly"
            class="vf-treeselect__clear"
            type="button"
            aria-label="Clear selection"
            @click.stop="clearSelection"
        >
            &#10005;
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-treeselect__panel"
                :data-placement="currentPlacement"
            >
                <div v-if="filter" class="vf-treeselect__search">
                    <input
                        ref="searchInput"
                        class="vf-treeselect__search-control"
                        type="text"
                        :value="query"
                        :placeholder="searchPlaceholder"
                        :readonly="readonly"
                        @input="onSearchInput"
                        @keydown.esc.prevent="close"
                    />
                </div>
                <div v-if="loading" class="vf-treeselect__loading">{{ loadingText }}</div>
                <Tree
                    v-else-if="filteredItems.length > 0"
                    class="vf-treeselect__tree"
                    :items="filteredItems"
                    :model-value="modelValue"
                    :expanded-keys="expandedKeys"
                    :multiple="multiple"
                    :selectable="selectable"
                    :expand-on-click="expandOnClick"
                    :disabled="disabled || readonly"
                    :size="size"
                    :variant="variant"
                    @update:model-value="onModelUpdate"
                    @change="onChange"
                    @update:expanded-keys="onExpandedKeysUpdate"
                    @toggle="onToggle"
                    @node-click="onNodeClick"
                >
                    <template #label="slotProps">
                        <slot name="label" v-bind="slotProps" />
                    </template>
                </Tree>
                <div v-else class="vf-treeselect__empty">{{ emptyText }}</div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';
import Tree, { type TreeItem, type TreeValue } from './tree.vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type TreeModelValue = TreeValue | Array<TreeValue> | undefined;

let treeSelectIdCounter = 0;

interface Props {
    items?: Array<TreeItem>;
    modelValue?: TreeModelValue;
    expandedKeys?: Array<TreeValue>;
    multiple?: boolean;
    selectable?: boolean;
    expandOnClick?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    filter?: boolean;
    clearable?: boolean;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits([
    'update:modelValue',
    'change',
    'update:expandedKeys',
    'toggle',
    'nodeClick',
    'search',
    'focus',
    'blur',
]);
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
    loadingText: 'Loading...',
    emptyText: 'No results',
    placeholder: '',
    searchPlaceholder: 'Search...',
    filter: true,
    clearable: false,
    variant: 'filled',
    size: 'normal',
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref('');
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-treeselect-panel-${++treeSelectIdCounter}`;
let floater: FloaterInstance = null;

const toArrayValue = (value: TreeModelValue) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === undefined || value === null) {
        return [];
    }

    return [value];
};

const flattenItems = (items: Array<TreeItem>) => {
    const output: Array<TreeItem> = [];

    const walk = (nodes: Array<TreeItem>) => {
        nodes.forEach(node => {
            output.push(node);

            if (node.children?.length) {
                walk(node.children);
            }
        });
    };

    walk(items);

    return output;
};

const selectedKeys = computed(() => toArrayValue(props.modelValue));
const hasValue = computed(() => selectedKeys.value.length > 0);
const labelMap = computed(() => {
    const map = new Map<TreeValue, string>();

    flattenItems(props.items).forEach(node => {
        map.set(node.key, node.label);
    });

    return map;
});
const displayLabel = computed(() => {
    const labels = selectedKeys.value
        .map(value => labelMap.value.get(value))
        .filter((value): value is string => !!value);

    if (!labels.length) {
        return '';
    }

    if (!props.multiple) {
        return labels[0];
    }

    return labels.join(', ');
});

const matchesLabel = (node: TreeItem, search: string) => node.label.toLowerCase().includes(search);

const filterTree = (nodes: Array<TreeItem>, search: string): Array<TreeItem> => {
    if (!search) {
        return nodes;
    }

    const output: Array<TreeItem> = [];

    nodes.forEach(node => {
        const children = node.children?.length ? filterTree(node.children, search) : [];

        if (matchesLabel(node, search) || children.length) {
            output.push({
                ...node,
                children,
            });
        }
    });

    return output;
};

const filteredItems = computed(() => {
    if (!props.filter) {
        return props.items;
    }

    const search = query.value.trim().toLowerCase();

    if (!search) {
        return props.items;
    }

    return filterTree(props.items, search);
});

const getClass = computed(() => {
    const classes = ['vf-treeselect', `vf-treeselect_${props.variant}`, open.value ? 'vf-treeselect_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-treeselect_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-treeselect_disabled');
    }

    return classes.filter(Boolean);
});

const close = () => {
    open.value = false;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
    query.value = '';
};

const openPanel = async () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';

    if (props.filter) {
        await nextTick();

        searchInput.value?.focus();
    }
};

const togglePanel = () => {
    if (open.value) {
        close();

        return;
    }

    void openPanel();
};

const onModelUpdate = (next: TreeModelValue) => {
    if (props.readonly) {
        return;
    }

    emits('update:modelValue', next);

    if (!props.multiple) {
        close();
    }
};

const onChange = (value: TreeModelValue, node: TreeItem, event: Event) => {
    if (props.readonly) {
        return;
    }

    emits('change', value, node, event);
};

const onExpandedKeysUpdate = (next: Array<TreeValue>) => {
    emits('update:expandedKeys', next);
};

const onToggle = (key: TreeValue, expanded: boolean, node: TreeItem, event: Event) => {
    emits('toggle', key, expanded, node, event);
};

const onNodeClick = (node: TreeItem, event: Event) => {
    emits('nodeClick', node, event);
};

const clearSelection = () => {
    if (props.readonly) {
        return;
    }

    const nextValue = props.multiple ? [] : undefined;

    emits('update:modelValue', nextValue);
    emits('change', nextValue);
};

const onSearchInput = (event: Event) => {
    if (props.readonly) {
        return;
    }

    const target = event.target as HTMLInputElement;

    query.value = target.value;

    emits('search', target.value);
};

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    const target = event.target as Node;

    if (root.value.contains(target) || panel.value?.contains(target)) {
        return;
    }

    close();
};

const mountFloater = () => {
    if (!trigger.value || !panel.value) {
        return;
    }

    const reference = trigger.value;
    const floating = panel.value;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offset(2), flip({ placements: ['bottom', 'top'] })],
        });

        currentPlacement.value = (resolvedPlacement as 'bottom' | 'top') ?? basePlacement.value;
        floating.style.minWidth = `${reference.getBoundingClientRect().width}px`;
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };

    const update = async () => {
        await applyPosition();
    };

    const cleanup = autoUpdate(reference, () => {
        void update();
    });

    const onScrollOrResize = () => {
        void update();
    };

    document.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, false);

    floater = {
        update,
        destroy: () => {
            cleanup();
            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize, false);
        },
    };

    void floater.update();
};

watch(open, async value => {
    if (!value) {
        if (floater) {
            floater.destroy();
            floater = null;
        }

        return;
    }

    await nextTick();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});

watch(
    () => [props.items, query.value, props.expandedKeys],
    () => {
        void floater?.update();
    },
    { deep: true },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    floater?.destroy();
    floater = null;
});
</script>

<style lang="scss">
.vf-treeselect {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: var(--vf-treeselect-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-treeselect-border-radius);
    border: var(--vf-border-width) solid var(--vf-treeselect-border-color);
    background-color: var(--vf-treeselect-background-color);
    color: var(--vf-treeselect-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-treeselect_outlined {
    background-color: transparent;
}

.vf-treeselect__control {
    width: 100%;
    min-width: 0;
    flex: 1 1 0%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-treeselect-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-treeselect-control-gap);
    padding: var(--vf-treeselect-padding);
    cursor: pointer;
}

.vf-treeselect__label {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vf-treeselect__label_placeholder {
    color: var(--vf-treeselect-placeholder-color);
}

.vf-treeselect__chevron {
    flex: 0 0 auto;
    font-size: var(--vf-treeselect-chevron-size);
    opacity: 0.7;
}

.vf-treeselect__clear {
    flex: 0 0 auto;
    width: var(--vf-treeselect-clear-size);
    height: var(--vf-treeselect-clear-size);
    margin-right: 0.35rem;
    padding: 0;
    border: none;
    border-radius: var(--vf-treeselect-clear-radius);
    background: transparent;
    color: inherit;
    font-size: 0.75rem;
    cursor: pointer;
}

.vf-treeselect__clear:hover {
    background-color: var(--vf-treeselect-clear-hover-background-color);
}

.vf-treeselect__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-treeselect-panel-padding);
    max-height: var(--vf-treeselect-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-treeselect-border-radius) + var(--vf-treeselect-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-treeselect-panel-border-color);
    background-color: var(--vf-treeselect-panel-background-color);
    box-shadow: var(--vf-treeselect-panel-shadow);
    color: var(--vf-treeselect-text-color);
}

.vf-treeselect__search {
    padding: var(--vf-treeselect-search-padding);
}

.vf-treeselect__search-control {
    width: 100%;
    border-radius: var(--vf-treeselect-search-border-radius);
    border: var(--vf-border-width) solid var(--vf-treeselect-search-border-color);
    background: transparent;
    color: inherit;
    padding: 0.35rem 0.45rem;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
}

.vf-treeselect__search-control:focus {
    border-color: var(--vf-treeselect-focus-border-color);
}

.vf-treeselect__tree {
    width: 100%;
}

.vf-treeselect__empty {
    padding: var(--vf-treeselect-empty-padding);
    color: var(--vf-treeselect-empty-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-treeselect__loading {
    padding: var(--vf-treeselect-loading-padding);
    color: var(--vf-treeselect-loading-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-treeselect_open {
    border-color: var(--vf-treeselect-focus-border-color);
    box-shadow: var(--vf-treeselect-focus-ring-shadow);
}

.vf-treeselect:hover:not(.vf-treeselect_disabled) {
    border-color: var(--vf-treeselect-hover-border-color);
}

.vf-treeselect:focus-within:not(.vf-treeselect_disabled) {
    border-color: var(--vf-treeselect-focus-border-color);
}

.vf-treeselect_small {
    .vf-treeselect__control {
        padding: var(--vf-treeselect-small-padding);
        font-size: var(--vf-treeselect-small-font-size);
    }
}

.vf-treeselect_large {
    .vf-treeselect__control {
        padding: var(--vf-treeselect-large-padding);
        font-size: var(--vf-treeselect-large-font-size);
    }
}

.vf-treeselect_disabled {
    opacity: var(--vf-treeselect-disabled-opacity);
    cursor: not-allowed;

    .vf-treeselect__control {
        cursor: not-allowed;
    }
}
</style>
