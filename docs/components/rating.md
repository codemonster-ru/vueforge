# Rating

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: number` (v-model)
- `max?: number` (default `5`)
- `allowHalf?: boolean` (default `false`)
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
