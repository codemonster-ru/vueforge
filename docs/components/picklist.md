# PickList

PickList moves items between source and target collections with transfer controls, list selection, and reordering.

## Import

```ts
import { PickList } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

```vue
<PickList
    :source="availableUsers"
    :target="assignedUsers"
    source-header="Available users"
    target-header="Assigned users"
    @update:source="availableUsers = $event"
    @update:target="assignedUsers = $event"
/>
```

### Custom Rows

```vue
<PickList :source="availableUsers" :target="assignedUsers">
    <template #source-item="{ item }">
        <span>{{ item.label }}</span>
    </template>

    <template #target-item="{ item }">
        <strong>{{ item.label }}</strong>
    </template>
</PickList>
```

## API

### Props

| Name              | Type                        | Default             |
| ----------------- | --------------------------- | ------------------- |
| `source`          | `Record<string, unknown>[]` | `[]`                |
| `target`          | `Record<string, unknown>[]` | `[]`                |
| `itemKey`         | `string`                    | `'id'`              |
| `itemLabel`       | `string`                    | `'label'`           |
| `sourceHeader`    | `string`                    | `'Available'`       |
| `targetHeader`    | `string`                    | `'Selected'`        |
| `sourceAriaLabel` | `string`                    | `'Available items'` |
| `targetAriaLabel` | `string`                    | `'Selected items'`  |
| `multiple`        | `boolean`                   | `true`              |
| `disabled`        | `boolean`                   | `false`             |

### Events

| Name            | Payload                                |
| --------------- | -------------------------------------- |
| `update:source` | updated source array                   |
| `update:target` | updated target array                   |
| `transfer`      | `{ direction, items, source, target }` |
| `reorder`       | `{ list, items }`                      |

### Slots

| Name          | Description                               |
| ------------- | ----------------------------------------- |
| `source-item` | Custom source row with `{ item, index }`. |
| `target-item` | Custom target row with `{ item, index }`. |

## Theming

Override component tokens through `theme.overrides.components.picklist`.

## Tokens

- Layout and surface: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `headerColor`, `listPadding`, `listMinHeight`
- Items: `itemPadding`, `itemRadius`, `itemHoverBackgroundColor`, `itemSelectedBackgroundColor`, `itemSelectedColor`
- Controls and state: `focusRingColor`, `buttonBorderColor`, `buttonRadius`, `buttonBackgroundColor`, `buttonColor`, `disabledOpacity`

## Recipes

- Use PickList for assignment flows, inclusion or exclusion configuration, and dual-bucket editors.
- Prefer `OrderList` when everything stays in one list and the only operation is reordering.

## Accessibility

- Both columns use listbox semantics and keyboard navigation.
- Transfer works through buttons and keyboard arrows, so the interaction stays accessible without drag and drop.
