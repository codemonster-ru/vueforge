<template>
    <div class="vf-pie-chart">
        <Chart
            ref="chartRef"
            class="vf-pie-chart__chart"
            :type="chartType"
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
        <ul v-if="showLegend && legendItems.length > 0" class="vf-pie-chart__legend" role="list">
            <li v-for="item in legendItems" :key="item.index" class="vf-pie-chart__legend-item" role="listitem">
                <button
                    type="button"
                    class="vf-pie-chart__legend-button"
                    :disabled="!legendInteractive"
                    :aria-pressed="!isHidden(item.index)"
                    @click="onLegendClick(item.index)"
                >
                    <span
                        class="vf-pie-chart__legend-swatch"
                        :style="{ backgroundColor: item.color }"
                        aria-hidden="true"
                    />
                    <slot name="legendLabel" :label="item.label" :value="item.value" :index="item.index">
                        <span class="vf-pie-chart__legend-label">{{ item.label }}</span>
                        <span class="vf-pie-chart__legend-value">{{ item.value }}</span>
                    </slot>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Chart from '@/package/components/chart.vue';
import type { ChartAdapter, ChartAdapterInstance, ChartType } from '@/package/components/chart-adapter';
import type { PassThroughOptions } from '@/package/config/pass-through';

export interface PieChartSeries {
    label?: string;
    data: Array<number | null>;
    backgroundColor?: Array<string>;
    borderColor?: Array<string>;
    borderWidth?: number;
    [key: string]: unknown;
}

export interface PieChartLegendTogglePayload {
    index: number;
    label: string;
    hidden: boolean;
}

export interface PieChartSliceClickPayload {
    index: number;
    label: string;
    value: number | null;
    datasetIndex: number;
}

export interface PieChartDrilldownPayload {
    source: 'legend' | 'slice';
    index: number;
    label: string;
    value: number | null;
    datasetIndex?: number;
}

interface Props {
    labels?: Array<string | number>;
    series?: Array<PieChartSeries>;
    variant?: 'pie' | 'donut';
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
    showLegend?: boolean;
    legendInteractive?: boolean;
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
    variant: 'pie',
    adapter: undefined,
    options: () => ({}),
    showLegend: true,
    legendInteractive: true,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Pie chart',
    lazy: true,
    lazyRootMargin: '200px',
    lazyThreshold: 0,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'ready', instance: ChartAdapterInstance): void;
    (event: 'error', error: Error): void;
    (event: 'legendToggle', payload: PieChartLegendTogglePayload): void;
    (event: 'sliceClick', payload: PieChartSliceClickPayload): void;
    (event: 'drilldown', payload: PieChartDrilldownPayload): void;
}>();

defineSlots<{
    loading?: () => unknown;
    empty?: () => unknown;
    legendLabel?: (props: { label: string; value: number | null; index: number }) => unknown;
}>();

type ChartRef = {
    resize: () => void;
    refresh: () => void;
};

const chartRef = ref<ChartRef | null>(null);
const hiddenIndices = ref<Set<number>>(new Set());

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

const chartType = computed<ChartType>(() => (props.variant === 'donut' ? 'doughnut' : 'pie'));

const isHidden = (index: number) => hiddenIndices.value.has(index);

const visibleSeries = computed(() =>
    props.series.map(item => ({
        ...item,
        data: item.data.map((entry, index) => (isHidden(index) ? null : entry)),
    })),
);

const legendItems = computed(() => {
    const firstSeries = props.series[0];
    const backgroundColors = Array.isArray(firstSeries?.backgroundColor) ? firstSeries.backgroundColor : [];

    return props.labels.map((entry, index) => {
        const numericValues = props.series
            .map(item => item.data[index])
            .filter((item): item is number => typeof item === 'number');
        const total = numericValues.reduce((sum, current) => sum + current, 0);

        return {
            index,
            label: String(entry),
            value: numericValues.length === 0 ? null : total,
            color: backgroundColors[index] ?? 'var(--vf-chart-text-color)',
        };
    });
});

const onLegendClick = (index: number) => {
    if (!props.legendInteractive || index < 0 || index >= props.labels.length) {
        return;
    }

    if (hiddenIndices.value.has(index)) {
        hiddenIndices.value.delete(index);
    } else {
        hiddenIndices.value.add(index);
    }

    hiddenIndices.value = new Set(hiddenIndices.value);

    const payload = {
        index,
        label: String(props.labels[index]),
        hidden: hiddenIndices.value.has(index),
    };
    emits('legendToggle', payload);
    emits('drilldown', {
        source: 'legend',
        index,
        label: payload.label,
        value: legendItems.value.find(item => item.index === index)?.value ?? null,
    });
};

const resolveSliceClick = (datasetIndex: number, index: number) => {
    if (datasetIndex < 0 || index < 0 || index >= props.labels.length) {
        return;
    }

    const dataset = visibleSeries.value[datasetIndex];
    const payload = {
        datasetIndex,
        index,
        label: String(props.labels[index]),
        value: dataset?.data[index] ?? null,
    };

    emits('sliceClick', payload);
    emits('drilldown', {
        source: 'slice',
        index,
        label: payload.label,
        value: payload.value,
        datasetIndex,
    });
};

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: props.variant === 'donut' ? '60%' : undefined,
    plugins: {
        legend: {
            display: !props.showLegend,
        },
    },
}));

const chartOptions = computed(() => {
    const userOptions = props.options;
    const userOnClick = userOptions.onClick;
    const merged = mergeOptions(baseOptions.value, userOptions);

    merged.onClick = (event: unknown, elements: Array<{ index?: number; datasetIndex?: number }>) => {
        const first = Array.isArray(elements) ? elements[0] : undefined;
        if (typeof first?.index === 'number') {
            resolveSliceClick(first.datasetIndex ?? 0, first.index);
        }

        if (typeof userOnClick === 'function') {
            userOnClick(event, elements);
        }
    };

    return merged;
});

const chartData = computed(() => ({
    labels: props.labels,
    datasets: visibleSeries.value,
}));

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
.vf-pie-chart {
    display: grid;
    gap: 0.75rem;
}

.vf-pie-chart__legend {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.4rem;
}

.vf-pie-chart__legend-button {
    width: 100%;
    border: var(--vf-border-width) solid var(--vf-chart-border-color);
    border-radius: var(--vf-radii-sm);
    background: transparent;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    text-align: left;
    font: inherit;
    cursor: pointer;
}

.vf-pie-chart__legend-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.vf-pie-chart__legend-swatch {
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}

.vf-pie-chart__legend-label {
    flex: 1;
}

.vf-pie-chart__legend-value {
    opacity: 0.8;
}
</style>
