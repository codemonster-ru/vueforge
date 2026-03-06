# Input Shared Props Matrix

This page documents the baseline prop contract shared across the core text-input family.

## Scope

These shared props apply across `Input`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `MaskedInput`, `MentionInput`, and `OtpInput`.

## Examples

### Form-Wide Size And Variant

Keep `size` and `variant` aligned when mixed input controls appear in the same form section.

```vue
<div style="display: grid; gap: 0.75rem;">
    <Input size="large" variant="outlined" placeholder="Name" />
    <PasswordInput size="large" variant="outlined" placeholder="Password" />
    <SearchInput size="large" variant="outlined" placeholder="Search users" />
</div>
```

### Disabled Lock State

Use `disabled` when the control should leave the tab order and block all interaction.

```vue
<Input disabled model-value="Archived value" />
```

### Readonly Review State

Use `readonly` when the current value should remain focusable and selectable but not editable.

```vue
<Textarea readonly model-value="Generated release notes" />
```

## Matrix

| Component | `size` | `variant` | `disabled` | `readonly` | Notes |
| --- | --- | --- | --- | --- | --- |
| `Input` | yes | yes | yes | yes | Text input baseline. |
| `Textarea` | yes | yes | yes | yes | Multiline text control. |
| `NumberInput` | yes | yes | yes | yes | Step controls are also blocked in `disabled` and `readonly`. |
| `PasswordInput` | yes | yes | yes | yes | Visibility toggle is disabled when the control is disabled. |
| `SearchInput` | yes | yes | yes | yes | Search and clear actions are blocked in `disabled` and `readonly`. |
| `MaskedInput` | yes | yes | yes | yes | Masking still follows disabled and readonly semantics. |
| `MentionInput` | yes | yes | yes | yes | Suggestion panel does not open when disabled or readonly. |
| `OtpInput` | yes | yes | yes | yes | Cell editing and backspace mutation are blocked in readonly mode. |

## Guidance

- Keep these four props aligned across mixed input rows unless there is a strong product reason not to.
- At the form level, choose `disabled` versus `readonly` intentionally based on expected focus and tab behavior.
- Use shared help, error, and description patterns consistently across the family.

## Theming

This is a family-level reference page. Theme overrides still apply per concrete component, not at a shared input-family key.

## Accessibility

- Keep `disabled` and `readonly` semantics consistent within a form so keyboard behavior remains predictable.
- Pair shared states with consistent `aria-invalid` and `aria-describedby` usage across the family.
