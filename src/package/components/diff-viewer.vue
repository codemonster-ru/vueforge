<template>
    <section class="vf-diff-viewer" :aria-label="ariaLabel">
        <header v-if="showToolbar" class="vf-diff-viewer__toolbar">
            <div class="vf-diff-viewer__toolbar-group" role="group" aria-label="Diff mode">
                <button
                    type="button"
                    class="vf-diff-viewer__toolbar-btn"
                    :class="{ 'vf-diff-viewer__toolbar-btn_active': currentMode === 'inline' }"
                    :disabled="disabled"
                    :aria-pressed="currentMode === 'inline'"
                    @click="setMode('inline')"
                >
                    {{ inlineLabel }}
                </button>
                <button
                    type="button"
                    class="vf-diff-viewer__toolbar-btn"
                    :class="{ 'vf-diff-viewer__toolbar-btn_active': currentMode === 'split' }"
                    :disabled="disabled"
                    :aria-pressed="currentMode === 'split'"
                    @click="setMode('split')"
                >
                    {{ splitLabel }}
                </button>
            </div>
            <button
                v-if="copyable"
                type="button"
                class="vf-diff-viewer__toolbar-btn"
                :disabled="disabled"
                @click="copyDiff"
            >
                {{ copyLabel }}
            </button>
        </header>

        <p v-if="!rows.length" class="vf-diff-viewer__empty">{{ emptyText }}</p>

        <table v-else-if="currentMode === 'split'" class="vf-diff-viewer__table" role="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{{ beforeLabel }}</th>
                    <th>{{ afterLabel }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.index" class="vf-diff-viewer__row" :data-state="row.state">
                    <td class="vf-diff-viewer__line">{{ row.index + 1 }}</td>
                    <td>
                        <pre>{{ row.beforeLine }}</pre>
                    </td>
                    <td>
                        <pre>{{ row.afterLine }}</pre>
                    </td>
                </tr>
            </tbody>
        </table>

        <ul v-else class="vf-diff-viewer__inline" role="list">
            <li v-for="row in rows" :key="row.index" class="vf-diff-viewer__row" :data-state="row.state">
                <span class="vf-diff-viewer__line">{{ row.index + 1 }}</span>
                <span class="vf-diff-viewer__marker">{{ row.marker }}</span>
                <pre class="vf-diff-viewer__content">{{ row.displayLine }}</pre>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type DiffMode = 'inline' | 'split';
type DiffFormat = 'auto' | 'text' | 'json';
type RowState = 'same' | 'added' | 'removed' | 'changed';

interface DiffRow {
    index: number;
    beforeLine: string;
    afterLine: string;
    displayLine: string;
    marker: string;
    state: RowState;
}

interface Props {
    before?: unknown;
    after?: unknown;
    mode?: DiffMode;
    format?: DiffFormat;
    showToolbar?: boolean;
    copyable?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    emptyText?: string;
    inlineLabel?: string;
    splitLabel?: string;
    beforeLabel?: string;
    afterLabel?: string;
    copyLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    before: undefined,
    after: undefined,
    mode: 'inline',
    format: 'auto',
    showToolbar: true,
    copyable: true,
    disabled: false,
    ariaLabel: 'Diff viewer',
    emptyText: 'No diff data.',
    inlineLabel: 'Inline',
    splitLabel: 'Split',
    beforeLabel: 'Before',
    afterLabel: 'After',
    copyLabel: 'Copy diff',
});

const emits = defineEmits<{
    (event: 'update:mode', value: DiffMode): void;
    (event: 'copy', payload: { text: string }): void;
}>();

const currentMode = ref<DiffMode>(props.mode);

watch(
    () => props.mode,
    value => {
        currentMode.value = value;
    },
);

const setMode = (mode: DiffMode) => {
    if (props.disabled || currentMode.value === mode) {
        return;
    }

    currentMode.value = mode;
    emits('update:mode', mode);
};

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

const normalizeJsonValue = (value: unknown) => {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return formatJson(parsed);
        } catch {
            return value;
        }
    }

    const formatted = formatJson(value);
    return formatted ?? 'undefined';
};

const normalizeTextValue = (value: unknown) => {
    if (value === undefined) {
        return '';
    }
    if (value === null) {
        return 'null';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    const formatted = formatJson(value);
    return formatted ?? 'undefined';
};

const resolvedFormat = computed<DiffFormat>(() => {
    if (props.format !== 'auto') {
        return props.format;
    }

    if (typeof props.before === 'object' || typeof props.after === 'object') {
        return 'json';
    }

    return 'text';
});

const beforeText = computed(() =>
    resolvedFormat.value === 'json' ? normalizeJsonValue(props.before) : normalizeTextValue(props.before),
);
const afterText = computed(() =>
    resolvedFormat.value === 'json' ? normalizeJsonValue(props.after) : normalizeTextValue(props.after),
);

const beforeLines = computed(() => (beforeText.value ? beforeText.value.split('\n') : []));
const afterLines = computed(() => (afterText.value ? afterText.value.split('\n') : []));

const rows = computed<Array<DiffRow>>(() => {
    const total = Math.max(beforeLines.value.length, afterLines.value.length);
    const list: Array<DiffRow> = [];

    for (let index = 0; index < total; index += 1) {
        const beforeLine = beforeLines.value[index] ?? '';
        const afterLine = afterLines.value[index] ?? '';

        let state: RowState = 'same';
        let marker = ' ';
        let displayLine = beforeLine;

        if (beforeLine === afterLine) {
            state = 'same';
            marker = ' ';
            displayLine = beforeLine;
        } else if (!beforeLine && afterLine) {
            state = 'added';
            marker = '+';
            displayLine = afterLine;
        } else if (beforeLine && !afterLine) {
            state = 'removed';
            marker = '-';
            displayLine = beforeLine;
        } else {
            state = 'changed';
            marker = '~';
            displayLine = `${beforeLine} -> ${afterLine}`;
        }

        list.push({
            index,
            beforeLine,
            afterLine,
            displayLine,
            marker,
            state,
        });
    }

    return list;
});

const copyDiff = async () => {
    if (props.disabled) {
        return;
    }

    const text = rows.value.map(row => `${row.index + 1} ${row.marker} ${row.displayLine}`).join('\n');

    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        }
    } finally {
        emits('copy', { text });
    }
};
</script>

<style lang="scss">
.vf-diff-viewer {
    display: grid;
    gap: var(--vf-diff-viewer-gap);
    border: var(--vf-border-width) solid var(--vf-diff-viewer-border-color);
    border-radius: var(--vf-diff-viewer-border-radius);
    background: var(--vf-diff-viewer-background-color);
    color: var(--vf-diff-viewer-text-color);
    padding: var(--vf-diff-viewer-padding);
    font-family: var(--vf-diff-viewer-font-family);
    font-size: var(--vf-diff-viewer-font-size);
    line-height: var(--vf-diff-viewer-line-height);
}

.vf-diff-viewer__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-diff-viewer-toolbar-gap);
}

.vf-diff-viewer__toolbar-group {
    display: inline-flex;
    gap: var(--vf-diff-viewer-toolbar-group-gap);
}

.vf-diff-viewer__toolbar-btn {
    border: var(--vf-border-width) solid var(--vf-diff-viewer-control-border-color);
    border-radius: var(--vf-diff-viewer-control-border-radius);
    background: var(--vf-diff-viewer-control-background-color);
    color: var(--vf-diff-viewer-control-text-color);
    font-size: var(--vf-diff-viewer-control-font-size);
    padding: var(--vf-diff-viewer-control-padding);
}

.vf-diff-viewer__toolbar-btn_active {
    background: var(--vf-diff-viewer-control-active-background-color);
    border-color: var(--vf-diff-viewer-control-active-border-color);
    color: var(--vf-diff-viewer-control-active-text-color);
}

.vf-diff-viewer__table {
    width: 100%;
    border-collapse: collapse;
}

.vf-diff-viewer__table th,
.vf-diff-viewer__table td {
    border: var(--vf-border-width) solid var(--vf-diff-viewer-divider-color);
    padding: var(--vf-diff-viewer-cell-padding);
    text-align: left;
    vertical-align: top;
}

.vf-diff-viewer__inline {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--vf-diff-viewer-row-gap);
}

.vf-diff-viewer__row {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: start;
    gap: var(--vf-diff-viewer-cell-gap);
    border: var(--vf-border-width) solid var(--vf-diff-viewer-divider-color);
    border-radius: var(--vf-diff-viewer-row-border-radius);
    padding: var(--vf-diff-viewer-cell-padding);
}

.vf-diff-viewer__row[data-state='added'] {
    background: var(--vf-diff-viewer-added-background-color);
}

.vf-diff-viewer__row[data-state='removed'] {
    background: var(--vf-diff-viewer-removed-background-color);
}

.vf-diff-viewer__row[data-state='changed'] {
    background: var(--vf-diff-viewer-changed-background-color);
}

.vf-diff-viewer__line {
    color: var(--vf-diff-viewer-line-color);
    min-width: 2.25rem;
}

.vf-diff-viewer__marker {
    color: var(--vf-diff-viewer-marker-color);
    min-width: 1rem;
}

.vf-diff-viewer pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
}

.vf-diff-viewer__empty {
    margin: 0;
    color: var(--vf-diff-viewer-empty-color);
}
</style>
