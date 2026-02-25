<template>
    <Chart
        ref="chartRef"
        class="vf-funnel-chart"
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

export interface FunnelChartStage {
    label: string;
    value: number;
    color?: string;
}

export interface FunnelChartStageComputed extends FunnelChartStage {
    conversionRate: number;
    dropOffRate: number;
}

interface Props {
    stages?: Array<FunnelChartStage>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    descending?: boolean;
    showConversionLabels?: boolean;
    palette?: Array<string>;
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
    stages: () => [],
    adapter: undefined,
    options: () => ({}),
    descending: true,
    showConversionLabels: true,
    palette: () => ['#2f80ed', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Funnel chart',
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

const sortedStages = computed(() => {
    if (!props.descending) {
        return props.stages;
    }

    return [...props.stages].sort((a, b) => b.value - a.value);
});

const computedStages = computed<Array<FunnelChartStageComputed>>(() => {
    if (sortedStages.value.length === 0) {
        return [];
    }

    const firstValue = sortedStages.value[0]?.value ?? 0;

    return sortedStages.value.map((stage, index) => {
        const previous = index === 0 ? firstValue : (sortedStages.value[index - 1]?.value ?? firstValue);
        const conversionRate = firstValue > 0 ? stage.value / firstValue : 0;
        const dropOffRate = previous > 0 ? (previous - stage.value) / previous : 0;

        return {
            ...stage,
            conversionRate,
            dropOffRate,
        };
    });
});

const labels = computed(() =>
    computedStages.value.map(stage => {
        if (!props.showConversionLabels) {
            return stage.label;
        }

        return `${stage.label} (${(stage.conversionRate * 100).toFixed(1)}%)`;
    }),
);

const backgroundColors = computed(() =>
    computedStages.value.map((stage, index) => stage.color ?? props.palette[index % props.palette.length]),
);

const chartData = computed(() => ({
    labels: labels.value,
    datasets: [
        {
            label: 'Stage volume',
            data: computedStages.value.map(stage => stage.value),
            backgroundColor: backgroundColors.value,
            borderColor: backgroundColors.value,
            borderWidth: 1,
        },
    ],
}));

const tooltipLabel = (context: { dataIndex?: number; parsed?: { x?: number } }) => {
    const index = context.dataIndex ?? 0;
    const stage = computedStages.value[index];

    if (!stage) {
        return '';
    }

    const value = context.parsed?.x ?? stage.value;
    return `${stage.label}: ${value} (conv ${(stage.conversionRate * 100).toFixed(1)}%, drop ${(stage.dropOffRate * 100).toFixed(1)}%)`;
};

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
        x: {
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            display: false,
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
    stages: computedStages,
});
</script>

<style lang="scss">
.vf-funnel-chart {
    display: block;
}
</style>
