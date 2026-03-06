# MeterGroup

MeterGroup displays multiple labeled values as compact progress meters.

## Import

```ts
import MeterGroup from '@/package/components/meter-group.vue';
```

## Examples

### Basic

Use `MeterGroup` for quota usage, storage breakdowns, or health summaries across several categories.

```vue
<script setup lang="ts">
const usage = [
    { id: 'cpu', label: 'CPU', value: 58 },
    { id: 'memory', label: 'Memory', value: 74 },
    { id: 'network', label: 'Network', value: 32 },
];
</script>

<template>
    <MeterGroup :items="usage" />
</template>
```

### Shared Maximum

Set `max` when all items should be measured against the same scale.

```vue
<MeterGroup :items="usage" :max="100" />
```

### Per-Item Thresholds

Use thresholds to surface warn and danger states inside dense status panels.

```vue
<script setup lang="ts">
const serviceLevels = [
    {
        id: 'api',
        label: 'API latency',
        value: 82,
        thresholds: { warn: 70, danger: 90 },
    },
    {
        id: 'queue',
        label: 'Queue backlog',
        value: 41,
        thresholds: { warn: 60, danger: 80 },
    },
];
</script>

<template>
    <MeterGroup :items="serviceLevels" :max="100" />
</template>
```

### Custom Item Content

Use the `item` slot when each meter needs richer labels or helper text.

```vue
<MeterGroup :items="usage">
    <template #item="{ item, percent }">
        <div style="display: grid; gap: 0.25rem;">
            <strong>{{ item.label }}</strong>
            <span>{{ item.value }} units</span>
            <span>{{ percent }}%</span>
        </div>
    </template>
</MeterGroup>
```

## API

### Types

```ts
interface MeterGroupItem {
    id?: string | number;
    label: string;
    value: number;
    max?: number;
    description?: string;
    thresholds?: {
        warn?: number;
        danger?: number;
    };
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `MeterGroupItem[]` | `[]` |
| `max` | `number \| undefined` | `undefined` |
| `ariaLabel` | `string` | `'Meter group'` |
| `locale` | `string \| undefined` | `undefined` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom item rendering with `{ item, index, percent, state }`. |

## Theming

Override component tokens through `theme.overrides.components.meterGroup`.

## Tokens

- Layout: `gap`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`
- Header and labels: `labelColor`, `labelFontSize`, `valueColor`, `valueFontWeight`, `descriptionColor`
- Meter track and fill: `trackColor`, `barColor`, `barRadius`
- States: `warnColor`, `dangerColor`

## Recipes

- Use `MeterGroup` when several related values should be scanned together without the weight of a chart.
- Prefer `Chart` when trend over time matters more than current relative values.

## Accessibility

- Keep item labels explicit and non-ambiguous so the meter text is meaningful without surrounding layout.
- If colors encode warn or danger meaning, reinforce them with text or descriptions.
