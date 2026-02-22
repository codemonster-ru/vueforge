# ColorPicker

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

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

## Theming

- Override via theme component overrides for each component documented on this page.

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

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify control affordances, panel sizing, and gesture/mouse interactions across device classes.
Ensure compact layouts preserve clarity for actions, handles, and contextual hints.

## SSR/Hydration

Keep initial value and panel-closed/base state stable between server and client output.
Hydrate client-only interaction engines (editor, drag, command layers) without DOM mismatch.

## Testing

Cover core interaction loops, boundary conditions, and value/state synchronization.
Add accessibility tests for keyboard alternatives, labelling, and focus behavior.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
