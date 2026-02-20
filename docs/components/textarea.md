# Textarea

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `rows?: number` (default `3`)

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
<Textarea v-model="bio" placeholder="Tell us about yourself" rows="4" />
```

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
