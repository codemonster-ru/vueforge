# RadarChart

## Purpose

Provide a typed radar chart component on top of VueForge `Chart` for multi-series comparison across shared dimensions.

## Props

- `labels?: Array<string | number>` - axis labels.
- `series?: Array<RadarChartSeries>` - radar datasets.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `fill?: boolean` (default `true`) - default area fill for series.
- `beginAtZero?: boolean` (default `true`) - radial axis baseline behavior.
- `suggestedMin?: number` - radial axis lower hint.
- `suggestedMax?: number` - radial axis upper hint.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Radar chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `RadarChartSeries`

- `label: string`
- `data: Array<number | null>`
- `backgroundColor?: string`
- `borderColor?: string`
- `borderWidth?: number`
- `pointBackgroundColor?: string`
- `pointBorderColor?: string`
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
import { RadarChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <RadarChart
        :adapter="adapter"
        :labels="['Speed', 'Reliability', 'Cost', 'Support']"
        :series="[
            { label: 'Team A', data: [82, 91, 65, 73] },
            { label: 'Team B', data: [74, 86, 72, 81], fill: false },
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
- Use container/grid constraints to avoid overflow in narrow cards.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states are deterministic for hydration-safe markup.

## Testing

- Cover multi-series dataset mapping and radial scale configuration.
- Cover options override behavior and adapter error/expose contract.
