# ContextMenu

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; icon?: string; disabled?: boolean; separator?: boolean; command?: () => void }>`
- `disabled?: boolean`
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `offset?: number` (default `2`)

## Events

- `update:modelValue`
- `open`
- `close`
- `select`
- `contextmenu`

## Slots

- `default` - context area/target
- `menu` (optional) - menu content (defaults to `items` list if provided)

Note: For custom menu content, add `data-context-menu-close` to clickable elements to auto-close on click.

## Examples

```vue
<ContextMenu :items="menuItems">
    <div class="surface">Right-click here</div>
</ContextMenu>
```

## Tokens

Component tokens (override via `theme.overrides.components.contextMenu`):

- `minWidth`
- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Accessibility

- Supports keyboard close via `Escape` when `closeOnEsc` is enabled.
- Context target should have clear visible focus and descriptive content.
- For custom menu content, include keyboard-focusable actions with meaningful labels.
