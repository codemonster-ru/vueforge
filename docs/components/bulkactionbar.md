# BulkActionBar

## Purpose

Provide selection-aware bulk actions for table/list workflows with confirm and undo hooks.
Supports operational SaaS flows where multi-row actions need explicit user feedback.

## Props

- `selection?: Array<string | number>` (default `[]`)
- `actions?: Array<{ id: string; label: string; requiresConfirm?: boolean; disabled?: boolean }>`
- `disabled?: boolean` (default `false`)
- `confirmMessage?: string` (default `Are you sure?`)
- `selectedCountLabel?: string` (default `selected`)
- `ariaLabel?: string` (default `Bulk action bar`)
- `undoLabel?: string` (default `Undo`)
- `showUndoButton?: boolean` (default `true`)
- `undoDisabled?: boolean` (default `false`)
- `lastActionId?: string | null` (default `null`)
- `undoToken?: string`

## Events

- `action` - emits `{ actionId, selection }`
- `confirm` - emits `{ actionId, selection, message }`
- `undo` - emits `{ actionId, selection, token? }`

## Slots

- This component does not expose named slots.

## Examples

```vue
<BulkActionBar
    :selection="selectedRowIds"
    :actions="[
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete', requiresConfirm: true },
    ]"
    :last-action-id="lastBulkActionId"
    :undo-token="lastUndoToken"
    @action="runBulkAction"
    @confirm="openConfirmDialog"
    @undo="undoBulkAction"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.bulkActionBar`):

- `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`
- `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- `secondaryBorderColor`
- `focusBorderColor`, `focusRing`
- `disabledOpacity`

## Accessibility

- Root uses `role="region"` with configurable `ariaLabel`.
- Action controls are native buttons and remain keyboard-accessible.
- Keep action labels explicit (`Archive`, `Delete`, etc.) to reduce ambiguity for assistive users.
