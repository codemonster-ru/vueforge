# PieChart / DonutChart

PieChart and DonutChart are typed wrappers over `Chart` for category distribution with optional interactive legends and drilldown hooks.

`DonutChart` is a convenience alias of `PieChart` with the donut variant.

## Import

```ts
import PieChart from '@/package/components/pie-chart.vue';
import DonutChart from '@/package/components/donut-chart.vue';
```

## Examples

### Pie

```vue
<PieChart
    :adapter="adapter"
    :labels="['North', 'South', 'West']"
    :series="[{ data: [42, 35, 23], backgroundColor: ['#2f80ed', '#27ae60', '#f2994a'] }]"
/>
```

### Donut

```vue
<DonutChart
    :adapter="adapter"
    :labels="['Free', 'Pro', 'Enterprise']"
    :series="[{ data: [58, 34, 8], backgroundColor: ['#93c5fd', '#2f80ed', '#1d4ed8'] }]"
/>
```

### Interactive Legend

```vue
<PieChart
    :adapter="adapter"
    :labels="labels"
    :series="series"
    show-legend
    legend-interactive
    @drilldown="onDrilldown"
/>
```

## API

### Types

```ts
interface PieChartSeries {
    label?: string;
    data: Array<number | null>;
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `labels` | `(string \| number)[]` | `[]` |
| `series` | `PieChartSeries[]` | `[]` |
| `variant` | `'pie' \| 'donut'` | `'pie'` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `showLegend` | `boolean` | `true` |
| `legendInteractive` | `boolean` | `true` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |
| `legendToggle` | `{ index, label, hidden }` |
| `sliceClick` | `{ datasetIndex, index, label, value }` |
| `drilldown` | `{ source, index, label, value, datasetIndex? }` |

### Slots

| Name | Description |
| --- | --- |
| `loading` | Replaces the loading state. |
| `empty` | Replaces the empty state. |
| `legendLabel` | Custom legend row content with `{ label, value, index }`. |

## Theming

PieChart and DonutChart inherit the shared chart token set from `theme.overrides.components.chart`.

## Recipes

- Use PieChart for simple proportion snapshots and DonutChart when the hollow center improves layout or leaves room for supplementary KPI treatment.
- Prefer bar-based comparisons when categories are numerous or values are close enough that arc comparison becomes hard to read.

