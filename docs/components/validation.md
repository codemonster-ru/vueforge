# Validation

## Purpose

Shared validation-state primitives and message wiring helpers used across form contracts.

## Exports

- `normalizeValidationErrors(result)` - normalize boolean/string/object validator results to `Record<string, string>`
- `createValidationMessages(errors, options)` - build field/form-scoped message list
- `buildValidationDescribedBy(...ids)` - deduplicated `aria-describedby` composition
- `createValidationState(options)` - produce unified state object (`status`, `invalid`, `messages`, `ariaInvalid`, `describedBy`)

## Types

- `ValidationErrors`
- `ValidationResultInput`
- `ValidationMessage`
- `ValidationMessageLevel`
- `ValidationStatus`
- `ValidationState`

## Example

```ts
import { createValidationState, normalizeValidationErrors } from '@codemonster-ru/vueforge';

const errors = normalizeValidationErrors({ email: 'Required' });
const state = createValidationState({
    errors,
    field: 'email',
    describedBy: 'email-hint',
    idPrefix: 'signup',
});
```

## Message Wiring

- Use `buildValidationDescribedBy(hintId, errorId)` to keep stable `aria-describedby` mapping.
- `FormField` uses this contract internally for hint/error linkage.
