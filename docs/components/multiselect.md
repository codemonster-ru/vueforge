# MultiSelect

## Purpose

Enable fast option discovery and selection for forms, filters, and table toolbars.
Cover both small curated lists and async/large datasets with consistent selection semantics.

## Props

- `modelValue?: Array<string | number>` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `searchPlaceholder?: string` (default `Search...`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `search`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<MultiSelect v-model="countries" :options="countryOptions" placeholder="Select countries" clearable />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

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

- Keyboard support includes open/navigation/select via `ArrowDown`/`ArrowUp`/`Enter` and close via `Escape`.
- Selected values are shown as chips in the trigger and can be removed individually.
- `Backspace` on the trigger removes the last selected item.
- `clearable` provides a keyboard-accessible action to clear all selected items.
- In `readonly` mode, panel open/search and selection mutation interactions are blocked.
