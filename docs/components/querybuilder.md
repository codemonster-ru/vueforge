# QueryBuilder

QueryBuilder builds nested `AND` and `OR` filter groups for complex list and report queries.

## Import

```ts
import QueryBuilder from '@/package/components/query-builder.vue';
```

## Examples

### Basic

Use `QueryBuilder` when advanced users need explicit combinators and nested rules.

```vue
<QueryBuilder
    v-model="filters"
    :fields="[
        { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Open', value: 'open' }] },
        { key: 'priority', label: 'Priority', type: 'number' },
        { key: 'assignee', label: 'Assignee', type: 'text' },
    ]"
/>
```

### Controlled Depth

Limit nesting when the product should discourage overly complex user-built logic.

```vue
<QueryBuilder
    v-model="filters"
    :fields="fields"
    :max-depth="3"
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `QueryBuilderGroupNode \| null` | `null` |
| `fields` | `QueryBuilderField[]` | `[]` |
| `maxDepth` | `number` | `5` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Query builder'` |
| `andLabel` | `string` | `'AND'` |
| `orLabel` | `string` | `'OR'` |
| `addRuleLabel` | `string` | `'+ Rule'` |
| `addGroupLabel` | `string` | `'+ Group'` |
| `removeRuleLabel` | `string` | `'Remove'` |
| `removeGroupLabel` | `string` | `'Remove group'` |
| `combinatorLabel` | `string` | `'Match'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `QueryBuilderGroupNode` |
| `change` | `QueryBuilderGroupNode` |

### Exposed Methods

| Name | Description |
| --- | --- |
| `serialize()` | Returns the current query tree as JSON. |
| `deserialize(payload)` | Applies a serialized query tree and returns success. |
| `getModel()` | Returns a cloned current model. |

## Theming

Override component tokens through `theme.overrides.components.queryBuilder`.

## Tokens

- Base surface: `fontSize`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- Layout: `rowGap`, `nestedOffset`, `groupGap`, `groupPadding`, `groupBorderRadius`, `groupBorderColor`, `groupBackgroundColor`
- Controls: `controlHeight`, `controlBorderRadius`, `controlBorderColor`, `controlBackgroundColor`, `controlFocusBorderColor`, `controlFocusRing`
- States: `dangerTextColor`, `dangerBorderColor`, `disabledOpacity`

## Recipes

- Use stable field keys and backend-aligned operators so serialized queries can be sent directly to APIs.
- Keep the first query-builder field meaningful, because it becomes the default in new rules.

## Accessibility

- The root uses `role="group"` with a configurable label.
- Native buttons, selects, and inputs keep rule editing keyboard-friendly.
