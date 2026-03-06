# DynamicDialog

DynamicDialog is a host renderer for programmatic dialogs opened through `dynamicDialogService`.

## Import

```ts
import DynamicDialog from '@/package/components/dynamic-dialog.vue';
import { dynamicDialogService } from '@/package/services/dynamic-dialog-service';
```

## Examples

### Root Host

Mount one host near the app root so feature code can open dialogs without local `v-model` wiring.

```vue
<template>
    <DynamicDialog />
</template>
```

### Programmatic Open

Use `dynamicDialogService.open()` when the caller should await the dialog result.

```ts
import { dynamicDialogService } from '@codemonster-ru/vueforge';
import MemberRoleDialog from './member-role-dialog.vue';

const result = await dynamicDialogService.open<{ role: string }, { memberId: string }>({
    title: 'Change member role',
    component: MemberRoleDialog,
    payload: { memberId: 'u_42' },
    listeners: {
        submit: payload => dynamicDialogService.closeCurrent(payload),
    },
}).promise;
```

### Slot-Based Fallback

Use the host slots when an entry provides only title and message, or when you want a custom global fallback UI.

```vue
<DynamicDialog>
    <template #default="{ entry, close, dismiss }">
        <div>
            <p>{{ entry?.options.message }}</p>
            <Button label="Close" @click="close()" />
            <Button label="Cancel" severity="secondary" @click="dismiss()" />
        </div>
    </template>
</DynamicDialog>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `service` | `DynamicDialogService` | `dynamicDialogService` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Fallback content when no component is provided, with `{ entry, close, dismiss }`. |
| `footer` | Optional footer actions with `{ entry, close, dismiss }`. |

### Exposed Methods

| Name | Description |
| --- | --- |
| `closeCurrent(result?)` | Resolves and closes the active dialog. |
| `dismissCurrent()` | Dismisses the active dialog without a result. |

## Theming

`DynamicDialog` does not have its own standalone visual contract. It renders through `Modal` and inherits the `theme.overrides.components.modal` token set.

## Tokens

- Uses `Modal` tokens such as `width*`, `maxWidth*`, `padding`, `borderRadius`, `overlayBackgroundColor`, `zIndex`, and header/body/footer control tokens

## Recipes

- Mount a single global host and treat feature dialogs as service-driven flows.
- Pass business payload through `payload` and UI bindings through `componentProps` or `listeners`.

## Accessibility

- Accessibility behavior comes from `Modal`, including dialog semantics, focus management, and close-on-escape handling.
- Dynamically rendered content still needs proper form labels, descriptions, and keyboard reachability.
