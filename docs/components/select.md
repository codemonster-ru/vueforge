# Select

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Select v-model="role" :options="roles" placeholder="Choose role" />
```

## Tokens

Override via `theme.overrides.components.select`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
