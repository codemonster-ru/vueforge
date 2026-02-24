# Knob

## Purpose

Provide a radial input control for compact value adjustment (audio, brightness, thresholds, and circular dashboards).

## Props

- `modelValue?: number` (v-model)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `step?: number` (default `1`)
- `size?: number` (default `120`)
- `strokeWidth?: number` (default `10`)
- `showValue?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `ariaLabel?: string` (default `Knob`)

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
<Knob v-model="volume" :min="0" :max="100" :step="1" show-value aria-label="Volume" />
```

## Theming

- Override via `theme.overrides.components.knob`.

## Tokens

- `trackColor`, `fillColor`
- `thumbColor`, `thumbBorderColor`
- `valueFontSize`, `valueColor`, `textColor`
- `focusRingShadow`, `disabledOpacity`

## Recipes

- Audio/media control dial.
- Compact KPI threshold controls in settings panels.

## Accessibility

- Exposes slider semantics (`role="slider"`) with `aria-valuemin/max/now`.
- Keyboard support: `Arrow`, `Home`, `End`, `PageUp`, `PageDown`.

## Responsive

- Prefer larger `size` values for touch-heavy views.
- Keep value text visible (`showValue`) when precise value confirmation is required.

## SSR/Hydration

- Deterministic initial render from numeric props.
- Pointer interactions are client-only and hydration-safe.

## Testing

- Cover keyboard value changes, pointer dragging, disabled/readonly guards, and ARIA value semantics.
