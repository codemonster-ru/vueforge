# KPIStatCard

## Purpose

Display compact KPI blocks with primary value, trend direction, delta, and optional sparkline slot for dashboard analytics.

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

- N/A

## Slots

- `sparkline`
- `value`
- `caption`

## Examples

```vue
<KPIStatCard title="MRR" subtitle="Monthly recurring revenue" value="$124,000" :delta="6.4">
    <template #sparkline>
        <svg width="80" height="24" viewBox="0 0 80 24" aria-hidden="true">
            <polyline points="0,16 16,14 32,12 48,10 64,8 80,6" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
    </template>
</KPIStatCard>
```

## Theming

- Override via `theme.overrides.components.kpiStatCard`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `gap`, `headerGap`
- `titleFontSize`, `titleFontWeight`
- `subtitleFontSize`, `subtitleColor`
- `valueGap`, `valueFontSize`, `valueFontWeight`
- `trendGap`, `trendFontSize`, `trendColor`, `upColor`, `downColor`
- `captionFontSize`, `captionColor`

## Recipes

- Use card sets in analytics dashboards where each KPI tile can inject custom sparkline trend visuals.

## Accessibility

- Card exposes optional `ariaLabel`.
- Trend icon is decorative (`aria-hidden`) while text trend/delta remains readable.

## Responsive

- Content stacks naturally with token-based spacing and supports narrow dashboard columns.

## SSR/Hydration

- Deterministic render from static props; locale formatting for delta is hydration-safe when locale is stable.

## Testing

- Cover trend resolution (`auto`), delta formatting, sparkline slot, and caption rendering.
