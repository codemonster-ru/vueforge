# Stack

Arrange content vertically with consistent spacing, alignment, and wrap behavior.

## Import

```ts
import { Stack } from '@codemonster-ru/vueforge';
```

## Examples

Use `Stack` whenever elements should read top-to-bottom and spacing should stay token-driven instead of margin-driven.

### Basic

Use the default vertical flow for forms, settings groups, and card lists.

```vue
<template>
    <Stack gap="1rem">
        <Card>Profile</Card>
        <Card>Security</Card>
        <Card>Notifications</Card>
    </Stack>
</template>
```

### Alignment

Change `align` and `justify` when the children need shared vertical layout but non-default positioning.

```vue
<template>
    <Stack gap="0.5rem" align="center" justify="center" style="min-height: 12rem;">
        <Badge>Draft</Badge>
        <Chip label="Waiting for review" />
    </Stack>
</template>
```

### Semantic Section

Use `as` to keep layout and document structure in the same place.

```vue
<template>
    <Stack as="section" gap="0.75rem">
        <PageHeader title="Security" subtitle="Manage access and session settings." size="small" />
        <Card>Section content</Card>
    </Stack>
</template>
```

### Wrapped Vertical Flow

`wrap` is available for constrained or unusual layouts where a vertical flow may need multiple columns.

```vue
<template>
    <Stack gap="0.5rem" wrap="wrap" style="max-height: 10rem;">
        <Chip label="Alpha" />
        <Chip label="Beta" />
        <Chip label="Gamma" />
        <Chip label="Delta" />
    </Stack>
</template>
```

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

## Theming

- Override via `theme.overrides.components.stack`.

## Tokens

Component tokens (override via `theme.overrides.components.stack`):

- `gap`
- `alignItems`
- `justifyContent`
- `wrap`

## Recipes

- Use `Stack` as the default primitive for vertical composition instead of manual bottom margins.
- Keep `align="stretch"` for most form and card layouts; centered alignment is better for compact status blocks.
- Reach for `Stack` before introducing dedicated wrapper components whose only job is spacing.

## Accessibility

- `Stack` is a non-interactive layout primitive.
- Use semantic element mapping through `as` based on page structure.
