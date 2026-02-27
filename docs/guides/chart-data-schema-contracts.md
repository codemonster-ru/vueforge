# Chart Data Schema Contracts

Goal: provide one shared data schema contract for chart `series`, `axes`, `legend`, `tooltip`, and `annotations` layers.

## Why

- Chart wrappers should stay consistent across dashboard/reporting use cases.
- Teams need one typed contract they can reuse across `BarChart`, `LineChart`, `AreaChart`, and other chart components.
- Shared schema metadata enables predictable validation and adapter interoperability.

## Public API

From `@codemonster-ru/vueforge`:

- Types:
    - `ChartDataSchema`
    - `ChartSeriesSchema`
    - `ChartAxisSchema`
    - `ChartAxisScale`
    - `ChartLegendSchema`
    - `ChartTooltipSchema`
    - `ChartAnnotationSchema`
- Helpers:
    - `createChartDataSchema(schema)`
    - `validateChartDataSchema(schema) => string[]`

## Contract Shape

- `series`: required array with unique `id` and human-readable `label`.
- `axes`: optional array with unique `id`, `position`, and optional scale/format hints.
- `legend`: optional visibility, position, and interaction contract.
- `tooltip`: optional display mode and shared-tooltip behavior contract.
- `annotations`: optional array with unique `id`, type, and axis/value range metadata.

Validation rules:

- At least one series is required.
- Series ids and annotation ids must be unique.
- Axis ids must be unique when provided.
- Series/annotation axis references must point to declared axes.

## Example

```ts
import { createChartDataSchema, validateChartDataSchema } from '@codemonster-ru/vueforge';

const schema = createChartDataSchema({
    series: [
        { id: 'revenue', label: 'Revenue', axis: 'y', dataKey: 'revenue' },
        { id: 'orders', label: 'Orders', axis: 'y2', dataKey: 'orders' },
    ],
    axes: [
        { id: 'x', position: 'bottom', scale: 'time' },
        { id: 'y', position: 'left', scale: 'linear', format: 'currency' },
        { id: 'y2', position: 'right', scale: 'linear', format: 'number' },
    ],
    legend: { visible: true, position: 'bottom', interactive: true },
    tooltip: { enabled: true, mode: 'index', shared: true },
    annotations: [{ id: 'target', type: 'line', axis: 'y', value: 120000, label: 'Target' }],
});

const schemaErrors = validateChartDataSchema(schema);
```

Use schema metadata as a stable shared contract for analytics surfaces; keep engine-specific settings in chart `options`.
