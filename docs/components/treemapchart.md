# TreemapChart

TreemapChart is a typed wrapper over `Chart` for hierarchical area encoding from nested or flat node data.

## Import

```ts
import TreemapChart from '@/package/components/treemap-chart.vue';
```

## Examples

### Basic

```vue
<TreemapChart
    :adapter="adapter"
    :nodes="[
        {
            id: 'products',
            label: 'Products',
            children: [
                { id: 'suite-a', label: 'Suite A', value: 48 },
                { id: 'suite-b', label: 'Suite B', value: 32 },
                { id: 'suite-c', label: 'Suite C', value: 20 },
            ],
        },
    ]"
/>
```

## API

### Types

```ts
interface TreemapChartNode {
    id: string;
    label: string;
    value?: number;
    color?: string;
    parentId?: string;
    children?: TreemapChartNode[];
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `nodes` | `TreemapChartNode[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `palette` | `string[] \| undefined` | `undefined` |
| chart base props | same as `Chart` | |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

TreemapChart inherits the shared chart token set from `theme.overrides.components.chart`.
