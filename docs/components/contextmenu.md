# ContextMenu

Open action menus from right-click or keyboard context-menu invocation at the pointer location.

## Import

```ts
import { ContextMenu } from '@codemonster-ru/vueforge';
```

## Examples

Use `ContextMenu` for row-level or canvas-level actions that naturally belong to right-click interaction.

### Basic

Use `items` for a conventional context menu with route or command actions.

```vue
<template>
    <ContextMenu
        :items="[
            { label: 'Open', href: '#' },
            { label: 'Duplicate', href: '#' },
            { separator: true },
            { label: 'Archive', href: '#', disabled: true }
        ]"
    >
        <div style="padding: 1rem; border: 1px dashed #ccc;">Right-click here</div>
    </ContextMenu>
</template>
```

### Custom Menu Content

Use the `menu` slot when the popup needs custom controls instead of a plain menu item list.

```vue
<template>
    <ContextMenu>
        <div style="padding: 1rem; border: 1px dashed #ccc;">Open custom menu</div>
        <template #menu>
            <Stack gap="0.5rem">
                <Button label="Create report" size="small" data-context-menu-close />
                <Button label="Share link" size="small" variant="text" data-context-menu-close />
            </Stack>
        </template>
    </ContextMenu>
</template>
```

### Controlled State

Use `v-model` when open state must stay coordinated with surrounding logic.

```vue
<template>
    <ContextMenu v-model="open" :items="[{ label: 'Refresh', href: '#' }]">
        <div style="padding: 1rem; border: 1px dashed #ccc;">Controlled context area</div>
    </ContextMenu>
</template>
```

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

## Theming

- Override via `theme.overrides.components.contextMenu`.

## Tokens

Component tokens (override via `theme.overrides.components.contextMenu`):

- `minWidth`
- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Recipes

- Use `ContextMenu` for actions that are contextual to a specific row, card, or canvas point.
- Always provide a keyboard fallback path for the same actions elsewhere in the UI.
- Keep context menu action lists short and task-oriented; long trees are hard to scan at pointer position.

## Accessibility

- Supports keyboard close via `Escape` when `closeOnEsc` is enabled.
- Supports keyboard fallback open via `ContextMenu` key and `Shift+F10`.
- Context target should have clear visible focus and descriptive content.
- For custom menu content, include keyboard-focusable actions with meaningful labels.
