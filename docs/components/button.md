# Button

## Props

- `to?: string | object`
- `href?: string`
- `url?: string`
- `as?: 'button' | 'link'`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset' | string` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `label?: string`
- `loading?: boolean` (default `false`)
- `rounded?: boolean` (default `false`)
- `iconPos?: 'top' | 'right' | 'bottom' | 'left'` (default `left`)
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: string` (default `primary`)
- `disabled?: boolean` (default `false`)

## Events

- Native `click` from rendered button/link

## Slots

- `default`

## Examples

```vue
<Button label="Primary" />
<Button label="Outlined" variant="outlined" />
<Button label="Docs" to="/docs" as="link" />
```

## Tokens

Override via `theme.overrides.components.button`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
