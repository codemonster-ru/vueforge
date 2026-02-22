# Stack

## Purpose

- Compose vertical flows (forms, sidebars, settings groups) with consistent gaps and alignment.
- Replace ad-hoc margin spacing with predictable layout primitives.

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

## Responsive

- Verify gap and alignment behavior under compact mobile widths.
- Ensure nested stacks preserve spacing without cumulative overflow.

## SSR/Hydration

- Stack is non-interactive and should hydrate to identical structure and styles.
- Confirm token-driven spacing is stable between server and client.

## Testing

- Test direction/alignment/gap variants and nested stack composition.
- Add viewport checks to ensure child content remains readable on small screens.

## Accessibility

- `Stack` is a non-interactive layout primitive.
- Use semantic element mapping through `as` based on page structure.
