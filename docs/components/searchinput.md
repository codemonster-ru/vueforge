# SearchInput

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `search`)
- `debounce?: number` (default `300`)
- `loading?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Search input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `search`
- `clear`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<SearchInput v-model="query" placeholder="Search..." clearable />
<SearchInput v-model="query" placeholder="Search..." :debounce="500" loading variant="outlined" />
```

## Tokens

Component tokens (override via `theme.overrides.components.searchInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `iconSize`, `iconColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `loadingSize`, `loadingBorderColor`, `loadingTopBorderColor`
- `small.fontSize`, `small.padding`, `small.iconSize`, `small.clearSize`
- `large.fontSize`, `large.padding`, `large.iconSize`, `large.clearSize`

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- `Enter` triggers immediate `search`, while normal typing uses debounce.
- Clear action is a keyboard-accessible button with `aria-label`.
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
