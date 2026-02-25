<template>
    <div class="vf-heatmap">
        <Chart
            ref="chartRef"
            class="vf-heatmap__chart"
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
        <div v-if="showRangeLegend && rangeItems.length > 0" class="vf-heatmap__legend" role="list">
            <span v-for="item in rangeItems" :key="item.label" class="vf-heatmap__legend-item" role="listitem">
                <span class="vf-heatmap__legend-swatch" :style="{ backgroundColor: item.color }" aria-hidden="true" />
                <span class="vf-heatmap__legend-label">{{ item.label }}</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Chart from '@/package/components/chart.vue';
import type { ChartAdapter, ChartAdapterInstance } from '@/package/components/chart-adapter';
import type { PassThroughOptions } from '@/package/config/pass-through';

export interface HeatmapCell {
    x: string | number;
    y: string | number;
    value: number;
}

export interface HeatmapRangeItem {
    min: number;
    max: number;
    color: string;
    label: string;
}

interface Props {
    cells?: Array<HeatmapCell>;
    xLabels?: Array<string | number>;
    yLabels?: Array<string | number>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    colorRange?: Array<string>;
    showRangeLegend?: boolean;
    cellRadius?: number;
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
    cells: () => [],
    xLabels: () => [],
    yLabels: () => [],
    adapter: undefined,
    options: () => ({}),
    colorRange: () => ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'],
    showRangeLegend: true,
    cellRadius: 14,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Heatmap',
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

const resolvedXLabels = computed<Array<string | number>>(() => {
    if (props.xLabels.length > 0) {
        return props.xLabels;
    }

    return [...new Set(props.cells.map(cell => cell.x))];
});

const resolvedYLabels = computed<Array<string | number>>(() => {
    if (props.yLabels.length > 0) {
        return props.yLabels;
    }

    return [...new Set(props.cells.map(cell => cell.y))];
});

const values = computed(() => props.cells.map(cell => cell.value));

const range = computed(() => {
    if (values.value.length === 0) {
        return { min: 0, max: 0 };
    }

    return {
        min: Math.min(...values.value),
        max: Math.max(...values.value),
    };
});

const resolveColor = (value: number) => {
    if (props.colorRange.length === 0) {
        return '#2563eb';
    }

    const { min, max } = range.value;
    if (min === max) {
        return props.colorRange[props.colorRange.length - 1];
    }

    const normalized = (value - min) / (max - min);
    const index = Math.min(props.colorRange.length - 1, Math.max(0, Math.floor(normalized * props.colorRange.length)));
    return props.colorRange[index];
};

const points = computed(() =>
    props.cells
        .map(cell => {
            const xIndex = resolvedXLabels.value.findIndex(label => label === cell.x);
            const yIndex = resolvedYLabels.value.findIndex(label => label === cell.y);

            if (xIndex < 0 || yIndex < 0) {
                return null;
            }

            return {
                x: xIndex,
                y: yIndex,
                r: props.cellRadius,
                value: cell.value,
                rawXLabel: String(cell.x),
                rawYLabel: String(cell.y),
            };
        })
        .filter((point): point is NonNullable<typeof point> => point !== null),
);

const chartData = computed(() => ({
    datasets: [
        {
            label: 'Heatmap',
            data: points.value,
            backgroundColor: points.value.map(point => resolveColor(point.value)),
            pointStyle: 'rectRounded',
        },
    ],
}));

const rangeItems = computed<Array<HeatmapRangeItem>>(() => {
    if (props.colorRange.length === 0 || values.value.length === 0) {
        return [];
    }

    const { min, max } = range.value;
    const step = (max - min) / props.colorRange.length;

    return props.colorRange.map((color, index) => {
        const start = min + step * index;
        const end = index === props.colorRange.length - 1 ? max : min + step * (index + 1);
        return {
            min: start,
            max: end,
            color,
            label: `${start.toFixed(2)}-${end.toFixed(2)}`,
        };
    });
});

const tooltipLabel = (context: { raw?: { value?: number; rawXLabel?: string; rawYLabel?: string } }) => {
    const value = context.raw?.value ?? 0;
    const x = context.raw?.rawXLabel ?? '';
    const y = context.raw?.rawYLabel ?? '';

    return `${x} / ${y}: ${value}`;
};

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'linear',
            min: -0.5,
            max: resolvedXLabels.value.length - 0.5,
            ticks: {
                stepSize: 1,
                callback: (value: number) => String(resolvedXLabels.value[value] ?? ''),
            },
        },
        y: {
            type: 'linear',
            min: -0.5,
            max: resolvedYLabels.value.length - 0.5,
            reverse: true,
            ticks: {
                stepSize: 1,
                callback: (value: number) => String(resolvedYLabels.value[value] ?? ''),
            },
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
    rangeItems,
});
</script>

<style lang="scss">
.vf-heatmap {
    display: grid;
    gap: 0.75rem;
}

.vf-heatmap__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
}

.vf-heatmap__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
}

.vf-heatmap__legend-swatch {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 0.2rem;
    border: 1px solid rgba(0, 0, 0, 0.18);
}
</style>
