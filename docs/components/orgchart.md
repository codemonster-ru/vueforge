# OrgChart

## Purpose

Render organizational hierarchies with expandable branches, selectable nodes, and keyboard navigation.

## Props

- `items?: Array<OrgChartNodeItem>` (default `[]`)
- `modelValue?: string | number | Array<string | number>` (v-model selected node key(s))
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `collapsible?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Org chart`)
- `ariaLabelledby?: string`

`OrgChartNodeItem`:

- `key: string | number`
- `label: string`
- `title?: string`
- `disabled?: boolean`
- `children?: OrgChartNodeItem[]`

## Events

- `update:modelValue`
- `update:expandedKeys`
- `change`
- `toggle`
- `nodeClick`

## Slots

- `node` - slot props `{ node, level, selected, expanded, disabled }`

## Example

```vue
<OrgChart v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="orgItems" aria-label="Company structure" />
```

## Theming

- Override via `theme.overrides.components.orgchart`.

## Tokens

- `gap`, `childrenMarginTop`, `connectorColor`, `textColor`
- `cardMinWidth`, `cardMaxWidth`, `cardGap`, `cardPadding`
- `cardBorderColor`, `cardBorderRadius`, `cardBackgroundColor`, `cardTextColor`
- `cardHoverBackgroundColor`, `cardSelectedBackgroundColor`, `cardSelectedColor`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `focusRingColor`
- `labelFontSize`, `labelFontWeight`, `titleFontSize`, `titleColor`
- `disabledOpacity`
- `small.cardPadding`, `small.labelFontSize`
- `large.cardPadding`, `large.labelFontSize`

## Accessibility

- Tree semantics via `role="tree"` and `role="treeitem"` hierarchy.
- Keyboard: `ArrowUp/ArrowDown`, `Home/End`, `ArrowRight` (expand/focus child), `ArrowLeft` (collapse/focus parent), `Enter/Space` select.

## Testing

- Cover expand/collapse, single/multi selection, keyboard navigation, and disabled-state behavior.
