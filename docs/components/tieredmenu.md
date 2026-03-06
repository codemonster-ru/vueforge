# TieredMenu

Provide a compatibility-oriented hierarchical menu alias over `Menu`.

## Import

```ts
import { TieredMenu } from '@codemonster-ru/vueforge';
```

## Examples

Use `TieredMenu` when preserving an older API name matters. Prefer `Menu` in new code.

### Sidebar Preset

Use `mode="sidebar-nav"` for vertical hierarchical navigation.

```vue
<template>
    <TieredMenu
        mode="sidebar-nav"
        :items="[
            { label: 'Overview', to: '/overview' },
            {
                label: 'Management',
                items: [
                    { label: 'Users', to: '/management/users' },
                    { label: 'Roles', to: '/management/roles' }
                ]
            }
        ]"
    />
</template>
```

### Top Navigation Preset

Use `mode="top-nav"` when the same menu data should render horizontally.

```vue
<template>
    <TieredMenu
        mode="top-nav"
        :items="[
            { label: 'Products', items: [{ label: 'Catalog', to: '/catalog' }] },
            { label: 'Docs', items: [{ label: 'Guides', to: '/guides' }] }
        ]"
    />
</template>
```

## Props

- `items?: Array<MenuItem>` (default `[]`)
- `mode?: 'sidebar-nav' | 'top-nav'` (default `sidebar-nav`)
- `orientation?: 'vertical' | 'horizontal'`

## Events

- `active`
- `onActive`
- `itemSelect`

## Slots

- Uses the same dynamic item slot contract as `Menu`.

## Guidance Vs Menu

- `Menu` is the canonical component for new implementation.
- `TieredMenu` exists for migration compatibility and familiar naming.
- `mode='sidebar-nav'` maps to vertical navigation and `mode='top-nav'` maps to horizontal navigation.

## Theming

- Uses the same token contract as `Menu`.
- Override via `theme.overrides.components.menu` or `theme.overrides.components.tieredMenu` if your project keeps a separate alias entry.

## Tokens

- Uses the `Menu` token contract: `iconGap`, `submenuOffset`, separator tokens, link and parent state colors, and item spacing.

## Recipes

- Prefer `Menu` for all new docs and implementation.
- Use `TieredMenu` only where a public API or migration path still depends on the older name.
- Do not create separate visual behavior unless the alias intentionally diverges.

## Accessibility

- Inherits ARIA and keyboard behavior from `Menu`.
- This includes menu semantics, submenu expansion contracts, and hierarchical keyboard traversal.
