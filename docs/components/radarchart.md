# RadarChart

RadarChart is a typed wrapper over `Chart` for multi-series comparison across shared dimensions.

## Import

```ts
import RadarChart from '@/package/components/radar-chart.vue';
```

## Examples

### Basic

```vue
<RadarChart
    :adapter="adapter"
    :labels="['Speed', 'Reliability', 'Cost', 'Support']"
    :series="[
        { label: 'Team A', data: [82, 91, 65, 73] },
        { label: 'Team B', data: [74, 86, 72, 81], fill: false },
    ]"
/>
```

## API

### Types

```ts
interface RadarChartSeries {
    label: string;
    data: Array<number | null>;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `labels` | `(string \| number)[]` | `[]` |
| `series` | `RadarChartSeries[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `fill` | `boolean` | `true` |
| `beginAtZero` | `boolean` | `true` |
| `suggestedMin` | `number \| undefined` | `undefined` |
| `suggestedMax` | `number \| undefined` | `undefined` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

RadarChart inherits the shared chart token set from `theme.overrides.components.chart`.

