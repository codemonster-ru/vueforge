# TreemapChart

## Purpose

Provide a typed treemap chart component on top of VueForge `Chart` with hierarchical area encoding.

## Props

- `nodes?: Array<TreemapChartNode>` - hierarchy data (nested `children` or flat `parentId` links).
- `adapter?: ChartAdapter` - rendering adapter (for example, `createChartJsAdapter`).
- `options?: Record<string, unknown>` - chart-engine options override.
- `palette?: Array<string>` - fallback color palette.
- `width?: number` (default `640`)
- `height?: number` (default `320`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading chart...`)
- `emptyText?: string` (default `No chart data`)
- `ariaLabel?: string` (default `Treemap chart`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

### `TreemapChartNode`

- `id: string`
- `label: string`
- `value?: number`
- `color?: string`
- `parentId?: string`
- `children?: Array<TreemapChartNode>`

### `TreemapChartTile`

- `id: string`
- `label: string`
- `value: number`
- `x: number`
- `y: number`
- `width: number`
- `height: number`
- `color: string`

## Events

- `ready` (`ChartAdapterInstance`)
- `error` (`Error`)

## Slots

- `loading`
- `empty`

## Example

```vue
<script setup lang="ts">
import { TreemapChart, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <TreemapChart
        :adapter="adapter"
        :nodes="[
            {
                id: 'products',
                label: 'Products',
                children: [
                    { id: 'suite-a', label: 'Suite A', value: 48 },
                    { id: 'suite-b', label: 'Suite B', value: 32 },
                    { id: 'suite-c', label: 'Suite C', value: 20 },
                ],
            },
        ]"
    />
</template>
```

## Accessibility

- Uses `role="img"` via base `Chart` canvas and supports custom `ariaLabel`.
- For critical metrics, provide a nearby table summary with tile labels and values.

## Theming

- Inherits chart token set via `theme.overrides.components.chart`.

## Responsive

- Uses responsive base chart options and normalized 0-100 layout coordinates.
- Use container/grid constraints to avoid overflow in narrow cards.

## SSR/Hydration

- Adapter mount happens only on client mount and respects `lazy` viewport rendering.
- Loading/empty states are deterministic for hydration-safe markup.

## Testing

- Cover nested and flat hierarchy normalization.
- Cover tooltip/axis callback contracts and adapter error/expose behavior.
