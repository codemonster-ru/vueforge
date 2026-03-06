# Spinner

Spinner communicates loading and waiting states in inline or overlay form.

## Import

```ts
import Spinner from '@/package/components/spinner.vue';
```

## Examples

### Inline

Use the inline variant inside buttons, cards, and compact loading placeholders.

```vue
<Spinner label="Loading metrics" />
```

### Overlay

Use the overlay variant when a whole surface is busy but should remain visible underneath.

```vue
<div style="position: relative; min-height: 12rem;">
    <Spinner variant="overlay" label="Saving changes" />
</div>
```

### Severity

Severity can align loading feedback with surrounding status color systems.

```vue
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <Spinner severity="primary" />
    <Spinner severity="success" />
    <Spinner severity="warning" />
    <Spinner severity="danger" />
</div>
```

### Custom Label Content

Use the default slot when loading copy needs more than a single string.

```vue
<Spinner>
    <span>Syncing workspace data...</span>
</Spinner>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `variant` | `'inline' \| 'overlay'` | `'inline'` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'primary'` |
| `label` | `string` | `''` |
| `ariaLabel` | `string` | `'Loading'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Replaces the text label content. |

## Theming

Override component tokens through `theme.overrides.components.spinner`.

## Tokens

- Base size and stroke: `size`, `thickness`
- Colors: `trackColor`, `indicatorColor`, `labelColor`
- Overlay: `overlayBackgroundColor`, `overlayBlur`, `overlayZIndex`
- Sizes: `small.size`, `large.size`
- Severities: `primaryColor`, `secondaryColor`, `successColor`, `infoColor`, `warningColor`, `dangerColor`

## Recipes

- Use inline spinners for localized async work and overlay spinners for blocking states on a card, pane, or page section.
- Pair long-running work with text that explains what is happening, not only that something is loading.

## Accessibility

- Provide a useful `label` or slot content when the loading state needs explanation beyond a generic spinner.
- Overlay loaders should not become the only source of progress information for long operations.
