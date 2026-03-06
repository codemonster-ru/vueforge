# FileManager

FileManager provides list and grid asset browsing with selection, preview, and bulk action hooks.

## Import

```ts
import FileManager from '@/package/components/file-manager.vue';
```

## Examples

### Basic

Use `FileManager` for media libraries, document repositories, and asset pickers.

```vue
<FileManager
    v-model="selectedIds"
    :items="assets"
/>
```

### Bulk Actions

Attach bulk actions when selected files can be archived, moved, or downloaded together.

```vue
<FileManager
    v-model="selectedIds"
    :items="assets"
    :bulk-actions="[
        { id: 'download', label: 'Download' },
        { id: 'archive', label: 'Archive' },
    ]"
    @bulk-action="handleBulkAction"
/>
```

### Grid Preview

Use grid mode and preview for image-heavy repositories.

```vue
<FileManager
    v-model="selectedIds"
    :items="assets"
    view="grid"
    @preview="trackPreview"
/>
```

## API

### Types

```ts
interface FileManagerItem {
    id?: string | number;
    name: string;
    kind?: 'file' | 'folder';
    size?: number;
    thumbnail?: string;
    updatedAt?: string;
    disabled?: boolean;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `FileManagerItem[]` | `[]` |
| `modelValue` | `Array<string \| number>` | `[]` |
| `view` | `'list' \| 'grid'` | `'list'` |
| `rowKey` | `string \| ((item, index) => string \| number)` | `'id'` |
| `selectable` | `boolean` | `true` |
| `multi` | `boolean` | `true` |
| `previewable` | `boolean` | `true` |
| `showToolbar` | `boolean` | `true` |
| `bulkActions` | `Array<{ id: string; label: string; disabled?: boolean }>` | `[]` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading assets...'` |
| `emptyText` | `string` | `'No assets found.'` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'File manager'` |
| `previewAriaLabel` | `string` | `'Asset preview'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `Array<string \| number>` |
| `update:view` | `'list' \| 'grid'` |
| `change` | `Array<string \| number>` |
| `itemClick` | `FileManagerItem` |
| `preview` | `FileManagerItem` |
| `bulkAction` | `{ actionId, items, ids }` |

### Slots

| Name | Description |
| --- | --- |
| `loading` | Replaces the loading state. |
| `empty` | Replaces the empty state. |

## Theming

Override component tokens through `theme.overrides.components.fileManager`.

## Tokens

- Toolbar and controls: `gap`, `toolbarGap`, `toolbarControlsGap`, `viewGap`, `control*`
- Layout: `listGap`, `gridGap`, `gridMinWidth`
- Items: `item*`, `thumb*`, `nameFontSize`, `nameFontWeight`, `details*`
- States and preview: `state*`, `preview*`, `disabledOpacity`

## Recipes

- Use list mode for metadata-heavy repositories and grid mode for visual assets.
- Keep preview for images or thumbnails; disable it for pure document indexes where it adds noise.

## Accessibility

- The content region switches between list and grid semantics by view mode.
- Preview opens as a dialog-style overlay and should not be the only way to access file metadata.
