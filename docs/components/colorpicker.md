# ColorPicker

## Props

- `modelValue?: string` (v-model)
- `format?: 'hex' | 'rgb' | 'hsl'` (default `hex`)
- `alpha?: boolean` (default `false`)
- `presets?: string[]` (default `[]`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Color picker`)

## Events

- `update:modelValue`
- `change`
- `open`
- `close`

## Slots

- This component does not expose named slots.

## Examples

```vue
<ColorPicker v-model="brandColor" />
<ColorPicker v-model="brandColorRgba" format="rgb" alpha variant="outlined" />
```

## Tokens

Component tokens (override via `theme.overrides.components.colorPicker`):

- `minWidth`, `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `swatchSize`, `swatchRadius`
- `panelPadding`, `panelBorderColor`, `panelBackgroundColor`, `panelShadow`, `panelGap`
- `rangeAccentColor`
- `presetSize`, `presetRadius`, `presetBorderColor`, `presetHoverBorderColor`
- `small.padding`, `small.fontSize`, `small.swatchSize`, `small.presetSize`
- `large.padding`, `large.fontSize`, `large.swatchSize`, `large.presetSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
