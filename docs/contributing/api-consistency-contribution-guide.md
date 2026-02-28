# API Consistency Contribution Guide

This guide is required for PRs that add or change public APIs.

## Scope

Applies to:

- Components (`props`, `events`, `slots`, `v-model`).
- Composables and services.
- Public utility functions and exported types.

## Source of Truth

- API conventions: [`docs/api-conventions.md`](../api-conventions.md)
- Consistency audit: [`docs/audits/api-consistency-audit.md`](../audits/api-consistency-audit.md)
- Testing/review checklist: [`docs/contributing/testing.md`](./testing.md)
- Core scope policy: [`docs/contributing/what-belongs-in-core-policy.md`](./what-belongs-in-core-policy.md)

## Required PR Checklist

- [ ] Prop names/defaults follow conventions (`size`, `variant`, `disabled`, `readonly`, `loading`).
- [ ] Event names use canonical patterns (`update:modelValue`, domain events with stable payload shape).
- [ ] Slot names and slot-props are consistent with family patterns.
- [ ] `v-model` contract is explicit (`modelValue` + `update:modelValue`).
- [ ] Backward-compat aliases are documented with deprecation path when needed.
- [ ] Component docs updated (Props/Events/Slots/A11y/Theming/Recipes/Migration when applicable).
- [ ] Tests cover API contract and interaction paths.
- [ ] Compliance/audit files updated for touched components.

## Naming and Behavior Rules

1. Do not introduce synonyms for existing concepts.
2. Keep boolean prop semantics positive and explicit (`disabled`, not `isEnabled` inversion).
3. Avoid hidden side effects in default prop values.
4. Preserve event payload stability; add new events instead of mutating existing payload shape.
5. Prefer additive evolution over renames/removals in non-major releases.

## Change Classification

- Non-breaking additions: can ship in `minor`.
- Compatibility aliases: allowed with deprecation metadata.
- Breaking changes: follow [`component-breaking-change-rules.md`](./component-breaking-change-rules.md).

## Review Notes Template (PR Description)

Include this block in PR description:

```md
## API Consistency

- Conventions checked: yes/no
- New/changed public APIs:
    - ...
- Alias/deprecation introduced: yes/no
- Migration note added: yes/no
- Compliance matrix updated: yes/no
```
