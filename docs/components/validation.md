# Validation

Provide utility helpers for normalizing validation output and wiring accessible validation state.

## Import

```ts
import {
    buildValidationDescribedBy,
    createValidationMessages,
    createValidationState,
    normalizeValidationErrors,
} from '@codemonster-ru/vueforge';
```

## Examples

Use these helpers when custom form abstractions need the same error normalization and ARIA wiring conventions as `FormField`.

### Normalize Validator Output

Convert boolean, string, or object results into a stable field-error map.

```ts
import { normalizeValidationErrors } from '@codemonster-ru/vueforge';

const errors = normalizeValidationErrors({ email: 'Required' });
```

### Build Validation State

Create one object that combines messages, `aria-invalid`, and `aria-describedby` composition.

```ts
import { createValidationState } from '@codemonster-ru/vueforge';

const state = createValidationState({
    errors: { email: 'Required' },
    field: 'email',
    describedBy: 'email-hint',
    idPrefix: 'signup',
});
```

### Described By Composition

Use `buildValidationDescribedBy` to merge hint and error ids without duplicates.

```ts
import { buildValidationDescribedBy } from '@codemonster-ru/vueforge';

const describedBy = buildValidationDescribedBy('email-hint', 'email-error');
```

## Exports

- `normalizeValidationErrors(result, options?)`
- `createValidationMessages(errors, options?)`
- `buildValidationDescribedBy(...parts)`
- `createValidationState(options?)`

## Types

- `ValidationErrors`
- `ValidationResultInput`
- `ValidationMessage`
- `ValidationMessageLevel`
- `ValidationStatus`
- `ValidationState`

## Behavior Notes

- `normalizeValidationErrors(false)` maps to a form-level error under `_form` by default.
- `createValidationMessages` can scope to one field or include full form messages.
- `createValidationState` derives `status`, `invalid`, `pending`, messages, `describedBy`, and `ariaInvalid`.

## Recipes

- Use these utilities inside custom field abstractions or adapter layers for schema validators.
- Keep validator outputs simple and normalize them once at the boundary.
- Reuse the same `_form` convention for form-level submit errors to stay consistent with `Form`.

## Accessibility

- `buildValidationDescribedBy` helps keep `aria-describedby` stable and deduplicated.
- `createValidationState` centralizes `aria-invalid` and validation message linkage for custom inputs.
