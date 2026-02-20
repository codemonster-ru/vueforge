# SearchInput

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `debounce?: number` (default `300`)
- `loading?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Search input`)

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

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
