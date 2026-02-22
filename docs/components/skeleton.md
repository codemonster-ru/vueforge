# Skeleton

## Purpose

- Provide loading placeholders that preserve layout during async data fetches.
- Reduce perceived latency and prevent content jumps.

## Props

- `width?: string | number`
- `height?: string | number`
- `variant?: 'text' | 'rect' | 'circle'` (default `text`)
- `animated?: boolean` (default `true`)

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<Skeleton width="240px" height="14px" />
<Skeleton width="180px" height="14px" />
<Skeleton variant="circle" width="48" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Verify skeleton dimensions adapt to container breakpoints and density presets.
- Ensure placeholder grids/lists remain aligned on small screens.

## SSR/Hydration

- SSR should render consistent placeholder structure for loading paths.
- Client transition from skeleton to content must avoid hydration warnings.

## Testing

- Cover shape/animation variants and accessibility expectations for loading semantics.
- Add visual regression tests for common list/card/table skeleton patterns.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
