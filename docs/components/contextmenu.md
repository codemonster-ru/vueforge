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

## Theming

- Override via `theme.overrides.components.contextMenu`.

## Tokens

Component tokens (override via `theme.overrides.components.contextMenu`):

- `minWidth`
- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Recipes

- File row context menu with item commands (`items` prop).
- Canvas context menu with custom `#menu` slot actions and `data-context-menu-close` hooks.
- Keyboard fallback menu for focused list items (`Shift+F10` / `ContextMenu` key).

## Accessibility

- Supports keyboard close via `Escape` when `closeOnEsc` is enabled.
- Supports keyboard fallback open via `ContextMenu` key and `Shift+F10`.
- Context target should have clear visible focus and descriptive content.
- For custom menu content, include keyboard-focusable actions with meaningful labels.

## Interaction Contract

- Open behavior:
    - right-click (`contextmenu`) opens menu at pointer position
    - `ContextMenu` key / `Shift+F10` opens menu near focused target center
- Close behavior:
    - outside click closes
    - `Escape` closes when `closeOnEsc=true`
    - select closes when `closeOnSelect=true` and clicked element is menu action or has `data-context-menu-close`
    - close restores focus to previously focused target
- Controlled mode:
    - with `modelValue`, component emits `update:modelValue` and leaves state management to parent

## Positioning and Z-Index Policy

- Menu is rendered as `position: fixed` popup and clamped to viewport bounds on open/resize.
- Offset from invocation point is controlled by `offset`.
- Layer uses `--vf-context-menu-z-index` (default `60`), above dropdown (`50`) and below popover/tooltip/modals by default.
