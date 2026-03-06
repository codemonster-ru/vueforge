# LineChart

LineChart is a typed wrapper over `Chart` for multi-series trends, `null` gaps, and threshold overlays.

## Import

```ts
import LineChart from '@/package/components/line-chart.vue';
```

## Examples

### Basic

```vue
<LineChart
    :adapter="adapter"
    :labels="['Jan', 'Feb', 'Mar', 'Apr']"
    :series="[
        { label: 'Revenue', data: [120, 140, null, 190] },
        { label: 'Cost', data: [80, 95, 100, 110] },
    ]"
/>
```

### Thresholds

```vue
<LineChart
    :adapter="adapter"
    :labels="['Jan', 'Feb', 'Mar', 'Apr']"
    :series="[{ label: 'Revenue', data: [120, 140, 165, 190] }]"
    :thresholds="[{ value: 150, label: 'Target', color: '#10b981' }]"
/>
```

## API

### Types

```ts
interface LineChartSeries {
    label: string;
    data: Array<number | null>;
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    pointRadius?: number;
    tension?: number;
    spanGaps?: boolean;
    [key: string]: unknown;
}

interface LineChartThreshold {
    value: number;
    label?: string;
    color?: string;
    dash?: number[];
    borderWidth?: number;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `labels` | `(string \| number)[]` | `[]` |
| `series` | `LineChartSeries[]` | `[]` |
| `thresholds` | `LineChartThreshold[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `spanGaps` | `boolean` | `false` |
| `curve` | `'linear' \| 'smooth'` | `'linear'` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

LineChart inherits the shared chart token set from `theme.overrides.components.chart`.

## Recipes

- Use LineChart for time series, targets versus actuals, and continuous trend comparison.
- Prefer `BarChart` for categorical comparison where discrete bars communicate magnitude more clearly.

