<template>
    <Chart
        ref="chartRef"
        class="vf-histogram"
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

export type HistogramBinStrategy = 'sturges' | 'sqrt' | 'fd' | 'fixed';

export interface HistogramBin {
    start: number;
    end: number;
    count: number;
    density: number;
    label: string;
}

interface Props {
    values?: Array<number>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    binStrategy?: HistogramBinStrategy;
    binCount?: number;
    binSize?: number;
    min?: number;
    max?: number;
    densityOverlay?: boolean;
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
    adapter: undefined,
    options: () => ({}),
    binStrategy: 'sturges',
    binCount: undefined,
    binSize: undefined,
    min: undefined,
    max: undefined,
    densityOverlay: false,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Histogram',
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

const finiteValues = computed(() => props.values.filter(value => Number.isFinite(value)));

const quartiles = (values: Array<number>) => {
    if (values.length === 0) {
        return { q1: 0, q3: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const resolve = (q: number) => {
        const index = (sorted.length - 1) * q;
        const low = Math.floor(index);
        const high = Math.ceil(index);

        if (low === high) {
            return sorted[low];
        }

        return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
    };

    return {
        q1: resolve(0.25),
        q3: resolve(0.75),
    };
};

const resolveBinCount = (values: Array<number>, range: number) => {
    if (values.length === 0) {
        return 0;
    }

    if (props.binStrategy === 'fixed') {
        if (typeof props.binSize === 'number' && props.binSize > 0) {
            return Math.max(1, Math.ceil(range / props.binSize));
        }

        return Math.max(1, props.binCount ?? 10);
    }

    if (typeof props.binCount === 'number' && props.binCount > 0) {
        return props.binCount;
    }

    if (props.binStrategy === 'sqrt') {
        return Math.max(1, Math.ceil(Math.sqrt(values.length)));
    }

    if (props.binStrategy === 'fd') {
        const { q1, q3 } = quartiles(values);
        const iqr = q3 - q1;
        const width = iqr > 0 ? (2 * iqr) / Math.cbrt(values.length) : 0;
        if (width > 0) {
            return Math.max(1, Math.ceil(range / width));
        }

        return Math.max(1, Math.ceil(Math.sqrt(values.length)));
    }

    return Math.max(1, Math.ceil(Math.log2(values.length) + 1));
};

const bins = computed<Array<HistogramBin>>(() => {
    if (finiteValues.value.length === 0) {
        return [];
    }

    const dataMin = props.min ?? Math.min(...finiteValues.value);
    const dataMax = props.max ?? Math.max(...finiteValues.value);
    const range = Math.max(dataMax - dataMin, 1);
    const count = Math.min(200, resolveBinCount(finiteValues.value, range));

    if (count <= 0) {
        return [];
    }

    const width =
        props.binStrategy === 'fixed' && typeof props.binSize === 'number' && props.binSize > 0
            ? props.binSize
            : range / count;
    const counts = Array.from({ length: count }, () => 0);

    for (const value of finiteValues.value) {
        if (value < dataMin || value > dataMax) {
            continue;
        }

        const index = Math.min(count - 1, Math.max(0, Math.floor((value - dataMin) / width)));
        counts[index] += 1;
    }

    return counts.map((value, index) => {
        const start = dataMin + index * width;
        const end = index === count - 1 ? dataMax : start + width;

        return {
            start,
            end,
            count: value,
            density: finiteValues.value.length === 0 || width <= 0 ? 0 : value / (finiteValues.value.length * width),
            label: `${start.toFixed(2)}-${end.toFixed(2)}`,
        };
    });
});

const chartData = computed(() => {
    const baseDataset = {
        label: 'Frequency',
        data: bins.value.map(bin => bin.count),
        backgroundColor: '#2f80ed',
        borderColor: '#2f80ed',
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1,
    };
    const densityDataset =
        props.densityOverlay && bins.value.length > 0
            ? [
                  {
                      type: 'line',
                      label: 'Density',
                      data: bins.value.map(bin => bin.density),
                      yAxisID: 'yDensity',
                      borderColor: '#ef4444',
                      borderWidth: 1.5,
                      pointRadius: 0,
                      fill: false,
                      tension: 0.2,
                  },
              ]
            : [];

    return {
        labels: bins.value.map(bin => bin.label),
        datasets: [baseDataset, ...densityDataset],
    };
});

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Bins',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Count',
            },
            beginAtZero: true,
        },
        yDensity: {
            display: props.densityOverlay,
            position: 'right',
            beginAtZero: true,
            grid: {
                drawOnChartArea: false,
            },
            title: {
                display: props.densityOverlay,
                text: 'Density',
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
    bins,
});
</script>

<style lang="scss">
.vf-histogram {
    display: block;
}
</style>
