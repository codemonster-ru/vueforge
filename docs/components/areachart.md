# AreaChart

AreaChart is a typed wrapper over `Chart` for filled trend layers, stacked areas, and normalized composition.

## Import

```ts
import AreaChart from '@/package/components/area-chart.vue';
```

## Examples

### Basic

```vue
<AreaChart
    :adapter="adapter"
    :labels="['Q1', 'Q2', 'Q3', 'Q4']"
    :series="[
        { label: 'New', data: [20, 28, 32, 35] },
        { label: 'Expansion', data: [10, 14, 16, 18] },
    ]"
/>
```

### Stacked

```vue
<AreaChart
    :adapter="adapter"
    :labels="['Q1', 'Q2', 'Q3', 'Q4']"
    stacked
    :series="[
        { label: 'New', data: [20, 28, 32, 35], backgroundColor: 'rgba(47,128,237,0.25)' },
        { label: 'Expansion', data: [10, 14, 16, 18], backgroundColor: 'rgba(39,174,96,0.25)' },
    ]"
/>
```

## API

### Types

```ts
interface AreaChartSeries {
    label: string;
    data: Array<number | null>;
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    pointRadius?: number;
    tension?: number;
    spanGaps?: boolean;
    stack?: string;
    fill?: boolean | string;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `labels` | `(string \| number)[]` | `[]` |
| `series` | `AreaChartSeries[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `stacked` | `boolean` | `false` |
| `normalized` | `boolean` | `false` |
| `spanGaps` | `boolean` | `false` |
| `curve` | `'linear' \| 'smooth'` | `'smooth'` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

AreaChart inherits the shared chart token set from `theme.overrides.components.chart`.

## Recipes

- Use AreaChart for contribution over time, cumulative layers, and composition trends.
- Prefer `LineChart` when area fill would add noise rather than useful hierarchy.

