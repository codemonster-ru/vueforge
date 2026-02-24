# MenuBar

## Purpose

Provide horizontal app-level navigation with nested sections, backed by the `Menu` interaction model.

## Props

- `items?: Array<MenuBarItem>`
- `ariaLabel?: string` (default `Main navigation`)

`MenuBarItem` supports the same shape as `Menu` items (`label`, `to`/`href`, `items`, `active`, `disabled`, `separator`, `command`).
Route-aware item activation is inherited from `Menu` + `Link` contracts for `to` links.

## Events

- `active`
- `onActive`

## Slots

- Inherits per-item dynamic slot capability from internal `Menu` rendering.

## Examples

```vue
<MenuBar
    aria-label="Primary navigation"
    :items="[
        { label: 'Dashboard', to: '/' },
        {
            label: 'Products',
            items: [
                { label: 'Catalog', to: '/products' },
                { label: 'Pricing', to: '/pricing' },
            ],
        },
        { label: 'Settings', to: '/settings' },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.menubar`.
- Inner menu visuals remain controlled by `theme.overrides.components.menu`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`

## Recipes

- Use `MenuBar` for top-level app sections and place contextual actions outside of navigation items.
- Keep first-level items short and move deep hierarchy to nested menus.

## Accessibility

- Renders semantic `nav` landmark with configurable `aria-label`.
- Nested interaction semantics are provided by `Menu` (`role="menu"`, `role="menuitem"`, submenu `aria-expanded` and keyboard navigation).
- Active route state for nested `to` links is synchronized via internal `Link` route matching.

## Responsive

- Prefer collapsing or switching to drawer mode on narrow viewports where top-nav labels overflow.
- Keep pointer targets large enough for touch usage in horizontal bars.

## SSR/Hydration

- Hydration-safe: wraps deterministic `Menu` rendering and does not introduce client-only branching.

## Testing

- Cover nav landmark rendering, horizontal menu orientation, forwarding of active navigation events, and route-active sync for nested links.
