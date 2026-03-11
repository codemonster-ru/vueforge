# Grid / GridItem

Grid and `GridItem` provide responsive two-dimensional layout primitives for cards, forms, and workspace shells.

## Import

```ts
import { Grid, GridItem } from '@codemonster-ru/vueforge';
import { Grid, GridItem } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use a fixed column count for dashboard and application layouts.

```vue
<Grid :columns="12" gap="1rem">
    <GridItem :span="3">Sidebar</GridItem>
    <GridItem :span="9">Main content</GridItem>
</Grid>
```

### Breakpoint Spans

Use breakpoint overrides to stack on mobile and spread across columns on larger screens.

```vue
<Grid :columns="12" gap="1rem">
    <GridItem :span="12" :breakpoints="{ md: { span: 3 } }">
        Sidebar
    </GridItem>
    <GridItem :span="12" :breakpoints="{ md: { span: 9 } }">
        Main content
    </GridItem>
</Grid>
```

### Explicit Placement

Use `start` and `end` when a layout needs more exact placement than simple spans.

```vue
<Grid columns="repeat(8, minmax(0, 1fr))" column-gap="0.75rem" row-gap="0.75rem">
    <GridItem :start="1" :end="5">A</GridItem>
    <GridItem :start="5" :end="9">B</GridItem>
</Grid>
```

## API

### Grid Props

| Name          | Type                                                                  | Default       |
| ------------- | --------------------------------------------------------------------- | ------------- |
| `as`          | `string`                                                              | `'div'`       |
| `columns`     | `number \| string`                                                    | theme default |
| `gap`         | `string`                                                              | `''`          |
| `columnGap`   | `string`                                                              | `''`          |
| `rowGap`      | `string`                                                              | `''`          |
| `align`       | `'start' \| 'center' \| 'end' \| 'stretch'`                           | `'stretch'`   |
| `justify`     | `'start' \| 'center' \| 'end' \| 'stretch'`                           | `'stretch'`   |
| `breakpoints` | `Partial<Record<'sm' \| 'md' \| 'lg' \| 'xl', GridBreakpointConfig>>` | `{}`          |

### GridItem Props

| Name          | Type                                                                      | Default |
| ------------- | ------------------------------------------------------------------------- | ------- |
| `as`          | `string`                                                                  | `'div'` |
| `span`        | `number \| string`                                                        | `''`    |
| `start`       | `number \| string`                                                        | `''`    |
| `end`         | `number \| string`                                                        | `''`    |
| `breakpoints` | `Partial<Record<'sm' \| 'md' \| 'lg' \| 'xl', GridItemBreakpointConfig>>` | `{}`    |

## Theming

Override component tokens through `theme.overrides.components.grid`.

## Tokens

- `columns`
- `gap`
- `columnGap`
- `rowGap`
- `alignItems`
- `justifyItems`
- `breakpointSm`
- `breakpointMd`
- `breakpointLg`
- `breakpointXl`

## Recipes

- Use Grid for layout only and keep content semantics on the child components.
- Prefer span-based placement first; drop to explicit `start` and `end` only when the layout truly requires it.

## Accessibility

- `Grid` and `GridItem` are non-interactive layout primitives.
- Use `as` to preserve surrounding semantics such as `section`, `article`, or `main`.
