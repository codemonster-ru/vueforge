# DataTable

## Purpose

Render and manage high-density operational data with scalable interaction patterns.
Support filtering, navigation, and bulk workflows used in core SaaS backoffice screens.

## Props

- `rows?: Array<Record<string, unknown>>`
- `columns?: Array<{ field: string; header?: string; sortable?: boolean; resizable?: boolean; align?: 'left' | 'center' | 'right'; width?: string; minWidth?: string; sticky?: 'left' | 'right'; formatter?: (row, value, column) => string | number }>`
- `rowKey?: string | ((row, index) => string | number)`
- `sortable?: boolean`
- `sortField?: string | null`
- `sortOrder?: 'asc' | 'desc' | null`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No data`)
- `striped?: boolean` (default `false`)
- `hover?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showHeader?: boolean` (default `true`)
- `ariaLabel?: string` (default `Data table`)
- `server?: boolean` (default `false`) - enables server-mode handoff
- `page?: number` (default `1`) - current server-side page
- `pageSize?: number` (default `10`) - current server-side page size
- `filters?: Record<string, unknown>` (default `{}`) - current server-side filters
- `selectionMode?: 'single' | 'multiple' | null` (default `null`)
- `selection?: string | number | Array<string | number> | null` (default `null`)
- `bulkActions?: Array<{ label: string; value: string; disabled?: boolean }>` (default `[]`)
- `selectAllAriaLabel?: string` (default `Select all rows`)
- `selectRowAriaLabel?: string` (default `Select row`)
- `stickyHeader?: boolean` (default `false`)
- `columnResize?: boolean` (default `false`) - enables drag-to-resize for header columns
- `minColumnWidth?: number` (default `80`) - minimum width in pixels for resized columns
- `columnReorder?: boolean` (default `false`) - enables drag-and-drop column reordering
- `columnOrder?: Array<string>` (default `[]`) - controlled ordered list of column fields
- `rowGroupBy?: string | ((row, index) => string | number | null | undefined)` - enables row grouping by field/computed key
- `rowGroupLabel?: string` (default `Group`) - fallback group label for empty keys
- `rowExpansion?: boolean` (default `false`) - enables expandable detail rows
- `expandedRows?: Array<string | number>` (default `[]`) - controlled expanded row keys
- `rowExpandable?: (row, index) => boolean` - controls which rows can expand
- `expandOnRowClick?: boolean` (default `false`) - toggles row expansion on row click
- `expandRowAriaLabel?: string` (default `Expand row`)
- `collapseRowAriaLabel?: string` (default `Collapse row`)
- `visibleColumns?: Array<string>` (default `[]`) - controlled visible column fields (`[]` means all)
- `columnVisibilityManager?: boolean` (default `false`) - built-in column visibility UI
- `columnVisibilityLabel?: string` (default `Columns`) - label for visibility manager toggle

## Events

- `update:sortField`
- `update:sortOrder`
- `sort`
- `rowClick`
- `update:page`
- `update:pageSize`
- `update:filters`
- `page`
- `filter`
- `request` - payload: `{ sortField, sortOrder, page, pageSize, filters }`
- `update:selection`
- `selectionChange`
- `bulkAction` - payload: `(action, selectedKeys, selectedRows)`
- `columnResize` - payload: `{ field, width, widthPx }`
- `update:columnOrder`
- `columnReorder` - payload: `{ fromField, toField, order }`
- `update:expandedRows`
- `rowExpand` - payload: `(row, index, event?)`
- `rowCollapse` - payload: `(row, index, event?)`
- `update:visibleColumns`
- `columnVisibilityChange` - payload: `Array<string>`

## Slots

- `header-{field}`
- `cell-{field}`
- `empty`
- `loading`
- `bulk-actions` - slot props: `{ selectedKeys, selectedRows, clearSelection, applyAction }`
- `group-header` - slot props: `{ group, rows }`
- `row-expansion` - slot props: `{ row, index }`

## Examples

```vue
<DataTable
    :columns="[
        { field: 'name', header: 'Name', sortable: true },
        { field: 'role', header: 'Role' },
        { field: 'age', header: 'Age', align: 'right', sortable: true },
    ]"
    :rows="[
        { id: 1, name: 'Alice', role: 'Developer', age: 29 },
        { id: 2, name: 'Bob', role: 'Designer', age: 34 },
    ]"
    row-key="id"
    sortable
    striped
/>
```

### Server-side table handoff

```vue
<script setup lang="ts">
import { ref } from 'vue';

const rows = ref([]);
const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc' | null>(null);
const page = ref(1);
const pageSize = ref(20);
const filters = ref<Record<string, unknown>>({ search: '' });

const onRequest = async (query: {
    sortField: string | null;
    sortOrder: 'asc' | 'desc' | null;
    page: number;
    pageSize: number;
    filters: Record<string, unknown>;
}) => {
    // Send query to backend and replace rows with server response.
};
</script>

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
        @update:sort-field="sortField = $event"
        @update:sort-order="sortOrder = $event"
        @update:page="page = $event"
        @update:page-size="pageSize = $event"
        @update:filters="filters = $event"
        @request="onRequest"
    />
</template>
```

### Selectable table with bulk actions

```vue
<script setup lang="ts">
import { ref } from 'vue';

const selection = ref<Array<string | number>>([]);

const onBulkAction = (action: string, keys: Array<string | number>) => {
    // Handle bulk action for selected keys.
};
</script>

<template>
    <DataTable
        :columns="columns"
        :rows="rows"
        selection-mode="multiple"
        :selection="selection"
        :bulk-actions="[
            { label: 'Archive', value: 'archive' },
            { label: 'Delete', value: 'delete' },
        ]"
        @update:selection="selection = $event"
        @bulk-action="onBulkAction"
    />
</template>
```

### Sticky header and sticky columns

```vue
<DataTable
    :columns="[
        { field: 'name', header: 'Name', sticky: 'left', width: '180px' },
        { field: 'role', header: 'Role' },
        { field: 'age', header: 'Age', align: 'right', sticky: 'right', width: '100px' },
    ]"
    :rows="rows"
    sticky-header
/>
```

### Column resize

```vue
<DataTable
    column-resize
    :min-column-width="96"
    :columns="[
        { field: 'name', header: 'Name', width: '180px', resizable: true },
        { field: 'role', header: 'Role', resizable: true },
        { field: 'age', header: 'Age', align: 'right', resizable: false },
    ]"
    :rows="rows"
    @column-resize="payload => console.log(payload)"
/>
```

### Column reorder

```vue
<script setup lang="ts">
import { ref } from 'vue';

const order = ref(['name', 'role', 'age']);
</script>

<template>
    <DataTable
        column-reorder
        :column-order="order"
        :columns="[
            { field: 'name', header: 'Name' },
            { field: 'role', header: 'Role' },
            { field: 'age', header: 'Age', align: 'right', sortable: true },
        ]"
        :rows="rows"
        @update:column-order="order = $event"
    />
</template>
```

### Row grouping and row expansion

```vue
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
```

### Column visibility manager

```vue
<DataTable
    column-visibility-manager
    :visible-columns="visibleColumns"
    :columns="columns"
    :rows="rows"
    @update:visible-columns="visibleColumns = $event"
/>
```

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

- Client-side sortable table with striped rows for management screens.
- Server-side handoff using `request` payload for backend-driven pagination/sorting/filtering.
- Multi-select table with `bulkActions` for batch operations.
- Sticky header/columns for wide datasets.
- Column-resize mode for dense/variable datasets.
- Column reorder mode for user-customizable table layouts.
- Row grouping for team/status segmented datasets.
- Row expansion for master-detail tables.
- Built-in column visibility manager for per-user table views.

## Responsive

Validate table/list density, horizontal overflow strategy, and virtualization behavior across breakpoints.
Ensure row/item actions remain accessible and discoverable on touch devices.

## SSR/Hydration

Render initial viewport slice and structural wrappers deterministically to avoid hydration drift.
Defer measurement-driven virtualization logic until client mount.

## Testing

Cover sorting/filtering/selection/navigation flows and large-dataset edge cases.
Cover row grouping/expansion and column visibility state management.
Add performance-sensitive regression tests and ARIA verification for interactive data regions.

## Accessibility

- Table uses semantic `<table>` structure and supports sortable header states via `aria-sort`.
- Use `ariaLabel` for contextual table naming in screen readers.
- Provide meaningful empty/loading slot text for assistive technologies.
