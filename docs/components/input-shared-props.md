# Input Shared Props Matrix

Shared baseline props across the input family:

- `size`
- `variant`
- `disabled`
- `readonly`

## Matrix

| Component       | `size` | `variant` | `disabled` | `readonly` | Notes                                                               |
| --------------- | ------ | --------- | ---------- | ---------- | ------------------------------------------------------------------- |
| `Input`         | yes    | yes       | yes        | yes        | Text input baseline.                                                |
| `Textarea`      | yes    | yes       | yes        | yes        | Multiline text control.                                             |
| `NumberInput`   | yes    | yes       | yes        | yes        | Step controls are also blocked in `disabled`/`readonly`.            |
| `PasswordInput` | yes    | yes       | yes        | yes        | Visibility toggle is disabled when control is disabled.             |
| `SearchInput`   | yes    | yes       | yes        | yes        | Search/clear actions are blocked in `disabled`/`readonly`.          |
| `MaskedInput`   | yes    | yes       | yes        | yes        | Masking runs on input while respecting disabled/readonly semantics. |
| `MentionInput`  | yes    | yes       | yes        | yes        | Suggestion panel does not open when disabled/readonly.              |
| `OtpInput`      | yes    | yes       | yes        | yes        | Cell editing and backspace mutations are blocked in readonly mode.  |

## Guidance

- Prefer keeping these four props aligned when composing mixed input UIs.
- For form-level lock states, set both `disabled` and `readonly` intentionally based on expected tab/focus behavior.
- For consistency, use the same `size` and `variant` in grouped controls unless there is a specific visual hierarchy reason.

## Theming

- Family-level guidance only; theme overrides are applied per concrete input component.

## Accessibility

- Keep `disabled` and `readonly` semantics consistent within a form so keyboard/tab behavior remains predictable.
- Use shared error/help patterns (`aria-invalid`, `aria-describedby`) consistently across the family.
