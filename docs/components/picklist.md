# PickList

## Purpose

Move items between available and selected lists with transfer and reorder controls.

## Props

- `source?: Array<Record<string, unknown>>` (default `[]`)
- `target?: Array<Record<string, unknown>>` (default `[]`)
- `itemKey?: string` (default `id`)
- `itemLabel?: string` (default `label`)
- `sourceHeader?: string` (default `Available`)
- `targetHeader?: string` (default `Selected`)
- `sourceAriaLabel?: string` (default `Available items`)
- `targetAriaLabel?: string` (default `Selected items`)
- `multiple?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)

## Events

- `update:source`
- `update:target`
- `transfer` - payload: `{ direction, items, source, target }`
- `reorder` - payload: `{ list: 'source' | 'target', items }`

## Slots

- `source-item` - slot props `{ item, index }`
- `target-item` - slot props `{ item, index }`

## Example

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

## Theming

- Override via `theme.overrides.components.picklist`.

## Tokens

- `gap`
- `borderColor`, `borderRadius`, `backgroundColor`, `headerColor`
- `listPadding`, `listMinHeight`
- `itemPadding`, `itemRadius`, `itemHoverBackgroundColor`, `itemSelectedBackgroundColor`, `itemSelectedColor`
- `focusRingColor`
- `buttonBorderColor`, `buttonRadius`, `buttonBackgroundColor`, `buttonColor`
- `disabledOpacity`

## Accessibility

- Both lists use `role="listbox"` and item selection state via `aria-selected`.
- Keyboard support: `Enter`/`Space` select, `ArrowLeft`/`ArrowRight` transfer, `Ctrl+ArrowUp/Down` reorder.

## Testing

- Cover transfer flow, keyboard reorder, and drag/drop transfer between lists.
