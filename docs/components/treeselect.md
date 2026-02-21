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

## Recipes

### Searchable multi-select with controlled expansion

```vue
<script setup lang="ts">
import { ref } from 'vue';

const value = ref<Array<string>>([]);
const expanded = ref<Array<string>>(['docs']);
</script>

<template>
    <TreeSelect
        v-model="value"
        v-model:expandedKeys="expanded"
        :items="treeItems"
        multiple
        clearable
        filter
        placeholder="Select sections"
    />
</template>
```

### Async loading + loading/empty states

```vue
<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(true);
const items = ref<Array<{ key: string; label: string; children?: Array<{ key: string; label: string }> }>>([]);

setTimeout(() => {
    items.value = [
        { key: 'docs', label: 'Docs' },
        { key: 'blog', label: 'Blog' },
    ];
    loading.value = false;
}, 600);
</script>

<template>
    <TreeSelect
        v-model="selectedNode"
        :items="items"
        :loading="loading"
        loading-text="Loading sections..."
        empty-text="No sections found"
    />
</template>
```

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

- Trigger opens the panel with keyboard (`ArrowDown`/`ArrowUp`) and closes with `Escape`.
- When opened from keyboard, focus moves into the tree (or search input when filtering is enabled).
- In filter mode, `ArrowDown` from the search input moves focus to the first enabled tree node.
- Tree hierarchy navigation is supported via tree keyboard bindings (`ArrowRight` expand, `ArrowLeft` collapse/parent, `ArrowUp`/`ArrowDown` move, `Enter`/`Space` select).
- Trigger/label/clear-control alignment relies on logical CSS properties, so RTL containers are supported.
- In `readonly` mode, panel open/search interactions and selection mutations are blocked.
