# Section

Define vertical page bands with consistent spacing, optional backgrounds, and border separation.

## Import

```ts
import { Section } from '@codemonster-ru/vueforge';
```

## Examples

Use `Section` for vertical rhythm and page banding. It is usually paired with `Container` inside.

### Basic

Use the default transparent section to separate logical page blocks without changing the page surface.

```vue
<template>
    <Section>
        <Container>
            <p>Default section content</p>
        </Container>
    </Section>
</template>
```

### Background Variants

Switch backgrounds to create alternating page bands or emphasize a specific block.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Section background="surface"><Container><Card>Surface section</Card></Container></Section>
        <Section background="muted"><Container><Card>Muted section</Card></Container></Section>
        <Section background="elevated"><Container><Card>Elevated section</Card></Container></Section>
    </div>
</template>
```

### Bordered

Use `bordered` when adjacent sections need a stronger visual boundary.

```vue
<template>
    <Section background="surface" bordered>
        <Container>
            <PageHeader title="Projects" subtitle="Overview and team activity." />
        </Container>
    </Section>
</template>
```

### Semantic Main Section

Use `as="main"` when a section should also define the main landmark for the current page view.

```vue
<template>
    <Section as="main" background="muted" padding-y="4rem">
        <Container size="lg">
            <p>Main section content with custom vertical rhythm.</p>
        </Container>
    </Section>
</template>
```

## Props

- `as?: string` (default `section`)
- `paddingY?: string` (optional runtime override)
- `background?: 'transparent' | 'surface' | 'muted' | 'elevated'` (default `transparent`)
- `bordered?: boolean` (default `false`)

## Events

- No emitted events.

## Slots

- `default`

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

- Alternate `surface` and `muted` backgrounds to build readable long-form settings and dashboard pages.
- Use `paddingY` overrides sparingly for hero bands or unusually dense admin sections.
- Keep `Section` responsible for page rhythm and leave width constraints to `Container`.

## Accessibility

- `Section` is non-interactive and keeps semantics through `as`.
- Prefer semantic landmarks intentionally (`section`, `main`, `article`) based on page structure.
