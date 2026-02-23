# DataView

## Purpose

Render datasets in list or grid layout with built-in pagination controls and server-handoff hooks for sorting/paging.

## Props

- `items?: Array<Record<string, unknown>>`
- `layout?: 'list' | 'grid'` (default `list`)
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No items`)
- `disabled?: boolean`
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

- `item` - item renderer (`{ item, index, layout }`)
- `loading`
- `empty`

## Examples

```vue
<DataView :items="products" sortable default-sort-field="name">
    <template #item="{ item, layout }">
        <ProductCard :compact="layout === 'list'" :product="item" />
    </template>
</DataView>
```

```vue
<DataView
    :items="serverItems"
    :total="total"
    :page="query.page"
    :page-size="query.pageSize"
    :sort-field="query.sortField"
    :sort-order="query.sortOrder"
    server
    @request="onRequest"
/>
```

## Theming

- Override via `theme.overrides.components.dataview`.

## Tokens

- `gap`, `toolbarGap`, `layoutGap`
- `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`, `controlTextColor`, `controlPadding`, `controlFontSize`
- `controlActiveBackgroundColor`, `controlActiveBorderColor`, `controlActiveTextColor`
- `listGap`, `gridGap`, `gridMinWidth`
- `itemBorderColor`, `itemBorderRadius`, `itemBackgroundColor`, `itemTextColor`, `itemPadding`
- `statePadding`, `stateTextColor`
- `paginationGap`, `disabledOpacity`

## Recipes

- Use `server` mode with `@request` to keep sorting/pagination state in route/query params.
- Use `layout` toggle to provide user-controlled list/grid preference in catalog pages.

## Accessibility

- Content root uses `role="list"` or `role="grid"` based on active layout.
- Layout toggle buttons use `aria-pressed` state.
- Keep item slot content semantic (`article`, heading, and actionable controls) for screen-reader clarity.

## Responsive

- Grid layout uses auto-fill columns with `gridMinWidth` token; list mode remains single-column.
- For narrow screens, reduce card density in slot renderer and keep primary action near top.

## SSR/Hydration

- Local mode is deterministic from props (`items`, `page`, `pageSize`, `sort*`) and is hydration-safe.
- In server mode, keep `items`/`total` synchronized with requested query state to avoid client/server drift.

## Testing

- Cover layout switching, local pagination behavior, server handoff payloads, and loading/empty states.
