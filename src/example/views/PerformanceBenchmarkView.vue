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

const onTreeExpandedUpdate = (value: Array<string | number>) => {
    treeExpanded.value = value.map(item => String(item));
};

const onRangeChange = (value: { start: number; end: number }) => {
    lastRangeLabel.value = `${value.start.toString()}-${value.end.toString()}`;
};

const onReachEnd = () => {
    reachEndCount.value += 1;
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
