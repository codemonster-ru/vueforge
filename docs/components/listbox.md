# Listbox

## Purpose

Provide an always-visible option list control for single or multiple selection with keyboard-first navigation and grouped options.

## Props

- `modelValue?: string | number | Array<string | number>`
- `options?: Array<ListboxOption | ListboxOptionGroup>`
- `multiple?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Listbox`)
- `emptyText?: string` (default `No options`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- `option` - custom option rendering (`{ option, selected, highlighted }`)
- `empty`

## Examples

```vue
<Listbox v-model="value" :options="options" />
```

```vue
<Listbox
    v-model="values"
    :options="[
        {
            label: 'Public',
            options: [
                { label: 'Read', value: 'read' },
                { label: 'Comment', value: 'comment' },
            ],
        },
        { label: 'Admin', options: [{ label: 'Write', value: 'write' }] },
    ]"
    multiple
/>
```

## Theming

- Override via `theme.overrides.components.listbox`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `minHeight`, `maxHeight`
- `focusRingShadow`, `focusBorderColor`
- `groupGapTop`, `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`
- `optionPadding`, `optionBorderRadius`, `optionHighlightedBackgroundColor`, `optionSelectedBackgroundColor`, `optionSelectedTextColor`
- `emptyPadding`, `emptyColor`, `disabledOpacity`
- `small.optionPadding`, `small.fontSize`
- `large.optionPadding`, `large.fontSize`

## Recipes

- Use grouped options for permission matrices, taxonomy pickers, and settings breakdowns.
- Use `multiple` mode where explicit persistent selection is needed without popup controls.

## Accessibility

- Root uses `role="listbox"`; options use `role="option"` and synchronize `aria-selected`.
- Supports `ArrowUp`/`ArrowDown`, `Home`/`End`, and `Enter`/`Space` for selection.
- Multi-select mode sets `aria-multiselectable="true"`.

## Responsive

- Keep option labels concise for narrow viewports and rely on scroll in long lists.
- Prefer grouped data only when group labels add clear semantic value on mobile screens.

## SSR/Hydration

- List structure is deterministic from `options` and selection props; hydration-safe with no client-only branching.

## Testing

- Cover single/multi selection, grouped rendering, keyboard navigation behavior, and ARIA listbox semantics.
