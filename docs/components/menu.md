# Menu

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

## Tokens

Override via `theme.overrides.components.menu`.

## Accessibility

- Root list uses `role="menu"`, items use `role="menuitem"`.
- Parent items with submenus expose `aria-expanded`.
- Keyboard support includes `Enter` and `Space` for parent item toggling.
- Ensure menu labels are meaningful and disabled items communicate `aria-disabled`.
