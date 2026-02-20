# Slider

## Props

- `modelValue?: number | [number, number]` (v-model)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `step?: number` (default `1`)
- `range?: boolean` (default `false`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showValue?: boolean` (default `false`)
- `marks?: Array<{ value: number; label?: string }>`

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
<Slider v-model="priceRange" :min="0" :max="1000" :step="10" range />
```

## Tokens

Component tokens (override via `theme.overrides.components.slider`):

- `width`, `gap`
- `textColor`
- `trackHeight`, `trackBackgroundColor`, `trackRadius`, `fillBackgroundColor`
- `thumbSize`, `thumbColor`, `thumbBorderColor`, `thumbBorderWidth`, `thumbShadow`
- `focusRingShadow`, `disabledOpacity`
- `markSize`, `markColor`, `markLabelFontSize`, `markLabelColor`, `marksHeight`
- `valueFontSize`, `valueColor`
- `small.trackHeight`, `small.thumbSize`, `small.valueFontSize`
- `large.trackHeight`, `large.thumbSize`, `large.valueFontSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
