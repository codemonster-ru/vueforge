<template>
    <div class="vf-gauge-chart">
        <Chart
            ref="chartRef"
            class="vf-gauge-chart__chart"
            type="doughnut"
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
        <div class="vf-gauge-chart__center">
            <slot name="center" :value="clampedValue" :ratio="ratio">
                <strong class="vf-gauge-chart__value">{{ formattedValue }}</strong>
                <span class="vf-gauge-chart__label">{{ formattedRatio }}</span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Chart from '@/package/components/chart.vue';
import type { ChartAdapter, ChartAdapterInstance } from '@/package/components/chart-adapter';
import type { PassThroughOptions } from '@/package/config/pass-through';

interface Props {
    value?: number;
    min?: number;
    max?: number;
    label?: string;
    formatter?: (value: number, ratio: number) => string;
    trackColor?: string;
    valueColor?: string;
    cutout?: string | number;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
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
    value: 0,
    min: 0,
    max: 100,
    label: '',
    formatter: undefined,
    trackColor: '#e5e7eb',
    valueColor: '#2563eb',
    cutout: '72%',
    adapter: undefined,
    options: () => ({}),
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Gauge chart',
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
    center?: (props: { value: number; ratio: number }) => unknown;
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

const safeMin = computed(() => (Number.isFinite(props.min) ? props.min : 0));
const safeMax = computed(() => {
    if (!Number.isFinite(props.max)) {
        return safeMin.value + 1;
    }

    if (props.max <= safeMin.value) {
        return safeMin.value + 1;
    }

    return props.max;
});

const clampedValue = computed(() => Math.min(safeMax.value, Math.max(safeMin.value, props.value)));
const ratio = computed(() => (clampedValue.value - safeMin.value) / (safeMax.value - safeMin.value));

const chartData = computed(() => ({
    labels: ['Value', 'Remaining'],
    datasets: [
        {
            label: props.label || 'KPI',
            data: [clampedValue.value - safeMin.value, safeMax.value - clampedValue.value],
            backgroundColor: [props.valueColor, props.trackColor],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: props.cutout,
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
            callbacks: {
                label: (context: { dataIndex?: number; parsed?: number }) => {
                    if ((context.dataIndex ?? 0) === 1) {
                        return `Remaining: ${safeMax.value - clampedValue.value}`;
                    }
                    return `${props.label || 'Value'}: ${context.parsed ?? clampedValue.value}`;
                },
            },
        },
    },
}));

const chartOptions = computed(() => mergeOptions(baseOptions.value, props.options));

const formattedRatio = computed(() => `${Math.round(ratio.value * 100)}%`);
const formattedValue = computed(() => {
    if (props.formatter) {
        return props.formatter(clampedValue.value, ratio.value);
    }

    return String(clampedValue.value);
});

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
.vf-gauge-chart {
    position: relative;
    display: grid;
}

.vf-gauge-chart__center {
    position: absolute;
    inset: auto 0 20%;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.vf-gauge-chart__value {
    font-size: 1.1rem;
    line-height: 1.2;
}

.vf-gauge-chart__label {
    font-size: 0.8rem;
    opacity: 0.75;
}
</style>
