# Tree

Tree renders hierarchical data with selection, expansion, optional async branch loading, and virtualization for large structures.

## Import

```ts
import { Tree } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use controlled selection and expansion for file trees, category browsers, and navigation sidebars.

```vue
<Tree v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="treeItems" />
```

### Multiple Selection

Use multiple or explicit `selectionMode="multiple"` for bulk workflows.

```vue
<Tree v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

### Async Expand

Enable `loadOnExpand` when child nodes are fetched lazily.

```vue
<Tree
    :items="items"
    :expanded-keys="expandedKeys"
    :loading-keys="loadingKeys"
    load-on-expand
    @load-children="onLoadChildren"
/>
```

### Virtualized Large Trees

Turn on virtualization for large visible trees where expanded nodes can exceed normal DOM limits.

```vue
<Tree :items="largeTreeItems" virtualized :virtualization-threshold="150" :item-height="30" :virtual-height="360" />
```

### Custom Labels

Use the `label` slot when each node needs badges, meta text, or richer layout.

```vue
<Tree :items="treeItems">
    <template #label="{ node, selected }">
        <span :class="{ 'is-selected': selected }">
            {{ node.label }}
            <Badge v-if="node.children?.length" :value="node.children.length" />
        </span>
    </template>
</Tree>
```

## API

### Types

```ts
type TreeValue = string | number;
type TreeSelectionMode = 'none' | 'single' | 'multiple';

interface TreeItem {
    key: TreeValue;
    label: string;
    disabled?: boolean;
    hasChildren?: boolean;
    children?: TreeItem[];
}
```

### Props

| Name                      | Type                                            | Default        |
| ------------------------- | ----------------------------------------------- | -------------- |
| `items`                   | `TreeItem[]`                                    | `[]`           |
| `modelValue`              | `TreeValue \| TreeValue[] \| undefined`         | `undefined`    |
| `expandedKeys`            | `TreeValue[]`                                   | `[]`           |
| `multiple`                | `boolean`                                       | `false`        |
| `selectionMode`           | `'none' \| 'single' \| 'multiple' \| undefined` | `undefined`    |
| `selectable`              | `boolean`                                       | `true`         |
| `expandOnClick`           | `boolean`                                       | `true`         |
| `disabled`                | `boolean`                                       | `false`        |
| `size`                    | `'small' \| 'normal' \| 'large'`                | `'normal'`     |
| `variant`                 | `'filled' \| 'outlined'`                        | `'filled'`     |
| `ariaLabel`               | `string`                                        | `'Tree'`       |
| `ariaLabelledby`          | `string`                                        | `''`           |
| `virtualized`             | `boolean`                                       | `false`        |
| `virtualizationThreshold` | `number`                                        | `120`          |
| `itemHeight`              | `number`                                        | `32`           |
| `virtualHeight`           | `number`                                        | `360`          |
| `overscan`                | `number`                                        | `4`            |
| `loadingKeys`             | `TreeValue[]`                                   | `[]`           |
| `loadOnExpand`            | `boolean`                                       | `false`        |
| `asyncBranchLabel`        | `string`                                        | `'Loading...'` |

### Events

| Name                  | Payload                      |
| --------------------- | ---------------------------- |
| `update:modelValue`   | selected value payload       |
| `update:expandedKeys` | expanded keys array          |
| `change`              | selection payload            |
| `toggle`              | `key, expanded, node, event` |
| `nodeClick`           | `node, event`                |
| `loadChildren`        | `key, node, event`           |

### Slots

| Name    | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| `label` | Custom label with `{ node, level, selected, expanded, disabled }`. |

## Theming

Override component tokens through `theme.overrides.components.tree`.

## Tokens

- Layout: `gap`, `indent`, `rowGap`
- Rows: `rowPadding`, `rowPaddingInline`, `rowBorderRadius`, `rowBorderColor`, `rowFontSize`, `rowTextColor`, `rowBackgroundColor`, `rowHoverBackgroundColor`, `rowSelectedBackgroundColor`, `rowSelectedTextColor`
- Toggle: `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- State and sizes: `focusRingShadow`, `disabledOpacity`, `small.*`, `large.*`

## Recipes

- Use Tree for file systems, nested settings, permissions, and large hierarchical filters.
- Prefer `TreeSelect` when the same hierarchy should be embedded inside a form control rather than rendered as a full data view.

## Accessibility

- Tree uses `role="tree"` and exposes `treeitem` semantics with expansion and selection state.
- Keyboard navigation supports directional movement, selection, and expand or collapse behavior.
- Virtualized mode preserves the same interaction contract while reducing DOM size for large trees.
