# Chip

## Purpose

Communicate system and domain state through inline status, metadata markers, loaders, and empty experiences.
Provide reusable feedback primitives for dashboards, tables, and long-running operations.

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

## Theming

- Override via theme component overrides for each component documented on this page.

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

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify text/icon/indicator layout and density at mobile/tablet/desktop breakpoints.
Ensure status content remains legible and non-overlapping in constrained containers.

## SSR/Hydration

Keep initial status/loading state deterministic in server-rendered output.
Start animations or timers only after hydration to avoid markup mismatch.

## Testing

Cover severity/variant rendering, visibility lifecycle, and accessibility announcements where relevant.
Add visual regression tests for key state combinations and contrast-sensitive variants.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
