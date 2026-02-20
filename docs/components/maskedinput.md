# MaskedInput

## Props

- `modelValue?: string` (v-model)
- `mask?: string | ((value: string) => string)` (default `''`)
- `placeholder?: string`
- `placeholderChar?: string` (default `_`)
- `disabled?: boolean`
- `readonly?: boolean`
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

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
