# DataTable

Render high-density operational datasets with sorting, selection, grouping, expansion, and server handoff hooks.

## Import

```ts
import { DataTable } from '@codemonster-ru/vueforge';
```

## Examples

Use `DataTable` for dense management and backoffice screens where rows behave like structured records rather than cards.

### Basic

Use columns and rows for a straightforward sortable table.

```vue
<template>
    <DataTable
        :columns="[
            { field: 'name', header: 'Name', sortable: true },
            { field: 'role', header: 'Role' },
            { field: 'age', header: 'Age', align: 'right', sortable: true }
        ]"
        :rows="[
            { id: 1, name: 'Alice', role: 'Developer', age: 29 },
            { id: 2, name: 'Bob', role: 'Designer', age: 34 }
        ]"
        row-key="id"
        sortable
        striped
    />
</template>
```

### Server Handoff

Use `server` mode when sorting, paging, and filtering are owned by the backend.

```vue
<template>
    <DataTable
        :columns="columns"
        :rows="rows"
        server
        sortable
        :sort-field="sortField"
        :sort-order="sortOrder"
        :page="page"
        :page-size="pageSize"
        :filters="filters"
        @request="onRequest"
    />
</template>
```

### Selection And Bulk Actions

Use multi-selection for batch workflows.

```vue
<template>
    <DataTable
        :columns="columns"
        :rows="rows"
        selection-mode="multiple"
        :selection="selection"
        :bulk-actions="[
            { label: 'Archive', value: 'archive' },
            { label: 'Delete', value: 'delete' }
        ]"
        @update:selection="selection = $event"
        @bulk-action="onBulkAction"
    />
</template>
```

### Grouping And Expansion

Use row grouping or expansion when records need secondary detail without leaving the table.

```vue
<template>
    <DataTable
        row-expansion
        row-group-by="team"
        :expanded-rows="expandedRows"
        :columns="columns"
        :rows="rows"
        @update:expanded-rows="expandedRows = $event"
    >
        <template #group-header="{ group, rows: groupRows }">
            <strong>{{ group }}</strong> ({{ groupRows.length }})
        </template>
        <template #row-expansion="{ row }">
            <div>Details for {{ row.name }}</div>
        </template>
    </DataTable>
</template>
```

### Column Management

Use reorder, resize, and visibility management for user-customizable dense tables.

```vue
<template>
    <DataTable
        column-resize
        column-reorder
        column-visibility-manager
        :column-order="columnOrder"
        :visible-columns="visibleColumns"
        :columns="columns"
        :rows="rows"
        @update:column-order="columnOrder = $event"
        @update:visible-columns="visibleColumns = $event"
    />
</template>
```

## Key Props

- `rows?: Array<Record<string, unknown>>`
- `columns?: Array<{ field: string; header?: string; sortable?: boolean; resizable?: boolean; align?: 'left' | 'center' | 'right'; width?: string; minWidth?: string; sticky?: 'left' | 'right'; formatter?: (row, value, column) => string | number }>`
- `rowKey?: string | ((row, index) => string | number)` (default `id`)
- `sortable?: boolean` (default `false`)
- `sortField?: string | null`
- `sortOrder?: 'asc' | 'desc' | null`
- `loading?: boolean` (default `false`)
- `emptyText?: string`
- `striped?: boolean` (default `false`)
- `hover?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showHeader?: boolean` (default `true`)
- `ariaLabel?: string` (default `Data table`)
- `server?: boolean` (default `false`)
- `page?: number` (default `1`)
- `pageSize?: number` (default `10`)
- `filters?: Record<string, unknown>` (default `{}`)
- `selectionMode?: 'single' | 'multiple' | null` (default `null`)
- `selection?: string | number | Array<string | number> | null`
- `bulkActions?: Array<{ label: string; value: string; disabled?: boolean }>`
- `pendingBulkActions?: Array<string>`
- `actionsLocked?: boolean` (default `false`)
- `stickyHeader?: boolean` (default `false`)
- `columnResize?: boolean` (default `false`)
- `minColumnWidth?: number` (default `80`)
- `columnReorder?: boolean` (default `false`)
- `columnOrder?: Array<string>`
- `rowGroupBy?: string | ((row, index) => string | number | null | undefined)`
- `rowExpansion?: boolean` (default `false`)
- `expandedRows?: Array<string | number>`
- `rowExpandable?: (row, index) => boolean`
- `expandOnRowClick?: boolean` (default `false`)
- `visibleColumns?: Array<string>`
- `columnVisibilityManager?: boolean` (default `false`)
- `savedFilters?: Array<{ id: string | number; label: string; filters: Record<string, unknown>; disabled?: boolean }>`
- `activeSavedFilterId?: string | number | null`
- `showSavedFilters?: boolean` (default `false`)
- `exportActions?: Array<{ label: string; value: string; disabled?: boolean }>`
- `pendingExportActions?: Array<string>`
- `showExportActions?: boolean` (default `false`)

## Key Events

- `update:sortField`, `update:sortOrder`, `sort`
- `rowClick`
- `update:page`, `update:pageSize`, `update:filters`
- `page`, `filter`, `request`
- `update:selection`, `selectionChange`, `bulkAction`
- `exportAction`, `update:activeSavedFilterId`, `savedFilterChange`
- `columnResize`, `update:columnOrder`, `columnReorder`
- `update:expandedRows`, `rowExpand`, `rowCollapse`
- `update:visibleColumns`, `columnVisibilityChange`

## Slots

- `header-{field}`
- `cell-{field}`
- `empty`
- `loading`
- `bulk-actions`
- `group-header`
- `row-expansion`

## Theming

- Override via `theme.overrides.components.datatable`.

## Tokens

Component tokens (override via `theme.overrides.components.datatable`):

- `borderColor`, `borderRadius`, `backgroundColor`
- `fontSize`, `textColor`
- `headerBackgroundColor`, `headerTextColor`, `headerFontSize`, `headerFontWeight`, `headerBorderColor`, `headerGap`
- `rowBackgroundColor`, `rowTextColor`, `rowBorderColor`
- `cellPadding`
- `stripedBackgroundColor`, `hoverBackgroundColor`
- `sortIconColor`, `sortIconActiveColor`, `sortIconSize`
- `statePadding`, `stateTextColor`
- `small.fontSize`, `small.cellPadding`
- `large.fontSize`, `large.cellPadding`

## Recipes

- Use `server` mode as soon as sort, page, or filter state is owned by an API rather than local memory.
- Keep row keys stable, especially when combining selection, expansion, and reordering features.
- Add complexity incrementally: selection, grouping, expansion, and column management all make sense, but not every table needs all of them at once.

## Accessibility

- Uses semantic table markup and exposes `aria-sort` on sortable headers.
- Provide an `ariaLabel` when the surrounding context does not already name the table.
- Make sure loading and empty states stay meaningful in assistive technologies through slot content or text props.
