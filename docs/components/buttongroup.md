# ButtonGroup

## Purpose

- Group related actions with shared spacing, sizing, and visual cohesion.
- Avoid inconsistent ad-hoc composition of adjacent action buttons.

## Props

- `size?: 'small' | 'normal' | 'large'` (inherits to nested `Button`/`SplitButton` when child props are not set)
- `variant?: 'filled' | 'outlined' | 'text'` (inherits to nested `Button`/`SplitButton`)
- `severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (inherits to nested `Button`/`SplitButton`)
- `disabled?: boolean` (default `false`)
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `attached?: boolean` (default `false`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - place `Button` / `SplitButton` items

## Examples

```vue
<ButtonGroup attached size="small" variant="outlined" severity="primary">
    <Button label="Day" />
    <Button label="Week" />
    <Button label="Month" />
</ButtonGroup>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.buttonGroup`):

- `gap`, `borderRadius`, `disabledOpacity`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Verify horizontal-to-wrap behavior on narrow screens.
- Ensure grouped controls keep usable tap targets and clear separation.

## SSR/Hydration

- Group wrapper is static; hydration should preserve child ordering and classes.
- Controlled active/disabled styles should not diverge on hydration.

## Testing

- Cover group orientation/size variants and mixed button states.
- Add visual regression tests for dense/outlined combinations.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
