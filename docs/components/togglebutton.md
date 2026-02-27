# ToggleButton

## Purpose

Binary action control for on/off state, separate from segmented option selection.

## Props

- `modelValue?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined' | 'text'` (default `filled`)
- `label?: string`
- `onLabel?: string`
- `offLabel?: string`
- `icon?: string`
- `onIcon?: string`
- `offIcon?: string`
- `ariaLabel?: string`
- `ariaLabelOn?: string`
- `ariaLabelOff?: string`

## Events

- `update:modelValue`
- `change`

## Example

```vue
<ToggleButton v-model="pinned" on-label="Pinned" off-label="Pin" on-icon="pin" off-icon="pinSlash" />
```

## Tokens

Component tokens (override via `theme.overrides.components.toggleButton`):

- `fontSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`
- `activeBorderColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`, `iconGap`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Accessibility

- Exposes `aria-pressed` for toggle state.
- Use `ariaLabelOn` / `ariaLabelOff` when visual text is ambiguous.
