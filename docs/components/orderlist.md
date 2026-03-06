# OrderList

OrderList manages ordered collections with selection, keyboard reordering, and drag and drop.

## Import

```ts
import OrderList from '@/package/components/order-list.vue';
```

## Examples

### Basic

```vue
<OrderList v-model="workflowSteps" header="Workflow steps" />
```

### Custom Item Content

```vue
<OrderList v-model="workflowSteps" item-key="id" item-label="label">
    <template #item="{ item }">
        <strong>{{ item.label }}</strong>
    </template>
</OrderList>
```

### Single Selection

```vue
<OrderList v-model="workflowSteps" :multiple="false" />
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `Record<string, unknown>[]` | `[]` |
| `itemKey` | `string` | `'id'` |
| `itemLabel` | `string` | `'label'` |
| `header` | `string` | `'Order'` |
| `ariaLabel` | `string` | `'Order list'` |
| `multiple` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | reordered items |
| `reorder` | reordered items |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom item rendering with `{ item, index }`. |

## Theming

Override component tokens through `theme.overrides.components.orderlist`.

## Tokens

- Layout and surface: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `headerColor`, `listPadding`, `listMinHeight`
- Items: `itemPadding`, `itemRadius`, `itemHoverBackgroundColor`, `itemSelectedBackgroundColor`, `itemSelectedColor`
- Controls and state: `focusRingColor`, `buttonBorderColor`, `buttonRadius`, `buttonBackgroundColor`, `buttonColor`, `disabledOpacity`

## Recipes

- Use OrderList for workflow steps, dashboard sections, priority queues, and any single-column reordering task.
- Prefer `PickList` when items must move between two buckets instead of only changing order.

## Accessibility

- OrderList uses listbox semantics with `aria-selected`.
- Keyboard support includes selection with `Enter` or `Space`, focus movement with arrow keys, and reorder with `Ctrl+ArrowUp` and `Ctrl+ArrowDown`.

