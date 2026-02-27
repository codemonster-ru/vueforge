# Chart

## Purpose

Provide an adapter-based chart wrapper with a stable VueForge API and an official `Chart.js` integration helper.

## Props

- `type?: ChartType` (default `line`)
- `data?: ChartData`
- `options?: Record<string, unknown>`
- `adapter?: ChartAdapter`
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Chart`)
- `a11ySummary?: string` (default empty) - screen-reader summary sentence for chart context/trends.
- `a11yKeyboardHint?: string` (default `Press Tab to focus chart and open the data table fallback control.`)
- `a11yTableFallback?: boolean` (default `false`) - render keyboard-accessible table fallback toggle and table.
- `tableCaption?: string` (default `Chart data table`)
- `tableLabelHeader?: string` (default `Label`)
- `showTableText?: string` (default `Show data table`)
- `hideTableText?: string` (default `Hide data table`)
- `printMode?: boolean` (default `false`) - enables print-friendly chart container state and adapter print hook.
- `highDensity?: boolean` (default `false`) - enables runtime high-density rendering strategy.
- `highDensityPointThreshold?: number` (default `2000`) - point-count threshold for auto decimation options.
- `highDensityDecimationAlgorithm?: 'lttb' | 'min-max'` (default `lttb`)
- `highDensitySamples?: number` (optional) - target sample count for decimation-capable engines.
- `lazy?: boolean` (default `true`) - defer adapter mount until component enters viewport.
- `lazyRootMargin?: string` (default `200px`) - pre-mount offset for lazy intersection checks.
- `lazyThreshold?: number` (default `0`) - intersection ratio threshold for lazy mount trigger.
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Exposed Methods

- `resize()`
- `refresh()`
- `exportAsPng() => string`
- `exportAsSvg() => string`
- `exportAsCsv() => string`
- `setPrintMode(enabled: boolean)`

## Slots

- `loading`
- `empty`

## Examples

```vue
<script setup lang="ts">
import { Chart, createChartJsAdapter } from '@codemonster-ru/vueforge';
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

## Theming

- Override via `theme.overrides.components.chart`.
- Use `createChartThemeOptions` to map token values to engine options (`legend`, `grid`, `axis`, `tooltip`, typography).
- Use `createChartSeriesPalette` to derive tokenized default series colors in wrappers/compositions.
- Detailed token contract: `docs/guides/chart-theming-token-contracts.md`.

## Adapter Policy

- Official engine strategy: `Chart.js` is the default adapter via `createChartJsAdapter`, while `ChartAdapter` remains the extension interface for custom engines.
- `Chart.js` is intentionally treated as a consumer-installed peer integration, not a bundled runtime dependency.
- Install `chart.js` in app dependencies when using `createChartJsAdapter`.
- Keep adapter creation client-safe for SSR apps (for example, lazy import the chart engine in client-only paths).
- Full strategy and extension guidance: `docs/guides/chart-engine-adapter-strategy.md`.
- Shared data-layer contracts for `series` / `axes` / `legend` / `tooltip` / `annotations`: `docs/guides/chart-data-schema-contracts.md`.
- Export/print extension contract: `docs/guides/chart-export-print-contracts.md`.
- Secure untrusted label/tooltip rendering guidance: `docs/guides/chart-secure-data-rendering.md`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `gridColor`, `axisColor`, `axisLabelColor`, `legendTextColor`
- `tooltipBackgroundColor`, `tooltipTitleColor`, `tooltipBodyColor`, `tooltipBorderColor`
- `seriesPrimaryColor`, `seriesSecondaryColor`, `seriesTertiaryColor`, `seriesQuaternaryColor`
- `seriesPositiveColor`, `seriesWarningColor`, `seriesNegativeColor`
- `titleFontFamily`, `titleFontSize`, `labelFontFamily`, `labelFontSize`, `valueFontFamily`, `valueFontSize`
- `padding`, `minHeight`
- `stateMinHeight`, `stateTextColor`, `stateFontSize`, `stateBackgroundColor`, `stateBorderColor`, `stateBorderStyle`
- `controlBackgroundColor`, `controlTextColor`, `controlBorderColor`, `controlHoverBackgroundColor`
- `tableHeaderBackgroundColor`, `tableHeaderTextColor`, `tableRowHoverBackgroundColor`, `tableBorderColor`
- `focusOutlineColor`, `focusOutlineOffset`

## Recipes

- Dashboard KPI panel with bar/line charts and synchronized filters.
- Analytics page where chart `type` switches from `line` to `bar` without remounting consumer view.

## Accessibility

- Canvas uses `role="img"` with configurable `ariaLabel`.
- Canvas is keyboard-focusable and can expose `a11ySummary` + `a11yKeyboardHint` via `aria-describedby`.
- Optional data-table fallback (`a11yTableFallback`) provides a semantic table view for exact values.
- Prefer providing a nearby data table summary for critical business metrics.
- Shared chart a11y contract: `docs/accessibility/chart-a11y-contracts.md`.

## Responsive

- Canvas stretches to container width (`width: 100%`) with fixed drawing resolution props.
- Use container/grid constraints for mobile panels to avoid horizontal overflow.
- Shared responsive + high-density strategy: `docs/guides/chart-responsive-high-density-strategy.md`.

## Export and Print

- Adapter-level export contracts support PNG/SVG/CSV.
- CSV export has built-in fallback from chart data via `createChartCsv`.
- Print mode can be toggled by prop (`printMode`) or by exposed method (`setPrintMode`).

## Security

- Sanitize untrusted labels/tooltip text with `sanitizeChartText` / `escapeChartHtml`.
- Avoid HTML tooltip templating with raw external input.

## SSR/Hydration

- Chart rendering starts only on client mount through adapter, avoiding SSR-side canvas logic.
- `lazy` mode keeps adapter mount deferred until the chart container intersects viewport, while preserving deterministic SSR markup.
- Loading/empty states are deterministic and hydration-safe.

## Testing

- Cover adapter lifecycle (`mount`, `update`, `destroy`), loading/empty states, and ARIA attributes.
- Cover screen-reader summary wiring and data-table fallback keyboard toggle behavior.
- Cover lazy-mount behavior and resize handling (`ResizeObserver` + window resize fallback).
- Cover high-density decimation option injection for large datasets.
- Cover export contract methods (PNG/SVG/CSV) and print mode adapter hook.
- Verify adapter error propagation via `error` event.
