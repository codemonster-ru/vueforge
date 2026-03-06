# Histogram

Histogram is a typed wrapper over `Chart` for bucketed numeric distributions with optional density overlay.

## Import

```ts
import Histogram from '@/package/components/histogram.vue';
```

## Examples

### Basic

Use `Histogram` for latency distributions, score distributions, and other raw numeric samples.

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
    />
</template>
```

### Density Overlay

Enable `density-overlay` when the chart should show both count bars and distribution shape.

```vue
<Histogram
    :adapter="adapter"
    :values="values"
    bin-strategy="fd"
    density-overlay
/>
```

### Fixed Bins

Use fixed bins when analytics requirements define explicit bucket widths.

```vue
<Histogram
    :adapter="adapter"
    :values="values"
    bin-strategy="fixed"
    :bin-size="10"
/>
```

## API

### Types

```ts
type HistogramBinStrategy = 'sturges' | 'sqrt' | 'fd' | 'fixed';
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `values` | `number[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `binStrategy` | `'sturges' \| 'sqrt' \| 'fd' \| 'fixed'` | `'sturges'` |
| `binCount` | `number \| undefined` | `undefined` |
| `binSize` | `number \| undefined` | `undefined` |
| `min` | `number \| undefined` | `undefined` |
| `max` | `number \| undefined` | `undefined` |
| `densityOverlay` | `boolean` | `false` |
| `width` | `number` | `640` |
| `height` | `number` | `320` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading chart...'` |
| `emptyText` | `string` | `'No chart data'` |
| `ariaLabel` | `string` | `'Histogram'` |
| `lazy` | `boolean` | `true` |
| `lazyRootMargin` | `string` | `'200px'` |
| `lazyThreshold` | `number` | `0` |
| `pt` | `PassThroughOptions \| undefined` | `undefined` |
| `unstyled` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

### Slots

| Name | Description |
| --- | --- |
| `loading` | Replaces the loading state. |
| `empty` | Replaces the empty state. |

## Theming

`Histogram` does not have its own default preset file in `src/package/themes/default/components/`. In this repo it inherits the shared `Chart` theming contract through `theme.overrides.components.chart`.

## Tokens

- Inherit chart surface, typography, tooltip, focus, and state tokens from `Chart`
- Use chart palette tokens plus explicit chart options when the bar and density line need custom colors

## Recipes

- Use `fd` or `sqrt` when binning should adapt to the dataset, and `fixed` when product requirements define exact bucket widths.
- Prefer `Histogram` over raw bar charts when the input is an unordered numeric sample rather than already aggregated categories.

## Accessibility

- The base `Chart` runtime provides the canvas and state semantics.
- For critical quantitative workflows, pair the histogram with numeric summaries or a table of bin counts.
