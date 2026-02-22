# Progress

## Purpose

- Visualize determinate/indeterminate progress for uploads, jobs, and long-running tasks.
- Surface task advancement in a compact, reusable primitive.

## Props

- `value?: number` (0-100; omit for indeterminate)
- `variant?: 'linear' | 'circular'` (default `linear`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `label?: string`
- `showValue?: boolean` (default `false`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `ariaLabel?: string`

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<Progress :value="64" />
<Progress variant="circular" :value="42" size="small" />
<Progress variant="linear" severity="success" showValue :value="85" />
<Progress variant="linear" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.progress`):

- `width`, `height`, `borderRadius`
- `backgroundColor`, `barColor`
- `labelColor`, `labelFontSize`, `gap`
- `circularSize`, `circularThickness`
- `animationDuration`
- `info.barColor`, `success.barColor`, `warn.barColor`, `danger.barColor`
- `small.height`, `small.labelFontSize`, `small.circularSize`, `small.circularThickness`
- `large.height`, `large.labelFontSize`, `large.circularSize`, `large.circularThickness`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Validate bar thickness/label readability on small viewports.
- Ensure progress components scale in narrow containers and cards.

## SSR/Hydration

- Initial value/indeterminate mode must be consistent across server and client.
- Animated transitions should start after hydration without structure changes.

## Testing

- Cover min/max/value clamping, indeterminate mode, and ARIA progress semantics.
- Add regression tests for label formatting and variant rendering.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
