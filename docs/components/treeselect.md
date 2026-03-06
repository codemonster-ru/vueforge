# TreeSelect

TreeSelect combines a trigger, optional search input, and embedded `Tree` for hierarchical form selection.

## Import

```ts
import TreeSelect from '@/package/components/tree-select.vue';
```

## Examples

### Basic

```vue
<TreeSelect
    v-model="selectedNode"
    v-model:expandedKeys="expandedKeys"
    :items="treeItems"
    placeholder="Select docs section"
    clearable
/>
```

### Multiple Selection

```vue
<TreeSelect v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

### Searchable

```vue
<TreeSelect
    v-model="value"
    v-model:expandedKeys="expanded"
    :items="treeItems"
    multiple
    clearable
    filter
    placeholder="Select sections"
/>
```

### Custom Labels

```vue
<TreeSelect :items="treeItems">
    <template #label="{ node, selected }">
        <span :class="{ 'is-selected': selected }">{{ node.label }}</span>
    </template>
</TreeSelect>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `TreeItem[]` | `[]` |
| `modelValue` | `TreeValue \| TreeValue[] \| undefined` | `undefined` |
| `expandedKeys` | `TreeValue[]` | `[]` |
| `multiple` | `boolean` | `false` |
| `selectable` | `boolean` | `true` |
| `expandOnClick` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string \| undefined` | `undefined` |
| `emptyText` | `string \| undefined` | `undefined` |
| `placeholder` | `string` | `''` |
| `searchPlaceholder` | `string \| undefined` | `undefined` |
| `filter` | `boolean` | `true` |
| `clearable` | `boolean` | `false` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | selected value payload |
| `change` | `value, node, event` |
| `update:expandedKeys` | expanded keys array |
| `toggle` | `key, expanded, node, event` |
| `nodeClick` | `node, event` |
| `search` | query string |
| `focus` | `FocusEvent` |
| `blur` | `FocusEvent` |

### Slots

| Name | Description |
| --- | --- |
| `label` | Forwarded tree label slot with `{ node, level, selected, expanded, disabled }`. |

## Theming

Override component tokens through `theme.overrides.components.treeselect`.

## Tokens

- Trigger: `minWidth`, `fontSize`, `controlGap`, `chevronSize`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`, `focusBorderColor`, `hoverBorderColor`, `focusRingShadow`, `disabledOpacity`
- Panel: `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- Search and states: `searchPadding`, `searchBorderColor`, `searchBorderRadius`, `emptyPadding`, `emptyColor`, `loadingPadding`, `loadingColor`, `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- Sizes: `small.*`, `large.*`

## Recipes

- Use TreeSelect for hierarchical form fields, faceted filters, and toolbar pickers that need deeper navigation than a flat select can offer.
- Prefer `Tree` when the hierarchy itself is the main content rather than a popup selection surface.

## Accessibility

- Trigger supports keyboard open and close, while the embedded tree keeps tree navigation bindings.
- In filter mode, keyboard flow moves from the search field into the first enabled tree item.
- `readonly` preserves the displayed value while blocking panel interaction and selection changes.

