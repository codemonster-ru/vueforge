# Parallax

## Purpose

Decorative motion container with scroll-driven transform and reduced-motion compliance.

## Props

- `as?: string` (default `div`)
- `speed?: number` (default `0.2`)
- `axis?: 'x' | 'y'` (default `y`)
- `reverse?: boolean` (default `false`)
- `maxOffset?: number` (default `120`)
- `clamp?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `reducedMotion?: boolean | null` (default `null`, auto-detect mode)
- `ariaLabel?: string`

## Events

- `change({ offset })`

## Slots

- `default`

## Example

```vue
<Parallax :speed="0.25" :max-offset="140">
    <img src="/hero-layer.png" alt="" />
</Parallax>
```

## Reduced Motion

- Auto-disables motion when `data-vf-reduced-motion="true"` is present on `<html>`.
- Auto-disables motion when OS `prefers-reduced-motion: reduce` is active.
- Override via `reducedMotion` prop.

## Tokens

Override via `theme.overrides.components.parallax`:

- `overflow`
- `transformOrigin`
- `transition`
- `disabledOpacity`
