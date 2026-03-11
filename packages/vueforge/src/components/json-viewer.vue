<template>
    <section class="vf-json-viewer" :aria-label="ariaLabel">
        <header v-if="showToolbar" class="vf-json-viewer__toolbar">
            <div class="vf-json-viewer__toolbar-group">
                <button type="button" class="vf-json-viewer__toolbar-btn" :disabled="disabled" @click="expandAll">
                    {{ expandAllLabel }}
                </button>
                <button type="button" class="vf-json-viewer__toolbar-btn" :disabled="disabled" @click="collapseAll">
                    {{ collapseAllLabel }}
                </button>
            </div>
            <button
                v-if="copyable"
                type="button"
                class="vf-json-viewer__toolbar-btn"
                :disabled="disabled"
                @click="copyJson"
            >
                {{ copyJsonLabel }}
            </button>
        </header>

        <p v-if="rows.length === 0" class="vf-json-viewer__empty">{{ emptyText }}</p>

        <ul v-else class="vf-json-viewer__tree" role="tree">
            <li
                v-for="row in rows"
                :key="row.id"
                class="vf-json-viewer__row"
                role="treeitem"
                :aria-level="row.depth + 1"
                :aria-expanded="row.hasChildren ? row.expanded : undefined"
                :style="{ paddingInlineStart: `calc(var(--vf-json-viewer-indent-size) * ${row.depth})` }"
            >
                <button
                    v-if="row.hasChildren"
                    type="button"
                    class="vf-json-viewer__toggle"
                    :disabled="disabled"
                    :aria-label="row.expanded ? collapseLabel : expandLabel"
                    @click="toggleRow(row.path)"
                >
                    {{ row.expanded ? '−' : '+' }}
                </button>
                <span v-else class="vf-json-viewer__toggle-spacer" aria-hidden="true" />

                <span v-if="row.showKey" class="vf-json-viewer__key">"{{ row.key }}"</span>
                <span v-if="row.showKey" class="vf-json-viewer__punctuation">: </span>

                <template v-if="row.kind === 'object'">
                    <span class="vf-json-viewer__punctuation">{</span>
                    <span class="vf-json-viewer__meta">{{ row.childCount }} keys</span>
                    <span class="vf-json-viewer__punctuation">}</span>
                </template>
                <template v-else-if="row.kind === 'array'">
                    <span class="vf-json-viewer__punctuation">[</span>
                    <span class="vf-json-viewer__meta">{{ row.childCount }} items</span>
                    <span class="vf-json-viewer__punctuation">]</span>
                </template>
                <template v-else-if="row.kind === 'string'">
                    <span class="vf-json-viewer__string">"{{ row.value }}"</span>
                </template>
                <template v-else-if="row.kind === 'number'">
                    <span class="vf-json-viewer__number">{{ row.value }}</span>
                </template>
                <template v-else-if="row.kind === 'boolean'">
                    <span class="vf-json-viewer__boolean">{{ row.value ? 'true' : 'false' }}</span>
                </template>
                <template v-else-if="row.kind === 'null'">
                    <span class="vf-json-viewer__null">null</span>
                </template>
                <template v-else>
                    <span class="vf-json-viewer__null">undefined</span>
                </template>

                <button
                    v-if="copyable"
                    type="button"
                    class="vf-json-viewer__copy"
                    :disabled="disabled"
                    @click="copyPath(row.path)"
                >
                    {{ copyPathLabel }}
                </button>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type JsonKind = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'undefined';

interface JsonViewerRow {
    id: string;
    path: string;
    depth: number;
    key: string;
    showKey: boolean;
    kind: JsonKind;
    hasChildren: boolean;
    expanded: boolean;
    childCount: number;
    value: unknown;
}

interface Props {
    value?: unknown;
    expandedDepth?: number;
    sortKeys?: boolean;
    showRoot?: boolean;
    copyable?: boolean;
    showToolbar?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    emptyText?: string;
    expandLabel?: string;
    collapseLabel?: string;
    expandAllLabel?: string;
    collapseAllLabel?: string;
    copyPathLabel?: string;
    copyJsonLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    expandedDepth: 1,
    sortKeys: true,
    showRoot: true,
    copyable: true,
    showToolbar: true,
    disabled: false,
    ariaLabel: 'JSON viewer',
    emptyText: 'No JSON data.',
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
    expandAllLabel: 'Expand all',
    collapseAllLabel: 'Collapse all',
    copyPathLabel: 'Copy path',
    copyJsonLabel: 'Copy JSON',
});

const emits = defineEmits<{
    (event: 'toggle', payload: { path: string; expanded: boolean }): void;
    (event: 'copyPath', payload: { path: string }): void;
    (event: 'copy', payload: { text: string }): void;
}>();

const expandedPaths = ref<Set<string>>(new Set<string>());

const isObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

const isArray = (value: unknown): value is Array<unknown> => Array.isArray(value);

const getKind = (value: unknown): JsonKind => {
    if (value === null) {
        return 'null';
    }
    if (value === undefined) {
        return 'undefined';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    if (typeof value === 'object') {
        return 'object';
    }
    if (typeof value === 'string') {
        return 'string';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }

    return 'string';
};

const appendPath = (base: string, key: string, arrayIndex: boolean) => {
    if (arrayIndex) {
        return `${base}[${key}]`;
    }

    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
        return `${base}.${key}`;
    }

    return `${base}[${JSON.stringify(key)}]`;
};

const getEntries = (value: unknown): Array<[string, unknown]> => {
    if (isArray(value)) {
        return value.map((item, index) => [String(index), item]);
    }
    if (isObject(value)) {
        const entries = Object.entries(value);
        if (!props.sortKeys) {
            return entries;
        }

        return entries.sort(([left], [right]) => left.localeCompare(right));
    }

    return [];
};

const collectExpandablePaths = (value: unknown, path: string, depth: number, target: Set<string>) => {
    const kind = getKind(value);
    if (kind !== 'object' && kind !== 'array') {
        return;
    }

    target.add(path);
    getEntries(value).forEach(([key, child]) => {
        collectExpandablePaths(child, appendPath(path, key, kind === 'array'), depth + 1, target);
    });
};

const collectDefaultExpanded = (value: unknown, path: string, depth: number, target: Set<string>) => {
    const kind = getKind(value);
    if ((kind !== 'object' && kind !== 'array') || depth >= props.expandedDepth) {
        return;
    }

    target.add(path);
    getEntries(value).forEach(([key, child]) => {
        collectDefaultExpanded(child, appendPath(path, key, kind === 'array'), depth + 1, target);
    });
};

const allContainerPaths = computed(() => {
    const paths = new Set<string>();
    collectExpandablePaths(props.value, '$', 0, paths);
    return paths;
});

const buildRows = (
    value: unknown,
    path: string,
    key: string,
    depth: number,
    showKey: boolean,
    rows: Array<JsonViewerRow>,
) => {
    const kind = getKind(value);
    const children = getEntries(value);
    const hasChildren = kind === 'object' || kind === 'array';
    const expanded = hasChildren && expandedPaths.value.has(path);

    rows.push({
        id: path,
        path,
        depth,
        key,
        showKey,
        kind,
        hasChildren,
        expanded,
        childCount: children.length,
        value,
    });

    if (!hasChildren || !expanded) {
        return;
    }

    children.forEach(([childKey, childValue]) => {
        buildRows(childValue, appendPath(path, childKey, kind === 'array'), childKey, depth + 1, true, rows);
    });
};

const rows = computed(() => {
    if (props.value === undefined) {
        return [];
    }

    const list: Array<JsonViewerRow> = [];
    if (props.showRoot) {
        buildRows(props.value, '$', '$', 0, true, list);
        return list;
    }

    const rootKind = getKind(props.value);
    if (rootKind === 'object' || rootKind === 'array') {
        getEntries(props.value).forEach(([key, child]) => {
            buildRows(child, appendPath('$', key, rootKind === 'array'), key, 0, true, list);
        });
        return list;
    }

    buildRows(props.value, '$', '$', 0, false, list);
    return list;
});

const resetExpanded = () => {
    const next = new Set<string>();
    collectDefaultExpanded(props.value, '$', 0, next);
    expandedPaths.value = next;
};

watch(
    () => [props.value, props.expandedDepth, props.showRoot, props.sortKeys],
    () => {
        resetExpanded();
    },
    { immediate: true, deep: true },
);

const toggleRow = (path: string) => {
    if (props.disabled) {
        return;
    }

    const next = new Set(expandedPaths.value);
    if (next.has(path)) {
        next.delete(path);
        expandedPaths.value = next;
        emits('toggle', { path, expanded: false });
        return;
    }

    next.add(path);
    expandedPaths.value = next;
    emits('toggle', { path, expanded: true });
};

const copyText = async (text: string) => {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        }
    } finally {
        emits('copy', { text });
    }
};

const copyPath = async (path: string) => {
    if (props.disabled) {
        return;
    }

    await copyText(path);
    emits('copyPath', { path });
};

const copyJson = async () => {
    if (props.disabled) {
        return;
    }

    const text = JSON.stringify(props.value, null, 2) ?? 'undefined';
    await copyText(text);
};

const expandAll = () => {
    if (props.disabled) {
        return;
    }

    expandedPaths.value = new Set(allContainerPaths.value);
};

const collapseAll = () => {
    if (props.disabled) {
        return;
    }

    expandedPaths.value = props.showRoot ? new Set(['$']) : new Set<string>();
};
</script>

<style lang="scss">
.vf-json-viewer {
    display: grid;
    gap: var(--vf-json-viewer-gap);
    border: var(--vf-border-width) solid var(--vf-json-viewer-border-color);
    border-radius: var(--vf-json-viewer-border-radius);
    background-color: var(--vf-json-viewer-background-color);
    color: var(--vf-json-viewer-text-color);
    padding: var(--vf-json-viewer-padding);
    font-family: var(--vf-json-viewer-font-family);
    font-size: var(--vf-json-viewer-font-size);
    line-height: var(--vf-json-viewer-line-height);
}

.vf-json-viewer__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-json-viewer-toolbar-gap);
}

.vf-json-viewer__toolbar-group {
    display: inline-flex;
    gap: var(--vf-json-viewer-toolbar-group-gap);
}

.vf-json-viewer__toolbar-btn,
.vf-json-viewer__copy,
.vf-json-viewer__toggle {
    border: var(--vf-border-width) solid var(--vf-json-viewer-control-border-color);
    border-radius: var(--vf-json-viewer-control-border-radius);
    background: var(--vf-json-viewer-control-background-color);
    color: var(--vf-json-viewer-control-text-color);
    font-size: var(--vf-json-viewer-control-font-size);
}

.vf-json-viewer__toolbar-btn,
.vf-json-viewer__copy {
    padding: var(--vf-json-viewer-control-padding);
}

.vf-json-viewer__toggle {
    width: var(--vf-json-viewer-toggle-size);
    height: var(--vf-json-viewer-toggle-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.vf-json-viewer__tree {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-json-viewer-row-gap);
}

.vf-json-viewer__row {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-json-viewer-cell-gap);
    min-height: var(--vf-json-viewer-row-min-height);
}

.vf-json-viewer__toggle-spacer {
    width: var(--vf-json-viewer-toggle-size);
    height: var(--vf-json-viewer-toggle-size);
}

.vf-json-viewer__key {
    color: var(--vf-json-viewer-key-color);
}

.vf-json-viewer__punctuation {
    color: var(--vf-json-viewer-punctuation-color);
}

.vf-json-viewer__meta {
    color: var(--vf-json-viewer-meta-color);
}

.vf-json-viewer__string {
    color: var(--vf-json-viewer-string-color);
}

.vf-json-viewer__number {
    color: var(--vf-json-viewer-number-color);
}

.vf-json-viewer__boolean {
    color: var(--vf-json-viewer-boolean-color);
}

.vf-json-viewer__null {
    color: var(--vf-json-viewer-null-color);
}

.vf-json-viewer__copy {
    margin-left: auto;
}

.vf-json-viewer__empty {
    margin: 0;
    color: var(--vf-json-viewer-empty-color);
}
</style>
