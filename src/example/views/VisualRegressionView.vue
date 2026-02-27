<template>
    <main class="vf-visual" data-testid="vf-visual-root">
        <Container size="lg">
            <Stack gap="24px">
                <Section bordered background="muted" data-testid="vf-visual-header">
                    <Stack gap="16px">
                        <h1 class="vf-visual__title">VueForge Visual Baseline</h1>
                        <Inline gap="12px">
                            <Button>Primary action</Button>
                            <Button severity="secondary">Secondary action</Button>
                            <Button variant="outlined" severity="success">Outlined action</Button>
                        </Inline>
                        <Inline gap="12px">
                            <Input model-value="hello@vueforge.dev" aria-label="Email" />
                            <Input model-value="Search components..." aria-label="Search" />
                        </Inline>
                    </Stack>
                </Section>

                <Section bordered data-testid="vf-visual-layout">
                    <Grid columns="12" gap="16px">
                        <GridItem span="4">
                            <Card>
                                <template #default>
                                    <Stack gap="8px">
                                        <h2 class="vf-visual__card-title">Summary</h2>
                                        <p class="vf-visual__text">
                                            Stable card snapshot for spacing, borders, and typography.
                                        </p>
                                    </Stack>
                                </template>
                            </Card>
                        </GridItem>
                        <GridItem span="8">
                            <Card>
                                <template #default>
                                    <Stack gap="8px">
                                        <h2 class="vf-visual__card-title">Release checks</h2>
                                        <Inline gap="8px">
                                            <Badge label="Lint" severity="success" />
                                            <Badge label="Typecheck" severity="success" />
                                            <Badge label="Unit tests" severity="success" />
                                        </Inline>
                                    </Stack>
                                </template>
                            </Card>
                        </GridItem>
                    </Grid>
                </Section>

                <Section bordered data-testid="vf-visual-data">
                    <DataTable
                        aria-label="Visual baseline table"
                        :rows="rows"
                        :columns="columns"
                        row-key="id"
                        striped
                        hover
                    />
                </Section>

                <Section bordered data-testid="vf-visual-charts">
                    <Stack gap="12px">
                        <h2 class="vf-visual__card-title">Chart variants</h2>
                        <Grid columns="12" gap="12px">
                            <GridItem span="6">
                                <Chart :adapter="visualChartAdapter" type="line" :data="chartData" :lazy="false" />
                            </GridItem>
                            <GridItem span="6">
                                <div class="vf-visual__chart-themed">
                                    <Chart
                                        :adapter="visualChartAdapter"
                                        type="bar"
                                        :data="chartData"
                                        :lazy="false"
                                        :print-mode="true"
                                        :a11y-table-fallback="true"
                                        show-table-text="Show values"
                                    />
                                </div>
                            </GridItem>
                        </Grid>
                    </Stack>
                </Section>

                <Section bordered class="vf-visual__layout-presets" data-testid="vf-visual-layout-presets">
                    <Stack gap="16px">
                        <AppBar title="Layout Visual Presets" />
                        <PageLayout
                            :show-mobile-toggles="true"
                            :show-desktop-toggles="true"
                            sidebar-width="220px"
                            aside-width="200px"
                        >
                            <template #sidebar>
                                <Card><template #default>Sidebar region</template></Card>
                            </template>
                            <template #default>
                                <StickyRegion bordered>Sticky action bar</StickyRegion>
                                <SplitLayout preset="master-detail" secondary-width="260px">
                                    <template #default>
                                        <Card><template #default>Primary content</template></Card>
                                    </template>
                                    <template #secondary>
                                        <Card><template #default>Detail panel</template></Card>
                                    </template>
                                </SplitLayout>
                            </template>
                            <template #aside>
                                <Card><template #default>Aside region</template></Card>
                            </template>
                        </PageLayout>
                    </Stack>
                </Section>
            </Stack>
        </Container>
    </main>
</template>

<script setup lang="ts">
import type { DataTableColumn } from '@/package/components/data-table.vue';
import type { ChartAdapter, ChartConfig } from '@/package/components/chart-adapter';
import AppBar from '@/package/components/app-bar.vue';
import Card from '@/package/components/card.vue';
import Chart from '@/package/components/chart.vue';
import PageLayout from '@/package/components/page-layout.vue';
import SplitLayout from '@/package/components/split-layout.vue';
import StickyRegion from '@/package/components/sticky-region.vue';

const rows = [
    { id: 1, name: 'Ada Lovelace', role: 'Maintainer', status: 'Active' },
    { id: 2, name: 'Linus Torvalds', role: 'Reviewer', status: 'Active' },
    { id: 3, name: 'Grace Hopper', role: 'Contributor', status: 'Idle' },
];

const columns: Array<DataTableColumn> = [
    { field: 'name', header: 'Name', width: '240px' },
    { field: 'role', header: 'Role', width: '180px' },
    { field: 'status', header: 'Status', width: '140px' },
];

const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        { label: 'Revenue', data: [42, 58, 51, 66, 73, 69] },
        { label: 'Cost', data: [28, 36, 34, 41, 49, 47] },
    ],
};

type VisualChartInstance = {
    canvas: HTMLCanvasElement;
    config: ChartConfig;
};

const drawVisualChart = ({ canvas, config }: VisualChartInstance) => {
    const context = canvas.getContext('2d');
    if (!context) {
        return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const labels = config.data.labels ?? [];
    const datasets = config.data.datasets ?? [];
    const gridColor = '#e5e7eb';
    const palette = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = gridColor;
    context.lineWidth = 1;
    for (let i = 1; i <= 4; i += 1) {
        const y = (height / 5) * i;
        context.beginPath();
        context.moveTo(28, y);
        context.lineTo(width - 12, y);
        context.stroke();
    }

    const chartWidth = width - 40;
    const chartHeight = height - 28;
    const maxValue = Math.max(
        1,
        ...datasets.flatMap(dataset =>
            Array.isArray(dataset.data) ? dataset.data.map(value => Number(value) || 0) : [],
        ),
    );

    datasets.forEach((dataset, datasetIndex) => {
        const values = Array.isArray(dataset.data) ? dataset.data.map(value => Number(value) || 0) : [];
        const color = palette[datasetIndex % palette.length] ?? '#6b7280';

        if (config.type === 'bar') {
            const totalBars = values.length * datasets.length;
            const barWidth = chartWidth / Math.max(totalBars, 1);
            values.forEach((value, pointIndex) => {
                const x = 28 + (pointIndex * datasets.length + datasetIndex) * barWidth;
                const barHeight = (value / maxValue) * (chartHeight - 12);
                const y = height - 18 - barHeight;
                context.fillStyle = color;
                context.fillRect(x, y, Math.max(2, barWidth - 2), barHeight);
            });
            return;
        }

        context.strokeStyle = color;
        context.lineWidth = 2;
        context.beginPath();
        values.forEach((value, pointIndex) => {
            const x = 28 + (pointIndex / Math.max(values.length - 1, 1)) * chartWidth;
            const y = height - 18 - (value / maxValue) * (chartHeight - 12);
            if (pointIndex === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        });
        context.stroke();
    });

    context.fillStyle = '#6b7280';
    context.font = '11px sans-serif';
    labels.slice(0, 6).forEach((label, index) => {
        const x = 24 + (index / Math.max(labels.length - 1, 1)) * chartWidth;
        context.fillText(String(label), x, height - 4);
    });
};

const visualChartAdapter: ChartAdapter = {
    mount(canvas, config) {
        const instance: VisualChartInstance = { canvas, config };
        drawVisualChart(instance);
        return instance;
    },
    update(instance, config) {
        const visualInstance = instance as VisualChartInstance;
        visualInstance.config = config;
        drawVisualChart(visualInstance);
    },
    resize(instance) {
        drawVisualChart(instance as VisualChartInstance);
    },
    destroy: () => undefined,
};
</script>

<style scoped lang="scss">
.vf-visual {
    padding: 32px 0;
}

.vf-visual__title {
    margin: 0;
    font-size: 28px;
}

.vf-visual__card-title {
    margin: 0;
    font-size: 18px;
}

.vf-visual__text {
    margin: 0;
}

/* Keep visual regression capture height stable across OS/browser font metrics. */
.vf-visual__layout-presets {
    min-height: 882px;
}

.vf-visual__chart-themed {
    --vf-chart-border-color: #1f2937;
    --vf-chart-background-color: #111827;
    --vf-chart-text-color: #e5e7eb;
    --vf-chart-table-header-background-color: #1f2937;
    --vf-chart-table-header-text-color: #f9fafb;
    --vf-chart-table-border-color: #374151;
    --vf-chart-control-background-color: #1f2937;
    --vf-chart-control-border-color: #4b5563;
    --vf-chart-control-text-color: #f9fafb;
}
</style>
