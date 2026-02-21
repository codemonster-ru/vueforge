# Autocomplete

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `ariaLabel?: string` (default `Autocomplete input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
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
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Input uses combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Options panel uses `role="listbox"` and options use `role="option"` with selected/highlighted state sync.
- Keyboard support: `ArrowDown`/`ArrowUp` navigate, `Enter` selects highlighted option, `Escape` closes panel.
- In `readonly` mode, panel open/search interactions are blocked.
