# CandlestickChart

CandlestickChart is a typed wrapper over `Chart` for OHLC financial series with optional volume overlay.

## Import

```ts
import CandlestickChart from '@/package/components/candlestick-chart.vue';
```

## Examples

### Basic

```vue
<CandlestickChart
    :adapter="adapter"
    :points="[
        { label: '2026-01-01', open: 100, high: 108, low: 95, close: 105, volume: 1200 },
        { label: '2026-01-02', open: 105, high: 110, low: 101, close: 103, volume: 900 },
    ]"
/>
```

## API

### Types

```ts
interface CandlestickDataPoint {
    label: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `points` | `CandlestickDataPoint[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `showVolume` | `boolean` | `true` |
| `bullishColor` | `string` | `'#16a34a'` |
| `bearishColor` | `string` | `'#dc2626'` |
| `wickColor` | `string` | `'#475569'` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

CandlestickChart inherits the shared chart token set from `theme.overrides.components.chart`.

