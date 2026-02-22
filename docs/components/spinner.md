# Spinner

## Purpose

- Indicate indeterminate loading for short-running asynchronous operations.
- Communicate busy state without shifting surrounding layout.

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.spinner`):

- `size`, `thickness`, `color`, `trackColor`
- `gap`, `labelColor`, `labelFontSize`
- `animationDuration`
- `overlayMinHeight`, `overlayPadding`, `overlayBorderRadius`, `overlayBackgroundColor`
- `info.color`, `success.color`, `warn.color`, `danger.color`
- `small.size`, `small.thickness`, `small.labelFontSize`
- `large.size`, `large.thickness`, `large.labelFontSize`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Verify spinner sizes and spacing remain legible in dense mobile layouts.
- Ensure inline spinner usage does not collapse text baselines.

## SSR/Hydration

- Spinner output is deterministic and should hydrate without animation-related mismatch.
- Client-only animation hooks must not alter initial markup.

## Testing

- Cover size/variant props and aria labeling for loading announcements.
- Add visual checks for contrast and animation presence in reduced-motion mode.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
