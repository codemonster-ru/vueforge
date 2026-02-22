# OtpInput

## Purpose

Capture user text and numeric input with consistent API, validation hooks, and theming behavior.
Support high-frequency form entry scenarios in SaaS settings, auth, and CRUD flows.

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.otpInput`):

- `gap`, `fontSize`, `cellSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.cellSize`, `small.fontSize`, `small.padding`
- `large.cellSize`, `large.fontSize`, `large.padding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate control height, helper/error text wrapping, and icon/addon placement across breakpoints.
Ensure virtual keyboards and touch interaction do not clip labels, hints, or action icons.

## SSR/Hydration

Keep initial value, disabled, and readonly states identical between server and client render.
Avoid hydration mismatches from client-only formatting or masking initialization.

## Testing

Cover v-model updates, input/change/blur events, and validation edge cases.
Add accessibility tests for labeling, error semantics, and keyboard interaction contracts.

## Accessibility

- Root uses `role="group"` and supports `ariaLabel` / `ariaLabelledby` / `ariaDescribedby`.
- Each cell exposes a generated label like `OTP digit 1 of 6` (customizable via `cellAriaLabelPrefix`).
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard supports `ArrowLeft`/`ArrowRight` navigation, `Backspace` clearing, and paste distribution across cells.
- Keyboard focus ring is provided per cell via `:focus-visible`.
