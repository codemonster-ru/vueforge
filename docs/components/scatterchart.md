# ScatterChart

ScatterChart is a typed wrapper over `Chart` for point clouds, optional regression lines, and cluster-aware splits.

## Import

```ts
import ScatterChart from '@/package/components/scatter-chart.vue';
```

## Examples

### Basic

```vue
<ScatterChart
    :adapter="adapter"
    :series="[
        {
            label: 'Leads',
            data: [
                { x: 1, y: 42 },
                { x: 2, y: 50 },
                { x: 3, y: 58 },
            ],
        },
    ]"
/>
```

### Regression And Clusters

```vue
<ScatterChart
    :adapter="adapter"
    regression-line
    :cluster-options="{ enabled: true, palette: ['#2f80ed', '#27ae60'] }"
    :series="[
        {
            label: 'Leads',
            data: [
                { x: 1, y: 42, cluster: 'new' },
                { x: 2, y: 50, cluster: 'expansion' },
            ],
        },
    ]"
/>
```

## API

### Types

```ts
interface ScatterChartPoint {
    x: number;
    y: number;
    cluster?: string;
    [key: string]: unknown;
}

interface ScatterChartSeries {
    label: string;
    data: ScatterChartPoint[];
    pointRadius?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointBorderWidth?: number;
    showLine?: boolean;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `series` | `ScatterChartSeries[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `regressionLine` | `boolean` | `false` |
| `regressionLineColor` | `string` | `'#ef4444'` |
| `clusterOptions` | cluster config \| `undefined` | `undefined` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

ScatterChart inherits the shared chart token set from `theme.overrides.components.chart`.

