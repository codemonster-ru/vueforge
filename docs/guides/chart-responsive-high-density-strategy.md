# Chart Responsive and High-Density Strategy

Goal: define shared responsive rendering and high-density dataset handling for VueForge charts.

## Responsive Baseline

- `Chart` uses `ResizeObserver` when available and falls back to `window.resize`.
- Base chart wrappers already configure `responsive: true` and `maintainAspectRatio: false`.
- `lazy` mount + intersection observer avoids unnecessary adapter initialization outside viewport.

## High-Density Baseline

`Chart` exposes runtime high-density controls:

- `highDensity` (default `false`)
- `highDensityPointThreshold` (default `2000`)
- `highDensityDecimationAlgorithm` (`lttb` or `min-max`, default `lttb`)
- `highDensitySamples` (optional)

When enabled and threshold is exceeded:

- `parsing` is disabled.
- `animation` is disabled.
- `plugins.decimation` config is injected for chart engines that support decimation (official default adapter: `Chart.js`).

Public helpers for shared logic:

- `estimateChartPointCount(data)`
- `shouldEnableChartDecimation(data, threshold)`
- `createHighDensityChartOptions(data, settings)`

## Virtualization Guidance

- Chart canvas rendering itself is delegated to the engine adapter and should use engine-level decimation/windowing for large series.
- For tabular fallbacks and adjacent high-density lists, compose with `VirtualScroller`/pagination patterns in layout flows.
- Avoid rendering full raw-value tables for very large datasets without explicit product requirements.

## Verification

- Responsive behavior and resize fallback: `src/package/components/__tests__/chart.test.ts`.
- High-density option generation: `src/package/components/__tests__/chart-performance.test.ts`.
