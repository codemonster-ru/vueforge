# Performance Guidance and Limits

This guide describes practical limits and usage guidance for heavy VueForge components.

Reference artifacts:

- budgets: `scripts/performance-budgets.json`
- benchmark scenarios: `scripts/benchmark-scenarios.json`
- benchmark report: `benchmarks/latest.json`

## DataTable

Recommended limits:

- Prefer pagination or server mode for datasets above `1000` rows.
- Keep visible columns within `12-16` for dense views.
- Enable sticky columns only for columns that must remain visible.

Guidance:

- Use server-mode sorting/filter/pagination for large datasets.
- Avoid expensive cell slot rendering in every column.
- Keep column resize/reorder enabled only where needed.

## Tree

Recommended limits:

- Keep simultaneously expanded nodes to a manageable range (target baseline: ~`400` expanded nodes in benchmark scenario).
- For very large trees, lazy-load or progressively expand branches.

Guidance:

- Avoid rendering deep nested custom slot content on every node.
- Prefer search/filter to reduce visible node count before interaction-heavy flows.

## VirtualScroller

Recommended limits:

- Keep `itemHeight` stable and deterministic.
- Use moderate `overscan` values (baseline uses `4`).
- Prefer VirtualScroller over full render once item count exceeds a few hundred rows.

Guidance:

- Do not mix highly variable-height content without custom measurement strategy.
- Keep row templates lightweight to preserve smooth scroll updates.

## Overlays

Covered overlays:

- `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`, `CommandPalette`, `NotificationCenter`

Guidance:

- Minimize heavy synchronous work in open/close handlers.
- Avoid large mount-time computations inside overlay content.
- Keep focus-transfer paths simple and deterministic.

## Budget Interpretation

- Current budgets are baseline CI gates, not absolute UX targets.
- A budget exceedance means "investigate and classify", not always "hard product regression".
- If intentional behavior increases cost, update benchmarks and budgets together with rationale in changelog/PR.

## Verification Workflow

1. Validate budget file:
    - `npm run verify:performance-budgets`
2. Run benchmark scenarios:
    - `npm run benchmark:run`
3. Verify report against budgets:
    - `npm run verify:performance-report`
4. Run combined gate:
    - `npm run performance:check`
