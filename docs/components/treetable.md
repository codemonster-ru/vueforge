# TreeTable

Render hierarchical datasets in table form with expandable branches, selection, and lazy loading hooks.

## Import

```ts
import { TreeTable } from '@codemonster-ru/vueforge';
```

## Examples

Use `TreeTable` when rows form a hierarchy and users need both tabular metadata and expand or collapse behavior.

### Basic

Use `expandedKeys` together with the selected value for a straightforward treegrid.

```vue
<template>
    <TreeTable
        v-model="selected"
        v-model:expandedKeys="expanded"
        :columns="[
            { field: 'name', header: 'Name' },
            { field: 'type', header: 'Type' }
        ]"
        :items="rows"
    />
</template>
```

### Multiple Selection

Use `multiple` when batch actions can apply across branches.

```vue
<template>
    <TreeTable v-model="selectedMany" :columns="columns" :items="rows" multiple striped />
</template>
```

### Lazy Server Tree

Use `lazy` and `server` when child nodes are loaded on demand.

```vue
<template>
    <TreeTable
        v-model:expandedKeys="expanded"
        :items="serverTree"
        :columns="columns"
        :loading-keys="loadingKeys"
        lazy
        server
        @lazy-load="onLazyLoad"
        @request="onTreeRequest"
    />
</template>
```

### Column Reorder And Resize

Use column management for dense file-browser or catalog-style trees.

```vue
<template>
    <TreeTable
        :items="rows"
        :columns="columns"
        :column-order="columnOrder"
        column-resize
        column-reorder
        @update:column-order="columnOrder = $event"
    />
</template>
```

## Props

- `items?: TreeTableNode[]`
- `columns?: TreeTableColumn[]`
- `modelValue?: string | number | Array<string | number>`
- `expandedKeys?: Array<string | number>`
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `striped?: boolean` (default `false`)
- `hover?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `lazy?: boolean` (default `false`)
- `loadingKeys?: Array<string | number>`
- `server?: boolean` (default `false`)
- `columnResize?: boolean` (default `false`)
- `minColumnWidth?: number` (default `80`)
- `columnReorder?: boolean` (default `false`)
- `columnOrder?: string[]`
- `ariaLabel?: string` (default `Tree table`)
- `emptyText?: string` (default `No data`)
- `expandLabel?: string` (default `Expand row`)
- `collapseLabel?: string` (default `Collapse row`)

## Events

- `update:modelValue`
- `change`
- `update:expandedKeys`
- `toggle`
- `rowClick`
- `lazyLoad`
- `request`
- `columnResize`
- `update:columnOrder`
- `columnReorder`

## Slots

- `empty`
- `header-{field}`
- `cell-{field}`

## Theming

- Override via `theme.overrides.components.treetable`.

## Tokens

Component tokens (override via `theme.overrides.components.treetable`):

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `fontSize`
- `headerBackgroundColor`, `headerTextColor`, `headerFontWeight`, `headerBorderColor`
- `rowBackgroundColor`, `rowBorderColor`, `rowHoverBackgroundColor`, `rowSelectedBackgroundColor`, `rowSelectedTextColor`, `rowStripedBackgroundColor`
- `cellPadding`, `cellGap`, `indentStep`
- `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `focusRingColor`, `statePadding`, `stateTextColor`, `disabledOpacity`
- `small.fontSize`, `small.cellPadding`
- `large.fontSize`, `large.cellPadding`

## Recipes

- Keep the first column as the hierarchy label and use later columns for metadata.
- Use `lazy` when the tree can grow large enough that eager loading becomes expensive.
- Persist column order and width if the tree is part of a long-lived operational workspace.

## Accessibility

- Root uses `role="treegrid"` and rows expose `aria-level`.
- Expandable rows expose `aria-expanded`; selectable rows expose `aria-selected`.
- Keyboard support includes tree-style navigation and selection on focused rows.
