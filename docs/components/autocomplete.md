# Autocomplete

## Purpose

Enable fast option discovery and selection for forms, filters, and table toolbars.
Cover both small curated lists and async/large datasets with consistent selection semantics.

## Props

- `modelValue?: string | number | Array<string | number>` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean } | { label: string; items: Array<...> }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `optionGroupLabel?: string` (default `label`)
- `optionGroupChildren?: string` (default `items`)
- `grouped?: boolean` (default `false`)
- `groupBy?: string | ((option) => string)` (default `undefined`)
- `multiple?: boolean` (default `false`)
- `removeChipLabel?: string` (default `Remove item`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `virtual?: boolean` (default `false`)
- `virtualItemHeight?: number` (default `36`)
- `virtualOverscan?: number` (default `4`)
- `virtualThreshold?: number` (default `100`)
- `loadMoreOffset?: number` (default `3`)
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
- `loadMore` (`{ query, visibleEndIndex, total }`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
<Autocomplete v-model="tags" :options="users" multiple placeholder="Add users" />
<Autocomplete v-model="city" :options="groupedCities" grouped />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Override via `theme.overrides.components.autocomplete`:

- Core: `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`
- Panel/options: `panel*`, `option*`, `empty*`, `loading*`
- Multiple chips: `chipGap`, `chipPadding`, `chipRadius`, `chipBackgroundColor`, `chipTextColor`, `chipFontSize`
- Group labels: `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`, `groupLabelFontWeight`

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
Add tests for filtering/search behavior, async loading states, virtualized rendering windows, `loadMore` handoff, and ARIA combobox/listbox contracts.

## Accessibility

- Input uses combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Options panel uses `role="listbox"` and options use `role="option"` with selected/highlighted state sync.
- Keyboard support: `ArrowDown`/`ArrowUp` navigate, `Enter` selects highlighted option, `Escape` closes panel.
- In `multiple` mode, selected values are rendered as chips and `Backspace` removes the last chip when query is empty.
- In `readonly` mode, panel open/search interactions are blocked.
