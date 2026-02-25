# CandlestickChart

## Purpose

Provide OHLC financial/time-series visualization with optional volume overlay on top of VueForge `Chart`.

## Props

- `points?: Array<CandlestickDataPoint>`
- `adapter?: ChartAdapter`
- `options?: Record<string, unknown>`
- `showVolume?: boolean` (default `true`)
- `bullishColor?: string` (default `#16a34a`)
- `bearishColor?: string` (default `#dc2626`)
- `wickColor?: string` (default `#475569`)
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Candlestick chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `CandlestickDataPoint`

- `label: string`
- `open: number`
- `high: number`
- `low: number`
- `close: number`
- `volume?: number`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { CandlestickChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <CandlestickChart
        :adapter="adapter"
        :points="[
            { label: '2026-01-01', open: 100, high: 108, low: 95, close: 105, volume: 1200 },
            { label: '2026-01-02', open: 105, high: 110, low: 101, close: 103, volume: 900 },
        ]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical financial decisions, provide nearby tabular OHLC fallback.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options with dual y-axis (`price` + optional `volume`).

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy`.

## Testing

- Cover OHLC mapping, bullish/bearish coloring, volume overlay, tooltip contract, and adapter error/expose behavior.
