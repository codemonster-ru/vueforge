# Section

## Purpose

- Define vertical page sections with consistent spacing and optional heading metadata.
- Compose dashboards/settings pages into readable content blocks.

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

## Theming

- Override via `theme.overrides.components.section`.

## Tokens

Component tokens (override via `theme.overrides.components.section`):

- `paddingY`, `paddingYSm`, `paddingYLg`
- `backgroundColorSurface`, `backgroundColorMuted`, `backgroundColorElevated`
- `borderColor`

## Recipes

- Alternating page bands: alternate `background="surface"` and `background="muted"` between sections.
- Hero section: `as="main"` with larger `padding-y` and nested `Container` for readable width.

## Responsive

- Verify section spacing scales correctly across breakpoints and density modes.
- Ensure heading/subtitle wrapping does not break layout on small screens.

## SSR/Hydration

- Section is render-only and should hydrate without interactive deltas.
- Confirm semantic tag output is identical between server and client.

## Testing

- Test spacing variants, heading slot rendering, and semantic tag output.
- Add snapshot coverage for compact and comfortable spacing combinations.

## Accessibility

- `Section` is non-interactive and keeps semantics through `as`.
- Prefer semantic landmarks intentionally (`section`, `main`, `article`) based on page structure.
