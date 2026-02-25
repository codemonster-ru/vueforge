<template>
    <Chart
        ref="chartRef"
        class="vf-scatter-chart"
        type="scatter"
        :data="chartData"
        :options="chartOptions"
        :adapter="adapter"
        :width="width"
        :height="height"
        :loading="loading"
        :loading-text="loadingText"
        :empty-text="emptyText"
        :aria-label="ariaLabel"
        :lazy="lazy"
        :lazy-root-margin="lazyRootMargin"
        :lazy-threshold="lazyThreshold"
        :pt="pt"
        :unstyled="unstyled"
        @ready="onReady"
        @error="onError"
    >
        <template v-if="$slots.loading" #loading>
            <slot name="loading" />
        </template>
        <template v-if="$slots.empty" #empty>
            <slot name="empty" />
        </template>
    </Chart>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Chart from '@/package/components/chart.vue';
import type { ChartAdapter, ChartAdapterInstance } from '@/package/components/chart-adapter';
import type { PassThroughOptions } from '@/package/config/pass-through';

export interface ScatterChartPoint {
    x: number;
    y: number;
    cluster?: string;
    [key: string]: unknown;
}

export interface ScatterChartSeries {
    label: string;
    data: Array<ScatterChartPoint>;
    pointRadius?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointBorderWidth?: number;
    showLine?: boolean;
    [key: string]: unknown;
}

export interface ScatterChartClusterOptions {
    enabled?: boolean;
    palette?: Array<string>;
}

interface Props {
    series?: Array<ScatterChartSeries>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    regressionLine?: boolean;
    regressionLineColor?: string;
    clusterOptions?: ScatterChartClusterOptions;
    width?: number;
    height?: number;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    ariaLabel?: string;
    lazy?: boolean;
    lazyRootMargin?: string;
    lazyThreshold?: number;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    series: () => [],
    adapter: undefined,
    options: () => ({}),
    regressionLine: false,
    regressionLineColor: '#ef4444',
    clusterOptions: () => ({}),
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Scatter chart',
    lazy: true,
    lazyRootMargin: '200px',
    lazyThreshold: 0,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'ready', instance: ChartAdapterInstance): void;
    (event: 'error', error: Error): void;
}>();

defineSlots<{
    loading?: () => unknown;
    empty?: () => unknown;
}>();

type ChartRef = {
    resize: () => void;
    refresh: () => void;
};

const chartRef = ref<ChartRef | null>(null);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeOptions = (base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> => {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(override)) {
        const previous = merged[key];

        if (isRecord(previous) && isRecord(value)) {
            merged[key] = mergeOptions(previous, value);
            continue;
        }

        merged[key] = value;
    }

    return merged;
};

const defaultPalette = ['#2f80ed', '#27ae60', '#f2994a', '#eb5757', '#9b51e0', '#56ccf2'];

const buildRegressionDataset = (label: string, points: Array<ScatterChartPoint>) => {
    if (points.length < 2) {
        return null;
    }

    const sumX = points.reduce((acc, point) => acc + point.x, 0);
    const sumY = points.reduce((acc, point) => acc + point.y, 0);
    const meanX = sumX / points.length;
    const meanY = sumY / points.length;

    let numerator = 0;
    let denominator = 0;
    for (const point of points) {
        numerator += (point.x - meanX) * (point.y - meanY);
        denominator += (point.x - meanX) ** 2;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;
    const sortedX = points.map(point => point.x).sort((a, b) => a - b);
    const firstX = sortedX[0];
    const lastX = sortedX[sortedX.length - 1];

    return {
        label: `${label} Regression`,
        data: [
            { x: firstX, y: slope * firstX + intercept },
            { x: lastX, y: slope * lastX + intercept },
        ],
        showLine: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.5,
        borderColor: props.regressionLineColor,
    };
};

const applyClustering = (series: ScatterChartSeries) => {
    if (!props.clusterOptions.enabled) {
        return [series];
    }

    const grouped = new Map<string, Array<ScatterChartPoint>>();
    for (const point of series.data) {
        const key = point.cluster || 'default';
        const current = grouped.get(key) ?? [];
        current.push(point);
        grouped.set(key, current);
    }

    const palette = props.clusterOptions.palette?.length ? props.clusterOptions.palette : defaultPalette;

    return Array.from(grouped.entries()).map(([cluster, points], index) => ({
        ...series,
        label: `${series.label} (${cluster})`,
        data: points,
        pointBackgroundColor: series.pointBackgroundColor ?? palette[index % palette.length],
    }));
};

const chartData = computed(() => {
    const clusteredSeries = props.series.flatMap(item => applyClustering(item));
    const withRegression = clusteredSeries.flatMap(item => {
        if (!props.regressionLine) {
            return [item];
        }

        const regressionDataset = buildRegressionDataset(item.label, item.data);
        return regressionDataset ? [item, regressionDataset] : [item];
    });

    return {
        datasets: withRegression,
    };
});

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'linear',
            position: 'bottom',
        },
        y: {
            type: 'linear',
        },
    },
}));

const chartOptions = computed(() => mergeOptions(baseOptions.value, props.options));

const onReady = (instance: ChartAdapterInstance) => emits('ready', instance);
const onError = (error: Error) => emits('error', error);

defineExpose({
    resize: () => {
        chartRef.value?.resize();
    },
    refresh: () => {
        chartRef.value?.refresh();
    },
});
</script>

<style lang="scss">
.vf-scatter-chart {
    display: block;
}
</style>
