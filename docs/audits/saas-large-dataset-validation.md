# SaaS Large-Dataset Validation

Purpose: document explicit validation coverage for pagination, virtualization, loading, and empty/error state behavior in SaaS-heavy flows.

## Scope

Validated components and utilities:

- `DataTable` (server handoff + pagination/filtering + loading/empty/error slot pattern)
- `Pagination` (page navigation behavior and edge-page controls)
- `VirtualScroller` (windowed rendering + range events + empty/error fallback)
- `Tree` (`TreeView` mode with virtualized expansion + async loading states)
- `TreeTable` (lazy/server expand flow with `loadingKeys`)

## Validation Matrix

| Component       | Pagination                                     | Virtualization                       | Loading             | Empty                            | Error Pattern                              |
| --------------- | ---------------------------------------------- | ------------------------------------ | ------------------- | -------------------------------- | ------------------------------------------ |
| DataTable       | Yes (server `page/pageSize` + request payload) | N/A                                  | Yes                 | Yes                              | Yes (`empty` slot for error fallback)      |
| Pagination      | Yes                                            | N/A                                  | N/A                 | N/A                              | N/A                                        |
| VirtualScroller | N/A                                            | Yes                                  | N/A                 | Yes                              | Yes (`empty` slot for error fallback)      |
| Tree            | N/A                                            | Yes (`virtualized`)                  | Yes (`loadingKeys`) | N/A                              | Async branch fallback label                |
| TreeTable       | Yes (server/lazy handoff)                      | Hierarchical/lazy windowing strategy | Yes (`loadingKeys`) | Yes (`emptyText` / `empty` slot) | Request/error handling delegated to parent |

## Test Evidence

- `src/package/components/__tests__/data-table.test.ts`
    - Server request handoff for sort/pagination/filter.
    - Loading/empty/error slot behavior for server datasets.
- `src/package/components/__tests__/pagination.test.ts`
    - Page updates and edge navigation behavior.
- `src/package/components/__tests__/virtual-scroller.test.ts`
    - Virtual window rendering and `rangeChange`/`reachEnd`.
    - Empty and error-state fallback through `empty` slot.
- `src/package/components/__tests__/tree.test.ts`
    - Virtualized expanded rendering.
    - Async branch states via `loadingKeys` and `loadChildren`.
- `src/package/components/__tests__/tree-table.test.ts`
    - Lazy and server handoff payload verification.

## Consumer Guidance

- Treat explicit `error` state as app-owned: pass fallback UI through component slots where no dedicated `error` prop exists.
- Use server-mode APIs for any dataset that exceeds practical client-only render limits.
- Pair virtualization with deterministic row/item height configuration.
