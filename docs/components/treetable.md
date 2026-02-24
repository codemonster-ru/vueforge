# TreeTable

## Purpose

Render hierarchical datasets in a table-like layout with expandable branches and row selection for file-browser or catalog-style UIs.

## Props

- `items?: TreeTableNode[]` - tree nodes (`key`, `data`, optional `children`, optional `disabled`).
- `columns?: TreeTableColumn[]` - table columns (`field`, optional `header`, `align`, `width`, `formatter`).
- `modelValue?: string | number | Array<string | number>` - selected row key(s).
- `expandedKeys?: Array<string | number>` - controlled expanded branch keys.
- `multiple?: boolean` (default `false`) - multi-selection mode.
- `selectable?: boolean` (default `true`) - enable row selection behavior.
- `expandOnClick?: boolean` (default `false`) - toggle branch when row is clicked.
- `disabled?: boolean` (default `false`) - disable all interactions.
- `striped?: boolean` (default `false`) - alternating row backgrounds.
- `hover?: boolean` (default `true`) - hover row highlighting.
- `size?: 'small' | 'normal' | 'large'` (default `normal`).
- `variant?: 'filled' | 'outlined'` (default `filled`).
- `lazy?: boolean` (default `false`) - enables lazy branch loading flow for nodes marked `hasChildren`.
- `loadingKeys?: Array<string | number>` - branch keys currently loading (used to suppress duplicate lazy requests).
- `server?: boolean` (default `false`) - emit request payloads for branch expand/collapse/lazy handoff.
- `columnResize?: boolean` (default `false`) - enables drag resize handles for columns.
- `minColumnWidth?: number` (default `80`) - minimum column width in pixels when resizing.
- `columnReorder?: boolean` (default `false`) - enables drag/drop column reordering.
- `columnOrder?: string[]` - controlled visual order of columns by `field`.
- `ariaLabel?: string` (default `Tree table`).
- `emptyText?: string` (default `No data`).
- `expandLabel?: string` (default `Expand row`).
- `collapseLabel?: string` (default `Collapse row`).

## Events

- `update:modelValue`
- `change`
- `update:expandedKeys`
- `toggle`
- `rowClick`
- `lazyLoad` - emitted on first lazy expand for a node without loaded children (`{ key, node }`).
- `request` - server handoff payload (`{ reason: 'expand' | 'collapse' | 'lazy-load', key, node, expandedKeys }`).
- `columnResize` - emitted after drag resize (`{ field, width, widthPx }`).
- `update:columnOrder`
- `columnReorder` - emitted after drag reorder (`{ fromField, toField, order }`).

## Slots

- `empty` - custom empty-state row content.
- `header-{field}` - custom header rendering for a column.
- `cell-{field}` - custom cell rendering for a column.

## Examples

```vue
<TreeTable
    v-model="selected"
    v-model:expandedKeys="expanded"
    :columns="[
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
    ]"
    :items="rows"
/>
```

```vue
<TreeTable v-model="selectedMany" :columns="columns" :items="rows" multiple striped>
    <template #cell-name="{ value, level }">
        <strong v-if="level === 1">{{ value }}</strong>
        <span v-else>{{ value }}</span>
    </template>
</TreeTable>
```

```vue
<TreeTable
    v-model:expandedKeys="expanded"
    :items="serverTree"
    :columns="columns"
    :loading-keys="loadingKeys"
    :column-order="columnOrder"
    lazy
    server
    column-resize
    column-reorder
    @lazy-load="onLazyLoad"
    @request="onTreeRequest"
    @update:columnOrder="columnOrder = $event"
/>
```

## Theming

- Override via `theme.overrides.components.treetable`.

## Tokens

Component tokens:

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `fontSize`
- `headerBackgroundColor`, `headerTextColor`, `headerFontWeight`, `headerBorderColor`
- `rowBackgroundColor`, `rowBorderColor`, `rowHoverBackgroundColor`, `rowSelectedBackgroundColor`, `rowSelectedTextColor`, `rowStripedBackgroundColor`
- `cellPadding`, `cellGap`, `indentStep`
- `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `focusRingColor`, `statePadding`, `stateTextColor`, `disabledOpacity`
- `small.fontSize`, `small.cellPadding`
- `large.fontSize`, `large.cellPadding`

## Recipes

- Use `expandOnClick` for touch-first experiences where tiny toggle controls are less reliable.
- Keep the first column as semantic hierarchy label and use secondary columns for status/metadata.
- For server trees, mark expandable stubs with `hasChildren: true`, set `lazy`, and populate `children` after `lazyLoad`.
- Persist `columnOrder` and `columnResize` payloads in user preferences for stable table layouts.

## Accessibility

- Root uses `role="treegrid"` and rows expose `aria-level`.
- Expandable rows expose `aria-expanded`; selected rows expose `aria-selected`.
- Keyboard support includes `ArrowUp`/`ArrowDown`, `Home`/`End`, `ArrowRight` (expand/descend), `ArrowLeft` (collapse/focus parent), and `Enter`/`Space` selection.

## Responsive

- Horizontal overflow is contained by root wrapper; use concise column sets for small screens.
- For mobile-first layouts, prefer fewer metadata columns and defer details to row drilldown surfaces.

## SSR/Hydration

- Visibility state is derived from props (`items`, `expandedKeys`) and is deterministic in SSR.
- No direct DOM access is used during setup; hydration is stable for controlled and uncontrolled flows.

## Testing

- Cover expand/collapse emissions, selection modes, keyboard treegrid navigation, and row ARIA state attributes.
- Cover lazy/server handoff events and column resize/reorder interactions.
