# Avatar

## Purpose

Communicate system and domain state through inline status, metadata markers, loaders, and empty experiences.
Provide reusable feedback primitives for dashboards, tables, and long-running operations.

## Props

- `src?: string`
- `alt?: string`
- `name?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `shape?: 'circle' | 'rounded'` (default `circle`)
- `status?: 'online' | 'offline' | 'busy' | 'away'`

## Events

- This component does not emit component-specific events.

## Slots

- `default` - custom avatar content

## Examples

```vue
<Avatar name="Ada Lovelace" />
<Avatar src="/img/ada.png" alt="Ada Lovelace" size="large" />
<Avatar name="Ada Lovelace" status="online" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.avatar`):

- `size`, `fontSize`, `fontWeight`
- `backgroundColor`, `textColor`, `borderColor`, `borderWidth`, `borderRadius`
- `statusSize`, `statusBorderWidth`, `statusBorderColor`
- `statusOnlineColor`, `statusOfflineColor`, `statusBusyColor`, `statusAwayColor`
- `small.size`, `small.fontSize`, `small.statusSize`
- `large.size`, `large.fontSize`, `large.statusSize`

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
