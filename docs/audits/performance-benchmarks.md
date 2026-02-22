# Performance Benchmark Scenarios and Measurement

VueForge benchmark scenarios and measurement runner are defined as:

- scenarios: `scripts/benchmark-scenarios.json`
- runner: `scripts/run-performance-benchmarks.ts`
- output report: `benchmarks/latest.json`

## Run

- `npm run benchmark:run`
- `npm run verify:performance-report`
- `npm run performance:check`

## Included Scenario Groups

- `DataTable`
- `Tree`
- `VirtualScroller`
- `Overlays`

Each group maps to deterministic UI scenarios rendered via:

- `/performance-benchmark?component=<name>`

## Metrics

The runner executes repeated interactions and records per-metric samples with `p95`.

Examples:

- `initialRenderP95Ms`
- `sortInteractionP95Ms`
- `expandCollapseP95Ms`
- `scrollUpdateP95Ms`
- `openP95Ms`

## Notes

- `performance:check` compares measured `p95` values with `scripts/performance-budgets.json` and fails on budget regressions.
- CI and release workflows run this check as a gating step.
- Practical usage guidance and limits are documented in [`docs/guides/performance-guidance-limits.md`](../guides/performance-guidance-limits.md).
