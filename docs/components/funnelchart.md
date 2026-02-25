# FunnelChart

## Purpose

Provide a typed funnel chart component on top of VueForge `Chart` for conversion-stage visualization.

## Props

- `stages?: Array<FunnelChartStage>` - funnel stages.
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `descending?: boolean` (default `true`) - sort by highest value first.
- `showConversionLabels?: boolean` (default `true`) - append conversion percentage to labels.
- `palette?: Array<string>` - fallback stage colors.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Funnel chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `FunnelChartStage`

- `label: string`
- `value: number`
- `color?: string`

### `FunnelChartStageComputed`

- `label: string`
- `value: number`
- `color?: string`
- `conversionRate: number` - share vs first stage.
- `dropOffRate: number` - drop from previous stage.

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { FunnelChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <FunnelChart
        :adapter="adapter"
        :stages="[
            { label: 'Visitors', value: 12000 },
            { label: 'Signups', value: 3200 },
            { label: 'Activated', value: 1800 },
            { label: 'Paid', value: 640 },
        ]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide a nearby data table summary with stage values.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and horizontal bars for readable stage labels on narrow screens.
- Use container/grid constraints to avoid overflow in dense dashboard cards.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states are deterministic for hydration-safe markup.

## Testing

- Cover stage mapping/sorting and conversion label behavior.
- Cover tooltip conversion/drop-off contract and adapter error/expose behavior.
