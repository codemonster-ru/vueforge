# DialogService / ConfirmService

## Purpose

- Provide programmatic dialog flows for module-level actions without manually managing local `v-model` state for each caller.
- Support promise-based user decision handling (`await`) for confirm/close outcomes.

## Props

- N/A (service APIs, not Vue components).

## Events

- N/A (service APIs return promises and expose imperative methods).

## Slots

- N/A (service APIs).

## Examples

```ts
import { confirmService } from '@codemonster-ru/vueforge';

const approved = await confirmService.confirm({
    title: 'Delete item?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    confirmSeverity: 'danger',
});

if (approved) {
    await deleteItem();
}
```

```ts
import { dialogService } from '@codemonster-ru/vueforge';

const dialog = dialogService.open<{ reason: string }>({
    title: 'Close editor?',
    message: 'Unsaved changes will be lost.',
});

// Later, from UI layer:
dialog.close({ reason: 'confirmed' });

const result = await dialog.promise;
```

## Theming

- Services have no direct visual surface. Use component-level theming for the renderer (`Modal`, `ConfirmDialog`, custom host component).

## Tokens

- N/A (no service-level tokens).

## Recipes

- App-level confirm queue: mount one `ConfirmDialog` near app root and bind it to `confirmService.current`.
- Feature-level programmatic dialogs: keep trigger logic in composables/stores and resolve via `dialogService` from host UI.

## Accessibility

- Accessibility behavior is enforced by the rendering component (`ConfirmDialog`, `Modal`, or custom host).
- Ensure renderer keeps keyboard and ARIA contracts (focus trap/restore, escape behavior, descriptive labels).

## Responsive

- Responsive behavior depends on the renderer component and layout constraints used by the host.

## SSR/Hydration

- Services are hydration-safe: state is plain reactive runtime data and does not access DOM APIs.
- Renderers should open dialogs only in deterministic client flows to avoid server/client mismatch.

## Testing

- Add service-level tests for queue/stack behavior, `open`/`close`, and promise resolution semantics.
- Add renderer integration tests for keyboard, ARIA, and interaction behavior.

## API

`DialogService`:

- `open(options?) => { id, promise, close(result?), dismiss() }`
- `close(id, result?)`
- `dismiss(id)`
- `closeCurrent(result?)`
- `dismissCurrent()`
- `clear()`
- `dialogs`, `currentDialog`

`ConfirmService`:

- `open(options?) => { id, promise, confirm(), cancel(), close() }`
- `confirm(options?) => Promise<boolean>`
- `resolve(id, confirmed)`
- `confirmById(id)` / `cancelById(id)`
- `confirmCurrent()` / `cancelCurrent()` / `resolveCurrent(confirmed)`
- `clear()`
- `queue`, `current`
