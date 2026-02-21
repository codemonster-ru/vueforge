# Selection Family State Conventions

Scope: `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`.

This document defines the unified behavior contract for `active`, `selected`, and `disabled`/`readonly` states.

## Unified Contract

- `disabled`:
    - Control is non-interactive and does not open its popup/panel.
    - Selection/value mutation actions are blocked.
- `readonly`:
    - Control remains focusable.
    - Popup open/search and selection/value mutation actions are blocked.
    - Clear/remove actions are hidden or disabled.
- `selected`:
    - Selected options expose `aria-selected="true"` where listbox/tree roles apply.
    - Visual selected styling uses component selected/active classes.
- `active` (highlighted option):
    - Keyboard navigation updates one highlighted option at a time.
    - `aria-activedescendant` is synced for combobox-style controls.

## Component Matrix

| Component      | Selected state                             | Active highlight                             | Disabled behavior                  | Readonly behavior                  |
| -------------- | ------------------------------------------ | -------------------------------------------- | ---------------------------------- | ---------------------------------- |
| `Select`       | `aria-selected` + active class             | keyboard focus in options                    | blocked open/select/clear          | blocked open/select/clear          |
| `Autocomplete` | `aria-selected` + active class             | highlighted option + `aria-activedescendant` | blocked open/search/select         | blocked open/search/select         |
| `Combobox`     | `aria-selected` + active class             | highlighted option + `aria-activedescendant` | blocked open/search/select/create  | blocked open/search/select/create  |
| `MultiSelect`  | `aria-selected` + active class             | highlighted option                           | blocked open/search/toggle/remove  | blocked open/search/toggle/remove  |
| `TagInput`     | selected tags rendered as chips            | highlighted option                           | blocked open/search/token mutation | blocked open/search/token mutation |
| `TreeSelect`   | selected keys reflected by tree node state | tree keyboard navigation                     | blocked open/search/select         | blocked open/search/select         |
