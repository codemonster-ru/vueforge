# Dock

## Purpose

Provide an app-launcher style navigation strip for quick access to primary workspaces and utility actions.

## Props

- `items?: Array<DockItem>`
- `modelValue?: string | number | null`
- `position?: 'bottom' | 'top' | 'left' | 'right'` (default `bottom`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Application launcher`)
- `syncActiveFromRoute?: boolean` (default `true`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

`DockItem`:

- `key?: string | number`
- `label: string`
- `icon?: string`
- `to?: string | RouteLocationRaw`
- `href?: string`
- `url?: string`
- `active?: boolean`
- `exact?: boolean`
- `disabled?: boolean`
- `command?: () => void`

## Events

- `update:modelValue`
- `select` (`{ item, index, key, event }`)

## Slots

- `item` - slot props `{ item, index, active }`

## Examples

```vue
<Dock
    v-model="activeKey"
    :items="[
        { key: 'home', label: 'Home', icon: 'house', to: '/home' },
        { key: 'search', label: 'Search', icon: 'magnifyingGlass', to: '/search' },
        { key: 'settings', label: 'Settings', icon: 'gear' },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.dock`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `shadow`
- `padding`, `gap`
- `itemSize`, `itemBorderRadius`, `itemColor`
- `itemHoverBackgroundColor`, `itemActiveBackgroundColor`, `itemActiveColor`
- `iconSize`, `labelFontSize`, `disabledOpacity`

## Recipes

- Bottom launcher for desktop apps with workspace shortcuts.
- Vertical side launcher (`position="left"`/`"right"`) for dense admin shells.

## Accessibility

- Renders semantic `nav` landmark with `menubar/menuitem` interaction roles.
- Keyboard support: `Arrow` keys for roving focus, `Home`/`End` for boundaries, `Enter`/`Space` for activation.
- Active route/item is exposed with `aria-current="page"`.

## Responsive

- Use horizontal dock for mobile bottom navigation and keep labels short.
- For vertical docks, verify hit targets and spacing in collapsed sidebars.

## SSR/Hydration

- Deterministic render from `items`/`modelValue`.
- Route-sync behavior reads injected route state without client-only branching.

## Testing

- Cover click/keyboard activation, disabled items, route active-state sync, and orientation behavior.
