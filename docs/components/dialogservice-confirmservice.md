# DialogService / ConfirmService

DialogService and ConfirmService provide promise-based programmatic dialog flows without local open-state wiring in each caller.

## Import

```ts
import { dialogService, confirmService } from '@codemonster-ru/vueforge';
```

## Examples

### Confirm Flow

Use `confirmService.confirm()` when a caller only needs a boolean user decision.

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

### Generic Dialog Flow

Use `dialogService.open()` when the result shape is domain-specific.

```ts
import { dialogService } from '@codemonster-ru/vueforge';

const dialog = dialogService.open<{ reason: string }>({
    title: 'Close editor?',
    message: 'Unsaved changes will be lost.',
});

dialog.close({ reason: 'confirmed' });

const result = await dialog.promise;
```

### Renderer Integration

These services are runtime state only. Pair them with visual hosts like `ConfirmDialog`, `DynamicDialog`, or a custom renderer component.

```vue
<template>
    <ConfirmDialog />
    <DynamicDialog />
</template>
```

## API

### DialogService

- `open(options?) => { id, promise, close(result?), dismiss() }`
- `close(id, result?)`
- `dismiss(id)`
- `closeCurrent(result?)`
- `dismissCurrent()`
- `clear()`
- state: `dialogs`, `currentDialog`

### ConfirmService

- `open(options?) => { id, promise, confirm(), cancel(), close() }`
- `confirm(options?) => Promise<boolean>`
- `resolve(id, confirmed)`
- `confirmById(id)` / `cancelById(id)`
- `confirmCurrent()` / `cancelCurrent()` / `resolveCurrent(confirmed)`
- `clear()`
- state: `queue`, `current`

## Theming

Services have no direct visual surface. Theme the renderer component instead, typically `ConfirmDialog`, `Modal`, or `DynamicDialog`.

## Tokens

- None at the service layer

## Recipes

- Use `confirmService` for standard destructive or approval prompts.
- Use `dialogService` when the caller needs richer payloads, multiple dialog entries, or a custom renderer.

## Accessibility

- Accessibility is enforced by the renderer component, not by the service state itself.
- The mounted host must still provide dialog semantics, focus handling, and explicit labels.
