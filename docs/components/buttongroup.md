# ButtonGroup

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

## Tokens

Component tokens (override via `theme.overrides.components.buttonGroup`):

- `gap`, `borderRadius`, `disabledOpacity`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
