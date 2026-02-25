# GaugeChart

## Purpose

Provide a single KPI radial gauge on top of VueForge `Chart`.

## Props

- `value?: number` (default `0`)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `label?: string` - metric label used in tooltip.
- `formatter?: (value: number, ratio: number) => string` - center value formatter.
- `trackColor?: string` (default `#e5e7eb`)
- `valueColor?: string` (default `#2563eb`)
- `cutout?: string | number` (default `72%`)
- `adapter?: ChartAdapter`
- `options?: Record<string, unknown>`
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Gauge chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`
- `center` (`{ value, ratio }`)

## Example

```vue
<script setup lang="ts">
import { GaugeChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <GaugeChart
        :adapter="adapter"
        :value="87"
        label="SLA"
        :formatter="(value, ratio) => `${value} (${Math.round(ratio * 100)}%)`"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical KPI decisions, provide nearby textual/tablular fallback.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and centered overlay label.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy`.

## Testing

- Cover clamping behavior, radial config, formatter/tooltip contract, and adapter error/expose behavior.
