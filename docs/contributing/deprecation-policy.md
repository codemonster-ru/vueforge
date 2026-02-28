# Deprecation Policy

This policy defines how VueForge deprecates public APIs (components, props, events, slots, composables, services, directives, and exported types).

## Principles

- Prefer additive, backward-compatible changes first.
- Deprecate before removing whenever practical.
- Every deprecation must provide a clear replacement path.
- Deprecation state must be visible in docs and release notes.

## Deprecation Lifecycle

1. Introduce deprecation:
    - Allowed in `minor` or `major` release preparation.
    - Keep old API behavior functional.
    - Mark API as deprecated in docs and changelog.
2. Stabilize migration:
    - Provide migration notes and examples in the same release.
    - Keep compatibility alias/shim while consumers migrate.
3. Remove deprecated API:
    - Removal is allowed only in `major` releases.
    - Deprecated APIs should remain for at least 2 minor releases before removal, unless there is a critical security reason.

## Required Deprecation Record

When `CHANGELOG.md` marks `Deprecations documented` as completed, include:

- Deprecated API identifier (for example: `Dropdown` alias, `onActive` event).
- Recommended replacement API.
- First deprecated version.
- Planned removal major version (or `TBD` with rationale).
- Migration notes link.

## Implementation Requirements

For each deprecation PR:

- Update component docs with a `Migration` section.
- Add/extend migration notes in `docs/migrations/`.
- Update `docs/audits/component-catalog-mapping.md` when aliases/equivalents are involved.
- Preserve tests for deprecated path until removal release.
- Add tests for replacement path if behavior changed.

Optional runtime warning behavior:

- Dev-only warnings are allowed for deprecated APIs.
- Warnings must be actionable and include the replacement API name.
- No noisy repeated warnings for the same key path in one render cycle.

## Exceptions

Immediate removal without deprecation window is allowed only for:

- Critical security vulnerabilities.
- Severe data-loss/corruption behavior.
- Legal/compliance requirements.

Such cases still require explicit migration guidance in the release notes.
