# TagInput

## Purpose

Enable fast option discovery and selection for forms, filters, and table toolbars.
Cover both small curated lists and async/large datasets with consistent selection semantics.

## Props

- `modelValue?: Array<string | number>` (v-model)
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
- `allowCustom?: boolean` (default `true`)
- `maxTags?: number`
- `clearable?: boolean` (default `false`)
- `validateTag?: (value: string) => boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `search`
- `add` (payload: `{ value: string | number; source: 'option' | 'custom' }`)
- `remove`
- `reject` (payload: `{ reason: 'duplicate' | 'maxTags' | 'invalid' | 'readonly'; value: string }`)
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<TagInput v-model="skills" :options="skillOptions" placeholder="Add skills" clearable />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.taginput`):

- `minWidth`, `minHeight`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `inputMinWidth`
- `chipGap`, `chipPadding`, `chipRadius`, `chipBackgroundColor`, `chipTextColor`, `chipFontSize`
- `chipRemoveSize`, `chipRemoveRadius`, `chipRemoveHoverBackgroundColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.chipPadding`, `small.chipFontSize`
- `large.fontSize`, `large.padding`, `large.chipPadding`, `large.chipFontSize`

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

- Keyboard token creation is supported by `Enter`, `Tab`, and comma (`,`).
- Keyboard token removal is supported via `Backspace` when query is empty.
- Chip remove buttons and `clearable` action provide explicit removal flows.
- In `readonly` mode, token mutation and open/search interactions are blocked.
