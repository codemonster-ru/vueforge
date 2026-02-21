# Select

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `clearLabel?: string` (default `Clear selection`)
- `ariaLabel?: string` (default `Select option`)
- `panelAriaLabel?: string` (default `Options`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Select v-model="role" :options="roles" placeholder="Choose role" />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Tokens

Override via `theme.overrides.components.select`.

## Accessibility

- Trigger exposes popup semantics via `aria-expanded`, `aria-controls`, and `aria-haspopup="listbox"`.
- Keyboard support: `ArrowDown`/`ArrowUp` open and navigate options, `Enter`/`Space` select, `Escape` closes.
- Options are exposed as `role="option"` within `role="listbox"` panel and sync selected state via `aria-selected`.
- `clearable` renders a keyboard-accessible clear button for resetting selection.
- In `readonly` mode, open/select/clear interactions are blocked.
