<template>
    <Chart
        ref="chartRef"
        class="vf-candlestick-chart"
        type="bar"
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

export interface CandlestickDataPoint {
    label: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface Props {
    points?: Array<CandlestickDataPoint>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    showVolume?: boolean;
    bullishColor?: string;
    bearishColor?: string;
    wickColor?: string;
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
    points: () => [],
    adapter: undefined,
    options: () => ({}),
    showVolume: true,
    bullishColor: '#16a34a',
    bearishColor: '#dc2626',
    wickColor: '#475569',
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Candlestick chart',
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

const labels = computed(() => props.points.map(point => point.label));

const candleColors = computed(() =>
    props.points.map(point => (point.close >= point.open ? props.bullishColor : props.bearishColor)),
);

const volumeValues = computed(() => props.points.map(point => point.volume ?? 0));

const chartData = computed(() => {
    const wickDataset = {
        type: 'bar',
        label: 'Range',
        data: props.points.map(point => [point.low, point.high]),
        backgroundColor: props.wickColor,
        borderColor: props.wickColor,
        borderSkipped: false,
        barPercentage: 0.18,
        categoryPercentage: 0.86,
        yAxisID: 'yPrice',
    };

    const bodyDataset = {
        type: 'bar',
        label: 'Body',
        data: props.points.map(point => [point.open, point.close]),
        backgroundColor: candleColors.value,
        borderColor: candleColors.value,
        borderSkipped: false,
        barPercentage: 0.58,
        categoryPercentage: 0.86,
        yAxisID: 'yPrice',
    };

    const volumeDataset = {
        type: 'bar',
        label: 'Volume',
        data: volumeValues.value,
        backgroundColor: candleColors.value.map(color => `${color}99`),
        borderColor: candleColors.value.map(color => `${color}cc`),
        borderWidth: 1,
        yAxisID: 'yVolume',
    };

    return {
        labels: labels.value,
        datasets: props.showVolume ? [wickDataset, bodyDataset, volumeDataset] : [wickDataset, bodyDataset],
    };
});

const tooltipLabel = (context: { dataIndex?: number }) => {
    const index = context.dataIndex ?? 0;
    const point = props.points[index];

    if (!point) {
        return '';
    }

    const volume = typeof point.volume === 'number' ? `, V ${point.volume}` : '';
    return `O ${point.open}, H ${point.high}, L ${point.low}, C ${point.close}${volume}`;
};

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yPrice: {
            type: 'linear',
            position: 'left',
            beginAtZero: false,
        },
        yVolume: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            display: props.showVolume,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            callbacks: {
                label: tooltipLabel,
            },
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
.vf-candlestick-chart {
    display: block;
}
</style>
