<template>
    <PieChart
        class="vf-donut-chart"
        :labels="labels"
        :series="series"
        variant="donut"
        :adapter="adapter"
        :options="options"
        :show-legend="showLegend"
        :legend-interactive="legendInteractive"
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
        @legend-toggle="onLegendToggle"
        @slice-click="onSliceClick"
        @drilldown="onDrilldown"
    >
        <template v-if="$slots.loading" #loading>
            <slot name="loading" />
        </template>
        <template v-if="$slots.empty" #empty>
            <slot name="empty" />
        </template>
        <template v-if="$slots.legendLabel" #legendLabel="slotProps">
            <slot name="legendLabel" v-bind="slotProps" />
        </template>
    </PieChart>
</template>

<script setup lang="ts">
import PieChart from '@/package/components/pie-chart.vue';
import type {
    PieChartDrilldownPayload,
    PieChartLegendTogglePayload,
    PieChartSeries,
    PieChartSliceClickPayload,
} from '@/package/components/pie-chart.vue';
import type { ChartAdapter, ChartAdapterInstance } from '@/package/components/chart-adapter';
import type { PassThroughOptions } from '@/package/config/pass-through';

interface Props {
    labels?: Array<string | number>;
    series?: Array<PieChartSeries>;
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

withDefaults(defineProps<Props>(), {
    labels: () => [],
    series: () => [],
    adapter: undefined,
    options: () => ({}),
    showLegend: true,
    legendInteractive: true,
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Donut chart',
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

const onReady = (instance: ChartAdapterInstance) => emits('ready', instance);
const onError = (error: Error) => emits('error', error);
const onLegendToggle = (payload: PieChartLegendTogglePayload) => emits('legendToggle', payload);
const onSliceClick = (payload: PieChartSliceClickPayload) => emits('sliceClick', payload);
const onDrilldown = (payload: PieChartDrilldownPayload) => emits('drilldown', payload);
</script>

<style lang="scss">
.vf-donut-chart {
    display: block;
}
</style>
