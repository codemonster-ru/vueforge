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
