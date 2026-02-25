# CommandPalette

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label: string; value?: string | number; description?: string; shortcut?: string; group?: string; scope?: string; disabled?: boolean; keywords?: Array<string>; entityType?: string; entityId?: string | number; entityKeywords?: Array<string>; command?: () => void }>`
- `placeholder?: string` (default `Type a command or search...`)
- `emptyText?: string` (default `No commands found`)
- `ariaLabel?: string` (default `Command palette`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `closeOnSelect?: boolean` (default `true`)
- `filter?: boolean` (default `true`)
- `enableShortcut?: boolean` (default `true`)
- `shortcutKey?: string` (default `k`)
- `scopes?: Array<{ id: string; label: string; aliases?: string[] }>`
- `scope?: string` (default `all`)
- `showScopeTabs?: boolean` (default `true`)
- `showRecent?: boolean` (default `true`)
- `recentLimit?: number` (default `6`)
- `recentStorageKey?: string`
- `entitySearch?: boolean` (default `true`)

## Events

- `update:modelValue`
- `update:scope`
- `update:recent`
- `open`
- `close`
- `select`
- `search`
- `scopeChange`
- `entitySearch`

## Slots

- This component does not expose named slots.

## Examples

```vue
<CommandPalette
    v-model="open"
    v-model:scope="scope"
    :items="[
        { label: 'Open docs', value: 'docs', group: 'Navigation', scope: 'project' },
        {
            label: 'Open customer',
            value: 'customer-42',
            group: 'Entities',
            scope: 'project',
            entityType: 'Customer',
            entityId: 42,
        },
        { label: 'Save and publish', value: 'publish', group: 'Actions', scope: 'project', shortcut: 'Ctrl+Enter' },
    ]"
    :scopes="[
        { id: 'project', label: 'Project', aliases: ['p'] },
        { id: 'billing', label: 'Billing', aliases: ['b'] },
    ]"
    recent-storage-key="workspace.commandPalette.recent"
    @select="onCommand"
    @entitySearch="onEntitySearch"
/>
```

## Recipes

- Global app command launcher: bind to `Ctrl/Cmd+K` and group commands by domain (`Navigation`, `Actions`).
- Admin shortcuts: attach `command` callbacks for direct side effects plus `select` event analytics.
- Search-only mode: keep `filter=true`, feed dynamic `items` from server, and use `search` for debounced fetch.
- Scoped commands: use scope tabs and query prefix (`p:deploy`, `b:invoice`) for domain-specific command sets.
- Recent actions: set `recentStorageKey` to persist last-used commands and surface them first when query is empty.
- Entity search: emit `entitySearch` to fetch entities and pass results as `items` with `entityType` metadata.

## Theming

- Override via theme component overrides for each component documented on this page.

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

## Responsive

Verify control affordances, panel sizing, and gesture/mouse interactions across device classes.
Ensure compact layouts preserve clarity for actions, handles, and contextual hints.

## SSR/Hydration

Keep initial value and panel-closed/base state stable between server and client output.
Hydrate client-only interaction engines (editor, drag, command layers) without DOM mismatch.

## Testing

Cover core interaction loops, boundary conditions, and value/state synchronization.
Add accessibility tests for keyboard alternatives, labelling, and focus behavior.

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
