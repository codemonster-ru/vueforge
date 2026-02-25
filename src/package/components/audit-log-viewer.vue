<template>
    <section class="vf-audit-log-viewer">
        <table class="vf-audit-log-viewer__table" :aria-label="ariaLabel">
            <thead>
                <tr class="vf-audit-log-viewer__row vf-audit-log-viewer__row_head">
                    <th class="vf-audit-log-viewer__header">Event</th>
                    <th class="vf-audit-log-viewer__header">Actor</th>
                    <th class="vf-audit-log-viewer__header">Entity</th>
                    <th class="vf-audit-log-viewer__header">Time</th>
                    <th class="vf-audit-log-viewer__header">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!entries.length" class="vf-audit-log-viewer__row vf-audit-log-viewer__row_state">
                    <td class="vf-audit-log-viewer__cell vf-audit-log-viewer__cell_state" colspan="5">
                        <slot name="empty">{{ emptyText }}</slot>
                    </td>
                </tr>
                <tr
                    v-for="(entry, index) in entries"
                    v-else
                    :key="getEntryKey(entry, index)"
                    class="vf-audit-log-viewer__row"
                >
                    <td class="vf-audit-log-viewer__cell">
                        <span class="vf-audit-log-viewer__event">{{ entry.event }}</span>
                        <p v-if="entry.summary" class="vf-audit-log-viewer__summary">{{ entry.summary }}</p>
                    </td>
                    <td class="vf-audit-log-viewer__cell">
                        <span>{{ entry.actor?.name ?? '-' }}</span>
                        <span v-if="entry.actor?.meta" class="vf-audit-log-viewer__meta">{{ entry.actor.meta }}</span>
                    </td>
                    <td class="vf-audit-log-viewer__cell">{{ entry.entity ?? '-' }}</td>
                    <td class="vf-audit-log-viewer__cell">{{ getTimestampLabel(entry.timestamp) }}</td>
                    <td class="vf-audit-log-viewer__cell">
                        <button type="button" class="vf-audit-log-viewer__open" @click="openEntry(entry, index)">
                            {{ detailsLabel }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <Drawer
            :model-value="isDrawerOpen"
            :title="drawerTitle"
            size="lg"
            position="right"
            @update:model-value="onDrawerVisibilityChange"
        >
            <template #body>
                <div v-if="activeEntry" class="vf-audit-log-viewer__details">
                    <dl class="vf-audit-log-viewer__meta-grid">
                        <div class="vf-audit-log-viewer__meta-row">
                            <dt>Event</dt>
                            <dd>{{ activeEntry.event }}</dd>
                        </div>
                        <div class="vf-audit-log-viewer__meta-row">
                            <dt>Actor</dt>
                            <dd>{{ activeEntry.actor?.name ?? '-' }}</dd>
                        </div>
                        <div class="vf-audit-log-viewer__meta-row">
                            <dt>Entity</dt>
                            <dd>{{ activeEntry.entity ?? '-' }}</dd>
                        </div>
                        <div class="vf-audit-log-viewer__meta-row">
                            <dt>Timestamp</dt>
                            <dd>{{ getTimestampLabel(activeEntry.timestamp) }}</dd>
                        </div>
                    </dl>

                    <section v-if="showDiff && hasDiff" class="vf-audit-log-viewer__diff" aria-label="Payload diff">
                        <h4 class="vf-audit-log-viewer__section-title">Payload diff</h4>
                        <table class="vf-audit-log-viewer__diff-table">
                            <thead>
                                <tr>
                                    <th>Field</th>
                                    <th>Before</th>
                                    <th>After</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in diffRows" :key="row.field">
                                    <td>{{ row.field }}</td>
                                    <td>
                                        <pre>{{ row.before }}</pre>
                                    </td>
                                    <td>
                                        <pre>{{ row.after }}</pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section v-if="showPayloadSection" class="vf-audit-log-viewer__payload" aria-label="Payload">
                        <h4 class="vf-audit-log-viewer__section-title">Payload</h4>
                        <pre>{{ payloadLabel }}</pre>
                    </section>
                </div>
            </template>
        </Drawer>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Drawer from '@/package/components/drawer.vue';

type DateLike = string | number | Date;

export interface AuditLogActor {
    id?: string | number;
    name: string;
    meta?: string;
}

export interface AuditLogEntry {
    id?: string | number;
    event: string;
    summary?: string;
    actor?: AuditLogActor;
    entity?: string;
    timestamp?: DateLike;
    payload?: unknown;
    previousPayload?: unknown;
}

interface Props {
    entries?: Array<AuditLogEntry>;
    drawerTitle?: string;
    emptyText?: string;
    detailsLabel?: string;
    ariaLabel?: string;
    showDiff?: boolean;
    locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
    entries: () => [],
    drawerTitle: 'Audit details',
    emptyText: 'No audit records.',
    detailsLabel: 'View',
    ariaLabel: 'Audit log',
    showDiff: true,
    locale: 'en',
});

const emits = defineEmits<{
    (event: 'select', payload: { entry: AuditLogEntry; index: number }): void;
    (event: 'openDetails', payload: { entry: AuditLogEntry; index: number }): void;
    (event: 'closeDetails'): void;
}>();

const activeEntry = ref<AuditLogEntry | null>(null);

const isDrawerOpen = computed(() => !!activeEntry.value);

const resolveDate = (value?: DateLike) => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

const getTimestampLabel = (value?: DateLike) => {
    const date = resolveDate(value);

    if (!date) {
        return '-';
    }

    return date.toLocaleString(props.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const getEntryKey = (entry: AuditLogEntry, index: number) => `${String(entry.id ?? entry.event)}_${index.toString()}`;

const stringifyValue = (value: unknown) => {
    if (value === undefined) {
        return '-';
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

    return JSON.stringify(value, null, 2);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const hasDiff = computed(() => {
    if (!activeEntry.value) {
        return false;
    }

    return activeEntry.value.previousPayload !== undefined || activeEntry.value.payload !== undefined;
});

const diffRows = computed(() => {
    if (!activeEntry.value) {
        return [];
    }

    const previous = activeEntry.value.previousPayload;
    const current = activeEntry.value.payload;

    if (!isRecord(previous) || !isRecord(current)) {
        return [
            {
                field: 'payload',
                before: stringifyValue(previous),
                after: stringifyValue(current),
            },
        ];
    }

    const fields = Array.from(new Set([...Object.keys(previous), ...Object.keys(current)]));

    return fields.map(field => ({
        field,
        before: stringifyValue(previous[field]),
        after: stringifyValue(current[field]),
    }));
});

const payloadLabel = computed(() => {
    if (!activeEntry.value) {
        return '-';
    }

    return stringifyValue(activeEntry.value.payload);
});

const showPayloadSection = computed(() => !!activeEntry.value && !props.showDiff);

const closeDetails = () => {
    activeEntry.value = null;
    emits('closeDetails');
};

const openEntry = (entry: AuditLogEntry, index: number) => {
    activeEntry.value = entry;
    emits('select', { entry, index });
    emits('openDetails', { entry, index });
};

const onDrawerVisibilityChange = (value: boolean) => {
    if (value) {
        return;
    }

    closeDetails();
};
</script>

<style lang="scss">
.vf-audit-log-viewer {
    border: var(--vf-border-width) solid var(--vf-audit-log-viewer-border-color);
    border-radius: var(--vf-audit-log-viewer-border-radius);
    background-color: var(--vf-audit-log-viewer-background-color);
    color: var(--vf-audit-log-viewer-text-color);
    overflow: hidden;
}

.vf-audit-log-viewer__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--vf-audit-log-viewer-font-size);
}

.vf-audit-log-viewer__header,
.vf-audit-log-viewer__cell {
    padding: var(--vf-audit-log-viewer-cell-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-audit-log-viewer-divider-color);
    text-align: left;
    vertical-align: top;
}

.vf-audit-log-viewer__row_head {
    background-color: var(--vf-audit-log-viewer-header-background-color);
}

.vf-audit-log-viewer__event {
    display: block;
    font-weight: var(--vf-audit-log-viewer-event-font-weight);
}

.vf-audit-log-viewer__summary,
.vf-audit-log-viewer__meta {
    margin: 0.25rem 0 0;
    color: var(--vf-audit-log-viewer-meta-color);
    font-size: var(--vf-audit-log-viewer-meta-font-size);
}

.vf-audit-log-viewer__open {
    border: none;
    background: transparent;
    color: var(--vf-audit-log-viewer-action-color);
    cursor: pointer;
    font-size: var(--vf-audit-log-viewer-action-font-size);
}

.vf-audit-log-viewer__cell_state {
    text-align: center;
    color: var(--vf-audit-log-viewer-meta-color);
}

.vf-audit-log-viewer__details {
    display: grid;
    gap: var(--vf-audit-log-viewer-details-gap);
}

.vf-audit-log-viewer__meta-grid {
    margin: 0;
    display: grid;
    gap: 0.35rem;
}

.vf-audit-log-viewer__meta-row {
    display: grid;
    gap: 0.2rem;
}

.vf-audit-log-viewer__meta-row dt {
    font-size: var(--vf-audit-log-viewer-meta-font-size);
    color: var(--vf-audit-log-viewer-meta-color);
}

.vf-audit-log-viewer__meta-row dd {
    margin: 0;
}

.vf-audit-log-viewer__section-title {
    margin: 0 0 0.5rem;
    font-size: var(--vf-audit-log-viewer-section-title-font-size);
}

.vf-audit-log-viewer__diff-table {
    width: 100%;
    border-collapse: collapse;
}

.vf-audit-log-viewer__diff-table th,
.vf-audit-log-viewer__diff-table td {
    padding: 0.5rem;
    border: var(--vf-border-width) solid var(--vf-audit-log-viewer-divider-color);
    text-align: left;
    vertical-align: top;
}

.vf-audit-log-viewer pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--vf-audit-log-viewer-mono-font-family);
    font-size: var(--vf-audit-log-viewer-mono-font-size);
}

@media (max-width: 768px) {
    .vf-audit-log-viewer {
        overflow-x: auto;
    }

    .vf-audit-log-viewer__table {
        min-width: 42rem;
    }
}
</style>
