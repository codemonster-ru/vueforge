# Container

## Purpose

- Constrain page content width with predictable horizontal rhythm for dashboards and CRUD screens.
- Provide a semantic wrapper for layout without introducing interaction behavior.

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

## Responsive

- Validate width presets and custom overrides at mobile/tablet/desktop breakpoints.
- Ensure horizontal padding prevents edge collisions on narrow viewports.

## SSR/Hydration

- Output is static layout markup; no hydration state transitions are expected.
- Keep server and client width calculations token-driven to avoid layout shifts.

## Testing

- Cover size preset class/token application and custom maxWidth/paddingX overrides.
- Add responsive viewport checks for overflow prevention on narrow screens.

## Accessibility

- `Container` is a layout wrapper and does not add interactive behavior.
- Use semantic tags through `as` (for example `main`, `section`) to improve landmark structure.
