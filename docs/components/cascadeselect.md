# CascadeSelect

## Purpose

Provide hierarchical option selection with optional async branch loading for deep trees.
Targets SaaS forms and filters where child options are fetched on-demand by branch.

## Props

- `items?: Array<{ key: string | number; label: string; disabled?: boolean; hasChildren?: boolean; children?: Array<...> }>`
- `modelValue?: string | number | Array<string | number>` (v-model)
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `true`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string`
- `loadingBranchText?: string` (default ` (loading...)`)
- `emptyText?: string`
- `placeholder?: string`
- `searchPlaceholder?: string`
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'`
- `variant?: 'filled' | 'outlined'`
- `autoLoadOnExpand?: boolean` (default `true`)
- `loadChildren?: (node) => Promise<Array<CascadeSelectItem>>`

## Events

- `update:modelValue`
- `change`
- `update:expandedKeys`
- `toggle`
- `nodeClick`
- `search`
- `focus`
- `blur`
- `branchLoadStart`
- `branchLoad`
- `branchLoadError`

## Slots

- `label` - slot props from `TreeSelect` plus `loading` flag: `{ node, level, selected, expanded, disabled, loading }`

## Examples

```vue
<CascadeSelect v-model="selectedNode" v-model:expandedKeys="expanded" :items="rootNodes" :load-children="loadBranch" />
```

## Theming

- Override via `theme.overrides.components.cascadeSelect` (same token shape as `treeselect`).

## Tokens

- Uses `TreeSelectTokens` contract (`padding`, `border`, `panel`, `search`, `clear`, size variants, etc.).

## Accessibility

- Inherits trigger/tree keyboard and ARIA contracts from `TreeSelect`.
- Async branch loading keeps tree semantics and exposes loading status in label slot (`loading`).
