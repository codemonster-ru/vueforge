# BarChart

BarChart is a typed wrapper over `Chart` for grouped, stacked, and horizontal bar visualizations.

## Import

```ts
import BarChart from '@/package/components/bar-chart.vue';
```

## Examples

### Basic

```vue
<BarChart
    :adapter="adapter"
    :labels="['Q1', 'Q2', 'Q3', 'Q4']"
    :series="[
        { label: 'North', data: [120, 160, 140, 190] },
        { label: 'South', data: [90, 130, 150, 170] },
    ]"
/>
```

### Stacked Horizontal

```vue
<BarChart
    :adapter="adapter"
    :labels="['Enterprise', 'SMB', 'Self-serve']"
    horizontal
    stacked
    :series="[
        { label: 'New', data: [42, 58, 76], stack: 'pipeline' },
        { label: 'Expansion', data: [21, 33, 29], stack: 'pipeline' },
    ]"
/>
```

## API

### Types

```ts
interface BarChartSeries {
    label: string;
    data: Array<number | null>;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    stack?: string;
    grouped?: boolean;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `labels` | `(string \| number)[]` | `[]` |
| `series` | `BarChartSeries[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `grouped` | `boolean` | `true` |
| `stacked` | `boolean` | `false` |
| `horizontal` | `boolean` | `false` |
| `width` | `number` | `640` |
| `height` | `number` | `320` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading chart...'` |
| `emptyText` | `string` | `'No chart data'` |
| `ariaLabel` | `string` | `'Bar chart'` |
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

## Theming

BarChart inherits the shared chart token set from `theme.overrides.components.chart`.

## Recipes

- Use BarChart for categorical comparison, stacked contribution, and rank-like horizontal layouts.
- Prefer `LineChart` or `AreaChart` when the x-axis primarily represents time or continuous progression.

## Accessibility

- BarChart inherits the accessibility contract of `Chart`, including ARIA labeling and optional data-table fallback when you need it at the base layer.

