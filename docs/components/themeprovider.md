# ThemeProvider

ThemeProvider scopes theme preset and token overrides to a subtree without replacing the global theme for the whole app.

## Import

```ts
import ThemeProvider from '@/package/components/theme-provider.vue';
```

## Examples

### Scoped Overrides

```vue
<ThemeProvider
    :overrides="{
        colors: { primary: '#7c3aed' },
        components: { button: { backgroundColor: '#7c3aed' } },
    }"
>
    <Button>Scoped Themed Action</Button>
</ThemeProvider>
```

### Local Dark Region

```vue
<ThemeProvider :overrides="dashboardTheme" dark>
    <DashboardSidebar />
</ThemeProvider>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `preset` | `ThemePreset \| undefined` | `undefined` |
| `overrides` | `ThemePreset \| undefined` | `undefined` |
| `as` | `string` | `'div'` |
| `dark` | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Content that should receive the scoped theme variables. |

## Recipes

- Use ThemeProvider for isolated themed surfaces, embedded product previews, and mixed light or dark regions.
- Nested providers are valid; inner scopes override outer CSS variable values for their subtree.

