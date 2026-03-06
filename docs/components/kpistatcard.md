# KPIStatCard

Display compact KPI summaries with a primary value, trend indicator, and optional sparkline.

## Import

```ts
import { KPIStatCard } from '@codemonster-ru/vueforge';
```

## Examples

Use `KPIStatCard` for dashboard tiles that summarize one important metric at a glance.

### Basic

Use title, value, and delta for a standard analytics tile.

```vue
<template>
    <KPIStatCard title="MRR" subtitle="Monthly recurring revenue" value="$124,000" :delta="6.4" />
</template>
```

### With Sparkline

Use the `sparkline` slot for a lightweight visual trend cue.

```vue
<template>
    <KPIStatCard title="Active users" value="18,402" :delta="3.1">
        <template #sparkline>
            <svg width="80" height="24" viewBox="0 0 80 24" aria-hidden="true">
                <polyline points="0,16 16,14 32,12 48,10 64,8 80,6" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
        </template>
    </KPIStatCard>
</template>
```

### Explicit Trend

Set `trend` directly when trend direction should not be inferred from `delta`.

```vue
<template>
    <KPIStatCard
        title="SLA"
        subtitle="Last 30 days"
        value="99.95%"
        trend="neutral"
        trend-label="Stable"
        :delta="0"
    />
</template>
```

## Props

- `title?: string`
- `subtitle?: string`
- `value?: string | number`
- `caption?: string`
- `trend?: 'up' | 'down' | 'neutral' | 'auto'` (default `auto`)
- `trendLabel?: string`
- `delta?: number | null`
- `deltaFormat?: 'number' | 'percent'` (default `percent`)
- `showDelta?: boolean` (default `true`)
- `ariaLabel?: string`
- `locale?: string` (default `en`)

## Events

- This component does not emit component-specific events.

## Slots

- `sparkline`
- `value`
- `caption`

## Theming

- Override via `theme.overrides.components.kpiStatCard`.

## Tokens

Component tokens (override via `theme.overrides.components.kpiStatCard`):

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `gap`, `headerGap`
- `titleFontSize`, `titleFontWeight`
- `subtitleFontSize`, `subtitleColor`
- `valueGap`, `valueFontSize`, `valueFontWeight`
- `trendGap`, `trendFontSize`, `trendColor`, `upColor`, `downColor`
- `captionFontSize`, `captionColor`

## Recipes

- Keep titles short and let the value carry the emphasis.
- Use the `value` slot only when formatting or composition is more complex than plain text.
- Treat the sparkline as supportive context, not the primary carrier of meaning.

## Accessibility

- Exposes optional `ariaLabel` on the root article.
- Trend icon is decorative while text trend and delta remain readable.
