# Spinner

## Props

- `variant?: 'inline' | 'overlay'` (default `inline`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `label?: string`
- `ariaLabel?: string` (default `Loading`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` (optional) - custom label content

## Examples

```vue
<Spinner />
<Spinner label="Loading users..." size="small" />
<Spinner variant="overlay" severity="info" label="Sync in progress" />
```

## Tokens

Component tokens (override via `theme.overrides.components.spinner`):

- `size`, `thickness`, `color`, `trackColor`
- `gap`, `labelColor`, `labelFontSize`
- `animationDuration`
- `overlayMinHeight`, `overlayPadding`, `overlayBorderRadius`, `overlayBackgroundColor`
- `info.color`, `success.color`, `warn.color`, `danger.color`
- `small.size`, `small.thickness`, `small.labelFontSize`
- `large.size`, `large.thickness`, `large.labelFontSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
