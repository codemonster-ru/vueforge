# Container

Constrain content width and horizontal gutters for pages, dashboards, and dense CRUD layouts.

## Import

```ts
import { Container } from '@codemonster-ru/vueforge';
```

## Examples

Use `Container` as the outer width contract for page content. It works best when other layout primitives live inside it.

### Basic

Use the default width preset for standard application pages.

```vue
<template>
    <Container>
        <PageHeader title="Projects" subtitle="Manage active projects and team workload." />
    </Container>
</template>
```

### Size Presets

Switch between width presets to match detail pages, dashboards, or reading surfaces.

```vue
<template>
    <div style="display: grid; gap: 1rem;">
        <Container size="sm"><Card>Small reading width</Card></Container>
        <Container size="md"><Card>Medium form width</Card></Container>
        <Container size="xl"><Card>Wide dashboard width</Card></Container>
        <Container size="full"><Card>Full-width workspace</Card></Container>
    </div>
</template>
```

### Semantic Element

Use `as` when the wrapper should also define a document landmark.

```vue
<template>
    <Container as="main" size="xl">
        <Section>
            <p>Main page content</p>
        </Section>
    </Container>
</template>
```

### Custom Width And Padding

Use runtime overrides for product-specific shells without replacing the base container primitive.

```vue
<template>
    <Container max-width="90rem" padding-x="2rem">
        <Card>Custom workspace width and gutters</Card>
    </Container>
</template>
```

## Props

- `as?: string` (default `div`)
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` (default `lg`)
- `maxWidth?: string` (optional runtime override)
- `paddingX?: string` (optional runtime override)

## Events

- No emitted events.

## Slots

- `default`

## Theming

- Override via `theme.overrides.components.container`.

## Tokens

Component tokens (override via `theme.overrides.components.container`):

- `maxWidth`, `maxWidthSm`, `maxWidthMd`, `maxWidthLg`, `maxWidthXl`
- `paddingX`, `paddingXSm`, `paddingXLg`

## Recipes

- Use `Container as="main"` for top-level page content so width and landmark semantics stay together.
- Prefer size presets first; reach for `maxWidth` only when the product shell has a specific hard requirement.
- Pair `Container` with `Section` to separate vertical rhythm from horizontal width control.

## Accessibility

- `Container` is a layout wrapper and does not add interactive behavior.
- Use semantic tags through `as` (for example `main`, `section`) to improve landmark structure.
