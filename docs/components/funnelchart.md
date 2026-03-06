# FunnelChart

FunnelChart is a typed wrapper over `Chart` for conversion-stage visualization and drop-off analysis.

## Import

```ts
import FunnelChart from '@/package/components/funnel-chart.vue';
```

## Examples

### Basic

```vue
<FunnelChart
    :adapter="adapter"
    :stages="[
        { label: 'Visitors', value: 12000 },
        { label: 'Signups', value: 3200 },
        { label: 'Activated', value: 1800 },
        { label: 'Paid', value: 640 },
    ]"
/>
```

## API

### Types

```ts
interface FunnelChartStage {
    label: string;
    value: number;
    color?: string;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `stages` | `FunnelChartStage[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `descending` | `boolean` | `true` |
| `showConversionLabels` | `boolean` | `true` |
| `palette` | `string[] \| undefined` | `undefined` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

FunnelChart inherits the shared chart token set from `theme.overrides.components.chart`.

