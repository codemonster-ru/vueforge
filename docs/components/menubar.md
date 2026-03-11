# MenuBar

Render top-level application navigation with the `Menu` interaction model in a horizontal shell.

## Import

```ts
import { MenuBar } from '@codemonster-ru/vueforge';
```

## Examples

Use `MenuBar` for primary product navigation, not for page-local actions.

### Basic

Use a short first-level navigation set for application-level destinations.

```vue
<template>
    <MenuBar
        aria-label="Primary navigation"
        :items="[
            { label: 'Dashboard', to: '/' },
            { label: 'Projects', to: '/projects' },
            { label: 'Settings', to: '/settings' },
        ]"
    />
</template>
```

### Nested Navigation

Use nested `items` when a top-level section needs a small submenu.

```vue
<template>
    <MenuBar
        :items="[
            { label: 'Dashboard', to: '/' },
            {
                label: 'Products',
                items: [
                    { label: 'Catalog', to: '/products' },
                    { label: 'Pricing', to: '/pricing' },
                ],
            },
            { label: 'Docs', href: 'https://example.com/docs' },
        ]"
    />
</template>
```

### Commands And Disabled Items

Use command-style items sparingly; most top-level nav should still map to routes.

```vue
<template>
    <MenuBar
        :items="[
            { label: 'Home', to: '/' },
            { label: 'Refresh', command: noop },
            { label: 'Archive', disabled: true },
        ]"
    />
</template>
```

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

## Theming

- Override via `theme.overrides.components.menubar`.
- Inner menu visuals remain controlled by `theme.overrides.components.menu`.

## Tokens

Component tokens (override via `theme.overrides.components.menubar`):

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`

## Recipes

- Keep first-level labels short and stable; overflow in primary navigation is a product IA problem, not a styling problem.
- Put contextual page actions outside the menubar so navigation and actions stay distinct.
- Use nested items only for one extra level of grouping; deeper trees belong in side navigation.

## Accessibility

- Renders semantic `nav` landmark with configurable `aria-label`.
- Nested interaction semantics are provided by `Menu` (`role="menu"`, `role="menuitem"`, submenu `aria-expanded` and keyboard navigation).
- Active route state for nested `to` links is synchronized via internal `Link` route matching.
