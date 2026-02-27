# Hover

## Purpose

Utility wrapper that exposes hover/focus interaction state with keyboard parity.

## Props

- `as?: string` (default `div`)
- `modelValue?: boolean` (optional controlled mode)
- `disabled?: boolean` (default `false`)
- `openDelay?: number` (default `0`)
- `closeDelay?: number` (default `0`)
- `ariaLabel?: string`

## Events

- `update:modelValue` (controlled mode)
- `change`

## Slots

- `default` scoped slot: `{ hovered, focused, active }`

## Example

```vue
<Hover v-slot="{ active }">
    <Card :class="{ 'is-elevated': active }">Hover or focus me</Card>
</Hover>
```

## Tokens

Component tokens (override via `theme.overrides.components.hover`):

- `disabledOpacity`

## Accessibility

- Keyboard parity: focus enters/leaves the same active lifecycle as pointer hover.
