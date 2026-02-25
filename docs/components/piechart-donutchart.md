# PieChart / DonutChart

## Purpose

Provide category-distribution charts on top of VueForge `Chart`, including interactive legend toggles and drilldown hooks.

`DonutChart` is a convenience alias of `PieChart` with `variant="donut"`.

## Props

- `labels?: Array<string | number>` - category labels.
- `series?: Array<PieChartSeries>` - category values (single or multiple datasets).
- `variant?: 'pie' | 'donut'` (PieChart only, default `pie`)
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `showLegend?: boolean` (default `true`) - render VueForge legend list under chart.
- `legendInteractive?: boolean` (default `true`) - allow toggling category visibility from legend.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (`Pie chart` / `Donut chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `PieChartSeries`

- `label?: string`
- `data: Array<number | null>`
- `backgroundColor?: Array<string>`
- `borderColor?: Array<string>`
- `borderWidth?: number`
- `...rest` - additional dataset fields are passed to the chart adapter.

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)
- `legendToggle` (`{ index, label, hidden }`) - fired when legend item is toggled.
- `sliceClick` (`{ datasetIndex, index, label, value }`) - fired when chart engine click callback reports a slice.
- `drilldown` (`{ source: 'legend' | 'slice', index, label, value, datasetIndex? }`) - unified hook for downstream drill-in flows.

## Slots

- `loading`
- `empty`
- `legendLabel` (`{ label, value, index }`) - custom legend row content.

## Examples

```vue
<script setup lang="ts">
import { PieChart, DonutChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <PieChart
        :adapter="adapter"
        :labels="['North', 'South', 'West']"
        :series="[{ data: [42, 35, 23], backgroundColor: ['#2f80ed', '#27ae60', '#f2994a'] }]"
        @drilldown="payload => console.log(payload)"
    />

    <DonutChart
        :adapter="adapter"
        :labels="['Free', 'Pro', 'Enterprise']"
        :series="[{ data: [58, 34, 8], backgroundColor: ['#93c5fd', '#2f80ed', '#1d4ed8'] }]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- Legend controls are keyboard-focusable buttons and expose `aria-pressed` state.
- For critical metrics, provide a nearby data table summary.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and stretches to container width.
- Legend wraps below chart and remains keyboard-accessible on small screens.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states and legend structure are deterministic for hydration-safe markup.

## Testing

- Cover legend rendering/toggle behavior and drilldown emissions.
- Cover pie/donut variant config and slice click hook behavior.
- Cover alias wrapper (`DonutChart`) event forwarding.
