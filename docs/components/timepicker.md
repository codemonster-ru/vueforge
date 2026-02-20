# TimePicker

## Props

- `modelValue?: string` (v-model, time `HH:mm`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (time `HH:mm`)
- `max?: string` (time `HH:mm`)
- `step?: number` (minutes, default `30`)
- `format?: '24h' | '12h'` (default `24h`)
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
<TimePicker v-model="meetingTime" placeholder="Pick time" min="09:00" max="18:00" :step="15" />
```

## Tokens

Component tokens (override via `theme.overrides.components.timepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
