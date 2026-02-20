# Chip

## Props

- `label?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'solid' | 'soft' | 'outline'` (default `soft`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `disabled?: boolean`
- `closable?: boolean` (default `false`)
- `icon?: string`
- `ariaLabel?: string`
- `closeLabel?: string` (default `Remove`)

## Events

- `close`

## Slots

- `default` - chip content (fallbacks to `label`)
- `icon` (optional)
- `close` (optional)

## Examples

```vue
<Chip label="New" />
<Chip severity="info" closable>Info</Chip>
```

## Tokens

Component tokens (override via `theme.overrides.components.chip`):

- `fontSize`, `lineHeight`, `paddingX`, `paddingY`, `borderRadius`, `gap`
- `backgroundColor`, `textColor`, `borderColor`
- `softBackgroundColor`, `softTextColor`, `softBorderColor`
- `outlineTextColor`, `outlineBorderColor`
- `iconSize`, `closeSize`, `closeFontSize`, `closeRadius`, `closeColor`, `closeHoverBackgroundColor`, `disabledOpacity`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/textColor/borderColor/soft*/outline*)
- `small.fontSize`, `small.paddingX`, `small.paddingY`
- `large.fontSize`, `large.paddingX`, `large.paddingY`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
