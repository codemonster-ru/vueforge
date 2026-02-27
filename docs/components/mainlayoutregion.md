# MainLayoutRegion

## Purpose

Provide a reusable `main` landmark primitive for shell/page composition with optional width constraints.

## Props

- `as?: string` (default `main`)
- `landmark?: boolean` (default `true`) - controls landmark role/aria behavior.
- `ariaLabel?: string` (default `Main content`)
- `padded?: boolean` (default `true`)
- `bordered?: boolean` (default `false`)
- `constrained?: boolean` (default `false`) - enables inner max-width container.
- `center?: boolean` (default `true`) - centers constrained content.
- `maxWidth?: string` (optional) - overrides constrained max width.

## Example

```vue
<MainLayoutRegion constrained max-width="64rem">
    <PageHeader title="Analytics" />
    <Chart :data="series" />
</MainLayoutRegion>
```

## Tokens

- `padding`
- `maxWidth`
- `borderColor`
- `backgroundColor`
- `textColor`

## Notes

- If `as` is not `main` and `landmark=true`, component applies `role="main"`.
- Use `landmark=false` when embedding as a nested non-landmark region.
