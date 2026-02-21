# Section

## Props

- `as?: string` (default `section`)
- `paddingY?: string` (optional runtime override)
- `background?: 'transparent' | 'surface' | 'muted' | 'elevated'` (default `transparent`)
- `bordered?: boolean` (default `false`)

## Events

- No emitted events.

## Slots

- `default`

## Examples

```vue
<Section background="surface" bordered>
    <Container size="xl">
        <PageHeader title="Projects" subtitle="Overview and team activity." />
    </Container>
</Section>

<Section as="main" background="muted" padding-y="4rem">
    <Container size="lg">
        <p>Main section content with custom vertical rhythm.</p>
    </Container>
</Section>
```

## Composition with Container

- Use `Section` for vertical rhythm and background/border separation.
- Use nested `Container` to control content width and horizontal gutters.

## Tokens

Component tokens (override via `theme.overrides.components.section`):

- `paddingY`, `paddingYSm`, `paddingYLg`
- `backgroundColorSurface`, `backgroundColorMuted`, `backgroundColorElevated`
- `borderColor`

## Accessibility

- `Section` is non-interactive and keeps semantics through `as`.
- Prefer semantic landmarks intentionally (`section`, `main`, `article`) based on page structure.
