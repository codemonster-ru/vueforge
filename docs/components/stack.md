# Stack

## Props

- `as?: string` (default `div`)
- `gap?: string` (optional runtime override)
- `align?: 'start' | 'center' | 'end' | 'stretch'` (default `stretch`)
- `justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'` (default `start`)
- `wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'` (default `nowrap`)

## Events

- No emitted events.

## Slots

- `default`

## Examples

```vue
<Stack gap="1rem">
    <Card>Profile</Card>
    <Card>Security</Card>
    <Card>Notifications</Card>
</Stack>

<Stack as="section" gap="0.5rem" align="center" justify="space-between">
    <Button label="Save" />
    <Button label="Cancel" variant="outlined" />
</Stack>
```

## Theming

- Override via `theme.overrides.components.stack`.

## Tokens

Component tokens (override via `theme.overrides.components.stack`):

- `gap`
- `alignItems`
- `justifyContent`
- `wrap`

## Recipes

- Vertical form layout: `gap="0.75rem"` and `as="section"` for grouped fields.
- Card list: `gap="1rem"` with default `align="stretch"` for equal-width stacked cards.

## Accessibility

- `Stack` is a non-interactive layout primitive.
- Use semantic element mapping through `as` based on page structure.
