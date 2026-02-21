# Calendar

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default `en-US`)
- `firstDayOfWeek?: number` (default `0`, Sunday)
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

## Accessibility

- Grid day navigation supports `Arrow` keys, `Home`/`End`, and `PageUp`/`PageDown`.
- Date commit is keyboard-accessible via `Enter`/`Space`.
- `min`/`max` constraints disable out-of-range days.
- Invalid ISO model values are ignored (no selected day state).
- In `readonly` mode, selection mutation is blocked.
