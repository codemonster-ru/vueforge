# Combobox

## Props

- `modelValue?: string | number` (v-model selected value)
- `inputValue?: string` (v-model:inputValue typed query)
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
- `strict?: boolean` (default `true`)
- `allowCreate?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `ariaLabel?: string` (default `Combobox input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `update:inputValue`
- `change`
- `search`
- `create`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Combobox v-model="countryId" v-model:inputValue="countryQuery" :options="countries" placeholder="Pick country" />
```

More recipes: [`Selection Patterns`](selection-patterns.md).

## Tokens

Component tokens (override via `theme.overrides.components.combobox`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Input uses combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Keyboard support: `ArrowDown`/`ArrowUp` navigate highlighted option, `Enter` selects highlighted option or commits custom value according to `strict`/`allowCreate`, `Escape` closes panel.
- In `readonly` mode, search/open interactions are blocked.
