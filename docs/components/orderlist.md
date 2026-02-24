# OrderList

## Purpose

Manage ordered collections with keyboard and drag/drop reordering.

## Props

- `modelValue?: Array<Record<string, unknown>>` (default `[]`)
- `itemKey?: string` (default `id`)
- `itemLabel?: string` (default `label`)
- `header?: string` (default `Order`)
- `ariaLabel?: string` (default `Order list`)
- `multiple?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `reorder` - payload: reordered array

## Slots

- `item` - slot props `{ item, index }`

## Example

```vue
<OrderList v-model="workflowSteps" header="Workflow steps" />
```

## Theming

- Override via `theme.overrides.components.orderlist`.

## Tokens

- `gap`
- `borderColor`, `borderRadius`, `backgroundColor`, `headerColor`
- `listPadding`, `listMinHeight`
- `itemPadding`, `itemRadius`, `itemHoverBackgroundColor`, `itemSelectedBackgroundColor`, `itemSelectedColor`
- `focusRingColor`
- `buttonBorderColor`, `buttonRadius`, `buttonBackgroundColor`, `buttonColor`
- `disabledOpacity`

## Accessibility

- List uses `role="listbox"` with `aria-selected` on options.
- Keyboard support includes `Enter`/`Space` selection and `Ctrl+ArrowUp/Down` reorder.

## Testing

- Cover button reorder, keyboard reorder, and drag/drop reorder.
