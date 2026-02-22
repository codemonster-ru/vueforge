# Slider

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: number | [number, number]` (v-model)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `step?: number` (default `1`)
- `range?: boolean` (default `false`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showValue?: boolean` (default `false`)
- `marks?: Array<{ value: number; label?: string }>`

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
<Slider v-model="priceRange" :min="0" :max="1000" :step="10" range />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.slider`):

- `width`, `gap`
- `textColor`
- `trackHeight`, `trackBackgroundColor`, `trackRadius`, `fillBackgroundColor`
- `thumbSize`, `thumbColor`, `thumbBorderColor`, `thumbBorderWidth`, `thumbShadow`
- `focusRingShadow`, `disabledOpacity`
- `markSize`, `markColor`, `markLabelFontSize`, `markLabelColor`, `marksHeight`
- `valueFontSize`, `valueColor`
- `small.trackHeight`, `small.thumbSize`, `small.valueFontSize`
- `large.trackHeight`, `large.thumbSize`, `large.valueFontSize`

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
