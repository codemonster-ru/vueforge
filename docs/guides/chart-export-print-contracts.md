# Chart Export and Print Contracts

Goal: provide consistent export contracts (PNG/SVG/CSV) and print-friendly rendering behavior for chart components.

## Adapter Extension Contract

`ChartAdapter` supports optional export/print methods:

- `exportPng(instance, config) => string`
- `exportSvg(instance, config) => string`
- `exportCsv(instance, config) => string`
- `setPrintMode(instance, enabled) => void`

Official default adapter (`createChartJsAdapter`) provides PNG export through `toBase64Image` when available.

## `Chart` Exposed API

`Chart` exposes instance methods:

- `exportAsPng() => string`
- `exportAsSvg() => string`
- `exportAsCsv() => string`
- `setPrintMode(enabled: boolean) => void`

Behavior:

- PNG/SVG use adapter hooks when provided.
- CSV uses adapter hook when available; otherwise fallback CSV is generated from chart `data` via `createChartCsv`.

## Print-Friendly Mode

- Prop: `printMode?: boolean` (default `false`).
- Print mode adds `vf-chart_print` state class.
- `@media print` styles remove non-essential UI chrome and hide the data-table toggle control.
- Adapters can react to print mode via `setPrintMode`.
