# StickyRegion

## Purpose

- Provide sticky utility wrappers for header/subheader/action regions.
- Standardize offset and z-index behavior for stacked sticky surfaces.

## Props

- `as?: string` (default `div`)
- `edge?: 'top' | 'bottom'` (default `top`)
- `offset?: string` (default `0px`)
- `zIndex?: string | number` (optional override)
- `bordered?: boolean` (default `false`)
- `shadow?: boolean` (default `false`)
- `ariaLabel?: string` (optional landmark label)

## Slots

- `default`

## Example

```vue
<StickyRegion as="header" edge="top" offset="3.5rem" bordered shadow>
    <Toolbar aria-label="Page actions" />
</StickyRegion>
```

## Tokens

Component tokens (override via `theme.overrides.components.stickyRegion`):

- `zIndex`, `padding`
- `borderColor`, `backgroundColor`, `textColor`
- `shadow`

## Responsive

- Use `offset` to align sticky region with responsive app bars or top system bars.

## SSR/Hydration

- Sticky positioning is CSS-only and SSR-stable when `offset` is deterministic.

## Testing

- Covers top/bottom variants, border/shadow classes, and style overrides.

## Accessibility

- Uses `role="region"` for non-semantic tags and supports explicit `ariaLabel`.
