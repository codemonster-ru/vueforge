# OtpInput

## Props

- `modelValue?: string` (v-model)
- `length?: number` (default `6`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `mask?: boolean` (default `false`)
- `alphanumeric?: boolean` (default `false`)
- `autocomplete?: string` (default `one-time-code`)
- `autoFocus?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `OTP input`)

## Events

- `update:modelValue`
- `change`
- `complete` (payload: `string`)
- `focus`
- `blur`
- `paste` (payload: `string`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<OtpInput v-model="otp" :length="6" />
<OtpInput v-model="backupCode" :length="8" alphanumeric variant="outlined" />
```

## Tokens

Component tokens (override via `theme.overrides.components.otpInput`):

- `gap`, `fontSize`, `cellSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.cellSize`, `small.fontSize`, `small.padding`
- `large.cellSize`, `large.fontSize`, `large.padding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
