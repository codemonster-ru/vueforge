# Rating

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: number` (v-model)
- `max?: number` (default `5`)
- `allowHalf?: boolean` (default `false`)
- `precision?: number` (optional, `0 < precision <= 1`)
- `clearable?: boolean` (default `false`)
- `readonly?: boolean`
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Rating v-model="score" />
<Rating v-model="score" allow-half size="large" />
<Rating :model-value="3.7" precision="0.1" readonly />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.rating`):

- `gap`, `size`, `color`, `activeColor`, `hoverColor`
- `focusRingShadow`, `focusRadius`, `disabledOpacity`
- `small.size`
- `large.size`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.
- Use `precision` for review displays (`readonly`) where half steps are not enough (for example `3.7`).
- Use `clearable` for form flows that allow removing a previously selected score from keyboard (`Delete`/`Backspace`) or repeated click.

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

- Keyboard support:
    - `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown` adjust value by `precision` step.
    - `Home` sets `0`, `End` sets max.
    - number keys (`0`-`9`) jump to rating value.
    - `Delete` / `Backspace` clears value when `clearable`.
- Horizontal arrows respect RTL direction.
