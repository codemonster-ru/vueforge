# DateTimePicker

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

## Accessibility

- The trigger exposes `aria-label`, `aria-expanded`, `aria-controls`, `aria-readonly` (when `readonly=true`) and `aria-haspopup="dialog"`.
- The popup dialog exposes `panelAriaLabel`, and the time listbox exposes `timeListAriaLabel`.
- Time options support keyboard navigation (`ArrowUp/ArrowDown`, `Home/End`, `Enter`/`Space`, `Escape`).
- Ensure visible focus state and sufficient color contrast in usage contexts.
- Locale and week-start defaults can be configured globally: [`Date/Time Locale Setup`](../guides/date-time-locale-setup.md).
