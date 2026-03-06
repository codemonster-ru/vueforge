# GaugeChart

GaugeChart is a typed wrapper over `Chart` for a single radial KPI with center content and value clamping.

## Import

```ts
import GaugeChart from '@/package/components/gauge-chart.vue';
```

## Examples

### Basic

```vue
<GaugeChart :adapter="adapter" :value="87" label="SLA" />
```

### Custom Center

```vue
<GaugeChart :adapter="adapter" :value="87" label="SLA">
    <template #center="{ value, ratio }">
        <strong>{{ value }}</strong>
        <span>{{ Math.round(ratio * 100) }}%</span>
    </template>
</GaugeChart>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `value` | `number` | `0` |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `label` | `string` | `''` |
| `formatter` | `((value: number, ratio: number) => string) \| undefined` | `undefined` |
| `trackColor` | `string` | `'#e5e7eb'` |
| `valueColor` | `string` | `'#2563eb'` |
| `cutout` | `string \| number` | `'72%'` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| chart base props | same as `Chart` | |

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
| `center` | Center overlay content with `{ value, ratio }`. |

## Theming

GaugeChart inherits the shared chart token set from `theme.overrides.components.chart`.

