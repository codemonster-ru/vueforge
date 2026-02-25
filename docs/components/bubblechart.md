# BubbleChart

## Purpose

Provide a typed bubble-chart component on top of VueForge `Chart`, including size encoding and tooltip formatting contracts.

## Props

- `series?: Array<BubbleChartSeries>` - bubble datasets.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `minRadius?: number` (default `4`) - minimum radius when encoding from `size`.
- `maxRadius?: number` (default `18`) - maximum radius when encoding from `size`.
- `tooltipFormatter?: (context: BubbleChartTooltipContext) => string` - tooltip label contract.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Bubble chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `BubbleChartPoint`

- `x: number`
- `y: number`
- `r?: number` - explicit bubble radius.
- `size?: number` - value used for auto radius encoding when `r` is absent.
- `label?: string`
- `...rest` - additional point fields are preserved.

### `BubbleChartSeries`

- `label: string`
- `data: Array<BubbleChartPoint>`
- `backgroundColor?: string`
- `borderColor?: string`
- `borderWidth?: number`
- `...rest` - additional dataset fields are passed to the chart adapter.

### `BubbleChartTooltipContext`

- `label: string`
- `x: number`
- `y: number`
- `r: number`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { BubbleChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <BubbleChart
        :adapter="adapter"
        :min-radius="6"
        :max-radius="20"
        :tooltip-formatter="ctx => `${ctx.label}: value=${ctx.y}, size=${ctx.r}`"
        :series="[
            {
                label: 'Accounts',
                data: [
                    { x: 1, y: 12, size: 10 },
                    { x: 2, y: 18, size: 20 },
                    { x: 3, y: 15, size: 30 },
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

- Cover explicit radius handling and size-based radius encoding.
- Cover tooltip formatter contract and adapter error/expose behavior.
