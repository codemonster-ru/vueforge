# Component-Level Breaking Change Rules

Use these rules to classify component/API changes as breaking and decide release/migration requirements.

## What Is Breaking

A change is breaking if existing consumer code can fail at compile-time, runtime, visual layout, accessibility behavior, or interaction contract without consumer opt-in.

## Breaking Change Rules

1. Prop contract changes:
    - Renaming/removing a public prop is breaking.
    - Narrowing accepted prop values is breaking.
    - Changing default behavior with visible/runtime impact is breaking unless gated behind a new opt-in prop.
2. Event contract changes:
    - Renaming/removing emitted events is breaking.
    - Changing event payload shape/semantics is breaking.
3. Slot contract changes:
    - Renaming/removing slots or slot-props is breaking.
    - Changing required slot structure for existing usage is breaking.
4. Accessibility/interaction changes:
    - Keyboard flow changes that alter expected navigation/activation paths are breaking.
    - ARIA role/state changes that alter assistive-technology interpretation are breaking.
5. Styling/theming contract changes:
    - Removing or renaming published token keys/part selectors is breaking.
    - Significant spacing/layout defaults that alter app composition should be treated as breaking unless behind an opt-in variant.
6. SSR/hydration/render timing changes:
    - Changes that introduce hydration mismatch risk or client-only behavior by default are breaking.

## Non-Breaking Examples

- Adding a new optional prop with safe default.
- Adding a new emitted event (without changing existing ones).
- Adding new slot-props while preserving old slot-props.
- Performance improvements with no external contract changes.

## Breaking Examples

1. Prop rename:
    - Breaking: `Dropdown` prop `modelValue` replaced by `value` only.
    - Safe path: keep `modelValue` alias deprecated for at least 2 minor releases, add migration note.
2. Event payload change:
    - Breaking: `@select` payload changes from item object to item id string.
    - Safe path: add new event `@select-id`, deprecate old payload path.
3. Slot removal:
    - Breaking: remove `header` slot from `DataTableToolbar`.
    - Safe path: keep `header` slot as alias and map to new `start` slot.
4. Token rename:
    - Breaking: rename `components.button.primaryBg` to `components.button.fillPrimary`.
    - Safe path: support both keys temporarily and document migration.

## Required Actions for Breaking Changes

- Release type must be `major` unless fully backward-compatible bridge is kept.
- Add changelog migration notes in the same release section.
- Add/update dedicated migration doc using `docs/migrations/MIGRATION_TEMPLATE.md`.
- Add regression tests for both old bridge path (if temporary) and new path.
- Update component docs and API package specs.

## Required Actions for Deprecation-First Changes

- Follow [Deprecation Policy](./deprecation-policy.md).
- Document first deprecated version and planned removal major version.
- Keep catalog mapping and compliance docs synchronized for aliases/equivalents.
