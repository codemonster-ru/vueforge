# Chart Engine Adapter Strategy

Goal: define the official visualization engine strategy for VueForge charts with one default adapter and a stable extension interface.

## Official Strategy

- VueForge chart components (`Chart`, `BarChart`, `LineChart`, etc.) are engine-agnostic at the component API layer.
- Official default adapter is `Chart.js`, provided via `createChartJsAdapter`.
- `chart.js` remains an optional peer dependency and is installed by consumers only when chart rendering is needed.
- Third-party engines are supported through the same `ChartAdapter` interface.

## Adapter Contract

`ChartAdapter` defines the extension interface:

- `mount(container, config)` is required.
- `update(instance, config)` is optional and should support in-place updates when possible.
- `resize(instance)` is optional and should reflow chart layout.
- `destroy(instance)` is optional and should free engine resources.

`ChartConfig` contract:

- `type: ChartType`
- `data: ChartData`
- `options?: Record<string, unknown>`

## Default Adapter Expectations (`Chart.js`)

- `createChartJsAdapter` maps VueForge `ChartConfig` into the engine constructor.
- `update` mutates engine config and calls engine `update`.
- `resize` and `destroy` delegate to engine lifecycle methods.
- Adapter throws a deterministic error when canvas 2D context is unavailable.

## Extension Guidance

- Keep custom adapters free of Vue-specific state so they remain portable across chart components.
- Treat engine-only options as `options` payload and avoid leaking engine-specific props into VueForge chart public APIs.
- For SSR apps, create engine adapters in client-only code paths.
- Preserve the `ChartAdapter` lifecycle semantics to keep behavior consistent across all chart wrappers.

## Verification

- Base lifecycle and a11y behavior is covered by `chart.test.ts`.
- Default adapter mapping and lifecycle contract is covered by `chart-adapter.test.ts`.
