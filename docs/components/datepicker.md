# DatePicker

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default `en-US`)
- `firstDayOfWeek?: number` (default `0`, Sunday)
- `ariaLabel?: string` (default `Date picker`)
- `panelAriaLabel?: string` (default `Calendar`)
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
<DatePicker v-model="startDate" placeholder="Pick date" min="2026-01-01" max="2026-12-31" />
```

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Trigger exposes popup semantics via `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Keyboard support: `ArrowDown` opens calendar, `Escape` closes popup.
- Invalid ISO values are ignored (treated as empty state) and do not produce invalid committed dates.
- `min`/`max` constraints disable out-of-range days in the calendar grid.
- In `readonly` mode, open/select interactions are blocked.
