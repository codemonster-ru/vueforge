# DataTable

## Props

- `rows?: Array<Record<string, unknown>>`
- `columns?: Array<{ field: string; header?: string; sortable?: boolean; align?: 'left' | 'center' | 'right'; width?: string; minWidth?: string; formatter?: (row, value, column) => string | number }>`
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

## Slots

- `header-{field}`
- `cell-{field}`
- `empty`
- `loading`

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

## Accessibility

- Table uses semantic `<table>` structure and supports sortable header states via `aria-sort`.
- Use `ariaLabel` for contextual table naming in screen readers.
- Provide meaningful empty/loading slot text for assistive technologies.
