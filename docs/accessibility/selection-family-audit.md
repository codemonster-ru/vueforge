# Selection Family Accessibility Audit Framework

Scope: `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`.

Goal: provide a repeatable checklist for open/close behavior, keyboard navigation, and ARIA contracts before release.

## Shared Interaction Checklist

- Open/close behavior:
    - Component opens with expected trigger (`click`, `ArrowDown`, or typing by design).
    - Component closes on `Escape`, outside click, and blur handoff where applicable.
    - Re-opening restores predictable state (highlight, query, scroll position).
- Focus management:
    - Trigger/control remains keyboard reachable via `Tab`.
    - Focus moves predictably between trigger, panel, and options.
    - Focus is restored to trigger/control after close when appropriate.
- Keyboard navigation:
    - `ArrowDown`/`ArrowUp` navigation is supported in the options list.
    - `Enter`/`Space` selection behavior is explicit and tested.
    - `Home`/`End` behavior is defined for list navigation where supported.
- Disabled and readonly:
    - `disabled` controls are non-interactive and non-focusable.
    - `readonly` controls remain focusable but do not mutate value.
- Typeahead/filter input:
    - Query updates are predictable and do not desync with highlighted option.
    - Empty/loading/no-results states are reachable and announced appropriately.

## Shared ARIA Checklist

- Trigger/control semantics:
    - Correct role is used (`combobox`, `button`, or native input role by design).
    - `aria-expanded` reflects actual open state.
    - `aria-controls` targets the active popup/list element.
- Popup semantics:
    - Popup role is correct (`listbox`, `tree`, etc.) for the interaction model.
    - Option/item roles are correct (`option`, `treeitem`, etc.).
    - `aria-selected`/`aria-checked` states are synchronized with internal value.
- Active option semantics:
    - `aria-activedescendant` (or equivalent focus strategy) tracks highlighted item.
    - Active option id is stable while navigating.
- Name/description/validation:
    - Accessible name is present via label, `aria-label`, or `aria-labelledby`.
    - Help/error text can be attached via `aria-describedby`.
    - Invalid and required states expose `aria-invalid` and `aria-required` consistently.

## Component-Specific Additions

- `Select`:
    - Single-select open/close and option commit semantics are verified.
- `Autocomplete`:
    - Query typing, filtering, and highlighted-option selection are verified.
- `Combobox`:
    - Free-text vs option-selection flows are both covered.
- `MultiSelect`:
    - Multi-selection toggling, chip/tag remove keyboard flows, and clear actions are verified.
- `TagInput`:
    - Token creation/removal keyboard contracts are verified.
- `TreeSelect`:
    - Hierarchical expand/collapse and parent/child selection semantics are verified.

## Test Matrix Template

Use this matrix per component:

- Open/close contract: pass/fail + notes
- Focus and restore behavior: pass/fail + notes
- Keyboard navigation/selection: pass/fail + notes
- ARIA role/state wiring: pass/fail + notes
- Disabled/readonly behavior: pass/fail + notes
- Empty/loading/error states: pass/fail + notes

## Exit Criteria

- All shared interaction and ARIA checklist items pass.
- Component-specific additions pass.
- Unit tests cover keyboard and ARIA contracts for the component.
