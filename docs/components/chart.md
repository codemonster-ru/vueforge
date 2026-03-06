# Chart

Chart is the canonical adapter-driven chart runtime for VueForge. It handles mounting, loading and empty states, accessibility fallbacks, lazy rendering, print mode, and export hooks.

## Import

```ts
import Chart from '@/package/components/chart.vue';
```

## Examples

### Basic

Use `Chart` directly when you need full control over `type`, `data`, and engine options.

```vue
<script setup lang="ts">
import { createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <Chart
        :adapter="adapter"
        type="bar"
        :data="{
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ label: 'Revenue', data: [120, 180, 150, 220] }],
        }"
    />
</template>
```

### Accessible Table Fallback

Enable the optional table fallback when exact values must stay keyboard-accessible and screen-reader friendly.

```vue
<Chart
    type="line"
    :data="{
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{ label: 'Revenue', data: [120, 180, 150, 220] }],
    }"
    a11y-summary="Revenue increased over the last four quarters."
    a11y-table-fallback
    table-caption="Quarterly revenue data"
/>
```

### High-Density Datasets

Use high-density mode when charts can render thousands of points.

```vue
<Chart
    type="line"
    :data="{
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [{ label: 'Telemetry', data: [12, 18, 14, 22, 19, 26, 21, 29] }],
    }"
    high-density
    :high-density-point-threshold="2500"
    high-density-decimation-algorithm="lttb"
/>
```

### Print And Export

Use print mode for reporting surfaces and the exposed methods for export workflows.

```vue
<Chart
    ref="chartRef"
    type="bar"
    :data="{
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{ label: 'Revenue', data: [120, 180, 150, 220] }],
    }"
    print-mode
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `type` | `ChartType` | `'line'` |
| `data` | `ChartData` | `{ labels: [], datasets: [] }` |
| `options` | `Record<string, unknown>` | `{}` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `width` | `number` | `640` |
| `height` | `number` | `320` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading chart...'` |
| `emptyText` | `string` | `'No chart data'` |
| `ariaLabel` | `string` | `'Chart'` |
| `a11ySummary` | `string` | `''` |
| `a11yKeyboardHint` | `string` | `'Press Tab to focus chart and open the data table fallback control.'` |
| `a11yTableFallback` | `boolean` | `false` |
| `tableCaption` | `string` | `'Chart data table'` |
| `tableLabelHeader` | `string` | `'Label'` |
| `showTableText` | `string` | `'Show data table'` |
| `hideTableText` | `string` | `'Hide data table'` |
| `printMode` | `boolean` | `false` |
| `highDensity` | `boolean` | `false` |
| `highDensityPointThreshold` | `number` | `2000` |
| `highDensityDecimationAlgorithm` | `'lttb' \| 'min-max'` | `'lttb'` |
| `highDensitySamples` | `number \| undefined` | `undefined` |
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

### Exposed Methods

| Name | Description |
| --- | --- |
| `resize()` | Triggers adapter resize if supported. |
| `refresh()` | Rebuilds or updates the mounted chart. |
| `exportAsPng()` | Returns PNG data when supported by the adapter. |
| `exportAsSvg()` | Returns SVG data when supported by the adapter. |
| `exportAsCsv()` | Returns CSV using adapter support or built-in fallback. |
| `setPrintMode(enabled)` | Toggles adapter print mode when supported. |

### Slots

| Name | Description |
| --- | --- |
| `loading` | Replaces the loading state content. |
| `empty` | Replaces the empty state content. |

## Theming

Override tokens through `theme.overrides.components.chart`.

Helpers around the same token contract:

- `createChartThemeOptions` maps tokens into engine config for axes, legend, tooltip, and typography.
- `createChartSeriesPalette` derives default series colors for typed wrappers.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `minHeight`
- Axes and legend: `gridColor`, `axisColor`, `axisLabelColor`, `legendTextColor`
- Tooltip: `tooltipBackgroundColor`, `tooltipTitleColor`, `tooltipBodyColor`, `tooltipBorderColor`
- Series palette: `seriesPrimaryColor`, `seriesSecondaryColor`, `seriesTertiaryColor`, `seriesQuaternaryColor`, `seriesPositiveColor`, `seriesWarningColor`, `seriesNegativeColor`
- Typography: `titleFontFamily`, `titleFontSize`, `labelFontFamily`, `labelFontSize`, `valueFontFamily`, `valueFontSize`
- States and controls: `stateMinHeight`, `stateTextColor`, `stateBackgroundColor`, `stateBorderColor`, `stateBorderStyle`, `stateFontSize`, `controlBackgroundColor`, `controlTextColor`, `controlBorderColor`, `controlHoverBackgroundColor`
- Table fallback and focus: `tableHeaderBackgroundColor`, `tableHeaderTextColor`, `tableRowHoverBackgroundColor`, `tableBorderColor`, `focusOutlineColor`, `focusOutlineOffset`

## Recipes

- Use `Chart` directly for custom adapters, uncommon chart types, or full engine-level option control.
- Prefer typed wrappers like `BarChart` or `LineChart` when you want a narrower and more product-oriented API.

## Accessibility

- Canvas uses `role="img"` and can expose summary plus keyboard hint text through `aria-describedby`.
- `a11yTableFallback` adds a semantic table for exact values.
- Critical analytics screens should still include nearby textual interpretation, not only graphics.
