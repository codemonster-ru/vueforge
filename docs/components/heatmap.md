# Heatmap

## Purpose

Provide a typed heatmap component on top of VueForge `Chart`, including axis labeling and range legend support.

## Props

- `cells?: Array<HeatmapCell>` - matrix cells.
- `xLabels?: Array<string | number>` - explicit x-axis labels.
- `yLabels?: Array<string | number>` - explicit y-axis labels.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `colorRange?: Array<string>` - palette from low to high values.
- `showRangeLegend?: boolean` (default `true`) - render value-range legend.
- `cellRadius?: number` (default `14`) - visual cell size in bubble renderer.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Heatmap`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `HeatmapCell`

- `x: string | number`
- `y: string | number`
- `value: number`

### `HeatmapRangeItem`

- `min: number`
- `max: number`
- `color: string`
- `label: string`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { Heatmap, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <Heatmap
        :adapter="adapter"
        :x-labels="['Mon', 'Tue', 'Wed']"
        :y-labels="['API', 'Queue', 'Workers']"
        :cells="[
            { x: 'Mon', y: 'API', value: 32 },
            { x: 'Tue', y: 'API', value: 45 },
            { x: 'Wed', y: 'Workers', value: 12 },
        ]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide a nearby table summary with numeric values.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and stretches to container width.
- Range legend wraps and remains readable on small viewports.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states and range legend structure are deterministic for hydration-safe markup.

## Testing

- Cover cell-to-axis mapping, legend rendering, and tooltip/axis label callbacks.
- Cover adapter error propagation and exposed methods.
