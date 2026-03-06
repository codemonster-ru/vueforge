# MainLayoutRegion

MainLayoutRegion is a reusable main-content wrapper with optional padding, borders, and width constraints.

## Import

```ts
import MainLayoutRegion from '@/package/components/main-layout-region.vue';
```

## Examples

### Basic

Use `MainLayoutRegion` as the primary content landmark in shells and page layouts.

```vue
<MainLayoutRegion>
    <PageHeader title="Analytics" />
    <Chart :data="series" />
</MainLayoutRegion>
```

### Constrained Width

Enable `constrained` for content-heavy pages that should not stretch across very wide screens.

```vue
<MainLayoutRegion constrained max-width="64rem">
    <PageHeader title="Analytics" />
</MainLayoutRegion>
```

### Non-Landmark Wrapper

Disable the landmark when embedding the component inside another `main` region.

```vue
<MainLayoutRegion as="section" :landmark="false" bordered>
    Nested content block
</MainLayoutRegion>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'main'` |
| `landmark` | `boolean` | `true` |
| `ariaLabel` | `string` | `'Main content'` |
| `padded` | `boolean` | `true` |
| `bordered` | `boolean` | `false` |
| `constrained` | `boolean` | `false` |
| `center` | `boolean` | `true` |
| `maxWidth` | `string` | `''` |

## Theming

Override component tokens through `theme.overrides.components.mainLayoutRegion`.

## Tokens

- `padding`
- `maxWidth`
- `borderColor`
- `backgroundColor`
- `textColor`

## Recipes

- Use `constrained` for reading-heavy pages and unconstrained mode for dashboards or full-width workspaces.
- Keep `landmark` disabled when the component is nested inside another main content region.

## Accessibility

- When `as` is not `main` and `landmark` is enabled, the component applies `role="main"`.
- `ariaLabel` is only applied when landmark mode is active.
