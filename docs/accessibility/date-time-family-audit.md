# Date/Time Family Accessibility Audit Framework

Scope: `DatePicker`, `Calendar`, `DateRangePicker`, `TimePicker`, `DateTimePicker`.

Goal: provide a repeatable checklist for keyboard behavior, parsing, and constraints handling before release.

## Shared Keyboard Checklist

- Focus entry/exit:
    - Trigger/input is reachable by `Tab`.
    - Focus moves predictably into popup content and back to trigger on close.
- Navigation:
    - Arrow keys navigate day/time options according to component model.
    - `Home`/`End` behavior is defined where grid/list navigation applies.
    - `PageUp`/`PageDown` behavior is defined for month/year jumps where applicable.
- Commit and dismiss:
    - `Enter` commits selection according to component contract.
    - `Escape` dismisses popup without unintended value mutation.
- Range behavior (where applicable):
    - Start/end navigation and commit are keyboard operable.
    - Keyboard users can complete range selection without mouse.

## Shared Parsing Checklist

- Input parsing:
    - Valid formatted input parses consistently.
    - Invalid input does not silently commit unexpected values.
    - Empty input is handled explicitly (clear vs keep previous value).
- Format consistency:
    - Display format and parser expectations are documented and aligned.
    - Partial input behavior is defined (intermediate vs committed states).

## Shared Constraints Checklist

- Min/max constraints:
    - Out-of-range days/times are visibly disabled and non-selectable.
    - Keyboard navigation skips or blocks disabled values consistently.
- Range constraints:
    - End cannot be before start when range mode is active.
    - Same-day/same-time boundaries are handled correctly.
- Step/interval constraints:
    - Time stepping and snapping behavior is documented and test-covered.

## Shared ARIA Checklist

- Correct popup semantics (`dialog`, `grid`, `listbox`, etc.) based on interaction model.
- Active option/day is announced via focus or `aria-activedescendant` strategy.
- Selected day/time/range state is reflected via ARIA state attributes.
- Accessible name/description and invalid state (`aria-invalid`) are supported.

## Test Matrix Template

Use this matrix per component:

- Keyboard navigation/commit: pass/fail + notes
- Parsing and invalid input behavior: pass/fail + notes
- Constraint handling (`min`/`max`/range/step): pass/fail + notes
- ARIA role/state coverage: pass/fail + notes
- Readonly/disabled behavior: pass/fail + notes

## Exit Criteria

- Shared keyboard/parsing/constraint checklist items pass.
- Component-specific edge cases are covered by tests.
- Documentation reflects supported keyboard, parsing, and constraint behavior.
