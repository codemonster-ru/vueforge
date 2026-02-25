<template>
    <Chart
        ref="chartRef"
        class="vf-bubble-chart"
        type="bubble"
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

export interface BubbleChartPoint {
    x: number;
    y: number;
    r?: number;
    size?: number;
    label?: string;
    [key: string]: unknown;
}

export interface BubbleChartSeries {
    label: string;
    data: Array<BubbleChartPoint>;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    [key: string]: unknown;
}

export interface BubbleChartTooltipContext {
    label: string;
    x: number;
    y: number;
    r: number;
}

interface Props {
    series?: Array<BubbleChartSeries>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    minRadius?: number;
    maxRadius?: number;
    tooltipFormatter?: (context: BubbleChartTooltipContext) => string;
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
    minRadius: 4,
    maxRadius: 18,
    tooltipFormatter: undefined,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Bubble chart',
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

const allSizeValues = computed(() =>
    props.series.flatMap(item =>
        item.data
            .map(point => (typeof point.size === 'number' ? point.size : undefined))
            .filter((value): value is number => typeof value === 'number'),
    ),
);

const sizeRange = computed(() => {
    if (allSizeValues.value.length === 0) {
        return { min: 0, max: 0 };
    }

    return {
        min: Math.min(...allSizeValues.value),
        max: Math.max(...allSizeValues.value),
    };
});

const resolveRadius = (point: BubbleChartPoint) => {
    if (typeof point.r === 'number') {
        return point.r;
    }

    if (typeof point.size !== 'number') {
        return props.minRadius;
    }

    const { min, max } = sizeRange.value;
    if (min === max) {
        return (props.minRadius + props.maxRadius) / 2;
    }

    const normalized = (point.size - min) / (max - min);
    return props.minRadius + normalized * (props.maxRadius - props.minRadius);
};

const normalizedSeries = computed(() =>
    props.series.map(item => ({
        ...item,
        data: item.data.map(point => ({
            ...point,
            r: resolveRadius(point),
        })),
    })),
);

const chartData = computed(() => ({
    datasets: normalizedSeries.value,
}));

const defaultTooltipFormatter = (context: BubbleChartTooltipContext) =>
    `${context.label}: x=${context.x}, y=${context.y}, r=${Math.round(context.r * 100) / 100}`;

const tooltipLabel = (context: { dataset?: { label?: string }; raw?: { x?: number; y?: number; r?: number } }) => {
    const formatter = props.tooltipFormatter ?? defaultTooltipFormatter;
    const x = context.raw?.x ?? 0;
    const y = context.raw?.y ?? 0;
    const r = context.raw?.r ?? 0;

    return formatter({
        label: context.dataset?.label ?? 'Series',
        x,
        y,
        r,
    });
};

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
    plugins: {
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
.vf-bubble-chart {
    display: block;
}
</style>
