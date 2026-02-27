# Performance Budgets

This document defines baseline performance budgets for heavy VueForge components.

Machine-readable source of truth:

- `scripts/performance-budgets.json`

Validation command:

- `npm run verify:performance-budgets`

Benchmark scenarios and measurement runner:

- [`docs/audits/performance-benchmarks.md`](./performance-benchmarks.md)
- Usage guidance and practical limits: [`docs/guides/performance-guidance-limits.md`](../guides/performance-guidance-limits.md)

## Scope

Budgets are currently defined for:

- `DataTable`
- `Tree`
- `VirtualScroller`
- key overlays (`Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`, `CommandPalette`, `NotificationCenter`)
- `Charts` (large-dataset line chart benchmark with high-density mode)

## Budget Semantics

- Budgets are `p95` timing targets in milliseconds.
- Budgets are evaluated under the environment declared in `scripts/performance-budgets.json`.
- A budget miss is treated as a regression candidate until root cause is classified.

## Notes

- This step defines targets only.
- Benchmark scenarios/measurement scripts and CI enforcement are tracked as follow-up checklist items.
