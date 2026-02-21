# TreeSelect

## Props

- `items?: Array<{ key: string | number; label: string; disabled?: boolean; children?: Array<...> }>` (default `[]`)
- `modelValue?: string | number | Array<string | number>` (v-model)
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `true`)
- `placeholder?: string`
- `searchPlaceholder?: string` (default `Search...`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `update:expandedKeys`
- `toggle`
- `nodeClick`
- `search`
- `focus`
- `blur`

## Slots

- `label` - forwarded Tree node label slot props: `{ node, level, selected, expanded, disabled }`

## Examples

```vue
<TreeSelect
    v-model="selectedNode"
    v-model:expandedKeys="expandedKeys"
    :items="treeItems"
    placeholder="Select docs section"
    clearable
/>
<TreeSelect v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Tokens

Component tokens (override via `theme.overrides.components.treeselect`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `searchPadding`, `searchBorderColor`, `searchBorderRadius`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Trigger opens the panel with keyboard (`ArrowDown`) and closes with `Escape`.
- Tree hierarchy navigation is supported via tree keyboard bindings (`ArrowRight` expand, `ArrowLeft` collapse/parent, `ArrowUp`/`ArrowDown` move, `Enter`/`Space` select).
- In `readonly` mode, panel open/search interactions and selection mutations are blocked.
