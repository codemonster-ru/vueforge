# BubbleChart

BubbleChart is a typed wrapper over `Chart` for scatter-like plots with size encoding.

## Import

```ts
import BubbleChart from '@/package/components/bubble-chart.vue';
```

## Examples

### Basic

```vue
<BubbleChart
    :adapter="adapter"
    :series="[
        {
            label: 'Accounts',
            data: [
                { x: 1, y: 12, size: 10 },
                { x: 2, y: 18, size: 20 },
                { x: 3, y: 15, size: 30 },
            ],
        },
    ]"
/>
```

### Tooltip Formatting

```vue
<BubbleChart
    :adapter="adapter"
    :tooltip-formatter="ctx => `${ctx.label}: value=${ctx.y}, size=${ctx.r}`"
    :series="series"
/>
```

## API

### Types

```ts
interface BubbleChartPoint {
    x: number;
    y: number;
    r?: number;
    size?: number;
    label?: string;
    [key: string]: unknown;
}

interface BubbleChartSeries {
    label: string;
    data: BubbleChartPoint[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    [key: string]: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `series` | `BubbleChartSeries[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `minRadius` | `number` | `4` |
| `maxRadius` | `number` | `18` |
| `tooltipFormatter` | formatter function \| `undefined` | `undefined` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

BubbleChart inherits the shared chart token set from `theme.overrides.components.chart`.

