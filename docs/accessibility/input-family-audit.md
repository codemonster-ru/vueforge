# Input Family Accessibility Audit Framework

Scope: `Input`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `MaskedInput`, `MentionInput`, `OtpInput`.

Goal: provide a repeatable checklist for keyboard and ARIA behavior validation before release.

## Shared Keyboard Checklist

- Tab order:
    - Control is reachable by `Tab`.
    - Focus exits predictably with `Shift+Tab`.
- Activation and editing:
    - Typing updates value normally.
    - `Backspace`/`Delete` behavior is consistent with native expectations.
- Submit and escape behavior:
    - `Enter` behavior is explicit (submit, select, or no-op by design).
    - `Escape` behavior is explicit for controls with overlays/panels.
- Disabled and readonly:
    - `disabled` controls are not interactive and not focusable.
    - `readonly` controls remain focusable but non-editable.
- Focus-visible:
    - Keyboard focus ring is visible and meets contrast expectations.

## Shared ARIA Checklist

- Name:
    - Control has accessible name (`label`, `aria-label`, or `aria-labelledby`).
- Description:
    - Hint and error text are wired via `aria-describedby` where applicable.
- Invalid state:
    - Invalid controls expose `aria-invalid="true"` when in error state.
- Required state:
    - Required controls expose `aria-required="true"` when applicable.
- Role correctness:
    - Native role is preserved unless custom role is required by interaction model.

## Component-Specific Additions

- `NumberInput`:
    - Arrow keys and step behavior are documented and tested.
- `PasswordInput`:
    - Show/hide toggle is keyboard accessible and labeled.
- `SearchInput`:
    - Clear action is keyboard accessible and labeled.
- `MentionInput`:
    - Suggestion list keyboard navigation and active option semantics are verified.
- `OtpInput`:
    - Cell navigation, paste behavior, and screen-reader clarity are verified.

## Test Matrix Template

Use this matrix per component:

- Keyboard happy path: pass/fail + notes
- Keyboard edge cases: pass/fail + notes
- ARIA name/description: pass/fail + notes
- Invalid/required semantics: pass/fail + notes
- Disabled/readonly semantics: pass/fail + notes
- Focus-visible quality: pass/fail + notes

## Exit Criteria

- All shared checklist items pass.
- Component-specific additions pass.
- Unit tests cover keyboard and ARIA contracts for the component.
