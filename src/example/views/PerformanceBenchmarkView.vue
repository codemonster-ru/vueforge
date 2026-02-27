<template>
    <main class="vf-perf" data-testid="perf-root">
        <span
            data-testid="perf-ready"
            :data-ready="isReady ? 'true' : 'false'"
            :data-component="activeComponent"
        ></span>

        <Container size="lg">
            <Stack gap="20px">
                <Section v-if="showDataTable" bordered data-testid="perf-datatable">
                    <h2>DataTable Benchmark</h2>
                    <DataTable
                        data-testid="perf-datatable-root"
                        aria-label="Performance DataTable"
                        :rows="tableRows"
                        :columns="tableColumns"
                        row-key="id"
                        sortable
                        selection-mode="multiple"
                        striped
                        hover
                        column-resize
                    />
                </Section>

                <Section v-if="showTree" bordered data-testid="perf-tree">
                    <h2>Tree Benchmark</h2>
                    <Tree
                        data-testid="perf-tree-root"
                        :items="treeItems"
                        :expanded-keys="treeExpanded"
                        @update:expanded-keys="onTreeExpandedUpdate"
                    />
                </Section>

                <Section v-if="showVirtualScroller" bordered data-testid="perf-virtual-scroller">
                    <h2>VirtualScroller Benchmark</h2>
                    <VirtualScroller
                        data-testid="perf-virtual-root"
                        :items="virtualItems"
                        :item-height="36"
                        height="320px"
                        :overscan="4"
                        @range-change="onRangeChange"
                        @reach-end="onReachEnd"
                    />
                    <div class="vf-perf__meta">
                        <span data-testid="perf-range">{{ lastRangeLabel }}</span>
                        <span data-testid="perf-reach-end">{{ reachEndCount }}</span>
                    </div>
                </Section>

                <Section v-if="showOverlays" bordered data-testid="perf-overlays">
                    <h2>Overlay Benchmark</h2>
                    <Inline gap="12px">
                        <Button data-testid="perf-open-notification" @click="notificationOpen = true"
                            >Open notifications</Button
                        >
                        <Button data-testid="perf-open-command" @click="commandOpen = true"
                            >Open command palette</Button
                        >
                    </Inline>

                    <NotificationCenter v-model="notificationOpen" :items="notificationItems" />
                    <CommandPalette v-model="commandOpen" :items="commandItems" />

                    <div class="vf-perf__meta">
                        <span data-testid="perf-overlay-open">{{ notificationOpen ? 'open' : 'closed' }}</span>
                        <span data-testid="perf-command-open">{{ commandOpen ? 'open' : 'closed' }}</span>
                    </div>
                </Section>

                <Section v-if="showKanban" bordered data-testid="perf-kanban">
                    <h2>Kanban Benchmark</h2>
                    <KanbanBoard
                        data-testid="perf-kanban-root"
                        :columns="kanbanColumns"
                        :items="kanbanItems"
                        virtualization
                        :virtualization-threshold="1"
                        :item-height="52"
                        :swimlane-height="360"
                        :overscan="4"
                    />
                </Section>

                <Section v-if="showCharts" bordered data-testid="perf-charts">
                    <h2>Chart Benchmark</h2>
                    <Button data-testid="perf-chart-update" @click="onChartUpdate">Update chart series</Button>
                    <Chart
                        data-testid="perf-chart-root"
                        :adapter="chartAdapter"
                        type="line"
                        :data="chartData"
                        :high-density="true"
                        :high-density-point-threshold="1000"
                        :lazy="false"
                        aria-label="Performance line chart"
                    />
                </Section>
            </Stack>
        </Container>
    </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { DataTableColumn } from '@/package/components/data-table.vue';
import type { TreeItem } from '@/package/components/tree.vue';
import type { NotificationCenterItem } from '@/package/components/notification-center.vue';
import type { KanbanBoardItem, KanbanColumn } from '@/package/components/kanban-board.vue';
import type { ChartAdapter } from '@/package/components/chart-adapter';
import Container from '@/package/components/container.vue';
import Stack from '@/package/components/stack.vue';
import Section from '@/package/components/section.vue';
import Inline from '@/package/components/inline.vue';
import Button from '@/package/components/button.vue';
import DataTable from '@/package/components/data-table.vue';
import Tree from '@/package/components/tree.vue';
import VirtualScroller from '@/package/components/virtual-scroller.vue';
import NotificationCenter from '@/package/components/notification-center.vue';
import CommandPalette from '@/package/components/command-palette.vue';
import KanbanBoard from '@/package/components/kanban-board.vue';
import Chart from '@/package/components/chart.vue';

const route = useRoute();
const isReady = ref(false);
const notificationOpen = ref(false);
const commandOpen = ref(false);
const reachEndCount = ref(0);
const lastRangeLabel = ref('none');

const activeComponent = computed(() => {
    const value = route.query.component;

    if (typeof value !== 'string') {
        return 'all';
    }

    return value.toLowerCase();
});

const showDataTable = computed(() => ['all', 'datatable'].includes(activeComponent.value));
const showTree = computed(() => ['all', 'tree'].includes(activeComponent.value));
const showVirtualScroller = computed(() => ['all', 'virtualscroller'].includes(activeComponent.value));
const showOverlays = computed(() => ['all', 'overlays'].includes(activeComponent.value));
const showKanban = computed(() => ['all', 'kanban'].includes(activeComponent.value));
const showCharts = computed(() => ['all', 'charts'].includes(activeComponent.value));

const tableColumns: Array<DataTableColumn> = Array.from({ length: 12 }, (_, index) => {
    const field = `col${index + 1}`;
    return {
        field,
        header: `Column ${index + 1}`,
        sortable: index === 1,
        resizable: true,
    };
});

const tableRows = Array.from({ length: 1000 }, (_, rowIndex) => {
    const row: Record<string, unknown> = {
        id: rowIndex + 1,
    };

    for (let colIndex = 0; colIndex < 12; colIndex += 1) {
        const key = `col${colIndex + 1}`;
        row[key] = `${key}-${(rowIndex + colIndex) % 250}`;
    }

    return row;
});

const treeItems: Array<TreeItem> = Array.from({ length: 200 }, (_, groupIndex) => ({
    key: `group-${groupIndex}`,
    label: `Group ${groupIndex}`,
    children: Array.from({ length: 10 }, (_, childIndex) => ({
        key: `node-${groupIndex}-${childIndex}`,
        label: `Node ${groupIndex}-${childIndex}`,
    })),
}));
const treeExpanded = ref<Array<string>>(Array.from({ length: 40 }, (_, index) => `group-${index}`));

const virtualItems = Array.from({ length: 10000 }, (_, index) => `Item ${index}`);

const notificationItems: Array<NotificationCenterItem> = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `Notification ${index + 1}`,
    message: `Message ${index + 1}`,
    read: index % 3 === 0,
}));

const commandItems = Array.from({ length: 200 }, (_, index) => ({
    label: `Command ${index + 1}`,
    value: `cmd-${index + 1}`,
    group: index % 2 === 0 ? 'General' : 'Actions',
}));

const kanbanColumns: Array<KanbanColumn> = Array.from({ length: 8 }, (_, index) => ({
    id: `lane-${index + 1}`,
    title: `Lane ${index + 1}`,
}));

const kanbanItems: Array<KanbanBoardItem> = kanbanColumns.flatMap((column, columnIndex) =>
    Array.from({ length: 500 }, (_, cardIndex) => ({
        id: `${String(column.id)}-${cardIndex + 1}`,
        columnId: column.id,
        title: `Task ${columnIndex + 1}-${cardIndex + 1}`,
        priority: cardIndex % 3 === 0 ? 'high' : cardIndex % 3 === 1 ? 'medium' : 'low',
    })),
);

const chartLabels = Array.from({ length: 5000 }, (_, index) => `P${index + 1}`);
const chartSeed = ref(0);
const chartData = computed(() => {
    const seed = chartSeed.value;

    return {
        labels: chartLabels,
        datasets: [
            {
                label: 'Throughput',
                data: chartLabels.map((_, index) => ((index * 17 + seed * 13) % 120) + (index % 40)),
            },
            {
                label: 'Latency',
                data: chartLabels.map((_, index) => ((index * 11 + seed * 7) % 80) + 20),
            },
        ],
    };
});
const chartAdapter: ChartAdapter = {
    mount: canvas => ({ canvas }),
    update: () => undefined,
    resize: () => undefined,
    destroy: () => undefined,
};

const onTreeExpandedUpdate = (value: Array<string | number>) => {
    treeExpanded.value = value.map(item => String(item));
};

const onRangeChange = (value: { start: number; end: number }) => {
    lastRangeLabel.value = `${value.start.toString()}-${value.end.toString()}`;
};

const onReachEnd = () => {
    reachEndCount.value += 1;
};

const onChartUpdate = () => {
    chartSeed.value += 1;
};

const waitForPaint = async () => {
    await nextTick();
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
};

onMounted(async () => {
    await waitForPaint();
    isReady.value = true;
});
</script>

<style scoped lang="scss">
.vf-perf {
    padding: 32px 0;
}

.vf-perf h2 {
    margin: 0 0 12px;
}

.vf-perf__meta {
    margin-top: 12px;
    display: inline-flex;
    gap: 12px;
    font-size: 12px;
    opacity: 0.75;
}
</style>
