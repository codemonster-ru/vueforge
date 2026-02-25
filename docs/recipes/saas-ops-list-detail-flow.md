# SaaS Recipe: Ops List + Detail Flow

## Goal

Build a production-style SaaS operations page with:

- list workspace (filters, table, quick actions),
- detail timeline/comments panel,
- locale/timezone-safe timestamps.

## Example

```vue
<script setup lang="ts">
import {
    ActivityFeed,
    AuditLogViewer,
    BulkActionBar,
    CommentThread,
    DataTable,
    DataTableToolbar,
    NotificationCenter,
    SavedViewsManager,
    type ActivityFeedItem,
    type AuditLogEntry,
    type CommentThreadItem,
    type DataTableColumn,
    type SavedViewItem,
} from '@codemonster-ru/vueforge';
import { computed, ref } from 'vue';

const locale = ref('en-US');
const timeZone = ref('UTC');

const selectedIds = ref<Array<string>>([]);
const search = ref('');
const loading = ref(false);

const columns: Array<DataTableColumn<Record<string, unknown>>> = [
    { key: 'service', title: 'Service', sortable: true },
    { key: 'owner', title: 'Owner', sortable: true },
    { key: 'status', title: 'Status' },
    { key: 'updatedAt', title: 'Updated', sortable: true },
];

const rows = ref([
    {
        id: 'svc-auth',
        service: 'auth-service',
        owner: 'Platform',
        status: 'Healthy',
        updatedAt: '2026-02-25T12:00:00.000Z',
    },
    {
        id: 'svc-billing',
        service: 'billing-service',
        owner: 'Payments',
        status: 'Degraded',
        updatedAt: '2026-02-25T12:20:00.000Z',
    },
]);

const savedViews = ref<Array<SavedViewItem>>([
    { id: 'default', label: 'Default', shared: true, isDefault: true },
    { id: 'degraded', label: 'Degraded only', shared: false },
]);

const feedItems = ref<Array<ActivityFeedItem>>([
    { id: 'e-1', actor: 'system', action: 'deployment finished', timestamp: '2026-02-25T11:45:00.000Z' },
]);

const comments = ref<Array<CommentThreadItem>>([
    {
        id: 'c-1',
        author: 'oncall@company.com',
        body: 'Investigating billing latency spike.',
        createdAt: '2026-02-25T11:55:00.000Z',
    },
]);

const auditEntries = ref<Array<AuditLogEntry>>([
    { id: 'a-1', actor: 'admin@company.com', action: 'role.updated', timestamp: '2026-02-25T12:05:00.000Z' },
]);

const filteredRows = computed(() =>
    rows.value.filter(row => row.service.toLowerCase().includes(search.value.toLowerCase())),
);
</script>

<template>
    <section class="ops-page">
        <header class="ops-header">
            <SavedViewsManager :items="savedViews" />
            <NotificationCenter :persist-key="'ops-notifications'" />
        </header>

        <DataTableToolbar v-model:query="search" :loading="loading" :export-enabled="true" @export="() => {}" />

        <DataTable
            :columns="columns"
            :items="filteredRows"
            selection-mode="multiple"
            row-key="id"
            v-model:selected-keys="selectedIds"
        />

        <BulkActionBar :count="selectedIds.length" @clear-selection="selectedIds = []" />

        <div class="ops-detail-grid">
            <ActivityFeed :items="feedItems" :locale="locale" :time-zone="timeZone" mode="absolute" />
            <CommentThread :items="comments" :locale="locale" :time-zone="timeZone" />
            <AuditLogViewer :entries="auditEntries" :locale="locale" :time-zone="timeZone" />
        </div>
    </section>
</template>
```

## Implementation Notes

- Keep RBAC enforcement on backend API routes; use UI controls only for discoverability, not authorization.
- Pass explicit `locale` and `timeZone` to date/time components for SSR-stable rendering.
- Use server-driven filters/saved views as the source of truth for list state and exports.
