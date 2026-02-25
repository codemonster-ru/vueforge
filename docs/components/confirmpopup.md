# ConfirmPopup

## Purpose

Provide anchor-based confirmation interactions for row/list actions without opening a full modal.
Built on `Popover` for contextual confirm/cancel workflows in dense SaaS tables.

## Props

- `modelValue?: boolean` (controlled open state)
- `title?: string`
- `message?: string`
- `confirmLabel?: string` (default `Confirm`)
- `cancelLabel?: string` (default `Cancel`)
- `confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (default `danger`)
- `placement?: 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`
- `offset?: number` (default `8`)
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `closeOnEsc?: boolean` (default `true`)
- `closeOnOutside?: boolean` (default `true`)
- `closeOnConfirm?: boolean` (default `true`)
- `closeOnCancel?: boolean` (default `true`)

## Events

- `update:modelValue`
- `confirm`, `accept` (alias)
- `cancel`, `reject` (alias)
- `show`, `onShow` (alias)
- `hide`, `onHide` (alias)

## Slots

- `trigger` - anchor trigger content (required for user interaction)
- default - custom body content
- `actions` - custom actions slot props: `{ confirm, cancel }`

## Exposed Methods

- `show()`
- `hide()`
- `toggle()`

## Examples

```vue
<ConfirmPopup
    v-model="open"
    title="Delete row?"
    message="This action cannot be undone."
    confirm-label="Delete"
    @confirm="deleteRow"
>
    <template #trigger>
        <Button severity="danger" label="Delete" />
    </template>
</ConfirmPopup>
```

## Theming

- Override via `theme.overrides.components.confirmPopup`.

## Tokens

- `bodyGap`
- `titleFontSize`, `titleFontWeight`, `titleColor`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Accessibility

- Inherits popover dialog semantics and keyboard close handling from `Popover`.
- Confirm/cancel actions are native buttons and remain keyboard reachable.
