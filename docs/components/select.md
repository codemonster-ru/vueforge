# Select

## Purpose

Enable fast option discovery and selection for forms, filters, and table toolbars.
Cover both small curated lists and async/large datasets with consistent selection semantics.

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Override via `theme.overrides.components.select`.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify popup width, option density, and chip/tag wrapping on mobile and tablet breakpoints.
Ensure touch hit targets and scroll behavior remain stable in long option lists.

## SSR/Hydration

Render initial value and selected option state deterministically in SSR output.
Defer async option fetching and client-only positioning logic until after hydration.

## Testing

Cover keyboard navigation, selection, clear/reset flows, and disabled/readonly states.
Add tests for filtering/search behavior, async loading states, and ARIA combobox/listbox contracts.

## Accessibility

- Trigger exposes popup semantics via `aria-expanded`, `aria-controls`, and `aria-haspopup="listbox"`.
- Keyboard support: `ArrowDown`/`ArrowUp` open and navigate options, `Enter`/`Space` select, `Escape` closes.
- Options are exposed as `role="option"` within `role="listbox"` panel and sync selected state via `aria-selected`.
- `clearable` renders a keyboard-accessible clear button for resetting selection.
- In `readonly` mode, open/select/clear interactions are blocked.
