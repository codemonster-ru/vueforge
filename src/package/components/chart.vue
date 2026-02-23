<template>
    <div v-bind="rootAttrs">
        <div v-if="loading" v-bind="stateAttrs">
            <slot name="loading">{{ loadingText }}</slot>
        </div>
        <div v-else-if="isEmpty" v-bind="stateAttrs">
            <slot name="empty">{{ emptyText }}</slot>
        </div>
        <div v-else v-bind="canvasWrapAttrs">
            <canvas
                ref="canvasRef"
                v-bind="canvasAttrs"
                :width="width"
                :height="height"
                role="img"
                :aria-label="ariaLabel"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ChartAdapter, ChartAdapterInstance, ChartConfig, ChartData, ChartType } from './chart-adapter';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

interface Props {
    type?: ChartType;
    data?: ChartData;
    options?: Record<string, unknown>;
    adapter?: ChartAdapter;
    width?: number;
    height?: number;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    ariaLabel?: string;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'line',
    data: () => ({ labels: [], datasets: [] }),
    options: () => ({}),
    adapter: undefined,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Chart',
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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartAdapterInstance | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const chartConfig = computed<ChartConfig>(() => ({
    type: props.type,
    data: props.data,
    options: props.options,
}));

const isEmpty = computed(() => {
    const datasets = props.data?.datasets ?? [];

    return datasets.length === 0;
});

const ptContext = computed(() => ({
    loading: props.loading,
    empty: isEmpty.value,
    type: props.type,
}));
const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        ['vf-chart', props.loading ? 'vf-chart_loading' : null, isEmpty.value ? 'vf-chart_empty' : null]
            .filter(Boolean)
            .join(' '),
        props.unstyled,
    ),
);
const stateAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'state', ptContext.value), 'vf-chart__state', props.unstyled),
);
const canvasWrapAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'canvasWrap', ptContext.value), 'vf-chart__canvas-wrap', props.unstyled),
);
const canvasAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'canvas', ptContext.value), 'vf-chart__canvas', props.unstyled),
);

const destroyChart = () => {
    if (!chartInstance.value || !props.adapter?.destroy) {
        chartInstance.value = null;

        return;
    }

    props.adapter.destroy(chartInstance.value);
    chartInstance.value = null;
};

const mountChart = () => {
    if (!props.adapter || props.loading || isEmpty.value || !canvasRef.value) {
        destroyChart();

        return;
    }

    try {
        if (!chartInstance.value) {
            chartInstance.value = props.adapter.mount(canvasRef.value, chartConfig.value);
            emits('ready', chartInstance.value);

            return;
        }

        if (props.adapter.update) {
            props.adapter.update(chartInstance.value, chartConfig.value);
        } else {
            destroyChart();
            chartInstance.value = props.adapter.mount(canvasRef.value, chartConfig.value);
            emits('ready', chartInstance.value);
        }
    } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        emits('error', normalizedError);
    }
};

onMounted(() => {
    mountChart();

    if (typeof ResizeObserver !== 'undefined') {
        resizeObserver.value = new ResizeObserver(() => {
            if (!chartInstance.value || !props.adapter?.resize) {
                return;
            }

            props.adapter.resize(chartInstance.value);
        });

        nextTick(() => {
            if (canvasRef.value) {
                resizeObserver.value?.observe(canvasRef.value);
            }
        });
    }
});

watch(
    () => [props.type, props.loading, props.adapter] as const,
    () => {
        mountChart();
    },
);

watch(
    () => props.data,
    () => {
        mountChart();
    },
    { deep: true },
);

watch(
    () => props.options,
    () => {
        mountChart();
    },
    { deep: true },
);

onBeforeUnmount(() => {
    resizeObserver.value?.disconnect();
    destroyChart();
});

defineExpose({
    resize: () => {
        if (!chartInstance.value || !props.adapter?.resize) {
            return;
        }

        props.adapter.resize(chartInstance.value);
    },
    refresh: mountChart,
});
</script>

<style lang="scss">
.vf-chart {
    display: block;
    border: var(--vf-border-width) solid var(--vf-chart-border-color);
    border-radius: var(--vf-chart-border-radius);
    background: var(--vf-chart-background-color);
    color: var(--vf-chart-text-color);
    padding: var(--vf-chart-padding);
}

.vf-chart__canvas-wrap {
    min-height: var(--vf-chart-min-height);
}

.vf-chart__canvas {
    display: block;
    width: 100%;
    height: auto;
}

.vf-chart__state {
    min-height: var(--vf-chart-state-min-height);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--vf-chart-state-text-color);
    font-size: var(--vf-chart-state-font-size);
}

.vf-chart_loading,
.vf-chart_empty {
    border-style: dashed;
}
</style>
