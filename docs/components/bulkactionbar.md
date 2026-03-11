# BulkActionBar

BulkActionBar provides selection-aware actions with confirm and undo hooks for list and table workflows.

## Import

```ts
import { BulkActionBar } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `BulkActionBar` when selected rows unlock actions like archive, assign, or export.

```vue
<BulkActionBar
    :selection="selectedRowIds"
    :actions="[
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete', requiresConfirm: true },
    ]"
    @action="runBulkAction"
    @confirm="openConfirmDialog"
/>
```

### Undo

Pair `last-action-id` and `undo-token` with backend undo semantics when the action can be reversed.

```vue
<BulkActionBar
    :selection="selectedRowIds"
    :actions="actions"
    :last-action-id="lastBulkActionId"
    :undo-token="lastUndoToken"
    @undo="undoBulkAction"
/>
```

## API

### Props

| Name                 | Type                      | Default             |
| -------------------- | ------------------------- | ------------------- |
| `selection`          | `Array<string \| number>` | `[]`                |
| `actions`            | `BulkActionBarAction[]`   | `[]`                |
| `disabled`           | `boolean`                 | `false`             |
| `confirmMessage`     | `string`                  | `'Are you sure?'`   |
| `selectedCountLabel` | `string`                  | `'selected'`        |
| `ariaLabel`          | `string`                  | `'Bulk action bar'` |
| `undoLabel`          | `string`                  | `'Undo'`            |
| `showUndoButton`     | `boolean`                 | `true`              |
| `undoDisabled`       | `boolean`                 | `false`             |
| `lastActionId`       | `string \| null`          | `null`              |
| `undoToken`          | `string`                  | `''`                |

### Events

| Name      | Payload                            |
| --------- | ---------------------------------- |
| `action`  | `{ actionId, selection }`          |
| `confirm` | `{ actionId, selection, message }` |
| `undo`    | `{ actionId, selection, token? }`  |

## Theming

Override component tokens through `theme.overrides.components.bulkActionBar`.

## Tokens

- Surface: `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- Action layout: `rowGap`
- Controls: `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`, `secondaryBorderColor`
- States: `focusBorderColor`, `focusRing`, `disabledOpacity`

## Recipes

- Use `requiresConfirm` only for destructive or high-impact actions.
- Pair the undo action with a real backend token or durable job ID instead of optimistic UI only.

## Accessibility

- The root uses `role="region"` with a configurable label.
- Action and undo controls are native buttons and remain keyboard accessible.
