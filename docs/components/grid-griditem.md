# Grid / GridItem

## Purpose

- Build responsive two-dimensional layouts for cards, forms, and workspace shells.
- Control placement with spans/start/end while keeping layout concerns separate from content components.

## Props

See Grid Props and GridItem Props below.

## Grid Props

- `as?: string` (default `div`)
- `columns?: number | string` (default from theme token)
- `gap?: string` (optional runtime override)
- `columnGap?: string` (optional runtime override)
- `rowGap?: string` (optional runtime override)
- `align?: 'start' | 'center' | 'end' | 'stretch'` (default `stretch`)
- `justify?: 'start' | 'center' | 'end' | 'stretch'` (default `stretch`)
- `breakpoints?: { sm?, md?, lg?, xl? }` where each item supports `columns`, `gap`, `columnGap`, `rowGap`, `align`, `justify`

## GridItem Props

- `as?: string` (default `div`)
- `span?: number | string`
- `start?: number | string`
- `end?: number | string`
- `breakpoints?: { sm?, md?, lg?, xl? }` where each item supports `span`, `start`, `end`

## Events

- No emitted events.

## Slots

- `Grid`: `default`
- `GridItem`: `default`

## Examples

```vue
<Grid :columns="12" gap="1rem" :breakpoints="{ md: { columns: 6 }, lg: { columns: 12, gap: '1.25rem' } }">
    <GridItem :span="12" :breakpoints="{ md: { span: 3 } }">
        <Card>Sidebar</Card>
    </GridItem>
    <GridItem :span="12" :breakpoints="{ md: { span: 3 } }">
        <Card>Main content</Card>
    </GridItem>
</Grid>
```

```vue
<Grid columns="repeat(8, minmax(0, 1fr))" column-gap="0.75rem" row-gap="0.75rem">
    <GridItem :start="1" :end="5">A</GridItem>
    <GridItem :start="5" :end="9">B</GridItem>
    <GridItem :span="2">C</GridItem>
    <GridItem :span="6">D</GridItem>
</Grid>
```

## Theming

- Override via `theme.overrides.components.grid`.

## Tokens

Component tokens (override via `theme.overrides.components.grid`):

- `columns`
- `gap`, `columnGap`, `rowGap`
- `alignItems`, `justifyItems`
- `breakpointSm`, `breakpointMd`, `breakpointLg`, `breakpointXl`

## Recipes

- 12-column desktop and stacked mobile:
    - base: `columns=1`
    - `md`: `columns=12`
    - each item uses breakpoint `span` for desktop widths
- Dashboard shell:
    - sidebar item: `md span=3`
    - main item: `md span=9`
    - adjust dense mode via `gap`, `columnGap`, `rowGap`

## Responsive

- Verify breakpoint overrides (columns, gap, span, start, end) across mobile/tablet/desktop.
- Check reflow behavior when content exceeds expected width.

## SSR/Hydration

- Grid uses deterministic style/class output and should not diverge at hydration.
- Ensure breakpoint configuration does not rely on client-only measurements for initial render.

## Testing

- Cover base and breakpoint prop merging for Grid and GridItem.
- Add regression tests for span/start/end combinations and overflow-safe layouts.

## Accessibility

- `Grid` and `GridItem` are layout primitives and do not add interactive behavior.
- Keep semantic structure with `as` (`section`, `article`, `main`) where needed.
