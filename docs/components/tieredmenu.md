# TieredMenu

## Purpose

Provide a migration-friendly hierarchical navigation alias over `Menu` with explicit preset modes.
Use this when teams need a familiar `TieredMenu` name while keeping `Menu` as canonical rendering core.

## Props

- `items?: Array<MenuItem>` (default `[]`)
- `mode?: 'sidebar-nav' | 'top-nav'` (default `sidebar-nav`)
- `orientation?: 'vertical' | 'horizontal'` (optional override)

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
- `itemSelect` (alias event for `active`)

## Slots

- Same dynamic item slot contract as `Menu` (`${label|to|href|url}_${index}`).

## Examples

```vue
<TieredMenu
    mode="sidebar-nav"
    :items="[
        { label: 'Overview', to: '/overview' },
        {
            label: 'Management',
            items: [
                { label: 'Users', to: '/management/users' },
                { label: 'Roles', to: '/management/roles' },
            ],
        },
    ]"
/>
```

## Guidance vs Menu

- `Menu` is the canonical component for new code.
- `TieredMenu` is v1 compatibility preset over `Menu`.
- `mode='sidebar-nav'` maps to vertical navigation; `mode='top-nav'` maps to horizontal navigation.

## Theming

- Override via `theme.overrides.components.tieredMenu` (same token shape as `menu`).

## Tokens

- Uses `MenuTokens` contract (`iconGap`, item spacing, separator, link/parent states, submenu offset).

## Accessibility

- Inherits ARIA and keyboard behavior from `Menu`:
    - `role="menu"` and orientation semantics
    - `menuitem` and submenu `aria-expanded` contracts
    - keyboard open/close navigation for hierarchical items
