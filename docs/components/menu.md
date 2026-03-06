# Menu

Render navigation and action menus with support for nesting, separators, and keyboard-friendly traversal.

## Import

```ts
import { Menu } from '@codemonster-ru/vueforge';
```

## Examples

Use `Menu` for structured navigation and command lists. Keep item trees explicit and stable so focus and active-state behavior stay predictable.

### Basic

Use a vertical menu for simple action or navigation lists.

```vue
<template>
    <Menu
        :items="[
            { label: 'Home', to: '/' },
            { separator: true },
            { label: 'Docs', href: 'https://example.com/docs' }
        ]"
    />
</template>
```

### Nested Menu

Use nested `items` to group related destinations or commands under a parent item.

```vue
<template>
    <Menu
        :items="[
            { label: 'Overview', to: '/overview' },
            {
                label: 'Management',
                items: [
                    { label: 'Users', to: '/management/users' },
                    { label: 'Roles', to: '/management/roles' }
                ]
            },
            { separator: true },
            { label: 'Settings', to: '/settings' }
        ]"
    />
</template>
```

### Horizontal Navigation

Use `orientation="horizontal"` for top-level app navigation.

```vue
<template>
    <Menu
        orientation="horizontal"
        :items="[
            { label: 'Dashboard', to: '/' },
            {
                label: 'Products',
                items: [
                    { label: 'Catalog', to: '/products/catalog' },
                    { label: 'Pricing', to: '/products/pricing' }
                ]
            },
            { label: 'Docs', href: 'https://example.com/docs' }
        ]"
    />
</template>
```

### Commands And Disabled Items

Use `command` for action-style items and `disabled` when an item should stay visible but unavailable.

```vue
<template>
    <Menu
        :items="[
            { label: 'Refresh', command: noop },
            { label: 'Archive', disabled: true },
            { label: 'Export', command: noop }
        ]"
    />
</template>
```

## Props

- `items: Array<MenuItem>`
- `orientation?: 'vertical' | 'horizontal'` (default `vertical`)

`MenuItem` supports:

- `label?: string`
- `to?: string`
- `href?: string`
- `url?: string`
- `icon?: string`
- `items?: Array<MenuItem>`
- `active?: boolean`
- `disabled?: boolean`
- `separator?: boolean`
- `command?: () => void`

## Events

- `active`
- `onActive`

## Slots

- Dynamic item slot by item key (`${label|to|href|url}_${index}`)

## Theming

- Override via `theme.overrides.components.menu`.

## Tokens

Component tokens (override via `theme.overrides.components.menu`):

- `iconGap`, `submenuOffset`
- `separatorThickness`, `separatorHeight`, `separatorColor`
- `link.hoverColor`, `link.activeColor`
- `parent.hoverColor`, `parent.activeColor`
- `item.marginTop`, `item.marginRight`, `item.marginBottom`, `item.marginLeft`

## Recipes

- Use `vertical` menus for side navigation and command lists, `horizontal` menus for top navigation.
- Prefer separators for grouping, not decoration; every separator should mark a meaningful boundary.
- Keep nesting shallow. Deep menu trees quickly become harder to scan and navigate with keyboard.

## Accessibility

- Root list uses `role="menu"` and `aria-orientation`.
- Interactive items use `role="menuitem"`; separators use `role="separator"`.
- Parent items expose `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Active links expose `aria-current="page"`.
- Keyboard support for submenu parents:
- `Enter` / `Space`: toggle submenu
- `ArrowRight` / `ArrowDown`: open submenu and move focus to first nested item
- `ArrowLeft` / `Escape`: close submenu
