# Chart Recipe: Ops Monitoring

Use this recipe for incident/operations consoles with fast anomaly detection and drill-down workflows.

## Composition

- `Sparkline` in dense list rows for compact trend context.
- `LineChart` with threshold overlays for latency/error-rate panels.
- `GaugeChart` for SLO compliance and capacity indicators.
- `Histogram` for latency distributions and outlier tails.

## Interaction

- Place charts inside `PageLayout` or `SplitLayout` with side panel drill-down.
- Link chart click/hover states to logs (`DataTable`) and event streams (`ActivityFeed`).

## Reliability

- Prefer deterministic adapter configs (fixed axis domain where required).
- Use high-density mode for long windows and keep refresh cadence bounded.
