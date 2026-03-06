# Heatmap

Heatmap is a typed wrapper over `Chart` for matrix-style intensity visualization with an optional range legend.

## Import

```ts
import Heatmap from '@/package/components/heatmap.vue';
```

## Examples

### Basic

Use `Heatmap` for activity density, system saturation, or resource-by-time summaries.

```vue
<script setup lang="ts">
import { Heatmap, createChartJsAdapter } from '@codemonster-ru/vueforge';
import ChartJs from 'chart.js/auto';

const adapter = createChartJsAdapter(ChartJs);
</script>

<template>
    <Heatmap
        :adapter="adapter"
        :x-labels="['Mon', 'Tue', 'Wed']"
        :y-labels="['API', 'Queue', 'Workers']"
        :cells="[
            { x: 'Mon', y: 'API', value: 32 },
            { x: 'Tue', y: 'API', value: 45 },
            { x: 'Wed', y: 'Workers', value: 12 },
        ]"
    />
</template>
```

### Custom Palette

Override `color-range` when the heatmap should align with product semantics or alert levels.

```vue
<Heatmap
    :adapter="adapter"
    :cells="cells"
    :color-range="['#ecfeff', '#67e8f9', '#0891b2', '#164e63']"
/>
```

### Compact Mode

Reduce dimensions and hide the legend for card-sized summaries.

```vue
<Heatmap
    :adapter="adapter"
    :cells="cells"
    :show-range-legend="false"
    :height="240"
/>
```

## API

### Types

```ts
interface HeatmapCell {
    x: string | number;
    y: string | number;
    value: number;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `cells` | `HeatmapCell[]` | `[]` |
| `xLabels` | `Array<string \| number>` | `[]` |
| `yLabels` | `Array<string \| number>` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `colorRange` | `string[]` | default palette |
| `showRangeLegend` | `boolean` | `true` |
| `cellRadius` | `number` | `14` |
| `width` | `number` | `640` |
| `height` | `number` | `320` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading chart...'` |
| `emptyText` | `string` | `'No chart data'` |
| `ariaLabel` | `string` | `'Heatmap'` |
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

`Heatmap` does not have its own default preset file in `src/package/themes/default/components/`. In this repo it inherits the shared `Chart` theming contract through `theme.overrides.components.chart`.

## Tokens

- Inherit chart surface, typography, focus, and state tokens from `Chart`
- Heatmap-specific visual tuning usually comes from `series*` palette tokens and explicit `colorRange`

## Recipes

- Use `Heatmap` when magnitude at two dimensions matters more than sequential trends.
- Drop to `Chart` when you need lower-level engine customization outside the typed heatmap behavior.

## Accessibility

- The chart still uses image semantics via the base `Chart` runtime.
- For critical operational dashboards, accompany the heatmap with textual or tabular value summaries.
