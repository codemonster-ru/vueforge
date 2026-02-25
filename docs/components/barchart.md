# BarChart

## Purpose

Provide a typed bar-chart component on top of VueForge `Chart`, with built-in grouped/stacked/horizontal variants.

## Props

- `labels?: Array<string | number>` - axis labels.
- `series?: Array<BarChartSeries>` - bar series data.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `grouped?: boolean` (default `true`) - apply grouped dataset behavior.
- `stacked?: boolean` (default `false`) - stack bars across axes.
- `horizontal?: boolean` (default `false`) - switch index axis to horizontal bars.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Bar chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `BarChartSeries`

- `label: string`
- `data: Array<number | null>`
- `backgroundColor?: string`
- `borderColor?: string`
- `borderWidth?: number`
- `stack?: string`
- `grouped?: boolean`
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
import { BarChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <BarChart
        :adapter="adapter"
        :labels="['Q1', 'Q2', 'Q3', 'Q4']"
        :series="[
            { label: 'North', data: [120, 160, 140, 190], backgroundColor: '#2f80ed' },
            { label: 'South', data: [90, 130, 150, 170], backgroundColor: '#27ae60' },
        ]"
    />
</template>
```

## Stacked Horizontal Variant

```vue
<BarChart
    :adapter="adapter"
    :labels="['Enterprise', 'SMB', 'Self-serve']"
    :horizontal="true"
    :stacked="true"
    :series="[
        { label: 'New', data: [42, 58, 76], stack: 'pipeline' },
        { label: 'Expansion', data: [21, 33, 29], stack: 'pipeline' },
    ]"
/>
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

- Cover dataset mapping and grouped/stacked/horizontal options.
- Cover error propagation and exposed `resize`/`refresh` methods.
