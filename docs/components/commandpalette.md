# CommandPalette

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label: string; value?: string | number; description?: string; shortcut?: string; group?: string; disabled?: boolean; keywords?: Array<string>; command?: () => void }>`
- `placeholder?: string` (default `Type a command or search...`)
- `emptyText?: string` (default `No commands found`)
- `ariaLabel?: string` (default `Command palette`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `closeOnSelect?: boolean` (default `true`)
- `filter?: boolean` (default `true`)
- `enableShortcut?: boolean` (default `true`)
- `shortcutKey?: string` (default `k`)

## Events

- `update:modelValue`
- `open`
- `close`
- `select`
- `search`

## Slots

- This component does not expose named slots.

## Examples

```vue
<CommandPalette
    v-model="open"
    :items="[
        { label: 'Open docs', value: 'docs', group: 'Navigation' },
        { label: 'Save and publish', value: 'publish', group: 'Actions', shortcut: 'Ctrl+Enter' },
    ]"
    @select="onCommand"
/>
```

## Recipes

- Global app command launcher: bind to `Ctrl/Cmd+K` and group commands by domain (`Navigation`, `Actions`).
- Admin shortcuts: attach `command` callbacks for direct side effects plus `select` event analytics.
- Search-only mode: keep `filter=true`, feed dynamic `items` from server, and use `search` for debounced fetch.

## Tokens

Component tokens (override via `theme.overrides.components.commandPalette`):

- `width`, `maxWidth`, `maxHeight`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `overlayBackgroundColor`
- `shadow`, `zIndex`, `headerGap`
- `inputPadding`, `inputBorderRadius`, `inputBorderColor`
- `inputBackgroundColor`, `inputTextColor`, `inputPlaceholderColor`
- `inputFocusBorderColor`, `inputFocusRingShadow`
- `listGap`, `groupGap`
- `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`
- `itemPadding`, `itemBorderRadius`, `itemGap`
- `itemTextColor`, `itemDescriptionColor`, `itemDescriptionFontSize`
- `itemActiveBackgroundColor`, `itemActiveTextColor`, `itemDisabledOpacity`
- `shortcutPadding`, `shortcutBorderRadius`, `shortcutBorderColor`
- `shortcutBackgroundColor`, `shortcutTextColor`, `shortcutFontSize`
- `emptyPadding`, `emptyColor`

## Accessibility

- Panel uses `role="dialog"` and command list uses `listbox` + `option`.
- On open, focus moves to search input; on close, focus restores to previously active element.
- Keyboard navigation supports `ArrowUp`/`ArrowDown`, `Enter` selection, and `Escape` close.

## Interaction Contract

- Open paths:
    - external `modelValue=true`
    - shortcut (`Ctrl/Cmd + shortcutKey`) when `enableShortcut=true`
- On open:
    - emits `open`
    - clears query and resets active item to first enabled option
    - focuses input
- Selection:
    - `Enter` selects active enabled item
    - emits `select`
    - runs item `command` callback when provided
    - closes when `closeOnSelect=true`
- Dismiss:
    - overlay click closes when `closeOnOverlay=true`
    - `Escape` closes when `closeOnEsc=true`
    - emits `close`

## Z-Index Policy

- Uses `--vf-command-palette-z-index` (default `110`).
- Default layer intent:
    - above modal/drawer (`100`)
    - below toast/tour (`120`) and notification center (`125`)
