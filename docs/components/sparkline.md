# Sparkline

Sparkline is a compact chart wrapper for inline trend indicators built on top of the canonical `Chart` runtime.

## Import

```ts
import Sparkline from '@/package/components/sparkline.vue';
```

## Examples

### Basic

Use `Sparkline` for compact trend signals in cards, tables, and KPI summaries.

```vue
<Sparkline :values="[12, 18, 14, 22, 19, 26, 21]" />
```

### Area Trend

Enable `area` when the sparkline should read more like a compact filled trend strip.

```vue
<Sparkline
    :values="[120, 160, 150, 190, 210, 205, 230]"
    area
/>
```

### Custom Colors

Use explicit colors when the sparkline must align with product-specific semantic palettes.

```vue
<Sparkline
    :values="[42, 38, 44, 46, 51, 49, 55]"
    color="#0f766e"
    fill-color="rgba(15, 118, 110, 0.16)"
    area
/>
```

### Points And Labels

Turn on points and labels when the inline trend still needs a bit more interpretability.

```vue
<Sparkline
    :values="[3, 5, 4, 8, 6, 9]"
    :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
    show-points
    :point-radius="2"
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `values` | `number[]` | `[]` |
| `labels` | `string[]` | `[]` |
| `adapter` | `ChartAdapter \| undefined` | `undefined` |
| `options` | `Record<string, unknown>` | `{}` |
| `color` | `string \| undefined` | `undefined` |
| `fillColor` | `string \| undefined` | `undefined` |
| `area` | `boolean` | `false` |
| `smooth` | `boolean` | `true` |
| `showPoints` | `boolean` | `false` |
| `pointRadius` | `number` | `1.5` |
| `width` | `number` | `120` |
| `height` | `number` | `36` |
| `loading` | `boolean` | `false` |
| `lazy` | `boolean` | `true` |
| `pt` | `PassThroughOptions \| undefined` | `undefined` |
| `unstyled` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `ready` | `ChartAdapterInstance` |
| `error` | `Error` |

## Theming

`Sparkline` does not have its own default theme preset file in `src/package/themes/default/components/`. In this repo it inherits the shared `Chart` token contract and uses `theme.overrides.components.chart`.

## Tokens

- Inherit chart surface, typography, focus, and state tokens from `Chart`
- Common overrides for sparklines are usually palette-oriented: `seriesPrimaryColor`, `seriesPositiveColor`, `seriesWarningColor`, `seriesNegativeColor`

## Recipes

- Use `Sparkline` for inline trend context next to a primary number, not as a replacement for a full analytical chart.
- Drop to `Chart` when you need legends, axes, table fallback, export, or uncommon chart options.

## Accessibility

- Sparklines are visually compact, so pair them with nearby labels or numeric summaries that explain the trend.
- For critical analytics surfaces, use full charts or textual interpretation in addition to the sparkline.
