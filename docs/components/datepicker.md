# DatePicker

## Purpose

Provide date/time input primitives for scheduling, reporting, and range-based filtering.
Support localized parsing/display while keeping predictable controlled value contracts.

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate panel positioning, grid readability, and action controls on small screens.
Ensure touch interactions for day/time selection remain accurate with adequate target size.

## SSR/Hydration

Render initial date/time value and panel-closed state consistently in SSR output.
Run locale/timezone-sensitive formatting in a hydration-safe way to prevent mismatch.

## Testing

Cover parsing/formatting, keyboard navigation, min/max constraints, and range/time edge cases.
Add tests for locale variants and ARIA semantics for calendar and listbox-like panels.

## Accessibility

- Trigger exposes popup semantics via `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Keyboard support: `ArrowDown` opens calendar, `Escape` closes popup.
- Invalid ISO values are ignored (treated as empty state) and do not produce invalid committed dates.
- `min`/`max` constraints disable out-of-range days in the calendar grid.
- In `readonly` mode, open/select interactions are blocked.
- Locale and week-start defaults can be configured globally: [`Date/Time Locale Setup`](../guides/date-time-locale-setup.md).
