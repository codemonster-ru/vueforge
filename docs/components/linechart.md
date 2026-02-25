# LineChart

## Purpose

Provide a typed line-chart component on top of VueForge `Chart`, with multi-series support, `null` gap handling, and threshold overlays.

## Props

- `labels?: Array<string | number>` - x-axis labels.
- `series?: Array<LineChartSeries>` - line series data.
- `thresholds?: Array<LineChartThreshold>` - horizontal overlay lines.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `spanGaps?: boolean` (default `false`) - connect points across `null` values.
- `curve?: 'linear' | 'smooth'` (default `linear`) - default line tension strategy.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Line chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `LineChartSeries`

- `label: string`
- `data: Array<number | null>`
- `borderColor?: string`
- `backgroundColor?: string`
- `borderWidth?: number`
- `pointRadius?: number`
- `tension?: number`
- `spanGaps?: boolean`
- `...rest` - additional dataset fields are passed to the chart adapter.

### `LineChartThreshold`

- `value: number`
- `label?: string`
- `color?: string`
- `dash?: Array<number>`
- `borderWidth?: number`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { LineChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <LineChart
        :adapter="adapter"
        :labels="['Jan', 'Feb', 'Mar', 'Apr']"
        :series="[
            { label: 'Revenue', data: [120, 140, null, 190], borderColor: '#2f80ed' },
            { label: 'Cost', data: [80, 95, 100, 110], borderColor: '#ef4444' },
        ]"
        :thresholds="[{ value: 150, label: 'Target', color: '#10b981' }]"
        :span-gaps="false"
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

- Cover multi-series mapping, threshold overlays, and `spanGaps` behavior.
- Cover options override behavior and exposed `resize`/`refresh` methods.
