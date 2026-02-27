# Chart Recipe: Product Analytics

Use this recipe for product usage funnels, retention slices, and feature adoption analysis.

## Composition

- `FunnelChart` for activation/conversion stages.
- `AreaChart` for DAU/WAU/MAU trends.
- `Heatmap` for day/hour interaction intensity.
- `ScatterChart` for cohort or account-level behavior clusters.

## Data Contracts

- Define shared schema via `createChartDataSchema` for series/axes/tooltip metadata.
- Keep engine-specific tuning in `options` and reuse `createChartThemeOptions` for consistent styling.

## Performance

- Enable `highDensity` on long-range time series.
- For dense detail views, combine chart section with paginated/virtualized tables.
