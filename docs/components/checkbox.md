# Checkbox

## Props

- `modelValue?: boolean` (v-model, default `false`)
- `label?: string`
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`

## Slots

- `default` (label content)

## Examples

```vue
<Checkbox v-model="agreed" label="I agree" />
<Checkbox v-model="agreed" variant="outlined">Custom label</Checkbox>
```

## Tokens

Override via `theme.overrides.components.checkbox`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
