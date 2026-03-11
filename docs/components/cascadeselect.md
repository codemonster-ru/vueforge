# CascadeSelect

CascadeSelect extends `TreeSelect` with async branch loading for deep hierarchies where children arrive on demand.

## Import

```ts
import { CascadeSelect } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

```vue
<CascadeSelect v-model="selectedNode" v-model:expandedKeys="expanded" :items="rootNodes" :load-children="loadBranch" />
```

### Async Branch Labels

```vue
<CascadeSelect :items="rootNodes" :load-children="loadBranch">
    <template #label="{ node, loading }">
        <span>{{ node.label }}</span>
        <small v-if="loading">Loading...</small>
    </template>
</CascadeSelect>
```

## API

### Props

| Name                | Type                                                    | Default           |
| ------------------- | ------------------------------------------------------- | ----------------- |
| `items`             | `CascadeSelectItem[]`                                   | `[]`              |
| `modelValue`        | `TreeValue \| TreeValue[] \| undefined`                 | `undefined`       |
| `expandedKeys`      | `TreeValue[]`                                           | `[]`              |
| `multiple`          | `boolean`                                               | `false`           |
| `selectable`        | `boolean`                                               | `true`            |
| `expandOnClick`     | `boolean`                                               | `true`            |
| `disabled`          | `boolean`                                               | `false`           |
| `readonly`          | `boolean`                                               | `false`           |
| `loading`           | `boolean`                                               | `false`           |
| `loadingText`       | `string \| undefined`                                   | `undefined`       |
| `loadingBranchText` | `string`                                                | `' (loading...)'` |
| `emptyText`         | `string \| undefined`                                   | `undefined`       |
| `placeholder`       | `string`                                                | `''`              |
| `searchPlaceholder` | `string \| undefined`                                   | `undefined`       |
| `filter`            | `boolean`                                               | `true`            |
| `clearable`         | `boolean`                                               | `false`           |
| `variant`           | `'filled' \| 'outlined'`                                | `'filled'`        |
| `size`              | `'small' \| 'normal' \| 'large'`                        | `'normal'`        |
| `autoLoadOnExpand`  | `boolean`                                               | `true`            |
| `loadChildren`      | `((node) => Promise<CascadeSelectItem[]>) \| undefined` | `undefined`       |

### Events

| Name                  | Payload                      |
| --------------------- | ---------------------------- |
| `update:modelValue`   | selected value payload       |
| `change`              | `value, node, event`         |
| `update:expandedKeys` | expanded keys array          |
| `toggle`              | `key, expanded, node, event` |
| `nodeClick`           | `node, event`                |
| `search`              | query string                 |
| `focus`               | `FocusEvent`                 |
| `blur`                | `FocusEvent`                 |
| `branchLoadStart`     | node                         |
| `branchLoad`          | `node, children`             |
| `branchLoadError`     | `node, error`                |

### Slots

| Name    | Description                                                                    |
| ------- | ------------------------------------------------------------------------------ |
| `label` | Tree label slot with `{ node, level, selected, expanded, disabled, loading }`. |

## Theming

CascadeSelect uses the same token contract as `TreeSelect` and is intended to share `theme.overrides.components.treeselect`.

## Recipes

- Use CascadeSelect when a hierarchy is too large to materialize upfront and branch expansion should trigger fetching.
- Prefer TreeSelect when the full tree is already available client-side.

## Accessibility

- CascadeSelect inherits the trigger, popup, and tree semantics of `TreeSelect`.
- Async branch loading preserves the hierarchy and surfaces loading state through the label slot.
