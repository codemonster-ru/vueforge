# DateRangePicker

## Props

- `modelValue?: [string | null, string | null] | null` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `startPlaceholder?: string` (default `Start`)
- `endPlaceholder?: string` (default `End`)
- `separator?: string` (default `-`)
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default `en-US`)
- `firstDayOfWeek?: number` (default `0`, Sunday)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<DateRangePicker v-model="dateRange" placeholder="Pick date range" min="2026-01-01" max="2026-12-31" />
```

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
