# AreaChart

## Purpose

Provide a typed area-chart component on top of VueForge `Chart`, with stacked and normalized variants for trend composition.

## Props

- `labels?: Array<string | number>` - x-axis labels.
- `series?: Array<AreaChartSeries>` - area series data.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `stacked?: boolean` (default `false`) - stack area layers.
- `normalized?: boolean` (default `false`) - enable normalized scaling in chart engine.
- `spanGaps?: boolean` (default `false`) - connect points across `null` values.
- `curve?: 'linear' | 'smooth'` (default `smooth`) - default line tension strategy.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Area chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `AreaChartSeries`

- `label: string`
- `data: Array<number | null>`
- `borderColor?: string`
- `backgroundColor?: string`
- `borderWidth?: number`
- `pointRadius?: number`
- `tension?: number`
- `spanGaps?: boolean`
- `stack?: string`
- `fill?: boolean | string`
- `...rest` - additional dataset fields are passed to the chart adapter.

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { AreaChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <AreaChart
        :adapter="adapter"
        :labels="['Q1', 'Q2', 'Q3', 'Q4']"
        :stacked="true"
        :series="[
            { label: 'New', data: [20, 28, 32, 35], backgroundColor: 'rgba(47,128,237,0.25)' },
            { label: 'Expansion', data: [10, 14, 16, 18], backgroundColor: 'rgba(39,174,96,0.25)' },
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

- Cover area dataset mapping, stacked/normalized behavior, and option overrides.
- Cover exposed `resize`/`refresh` methods and adapter error propagation.
