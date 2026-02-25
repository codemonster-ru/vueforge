# Sparkline

## Purpose

Provide compact inline trend visualizations on top of VueForge `Chart`.

## Props

- `values?: Array<number | null>` - trend values.
- `labels?: Array<string | number>` - optional labels; defaults to sequential index.
- `adapter?: ChartAdapter`
- `options?: Record<string, unknown>`
- `color?: string` (default `#2563eb`)
- `fillColor?: string` (default `rgba(37, 99, 235, 0.22)`)
- `area?: boolean` (default `false`)
- `smooth?: boolean` (default `true`)
- `showPoints?: boolean` (default `false`)
- `pointRadius?: number` (default `2`)
- `width?: number` (default `180`)
- `height?: number` (default `48`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Sparkline`)
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

## Example

```vue
<script setup lang="ts">
import { Sparkline, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <Sparkline :adapter="adapter" :values="[12, 14, 13, 15, 18, 17, 20]" :area="true" />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide nearby text delta/value fallback.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses axis-less compact rendering suitable for dense KPI cards and table cells.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy`.

## Testing

- Cover compact config, area mode, points, axis hiding, and adapter error/expose behavior.
