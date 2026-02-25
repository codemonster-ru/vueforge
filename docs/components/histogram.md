# Histogram

## Purpose

Provide a typed histogram component on top of VueForge `Chart`, with configurable binning strategies and optional density overlay.

## Props

- `values?: Array<number>` - raw numeric values.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `binStrategy?: 'sturges' | 'sqrt' | 'fd' | 'fixed'` (default `sturges`)
- `binCount?: number` - explicit bin count override.
- `binSize?: number` - fixed bin width when `binStrategy='fixed'`.
- `min?: number` - lower range bound.
- `max?: number` - upper range bound.
- `densityOverlay?: boolean` (default `false`) - add density line over bars.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Histogram`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Exposed Types

- `HistogramBinStrategy`
- `HistogramBin` (`{ start, end, count, density, label }`)

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { Histogram, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <Histogram
        :adapter="adapter"
        :values="[12, 13, 14, 18, 19, 24, 25, 28, 30, 35, 36, 40]"
        bin-strategy="fd"
        :density-overlay="true"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide a nearby table summary with bucket counts.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and stretches to container width.
- Use grid/container constraints to avoid overflow in narrow cards.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states are deterministic for hydration-safe markup.

## Testing

- Cover bin strategy behavior (`sturges`, `fixed`, etc.).
- Cover density overlay dataset contract and adapter error/expose behavior.
