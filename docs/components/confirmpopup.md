# ConfirmPopup

Present anchored confirmation UI for compact destructive or sensitive actions.

## Import

```ts
import { ConfirmPopup } from '@codemonster-ru/vueforge';
```

## Examples

Use `ConfirmPopup` when the confirmation belongs directly to a trigger and does not justify a full modal.

### Basic

Use the default action pair for compact destructive actions.

```vue
<template>
    <ConfirmPopup
        v-model="open"
        title="Delete row?"
        message="This action cannot be undone."
        confirm-label="Delete"
    >
        <template #trigger>
            <Button severity="danger" label="Delete" />
        </template>
    </ConfirmPopup>
</template>
```

### Custom Placement

Adjust placement when the trigger sits near the viewport edge or in a dense table action column.

```vue
<template>
    <ConfirmPopup placement="top-end" title="Archive item?" message="You can restore it later.">
        <template #trigger>
            <Button label="Archive" severity="warning" />
        </template>
    </ConfirmPopup>
</template>
```

### Loading Confirm Action

Use `loading` to block repeated confirm presses during async completion.

```vue
<template>
    <ConfirmPopup
        :loading="true"
        :close-on-confirm="false"
        title="Sync project?"
        message="This may take a minute."
    >
        <template #trigger>
            <Button label="Sync" />
        </template>
    </ConfirmPopup>
</template>
```

### Custom Actions Slot

Use the `actions` slot when the popup needs a custom button arrangement.

```vue
<template>
    <ConfirmPopup title="Leave without saving?" message="Unsaved changes will be lost.">
        <template #trigger>
            <Button label="Close editor" severity="secondary" />
        </template>
        <template #actions="{ confirm, cancel }">
            <Button label="Stay" variant="outlined" severity="secondary" @click="cancel" />
            <Button label="Leave" severity="danger" @click="confirm" />
        </template>
    </ConfirmPopup>
</template>
```

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

## Theming

- Override via `theme.overrides.components.confirmPopup`.

## Tokens

Component tokens (override via `theme.overrides.components.confirmPopup`):

- `bodyGap`
- `titleFontSize`, `titleFontWeight`, `titleColor`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Recipes

- Use `ConfirmPopup` for row actions and dense interfaces where a full dialog would feel heavy.
- Keep the trigger close to the affected entity so the confirmation remains contextual.
- Prefer `ConfirmDialog` when the action impacts the whole page or needs more explanation.

## Accessibility

- Inherits popover dialog semantics and keyboard close handling from `Popover`.
- Confirm/cancel actions are native buttons and remain keyboard reachable.
