# ScatterChart

## Purpose

Provide a typed scatter-chart component on top of VueForge `Chart`, including optional regression line and cluster-splitting support.

## Props

- `series?: Array<ScatterChartSeries>` - scatter datasets.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `regressionLine?: boolean` (default `false`) - append linear regression dataset per series.
- `regressionLineColor?: string` (default `#ef4444`) - line color for generated regression datasets.
- `clusterOptions?: ScatterChartClusterOptions` - optional cluster splitting mode.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Scatter chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `ScatterChartPoint`

- `x: number`
- `y: number`
- `cluster?: string`
- `...rest` - additional point fields are preserved.

### `ScatterChartSeries`

- `label: string`
- `data: Array<ScatterChartPoint>`
- `pointRadius?: number`
- `pointBackgroundColor?: string`
- `pointBorderColor?: string`
- `pointBorderWidth?: number`
- `showLine?: boolean`
- `...rest` - additional dataset fields are passed to the chart adapter.

### `ScatterChartClusterOptions`

- `enabled?: boolean`
- `palette?: Array<string>`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { ScatterChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <ScatterChart
        :adapter="adapter"
        :regression-line="true"
        :cluster-options="{ enabled: true, palette: ['#2f80ed', '#27ae60'] }"
        :series="[
            {
                label: 'Leads',
                data: [
                    { x: 1, y: 42, cluster: 'new' },
                    { x: 2, y: 50, cluster: 'expansion' },
                    { x: 3, y: 58, cluster: 'new' },
                ],
            },
        ]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide a nearby data table summary.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and stretches to container width.
- Use grid/container constraints to avoid overflow in narrow cards.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states are deterministic for hydration-safe markup.

## Testing

- Cover dataset mapping, regression line generation, and cluster splitting behavior.
- Cover exposed `resize`/`refresh` methods and adapter error propagation.
