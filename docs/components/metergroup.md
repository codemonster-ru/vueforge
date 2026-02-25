# MeterGroup

## Purpose

Render grouped KPI meters with threshold-based visual states for progressive capacity/usage blocks.

## Props

- `items?: Array<MeterGroupItem>` (default `[]`)
- `max?: number` (default `100`)
- `ariaLabel?: string` (default `Meter group`)
- `locale?: string` (default `en`)

`MeterGroupItem`:

- `id?: string | number`
- `label: string`
- `value: number`
- `max?: number`
- `description?: string`
- `thresholds?: { warn?: number; danger?: number }`

## Events

- N/A

## Slots

- `item` (`{ item, index, percent, state }`)

## Examples

```vue
<MeterGroup
    :items="[
        { id: 'cpu', label: 'CPU', value: 62, thresholds: { warn: 70, danger: 90 } },
        { id: 'memory', label: 'Memory', value: 82, thresholds: { warn: 75, danger: 90 } },
        { id: 'storage', label: 'Storage', value: 96, thresholds: { warn: 80, danger: 95 } },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.meterGroup`.

## Tokens

- `gap`, `itemGap`
- `itemBorderColor`, `itemBorderRadius`, `itemBackgroundColor`, `itemPadding`
- `headerGap`
- `labelFontSize`, `labelFontWeight`
- `valueFontSize`, `valueColor`
- `trackHeight`, `trackBorderRadius`, `trackBackgroundColor`
- `barColor`, `warnBarColor`, `dangerBarColor`
- `descriptionFontSize`, `descriptionColor`

## Recipes

- Use in ops/monitoring cards where each meter line maps to a subsystem quota or thresholded KPI.

## Accessibility

- Each meter row exposes progress semantics (`role="progressbar"` with `aria-valuenow/max`).
- Group root supports custom section labeling via `ariaLabel`.

## Responsive

- Meters stack in a single column and remain readable in narrow dashboard panels.

## SSR/Hydration

- Fully deterministic render from props; no DOM-only runtime dependencies.

## Testing

- Cover threshold state mapping, width calculations, max overrides, and slot customization.
