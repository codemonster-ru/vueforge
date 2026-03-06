# Inline

Arrange content horizontally with controlled gaps, alignment, and wrapping.

## Import

```ts
import { Inline } from '@codemonster-ru/vueforge';
```

## Examples

Use `Inline` for rows of controls, chips, badges, and compact metadata where horizontal flow matters.

### Basic

Use the default wrapping row for chip collections and compact metadata groups.

```vue
<template>
    <Inline gap="0.5rem">
        <Chip label="Frontend" />
        <Chip label="Backend" />
        <Chip label="Design" />
    </Inline>
</template>
```

### Toolbar Row

Use `justify="space-between"` and `wrap="nowrap"` for toolbar-like layouts with left and right regions.

```vue
<template>
    <Inline align="center" justify="space-between" wrap="nowrap">
        <span>Status</span>
        <Badge severity="success">Healthy</Badge>
    </Inline>
</template>
```

### Wrapping Actions

Allow wrapping when action groups must stay usable on smaller widths.

```vue
<template>
    <Inline gap="0.75rem" wrap="wrap">
        <Button label="Export" variant="outlined" />
        <Button label="Archive" severity="secondary" />
        <Button label="Create report" />
    </Inline>
</template>
```

### Semantic Row

Use `as` when the inline row should also define a semantic region.

```vue
<template>
    <Inline as="section" gap="0.5rem" align="center">
        <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Projects', active: true }]" />
    </Inline>
</template>
```

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

## Theming

- Override via `theme.overrides.components.inline`.

## Tokens

Component tokens (override via `theme.overrides.components.inline`):

- `gap`
- `alignItems`
- `justifyContent`
- `wrap`

## Recipes

- Use `Inline` for horizontal composition instead of sprinkling left/right margins across children.
- Prefer wrapping rows by default; reserve `nowrap` for compact toolbars where clipping is unacceptable.
- Combine `Inline` and `Stack` instead of introducing one-off CSS wrappers for every header or control row.

## Accessibility

- `Inline` is a non-interactive layout primitive.
- Use semantic element mapping through `as` when appropriate.
