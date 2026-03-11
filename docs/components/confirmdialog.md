# ConfirmDialog

Present a blocking confirmation flow with built-in confirm and cancel actions.

## Import

```ts
import { ConfirmDialog } from '@codemonster-ru/vueforge';
```

## Examples

Use `ConfirmDialog` when the user must explicitly accept or reject a blocking action.

### Basic

Use the defaults for destructive confirmation flows.

```vue
<template>
    <ConfirmDialog v-model="open" title="Delete item?" message="This action cannot be undone." confirm-label="Delete" />
</template>
```

### Custom Severity And Labels

Adjust labels and confirm severity to match the intent of the action.

```vue
<template>
    <ConfirmDialog
        v-model="open"
        title="Publish changes?"
        message="The new version will become visible to all users."
        confirm-label="Publish"
        cancel-label="Keep draft"
        confirm-severity="primary"
    />
</template>
```

### Loading Confirm Action

Use `loading` when the confirm action is async and the dialog should not close immediately.

```vue
<template>
    <ConfirmDialog
        v-model="open"
        title="Sync project?"
        message="This may take a minute."
        :loading="true"
        :close-on-confirm="false"
    />
</template>
```

### Custom Actions Slot

Use the `actions` slot when the default two-button footer is not sufficient.

```vue
<template>
    <ConfirmDialog v-model="open" title="Archive project?" message="You can restore it later.">
        <template #actions="{ confirm, cancel }">
            <Button label="Cancel" variant="outlined" severity="secondary" @click="cancel" />
            <Button label="Archive" severity="warning" @click="confirm" />
        </template>
    </ConfirmDialog>
</template>
```

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

## Theming

- Override via `theme.overrides.components.confirmDialog`.

## Tokens

Component tokens (override via `theme.overrides.components.confirmDialog`):

- `maxWidth`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Recipes

- Use `ConfirmDialog` for blocking confirmations that should interrupt the workflow before proceeding.
- Keep destructive labels explicit (`Delete project`, `Archive workspace`) rather than generic (`Confirm`).
- Use `closeOnConfirm=false` only when the caller truly needs to keep the dialog open during async completion.

## Accessibility

- Inherits modal dialog semantics (`role="dialog"`, `aria-modal="true"`) and labelled/description wiring from `Modal`.
- Supports `Escape` close behavior (configurable via `closeOnEsc`) and overlay-close policy via `closeOnOverlay`.
- Keep action buttons keyboard reachable and provide explicit, descriptive confirm/cancel labels for destructive flows.
