# Divider

## Props

- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `variant?: 'solid' | 'dashed' | 'dotted'` (default `solid`)
- `inset?: boolean` (default `false`)
- `label?: string`
- `ariaLabel?: string` (default `Divider`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` (optional) - custom label content (horizontal mode only)

## Examples

```vue
<Divider />
<Divider label="OR" />
<div style="height: 32px; display: flex; align-items: center; gap: 8px">
    <span>Left</span>
    <Divider orientation="vertical" />
    <span>Right</span>
</div>
```

## Theming

- Override via `theme.overrides.components.divider`.

## Tokens

Component tokens (override via `theme.overrides.components.divider`):

- `color`, `textColor`, `thickness`, `minLength`
- `gap`, `inset`
- `labelPadding`, `labelFontSize`

## Recipes

- Horizontal section separator between content groups.
- Centered label separator (`label="OR"`) for auth/social blocks.
- Vertical separator inside compact inline toolbars.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
