# Chart Recipe: Executive Dashboard

Use this recipe for C-level summary pages with KPI tiles and high-level trend context.

## Composition

- `KPIStatCard` for top-line metrics (`MRR`, `ARR`, `Burn`, `NPS`).
- `LineChart` for monthly trend line.
- `BarChart` for quarter-over-quarter comparison.
- `PieChart` for segment mix.

## Layout

- Desktop: 12-column grid (`KPI` row + two-column chart section).
- Mobile: stacked cards/charts with `Chart` `highDensity` enabled for dense ranges.

## Accessibility

- Provide `ariaLabel` and `a11ySummary` for each chart.
- Enable `a11yTableFallback` for business-critical visualizations.
