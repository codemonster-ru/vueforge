# Switch

## Props

- `modelValue?: boolean` (v-model, default `false`)
- `label?: string`
- `disabled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `change`

## Slots

- `default` (label content)

## Examples

```vue
<Switch v-model="darkMode" label="Dark mode" />
```

## Tokens

Override via `theme.overrides.components.switch`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
