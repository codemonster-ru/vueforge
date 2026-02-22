# Calendar

## Purpose

Provide date/time input primitives for scheduling, reporting, and range-based filtering.
Support localized parsing/display while keeping predictable controlled value contracts.

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `ariaLabel?: string` (default `Calendar`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Calendar v-model="selectedDate" min="2026-01-01" max="2026-12-31" />
<Calendar v-model="selectedDateAlt" variant="outlined" :first-day-of-week="1" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.calendar`):

- `width`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `disabledOpacity`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

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

- Grid day navigation supports `Arrow` keys, `Home`/`End`, and `PageUp`/`PageDown`.
- Date commit is keyboard-accessible via `Enter`/`Space`.
- `min`/`max` constraints disable out-of-range days.
- Invalid ISO model values are ignored (no selected day state).
- In `readonly` mode, selection mutation is blocked.
- Locale and week-start defaults can be configured globally: [`Date/Time Locale Setup`](../guides/date-time-locale-setup.md).
