# Menu

## Purpose

- Render navigation/action menus with keyboard-friendly item traversal.
- Support app navigation and contextual command lists with a consistent API.

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

## Examples

```vue
<Menu :items="[{ label: 'Home', to: '/' }, { separator: true }, { label: 'Docs', href: 'https://example.com' }]" />
```

### Top-nav preset

```vue
<Menu
    orientation="horizontal"
    :items="[
        { label: 'Dashboard', to: '/' },
        {
            label: 'Products',
            items: [
                { label: 'Catalog', to: '/products/catalog' },
                { label: 'Pricing', to: '/products/pricing' },
            ],
        },
        { label: 'Docs', href: 'https://example.com/docs' },
    ]"
/>
```

### Sidebar-nav preset

```vue
<Menu
    orientation="vertical"
    :items="[
        { label: 'Overview', to: '/overview' },
        {
            label: 'Management',
            items: [
                { label: 'Users', to: '/management/users' },
                { label: 'Roles', to: '/management/roles' },
            ],
        },
        { separator: true },
        { label: 'Settings', to: '/settings' },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.menu`.

## Tokens

- See menu token set in theme overrides (item spacing, separator, colors, submenu spacing, icon gaps).

## Recipes

- Top navigation: `orientation="horizontal"` with first-level product areas and dropdown children.
- Sidebar navigation: `orientation="vertical"` with grouped sections and separators.

## Responsive

- Validate dense and touch-friendly row sizing for mobile/tablet.
- Ensure long labels/icons truncate or wrap predictably without clipping.

## SSR/Hydration

- Keep item tree rendering stable across server/client, including active/disabled states.
- Confirm focus/hover runtime states initialize client-side without markup drift.

## Testing

- Cover item rendering, active/disabled/selected states, and keyboard navigation.
- Add regression tests for nested groups and icon/label alignment in narrow widths.

## Accessibility

- Root list uses `role="menu"` and `aria-orientation`.
- Interactive items use `role="menuitem"`; separators use `role="separator"`.
- Parent items expose `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Active links expose `aria-current="page"`.
- Keyboard support for submenu parents:
    - `Enter` / `Space`: toggle submenu
    - `ArrowRight` / `ArrowDown`: open submenu and move focus to first nested item
    - `ArrowLeft` / `Escape`: close submenu
