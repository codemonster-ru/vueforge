# Rating

## Props

- `modelValue?: number` (v-model)
- `max?: number` (default `5`)
- `allowHalf?: boolean` (default `false`)
- `readonly?: boolean`
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Rating v-model="score" />
<Rating v-model="score" allow-half size="large" />
```

## Tokens

Component tokens (override via `theme.overrides.components.rating`):

- `gap`, `size`, `color`, `activeColor`, `hoverColor`
- `focusRingShadow`, `focusRadius`, `disabledOpacity`
- `small.size`
- `large.size`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
