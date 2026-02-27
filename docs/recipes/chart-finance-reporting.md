# Chart Recipe: Finance Reporting

Use this recipe for reporting pages that combine P&L trends, variance views, and market/price data.

## Composition

- `CandlestickChart` for OHLC time-series views.
- `BarChart` for budget vs actual comparisons (grouped/stacked).
- `LineChart` thresholds for forecast/target overlays.
- `TreemapChart` for hierarchical spend or revenue contribution.

## Export and Print

- Use `exportAsCsv` for tabular extract.
- Use `exportAsPng`/`exportAsSvg` where adapter support exists.
- Enable `printMode` for report-friendly rendering before print/export capture.

## Validation

- Pair every critical chart with `a11yTableFallback` and report-table reconciliation checks.
