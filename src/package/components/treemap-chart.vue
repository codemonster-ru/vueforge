<template>
    <Chart
        ref="chartRef"
        class="vf-treemap-chart"
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

export interface TreemapChartNode {
    id: string;
    label: string;
    value?: number;
    color?: string;
    parentId?: string;
    children?: Array<TreemapChartNode>;
}

export interface TreemapChartTile {
    id: string;
    label: string;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

interface LayoutNode {
    id: string;
    label: string;
    value: number;
    color?: string;
    children: Array<LayoutNode>;
}

interface Props {
    nodes?: Array<TreemapChartNode>;
    adapter?: ChartAdapter;
    options?: Record<string, unknown>;
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
    nodes: () => [],
    adapter: undefined,
    options: () => ({}),
    palette: () => ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'],
    width: 640,
    height: 320,
    loading: false,
    loadingText: 'Loading chart...',
    emptyText: 'No chart data',
    ariaLabel: 'Treemap chart',
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

const normalizeTree = (nodes: Array<TreemapChartNode>): Array<LayoutNode> => {
    if (nodes.some(node => Array.isArray(node.children))) {
        const visit = (node: TreemapChartNode): LayoutNode => {
            const children = (node.children ?? []).map(visit);
            const value =
                typeof node.value === 'number' ? node.value : children.reduce((sum, child) => sum + child.value, 0);
            return {
                id: node.id,
                label: node.label,
                value: Math.max(0, value),
                color: node.color,
                children,
            };
        };

        return nodes.map(visit);
    }

    const map = new Map<string, LayoutNode>();
    for (const node of nodes) {
        map.set(node.id, {
            id: node.id,
            label: node.label,
            value: Math.max(0, node.value ?? 0),
            color: node.color,
            children: [],
        });
    }

    const roots: Array<LayoutNode> = [];
    for (const node of nodes) {
        const current = map.get(node.id);
        if (!current) {
            continue;
        }

        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId)?.children.push(current);
            continue;
        }

        roots.push(current);
    }

    for (const root of roots) {
        const assign = (item: LayoutNode) => {
            if (item.children.length > 0 && item.value <= 0) {
                item.value = item.children.reduce((sum, child) => sum + child.value, 0);
            }
            item.children.forEach(assign);
        };
        assign(root);
    }

    return roots;
};

const layoutTiles = (
    nodes: Array<LayoutNode>,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
): Array<TreemapChartTile> => {
    const total = nodes.reduce((sum, node) => sum + Math.max(0, node.value), 0);
    if (total <= 0 || width <= 0 || height <= 0) {
        return [];
    }

    const horizontal = depth % 2 === 0;
    let cursor = horizontal ? x : y;
    const tiles: Array<TreemapChartTile> = [];

    for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const ratio = node.value / total;
        const segment = (horizontal ? width : height) * ratio;
        const tileX = horizontal ? cursor : x;
        const tileY = horizontal ? y : cursor;
        const tileWidth = horizontal ? segment : width;
        const tileHeight = horizontal ? height : segment;

        if (node.children.length > 0) {
            tiles.push(...layoutTiles(node.children, tileX, tileY, tileWidth, tileHeight, depth + 1));
        } else {
            tiles.push({
                id: node.id,
                label: node.label,
                value: node.value,
                x: tileX,
                y: tileY,
                width: tileWidth,
                height: tileHeight,
                color: node.color ?? props.palette[index % props.palette.length],
            });
        }

        cursor += segment;
    }

    return tiles;
};

const tiles = computed<Array<TreemapChartTile>>(() => {
    const roots = normalizeTree(props.nodes);
    return layoutTiles(roots, 0, 0, 100, 100, 0).filter(tile => tile.value > 0);
});

const chartData = computed(() => ({
    datasets: [
        {
            label: 'Treemap',
            data: tiles.value.map(tile => ({
                x: tile.x + tile.width / 2,
                y: tile.y + tile.height / 2,
                r: Math.min(tile.width, tile.height) / 2,
                tile,
            })),
            backgroundColor: tiles.value.map(tile => tile.color),
            pointStyle: 'rectRounded',
        },
    ],
}));

const tooltipLabel = (context: { raw?: { tile?: TreemapChartTile } }) => {
    const tile = context.raw?.tile;
    if (!tile) {
        return '';
    }

    return `${tile.label}: ${tile.value}`;
};

const xTick = (value: number) => `${Math.round(value)}%`;
const yTick = (value: number) => `${Math.round(value)}%`;

const baseOptions = computed<Record<string, unknown>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'linear',
            min: 0,
            max: 100,
            ticks: {
                callback: xTick,
            },
            grid: {
                display: false,
            },
        },
        y: {
            type: 'linear',
            min: 0,
            max: 100,
            reverse: true,
            ticks: {
                callback: yTick,
            },
            grid: {
                display: false,
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
    tiles,
});
</script>

<style lang="scss">
.vf-treemap-chart {
    display: block;
}
</style>
