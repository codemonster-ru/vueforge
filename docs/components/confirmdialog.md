# ConfirmDialog

## Props

- `modelValue?: boolean` (v-model)
- `title?: string` (default `Confirm action`)
- `message?: string`
- `confirmLabel?: string` (default `Confirm`)
- `cancelLabel?: string` (default `Cancel`)
- `confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (default `danger`)
- `loading?: boolean` (default `false`)
- `closeOnConfirm?: boolean` (default `true`)
- `size?: 'sm' | 'md' | 'lg'` (default `sm`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showClose?: boolean` (default `true`)
- `lockScroll?: boolean` (default `true`)

## Events

- `update:modelValue`
- `confirm`
- `cancel`
- `open`
- `close`

## Slots

- `default` (optional) - dialog message/body content (fallbacks to `message`)
- `actions` (optional) - custom action buttons; slot props: `{ confirm, cancel }`

## Examples

```vue
<ConfirmDialog
    v-model="open"
    title="Delete item?"
    message="This action cannot be undone."
    confirm-label="Delete"
    @confirm="removeItem"
/>
```

## Tokens

Component tokens (override via `theme.overrides.components.confirmDialog`):

- `maxWidth`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
