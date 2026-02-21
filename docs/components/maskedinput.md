# MaskedInput

## Props

- `modelValue?: string` (v-model)
- `mask?: string | ((value: string) => string)` (default `''`)
- `placeholder?: string`
- `placeholderChar?: string` (default `_`)
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `text`)
- `ariaLabel?: string` (default `Masked input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)
- `unmask?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `complete`

## Slots

- This component does not expose named slots.

## Examples

```vue
<MaskedInput v-model="phone" mask="+7 (###) ###-##-##" />
<MaskedInput v-model="licenseRaw" mask="AA-####" unmask variant="outlined" />
```

## Tokens

Component tokens (override via `theme.overrides.components.maskedInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
