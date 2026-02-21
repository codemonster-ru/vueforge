# Container

## Props

- `as?: string` (default `div`)
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` (default `lg`)
- `maxWidth?: string` (optional runtime override)
- `paddingX?: string` (optional runtime override)

## Events

- No emitted events.

## Slots

- `default`

## Examples

```vue
<Container size="xl">
    <PageHeader title="Projects" subtitle="Manage active projects and team workload." />
</Container>
<Container as="main" max-width="90rem" padding-x="2rem">
    <div>Custom width and horizontal padding</div>
</Container>
```

## Theming

- Override via `theme.overrides.components.container`.

## Tokens

Component tokens (override via `theme.overrides.components.container`):

- `maxWidth`, `maxWidthSm`, `maxWidthMd`, `maxWidthLg`, `maxWidthXl`
- `paddingX`, `paddingXSm`, `paddingXLg`

## Recipes

- Page shell: `Container as="main" size="xl"` for top-level content width.
- Wide workspace: `size="full"` with custom `max-width` and `padding-x` for dashboards.

## Accessibility

- `Container` is a layout wrapper and does not add interactive behavior.
- Use semantic tags through `as` (for example `main`, `section`) to improve landmark structure.
