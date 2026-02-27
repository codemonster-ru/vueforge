<template>
    <div ref="rootRef" v-bind="rootAttrs">
        <div v-if="loading" v-bind="stateAttrs">
            <slot name="loading">{{ loadingText }}</slot>
        </div>
        <div v-else-if="isEmpty" v-bind="stateAttrs">
            <slot name="empty">{{ emptyText }}</slot>
        </div>
        <div v-else v-bind="canvasWrapAttrs">
            <p v-if="a11yDescriptionText" :id="descriptionId" class="vf-chart__sr-only">{{ a11yDescriptionText }}</p>
            <canvas
                ref="canvasRef"
                v-bind="canvasAttrs"
                :width="width"
                :height="height"
                role="img"
                :aria-label="ariaLabel"
                :aria-describedby="a11yDescriptionText ? descriptionId : undefined"
                tabindex="0"
            />
            <button
                v-if="a11yTableFallback"
                type="button"
                class="vf-chart__table-toggle"
                :aria-controls="tableId"
                :aria-expanded="showDataTable ? 'true' : 'false'"
                @click="showDataTable = !showDataTable"
            >
                {{ showDataTable ? hideTableText : showTableText }}
            </button>
            <div v-if="a11yTableFallback && showDataTable" :id="tableId" class="vf-chart__table-wrap">
                <table class="vf-chart__table">
                    <caption>
                        {{
                            tableCaption
                        }}
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">{{ tableLabelHeader }}</th>
                            <th v-for="dataset in normalizedDatasets" :key="dataset.key" scope="col">
                                {{ dataset.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in dataTableRows" :key="row.id">
                            <th scope="row">{{ row.label }}</th>
                            <td v-for="(value, index) in row.values" :key="`${row.id}-${index}`">{{ value }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ChartAdapter, ChartAdapterInstance, ChartConfig, ChartData, ChartType } from './chart-adapter';
import { createChartCsv } from './chart-export';
import { createHighDensityChartOptions } from './chart-performance';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

export interface ChartProps {
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
    a11ySummary?: string;
    a11yKeyboardHint?: string;
    a11yTableFallback?: boolean;
    tableCaption?: string;
    tableLabelHeader?: string;
    showTableText?: string;
    hideTableText?: string;
    printMode?: boolean;
    highDensity?: boolean;
    highDensityPointThreshold?: number;
    highDensityDecimationAlgorithm?: 'lttb' | 'min-max';
    highDensitySamples?: number;
    lazy?: boolean;
    lazyRootMargin?: string;
    lazyThreshold?: number;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<ChartProps>(), {
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
    a11ySummary: '',
    a11yKeyboardHint: 'Press Tab to focus chart and open the data table fallback control.',
    a11yTableFallback: false,
    tableCaption: 'Chart data table',
    tableLabelHeader: 'Label',
    showTableText: 'Show data table',
    hideTableText: 'Hide data table',
    printMode: false,
    highDensity: false,
    highDensityPointThreshold: 2000,
    highDensityDecimationAlgorithm: 'lttb',
    highDensitySamples: undefined,
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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const chartInstance = ref<ChartAdapterInstance | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);
const isVisible = ref(false);
const showDataTable = ref(false);
const isPrintMode = ref(props.printMode);
const componentUid = getCurrentInstance()?.uid ?? 0;
const descriptionId = `vf-chart-description-${componentUid}`;
const tableId = `vf-chart-table-${componentUid}`;

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

const runtimeChartOptions = computed<Record<string, unknown>>(() => {
    const highDensityOptions = createHighDensityChartOptions(props.data, {
        enabled: props.highDensity,
        pointThreshold: props.highDensityPointThreshold,
        decimationAlgorithm: props.highDensityDecimationAlgorithm,
        samples: props.highDensitySamples,
    });

    return mergeOptions(highDensityOptions, props.options);
});

const chartConfig = computed<ChartConfig>(() => ({
    type: props.type,
    data: props.data,
    options: runtimeChartOptions.value,
}));

const normalizedDatasets = computed(() =>
    (props.data?.datasets ?? []).map((dataset, index) => {
        const datasetLabel =
            typeof dataset.label === 'string' && dataset.label.length > 0 ? dataset.label : `Series ${index + 1}`;

        return {
            key: `series-${index}`,
            label: datasetLabel,
            data: Array.isArray(dataset.data) ? dataset.data : [],
        };
    }),
);
const rowCount = computed(() => {
    const labelCount = props.data?.labels?.length ?? 0;
    const maxDatasetLength = Math.max(0, ...normalizedDatasets.value.map(dataset => dataset.data.length));

    return Math.max(labelCount, maxDatasetLength);
});
const dataTableRows = computed(() =>
    Array.from({ length: rowCount.value }, (_, rowIndex) => {
        const rawLabel = props.data?.labels?.[rowIndex];
        const label =
            rawLabel === undefined || rawLabel === null || rawLabel === '' ? `${rowIndex + 1}` : String(rawLabel);
        const values = normalizedDatasets.value.map(dataset => {
            const value = dataset.data[rowIndex];

            return value === undefined || value === null || value === '' ? '-' : String(value);
        });

        return {
            id: `row-${rowIndex}`,
            label,
            values,
        };
    }),
);
const a11yDescriptionText = computed(() => [props.a11ySummary, props.a11yKeyboardHint].filter(Boolean).join(' '));

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
        [
            'vf-chart',
            props.loading ? 'vf-chart_loading' : null,
            isEmpty.value ? 'vf-chart_empty' : null,
            isPrintMode.value ? 'vf-chart_print' : null,
        ]
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
    if (!props.adapter || props.loading || isEmpty.value || !canvasRef.value || (props.lazy && !isVisible.value)) {
        destroyChart();

        return;
    }

    try {
        if (!chartInstance.value) {
            chartInstance.value = props.adapter.mount(canvasRef.value, chartConfig.value);
            emits('ready', chartInstance.value);
            syncPrintModeWithInstance();

            return;
        }

        if (props.adapter.update) {
            props.adapter.update(chartInstance.value, chartConfig.value);
            syncPrintModeWithInstance();
        } else {
            destroyChart();
            chartInstance.value = props.adapter.mount(canvasRef.value, chartConfig.value);
            emits('ready', chartInstance.value);
            syncPrintModeWithInstance();
        }
    } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        emits('error', normalizedError);
    }
};

const resizeChart = () => {
    if (!chartInstance.value || !props.adapter?.resize) {
        return;
    }

    props.adapter.resize(chartInstance.value);
};

const syncPrintModeWithInstance = () => {
    if (!chartInstance.value || !props.adapter?.setPrintMode) {
        return;
    }

    props.adapter.setPrintMode(chartInstance.value, isPrintMode.value);
};

const exportAsPng = () => {
    if (!chartInstance.value) {
        return '';
    }

    return props.adapter?.exportPng?.(chartInstance.value, chartConfig.value) ?? '';
};

const exportAsSvg = () => {
    if (!chartInstance.value) {
        return '';
    }

    return props.adapter?.exportSvg?.(chartInstance.value, chartConfig.value) ?? '';
};

const exportAsCsv = () => {
    if (chartInstance.value && props.adapter?.exportCsv) {
        return props.adapter.exportCsv(chartInstance.value, chartConfig.value);
    }

    return createChartCsv(props.data);
};

const applyPrintMode = (enabled: boolean) => {
    isPrintMode.value = enabled;
    syncPrintModeWithInstance();
};

const setupIntersectionObserver = () => {
    intersectionObserver.value?.disconnect();
    intersectionObserver.value = null;

    if (!props.lazy) {
        isVisible.value = true;

        return;
    }

    const target = rootRef.value ?? canvasRef.value;
    if (!target || typeof IntersectionObserver === 'undefined') {
        isVisible.value = true;

        return;
    }

    isVisible.value = false;
    intersectionObserver.value = new IntersectionObserver(
        entries => {
            if (!entries.some(entry => entry.isIntersecting || entry.intersectionRatio > 0)) {
                return;
            }

            isVisible.value = true;
            intersectionObserver.value?.disconnect();
            intersectionObserver.value = null;
            mountChart();
        },
        {
            root: null,
            rootMargin: props.lazyRootMargin,
            threshold: props.lazyThreshold,
        },
    );

    intersectionObserver.value.observe(target);
};

const onWindowResize = () => {
    resizeChart();
};

onMounted(() => {
    applyPrintMode(props.printMode);
    setupIntersectionObserver();
    mountChart();

    if (typeof ResizeObserver !== 'undefined') {
        resizeObserver.value = new ResizeObserver(() => {
            resizeChart();
        });

        nextTick(() => {
            if (rootRef.value) {
                resizeObserver.value?.observe(rootRef.value);
            }
        });
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', onWindowResize, false);
    }
});

watch(
    () => [props.type, props.loading, props.adapter, props.lazy, isVisible.value] as const,
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

watch(
    () => [props.lazy, props.lazyRootMargin, props.lazyThreshold] as const,
    () => {
        setupIntersectionObserver();
        mountChart();
    },
);

watch(
    () => props.printMode,
    value => {
        applyPrintMode(value);
    },
);

onBeforeUnmount(() => {
    intersectionObserver.value?.disconnect();
    resizeObserver.value?.disconnect();
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onWindowResize, false);
    }
    destroyChart();
});

defineExpose({
    resize: () => {
        resizeChart();
    },
    refresh: mountChart,
    exportAsPng,
    exportAsSvg,
    exportAsCsv,
    setPrintMode: (enabled: boolean) => {
        applyPrintMode(enabled);
    },
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

.vf-chart__canvas:focus-visible {
    outline: 2px solid var(--vf-chart-focus-outline-color, var(--vf-primary-color));
    outline-offset: var(--vf-chart-focus-outline-offset, 2px);
}

.vf-chart__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.vf-chart__table-toggle {
    margin-top: 0.75rem;
    background: var(--vf-chart-control-background-color, var(--vf-bg-color));
    color: var(--vf-chart-control-text-color, var(--vf-text-color));
    border: 1px solid var(--vf-chart-control-border-color, var(--vf-border-color));
    border-radius: var(--vf-radii-sm);
    padding: 0.35rem 0.6rem;
}

.vf-chart__table-toggle:hover {
    background: var(--vf-chart-control-hover-background-color, var(--vf-bg-color));
}

.vf-chart__table-wrap {
    margin-top: 0.75rem;
    overflow-x: auto;
}

.vf-chart__table {
    width: 100%;
    border-collapse: collapse;
}

.vf-chart__table th,
.vf-chart__table td {
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--vf-chart-table-border-color, var(--vf-chart-border-color));
    text-align: left;
}

.vf-chart__table th {
    background: var(--vf-chart-table-header-background-color, var(--vf-bg-color));
    color: var(--vf-chart-table-header-text-color, var(--vf-chart-text-color));
}

.vf-chart__table tbody tr:hover {
    background: var(--vf-chart-table-row-hover-background-color, var(--vf-bg-color));
}

.vf-chart__state {
    min-height: var(--vf-chart-state-min-height);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vf-chart-state-background-color, var(--vf-bg-color));
    border: 1px var(--vf-chart-state-border-style, dashed)
        var(--vf-chart-state-border-color, var(--vf-chart-border-color));
    color: var(--vf-chart-state-text-color);
    font-size: var(--vf-chart-state-font-size);
}

.vf-chart_loading,
.vf-chart_empty {
    border-style: var(--vf-chart-state-border-style, dashed);
}

.vf-chart_print {
    border-style: solid;
    break-inside: avoid;
}

@media print {
    .vf-chart {
        border-color: var(--vf-chart-border-color, #d1d5db);
        background: #ffffff;
        color: #000000;
        box-shadow: none;
    }

    .vf-chart__table-toggle {
        display: none;
    }
}
</style>
