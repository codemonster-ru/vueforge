# MultiSelect

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

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Keyboard support includes open/navigation/select via `ArrowDown`/`ArrowUp`/`Enter` and close via `Escape`.
- Selected values are shown as chips in the trigger and can be removed individually.
- `Backspace` on the trigger removes the last selected item.
- `clearable` provides a keyboard-accessible action to clear all selected items.
- In `readonly` mode, panel open/search and selection mutation interactions are blocked.
