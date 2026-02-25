<template>
    <Chart
        ref="chartRef"
        class="vf-area-chart"
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

export interface AreaChartSeries {
    label: string;
    data: Array<number | null>;
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    pointRadius?: number;
    tension?: number;
    spanGaps?: boolean;
    stack?: string;
    fill?: boolean | string;
    [key: string]: unknown;
}

interface Props {
    labels?: Array<string | number>;
    series?: Array<AreaChartSeries>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    stacked?: boolean;
    normalized?: boolean;
    spanGaps?: boolean;
    curve?: 'linear' | 'smooth';
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
    labels: () => [],
    series: () => [],
    adapter: undefined,
    options: () => ({}),
    stacked: false,
    normalized: false,
    spanGaps: false,
    curve: 'smooth',
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Area chart',
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

const tension = computed(() => (props.curve === 'smooth' ? 0.35 : 0));

const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.series.map(item => ({
        ...item,
        fill: item.fill ?? true,
        tension: item.tension ?? tension.value,
        spanGaps: item.spanGaps ?? props.spanGaps,
        stack: item.stack ?? (props.stacked ? 'area' : undefined),
    })),
}));

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: props.spanGaps,
    normalized: props.normalized,
    scales: {
        x: { stacked: props.stacked },
        y: { stacked: props.stacked },
    },
    elements: {
        line: {
            tension: tension.value,
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
.vf-area-chart {
    display: block;
}
</style>
