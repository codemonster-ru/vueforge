# DynamicDialog

## Purpose

Programmatically open feature-level modals with dynamic Vue content, without wiring local `v-model` state per caller.
`DynamicDialog` is a host renderer that consumes `DynamicDialogService` queue entries.

## Props

- `service?: DynamicDialogService` (default `dynamicDialogService`)

## Events

- N/A (dialog lifecycle is controlled through `DynamicDialogService` methods and promises).

## Slots

- default - fallback content when no `component` is provided; slot props: `{ entry, close, dismiss }`
- `footer` - optional footer actions; slot props: `{ entry, close, dismiss }`

## Exposes

- `closeCurrent(result?)`
- `dismissCurrent()`

## Examples

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

```vue
<template>
    <DynamicDialog />
</template>
```

## Theming

- Override via `theme.overrides.components.dynamicDialog`.
- Default token source is aliased to `modal` token contract.

## Tokens

- Uses `ModalTokens` (`width*`, `maxWidth*`, `padding`, `borderRadius`, `overlayBackgroundColor`, `zIndex`, header/body/footer/close tokens).

## Recipes

- Mount one global `<DynamicDialog />` near app root and trigger dialogs from composables/stores via `dynamicDialogService`.
- Pass feature component listeners through `open({ listeners })` and resolve with `closeCurrent(result)`.

## Accessibility

- Inherits `role="dialog"` semantics, focus trap, focus restore, and `Escape` handling from `Modal`.
- Overlay-close behavior follows per-entry `modal.closeOnOverlay`.
- Ensure injected dynamic component keeps form controls keyboard reachable and labels/descriptions explicit.

## Responsive

- Responsive surface sizing follows `Modal` tokens (`width`, `maxWidth`, `size` variants).
- Use per-dialog `modal.size` to adapt compact vs wide feature flows.

## SSR/Hydration

- Service state is plain reactive data and does not access DOM APIs.
- Host component is hydration-safe; open dialogs in deterministic client actions to avoid mismatch.

## Testing

- Cover service queue/stack semantics, close/dismiss promise resolution, and clear behavior.
- Cover host rendering for dynamic component props/listeners and modal close/dismiss integration.
