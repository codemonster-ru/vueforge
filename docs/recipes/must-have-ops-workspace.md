# Must-have Ops Workspace Recipe

Goal: compose a production-style operations workspace using must-have parity components without external UI kits.

Includes:

- `MenuBar` for app navigation
- `DataView` for mode switch and paging handoff
- `TreeTable` for hierarchical asset structure
- `Image` preview for selected asset details
- `OverlayPanel` for contextual row actions
- `SpeedDial` for global quick actions
- `Carousel` for rotating operational highlights

```vue
<script setup lang="ts">
import {
    Carousel,
    DataView,
    Image,
    MenuBar,
    OverlayPanel,
    SpeedDial,
    TreeTable,
    type TreeTableColumn,
    type TreeTableNode,
} from '@codemonster-ru/vueforge';
import { ref } from 'vue';

const navItems = [
    { label: 'Overview', href: '#' },
    { label: 'Assets', href: '#' },
    { label: 'Incidents', href: '#' },
];
const highlights = [
    { id: 1, title: 'SLA 99.97%' },
    { id: 2, title: '12 deploys today' },
    { id: 3, title: '0 sev-1 open' },
];
const quickActions = [
    { label: 'Create incident', value: 'incident' },
    { label: 'Deploy rollback', value: 'rollback' },
    { label: 'Invite operator', value: 'invite' },
];

const treeColumns: Array<TreeTableColumn> = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
];
const treeItems: Array<TreeTableNode> = [
    {
        key: 'cluster-a',
        data: { name: 'Cluster A', status: 'Healthy' },
        children: [
            { key: 'svc-auth', data: { name: 'auth-service', status: 'Healthy' } },
            { key: 'svc-billing', data: { name: 'billing-service', status: 'Degraded' } },
        ],
    },
    {
        key: 'cluster-b',
        data: { name: 'Cluster B', status: 'Healthy' },
    },
];

const selectedNode = ref<string | undefined>();
const assetCards = ref([
    { id: 1, name: 'Auth cluster', owner: 'Platform', thumbnail: '/assets/auth.png' },
    { id: 2, name: 'Billing cluster', owner: 'Payments', thumbnail: '/assets/billing.png' },
]);
const dataLayout = ref<'list' | 'grid'>('grid');
const rowActionsOpen = ref(false);
</script>

<template>
    <section class="ops-workspace">
        <MenuBar :items="navItems" aria-label="Operations primary navigation" />

        <Carousel :items="highlights" :autoplay="true" :autoplay-interval="4500">
            <template #item="{ item }">
                <article class="ops-highlight">{{ item.title }}</article>
            </template>
        </Carousel>

        <div class="ops-grid">
            <aside class="ops-pane">
                <TreeTable
                    v-model="selectedNode"
                    :columns="treeColumns"
                    :items="treeItems"
                    aria-label="Service topology"
                />
            </aside>

            <main class="ops-pane">
                <DataView
                    v-model:layout="dataLayout"
                    :items="assetCards"
                    :page-size="6"
                    :sortable="true"
                    default-sort-field="name"
                >
                    <template #item="{ item }">
                        <article class="ops-card">
                            <Image
                                :src="item.thumbnail"
                                :alt="item.name"
                                preview
                                width="240"
                                height="140"
                                fit="cover"
                            />
                            <h3>{{ item.name }}</h3>
                            <p>Owner: {{ item.owner }}</p>
                            <OverlayPanel v-model="rowActionsOpen" showCloseIcon>
                                <template #trigger>
                                    <button type="button">Actions</button>
                                </template>
                                <template #default>
                                    <button type="button">Open runbook</button>
                                    <button type="button">Escalate</button>
                                </template>
                            </OverlayPanel>
                        </article>
                    </template>
                </DataView>
            </main>
        </div>

        <SpeedDial :actions="quickActions" />
    </section>
</template>
```

Implementation notes:

- Keep `TreeTable` and `DataView` server-handoff events wired to the same query store for consistent pagination/filter/sort state.
- Use `Image` preview only for drill-down assets (avoid opening every thumbnail by default in high-density lists).
- Keep `SpeedDial` limited to top 3 global actions; route row-scoped actions to `OverlayPanel`.
