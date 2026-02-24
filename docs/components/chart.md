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
- `lazy?: boolean` (default `true`) - defer adapter mount until component enters viewport.
- `lazyRootMargin?: string` (default `200px`) - pre-mount offset for lazy intersection checks.
- `lazyThreshold?: number` (default `0`) - intersection ratio threshold for lazy mount trigger.
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

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

## Adapter Policy

- `Chart.js` is intentionally treated as a consumer-installed peer integration, not a bundled runtime dependency.
- Install `chart.js` in app dependencies when using `createChartJsAdapter`.
- Keep adapter creation client-safe for SSR apps (for example, lazy import the chart engine in client-only paths).

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `minHeight`
- `stateMinHeight`, `stateTextColor`, `stateFontSize`

## Recipes

- Dashboard KPI panel with bar/line charts and synchronized filters.
- Analytics page where chart `type` switches from `line` to `bar` without remounting consumer view.

## Accessibility

- Canvas uses `role="img"` with configurable `ariaLabel`.
- Prefer providing a nearby data table summary for critical business metrics.

## Responsive

- Canvas stretches to container width (`width: 100%`) with fixed drawing resolution props.
- Use container/grid constraints for mobile panels to avoid horizontal overflow.

## SSR/Hydration

- Chart rendering starts only on client mount through adapter, avoiding SSR-side canvas logic.
- `lazy` mode keeps adapter mount deferred until the chart container intersects viewport, while preserving deterministic SSR markup.
- Loading/empty states are deterministic and hydration-safe.

## Testing

- Cover adapter lifecycle (`mount`, `update`, `destroy`), loading/empty states, and ARIA attributes.
- Cover lazy-mount behavior and resize handling (`ResizeObserver` + window resize fallback).
- Verify adapter error propagation via `error` event.
