# OverlayBadge

## Purpose

Render compact status/count overlays on top of actionable icons, buttons, or avatars.

## Props

- `value?: string | number | null` (default `undefined`)
- `hidden?: boolean` (default `false`)
- `dot?: boolean` (default `false`)
- `max?: number` (default `99`)
- `showZero?: boolean` (default `false`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `danger`)
- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default `top-right`)
- `ariaLabel?: string` (default `''`)
- `as?: string` (default `span`)

## Events

- N/A

## Slots

- `default` (trigger/content target to decorate)

## Examples

```vue
<OverlayBadge :value="8" severity="info">
    <button type="button" aria-label="Inbox">📥</button>
</OverlayBadge>
```

Directive usage:

```vue
<button v-overlay-badge="{ value: 3, severity: 'warn' }" type="button">Alerts</button>
```

## Theming

- Override via `theme.overrides.components.overlayBadge`.

## Tokens

- `minSize`, `dotSize`, `paddingX`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`
- `fontSize`, `fontWeight`, `lineHeight`, `zIndex`
- `topOffset`, `rightOffset`, `bottomOffset`, `leftOffset`
- `neutral*`, `info*`, `success*`, `warn*`, `danger*` color triplets

## Recipes

- Notification icon counts in app header.
- Presence/status dots on avatar actions.

## Accessibility

- Provide meaningful `ariaLabel` when badge meaning is critical for non-visual users.
- Decorative badges are hidden from assistive tech by default.

## Responsive

- Overlay keeps compact footprint and supports all corner positions for narrow toolbar/icon targets.

## SSR/Hydration

- Component output is deterministic from props.
- Directive applies DOM styles only on client mount/update.

## Testing

- Cover count formatting (`max`, `showZero`), dot mode, severity/position attributes, and directive reactive updates.
