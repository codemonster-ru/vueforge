<template>
    <Chart
        ref="chartRef"
        class="vf-sparkline"
        type="line"
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

interface Props {
    values?: Array<number | null>;
    labels?: Array<string | number>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    color?: string;
    fillColor?: string;
    area?: boolean;
    smooth?: boolean;
    showPoints?: boolean;
    pointRadius?: number;
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
    values: () => [],
    labels: () => [],
    adapter: undefined,
    options: () => ({}),
    color: '#2563eb',
    fillColor: 'rgba(37, 99, 235, 0.22)',
    area: false,
    smooth: true,
    showPoints: false,
    pointRadius: 2,
    width: 180,
    height: 48,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Sparkline',
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

const resolvedLabels = computed(() => {
    if (props.labels.length === props.values.length) {
        return props.labels;
    }

    return props.values.map((_, index) => index + 1);
});

const chartData = computed(() => ({
    labels: resolvedLabels.value,
    datasets: [
        {
            label: 'Sparkline',
            data: props.values,
            borderColor: props.color,
            backgroundColor: props.area ? props.fillColor : 'transparent',
            borderWidth: 1.6,
            pointRadius: props.showPoints ? props.pointRadius : 0,
            pointHoverRadius: props.showPoints ? props.pointRadius + 1 : 0,
            fill: props.area,
            tension: props.smooth ? 0.32 : 0,
            spanGaps: false,
        },
    ],
}));

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            displayColors: false,
        },
    },
    elements: {
        line: {
            tension: props.smooth ? 0.32 : 0,
        },
    },
    scales: {
        x: {
            display: false,
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
        },
        y: {
            display: false,
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
        },
    },
    layout: {
        padding: 0,
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
.vf-sparkline {
    display: inline-block;
    width: 100%;
}
</style>
