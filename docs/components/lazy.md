# Lazy

## Purpose

Deferred mount/render wrapper for heavy subtree content.

## Props

- `as?: string` (default `div`)
- `when?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `eager?: boolean` (default `false`) - render immediately, bypass observer
- `once?: boolean` (default `true`) - keep mounted after first visibility trigger
- `delay?: number` (default `0`) - defer mount after visibility
- `rootMargin?: string` (default `200px`)
- `threshold?: number` (default `0`)
- `placeholderTag?: string` (default `div`)
- `ariaLabel?: string`

## Events

- `enter`
- `leave` (only when `once=false` and content becomes non-visible)

## Slots

- `default`
- `placeholder`

## Example

```vue
<Lazy :once="true" root-margin="250px">
    <HeavyChart />
    <template #placeholder>
        <Skeleton height="220px" />
    </template>
</Lazy>
```

## Tokens

Override via `theme.overrides.components.lazy`:

- `placeholderMinHeight`
- `placeholderBorderRadius`
- `placeholderBackgroundColor`
- `disabledOpacity`

## Notes

- Falls back to immediate mount when `IntersectionObserver` is unavailable.
- `when=false` always suppresses rendered content.
