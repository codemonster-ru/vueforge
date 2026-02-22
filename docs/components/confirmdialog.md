# ConfirmDialog

## Purpose

Handle layered interactions (dialogs, overlays, contextual actions, and transient notifications) with consistent behavior.
Centralize close policies, focus management, and stack/layer contracts for complex SaaS screens.

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.confirmDialog`):

- `maxWidth`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify overlay sizing, placement fallback, and viewport collision handling on mobile/tablet/desktop.
Ensure gesture/touch close interactions and action buttons remain accessible on small screens.

## SSR/Hydration

Render closed/open initial state deterministically and keep portal/container structure hydration-safe.
Initialize positioning/focus logic only after mount to avoid server-client markup drift.

## Testing

Cover open/close triggers, escape/outside click behavior, focus trap/restore, and stacking order.
Add accessibility tests for ARIA roles, labelling, and keyboard navigation in layered UI.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
