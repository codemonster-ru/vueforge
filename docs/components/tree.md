# Tree

## Props

- `items?: Array<{ key: string | number; label: string; disabled?: boolean; children?: Array<...> }>` (default `[]`)
- `modelValue?: string | number | Array<string | number>` (v-model)
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `true`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `update:expandedKeys`
- `change`
- `toggle`
- `nodeClick`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Tree v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="treeItems" />
<Tree v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

## Recipes

### Controlled expand/select with external state sync

```vue
<script setup lang="ts">
import { ref } from 'vue';

const selected = ref<string | undefined>();
const expanded = ref<Array<string>>(['docs']);
const items = [
    {
        key: 'docs',
        label: 'Docs',
        children: [
            { key: 'guides', label: 'Guides' },
            { key: 'api', label: 'API' },
        ],
    },
    { key: 'blog', label: 'Blog' },
];
</script>

<template>
    <Tree v-model="selected" v-model:expandedKeys="expanded" :items="items" />
</template>
```

### Large tree with pre-expanded sections

```vue
<Tree :items="largeTreeItems" :expanded-keys="['group-0', 'group-1', 'group-2']" aria-label="Project structure" />
```

## Tokens

Component tokens (override via `theme.overrides.components.tree`):

- `gap`, `indent`, `rowGap`, `rowPadding`, `rowPaddingInline`
- `rowBorderRadius`, `rowBorderColor`, `rowFontSize`, `rowTextColor`
- `rowBackgroundColor`, `rowHoverBackgroundColor`, `rowSelectedBackgroundColor`, `rowSelectedTextColor`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `focusRingShadow`, `disabledOpacity`
- `small.rowPadding`, `small.rowPaddingInline`, `small.rowFontSize`, `small.toggleSize`
- `large.rowPadding`, `large.rowPaddingInline`, `large.rowFontSize`, `large.toggleSize`

## Accessibility

- Keyboard navigation supports `ArrowUp`/`ArrowDown`, `Home`/`End`, `ArrowRight` (expand/focus first child), and `ArrowLeft` (collapse/focus parent).
- Disabled nodes are skipped during keyboard focus traversal.
- Layout indentation and label alignment use logical properties, so the component works in both LTR and RTL containers.
- Ensure visible focus state and sufficient color contrast in usage contexts.
