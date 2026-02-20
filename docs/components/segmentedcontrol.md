# SegmentedControl

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>` (default `[]`)
- `disabled?: boolean`
- `fullWidth?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<SegmentedControl
    v-model="view"
    :options="[
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
        { label: 'Board', value: 'board' },
    ]"
/>
```

## Tokens

Component tokens (override via `theme.overrides.components.segmentedControl`):

- `fontSize`, `padding`, `gap`
- `borderRadius`, `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`
- `segmentPadding`, `segmentRadius`, `segmentFontWeight`
- `small.fontSize`, `small.padding`, `small.segmentPadding`
- `large.fontSize`, `large.padding`, `large.segmentPadding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
