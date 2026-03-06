# DataView

Render datasets in list or grid layout with built-in layout switching, sorting, and pagination hooks.

## Import

```ts
import { DataView } from '@codemonster-ru/vueforge';
```

## Examples

Use `DataView` when the same dataset should support both list and card-style presentation.

### Basic

Use the `item` slot to render each row or card while `DataView` manages layout and paging.

```vue
<template>
    <DataView :items="products">
        <template #item="{ item, layout }">
            <Card>
                <template #body>
                    <strong>{{ item.name }}</strong> · {{ layout }}
                </template>
            </Card>
        </template>
    </DataView>
</template>
```

### Sortable Catalog

Enable `sortable` when users should change ordering locally.

```vue
<template>
    <DataView :items="products" sortable default-sort-field="name">
        <template #item="{ item }">
            <article>{{ item.name }}</article>
        </template>
    </DataView>
</template>
```

### Server Handoff

Use `server` mode when paging and sorting are owned by an API.

```vue
<template>
    <DataView
        :items="serverItems"
        :total="total"
        :page="query.page"
        :page-size="query.pageSize"
        :sort-field="query.sortField"
        :sort-order="query.sortOrder"
        server
        @request="onRequest"
    >
        <template #item="{ item }">
            <article>{{ item.name }}</article>
        </template>
    </DataView>
</template>
```

### Custom Empty State

Use the `empty` slot when the no-results state needs explanation or actions.

```vue
<template>
    <DataView :items="[]">
        <template #empty>
            <EmptyState title="No products" description="Try adjusting filters." />
        </template>
    </DataView>
</template>
```

## Props

- `items?: Array<Record<string, unknown>>`
- `layout?: 'list' | 'grid'` (default `list`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No items`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Data view`)
- `rowKey?: string | ((item, index) => string | number)` (default `id`)
- `sortable?: boolean` (default `false`)
- `sortField?: string | null`
- `sortOrder?: 'asc' | 'desc' | null`
- `defaultSortField?: string | null`
- `page?: number` (default `1`)
- `pageSize?: number` (default `12`)
- `total?: number`
- `server?: boolean` (default `false`)

## Events

- `update:layout`
- `update:sortField`
- `update:sortOrder`
- `sort`
- `update:page`
- `update:pageSize`
- `page`
- `request`

## Slots

- `item` - item renderer with `{ item, index, layout }`
- `loading`
- `empty`

## Theming

- Override via `theme.overrides.components.dataview`.

## Tokens

Component tokens (override via `theme.overrides.components.dataview`):

- `gap`, `toolbarGap`, `layoutGap`
- `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`, `controlTextColor`, `controlPadding`, `controlFontSize`
- `controlActiveBackgroundColor`, `controlActiveBorderColor`, `controlActiveTextColor`
- `listGap`, `gridGap`, `gridMinWidth`
- `itemBorderColor`, `itemBorderRadius`, `itemBackgroundColor`, `itemTextColor`, `itemPadding`
- `statePadding`, `stateTextColor`
- `paginationGap`, `disabledOpacity`

## Recipes

- Use `DataView` for catalog or gallery-style datasets where list and grid both make sense.
- In server mode, keep `items`, `total`, and query props synchronized to avoid stale UI state.
- Let the slot renderer own semantics such as `article`, headings, and actions.

## Accessibility

- Content root uses `role="list"` or `role="grid"` based on active layout.
- Layout toggle buttons expose `aria-pressed`.
- Keep slot content semantic so assistive tech can understand each rendered item.
