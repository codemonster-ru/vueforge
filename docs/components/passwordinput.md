# PasswordInput

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `current-password`)
- `showToggle?: boolean` (default `true`)
- `showStrength?: boolean` (default `false`)
- `showCapsLockHint?: boolean` (default `true`)
- `revealLabel?: string` (default `Show password`)
- `hideLabel?: string` (default `Hide password`)
- `revealText?: string` (default `Show`)
- `hideText?: string` (default `Hide`)
- `capsLockHint?: string` (default `Caps Lock is on`)
- `weakLabel?: string` (default `Weak password`)
- `mediumLabel?: string` (default `Medium password`)
- `strongLabel?: string` (default `Strong password`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Password input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `toggleVisibility` (payload: `boolean`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<PasswordInput v-model="password" show-strength />
```

## Tokens

Component tokens (override via `theme.overrides.components.passwordInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `toggleSize`, `toggleRadius`, `toggleColor`, `toggleHoverBackgroundColor`
- `strengthGap`, `strengthTrackHeight`, `strengthTrackRadius`, `strengthTrackBackgroundColor`
- `strengthWeakColor`, `strengthMediumColor`, `strengthStrongColor`
- `metaFontSize`, `hintColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Visibility toggle is a native `button`, so it is keyboard accessible by default.
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
