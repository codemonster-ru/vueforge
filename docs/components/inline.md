# Inline

## Props

- `as?: string` (default `div`)
- `gap?: string` (optional runtime override)
- `align?: 'start' | 'center' | 'end' | 'stretch'` (default `center`)
- `justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'` (default `start`)
- `wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'` (default `wrap`)

## Events

- No emitted events.

## Slots

- `default`

## Examples

```vue
<Inline gap="0.5rem">
    <Chip label="Frontend" />
    <Chip label="Backend" />
    <Chip label="Design" />
</Inline>

<Inline as="section" align="center" justify="space-between" wrap="nowrap">
    <span>Status</span>
    <Badge severity="success">Healthy</Badge>
</Inline>
```

## Theming

- Override via `theme.overrides.components.inline`.

## Tokens

Component tokens (override via `theme.overrides.components.inline`):

- `gap`
- `alignItems`
- `justifyContent`
- `wrap`

## Recipes

- Toolbar row: `wrap="nowrap"` with `justify="space-between"` for label/action alignment.
- Tag cloud: default `wrap="wrap"` and small `gap` for compact chip collections.

## Accessibility

- `Inline` is a non-interactive layout primitive.
- Use semantic element mapping through `as` when appropriate.
