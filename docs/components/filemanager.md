# FileManager

## Purpose

Provide an asset-browser surface with list/grid modes, selection, preview, and bulk action hooks.

## Props

- `items?: Array<FileManagerItem>` (default `[]`)
- `modelValue?: Array<string | number>` (default `[]`)
- `view?: 'list' | 'grid'` (default `list`)
- `rowKey?: string | ((item, index) => string | number)` (default `id`)
- `selectable?: boolean` (default `true`)
- `multi?: boolean` (default `true`)
- `previewable?: boolean` (default `true`)
- `showToolbar?: boolean` (default `true`)
- `bulkActions?: Array<{ id: string; label: string; disabled?: boolean }>` (default `[]`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading assets...`)
- `emptyText?: string` (default `No assets found.`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `File manager`)
- `previewAriaLabel?: string` (default `Asset preview`)

`FileManagerItem`:

- `id?: string | number`
- `name: string`
- `kind?: 'file' | 'folder'`
- `size?: number`
- `thumbnail?: string`
- `updatedAt?: string`
- `disabled?: boolean`

## Events

- `update:modelValue`
- `update:view`
- `change`
- `itemClick(item)`
- `preview(item)`
- `bulkAction({ actionId, items, ids })`

## Slots

- `loading`
- `empty`

## Examples

```vue
<FileManager
    v-model="selectedIds"
    :items="assets"
    :bulk-actions="[
        { id: 'download', label: 'Download' },
        { id: 'archive', label: 'Archive' },
    ]"
    @bulkAction="handleBulkAction"
/>
```

## Theming

- Override via `theme.overrides.components.fileManager`.

## Tokens

- Toolbar: `gap`, `toolbarGap`, `toolbarControlsGap`, `viewGap`
- Controls: `control*`
- Layout: `listGap`, `gridGap`, `gridMinWidth`
- Items: `item*`, `thumb*`, `name*`, `details*`
- States: `state*`, `disabledOpacity`
- Preview: `preview*`

## Recipes

- Use list mode for metadata-heavy repositories and grid mode for media catalogs.
- Wire `bulkAction` to backend jobs (delete/move/download/archive) with confirmation flow.

## Accessibility

- List/grid regions expose semantic roles by mode.
- Toolbar toggle uses `aria-pressed` and bulk controls remain keyboard accessible.

## Responsive

- Grid mode auto-fills cards via `gridMinWidth`.
- List mode keeps actions visible for narrow admin side panels.

## SSR/Hydration

- Deterministic from props; no client-only random IDs.
- Preview overlay only renders when user opens a preview item.

## Testing

- Cover view switching, selection and select-all behavior, bulk action payloads, and preview open/close flow.
