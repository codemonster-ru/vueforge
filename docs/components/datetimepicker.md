# DateTimePicker

## Purpose

Provide date/time input primitives for scheduling, reporting, and range-based filtering.
Support localized parsing/display while keeping predictable controlled value contracts.

## Props

- `modelValue?: string` (v-model, ISO datetime `YYYY-MM-DDTHH:mm`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `max?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `minuteStep?: number` (default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `ariaLabel?: string` (default `Date and time picker`)
- `panelAriaLabel?: string` (default `Date and time selection`)
- `timeListAriaLabel?: string` (default `Time options`)
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
<DateTimePicker v-model="meetingAt" placeholder="Pick date and time" />
<DateTimePicker
    v-model="meetingAtAlt"
    variant="outlined"
    min="2026-01-10T09:00"
    max="2026-12-31T18:00"
    :minute-step="15"
    format="12h"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.datetimepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelWidth`, `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelRadiusOffset`, `panelShadow`, `panelGap`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `timesWidth`, `timesMaxHeight`, `timesPaddingLeft`, `timesBorderColor`
- `timeOptionPadding`, `timeOptionBorderRadius`, `timeOptionFontSize`
- `timeOptionHoverBackgroundColor`, `timeOptionActiveBackgroundColor`, `timeOptionActiveTextColor`
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

- The trigger exposes `aria-label`, `aria-expanded`, `aria-controls`, `aria-readonly` (when `readonly=true`) and `aria-haspopup="dialog"`.
- The popup dialog exposes `panelAriaLabel`, and the time listbox exposes `timeListAriaLabel`.
- Time options support keyboard navigation (`ArrowUp/ArrowDown`, `Home/End`, `Enter`/`Space`, `Escape`).
- Ensure visible focus state and sufficient color contrast in usage contexts.
- Locale and week-start defaults can be configured globally: [`Date/Time Locale Setup`](../guides/date-time-locale-setup.md).
