# OtpInput

## Props

- `modelValue?: string` (v-model)
- `length?: number` (default `6`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string` (cell names are generated as `${name}-1`, `${name}-2`, ...)
- `mask?: boolean` (default `false`)
- `alphanumeric?: boolean` (default `false`)
- `autocomplete?: string` (default `one-time-code`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `numeric`)
- `autoFocus?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `OTP input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)
- `cellAriaLabelPrefix?: string` (default `OTP digit`)

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

- Root uses `role="group"` and supports `ariaLabel` / `ariaLabelledby` / `ariaDescribedby`.
- Each cell exposes a generated label like `OTP digit 1 of 6` (customizable via `cellAriaLabelPrefix`).
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard supports `ArrowLeft`/`ArrowRight` navigation, `Backspace` clearing, and paste distribution across cells.
- Keyboard focus ring is provided per cell via `:focus-visible`.
