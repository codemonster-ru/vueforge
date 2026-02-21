# Browser Compatibility Checks (Critical Components)

Date: 2026-02-21
Matrix reference: `docs/browser-support.md`

## Critical Components Covered

- Overlay interactions: `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`
- Form/input flows: `Form`, `FormField`, `Input`, selection family, date-time family
- Data/navigation flows: `DataTable`, `Tabs`, `Menu`, `Pagination`

## Check Areas

- Keyboard interaction (open/close/navigation/commit)
- Focus management (trap/restore where applicable)
- ARIA semantics and state attributes
- Viewport/collision behavior for positioned overlays
- Basic rendering and token-driven styles

## Validation Notes

- Unit/regression tests were added or expanded for critical interaction flows.
- Compatibility-sensitive behavior (positioning/focus/scroll lock) is documented with explicit contracts.
- No matrix-breaking browser-specific APIs are introduced in critical components.

## Known Limitations

- Visual fine details (focus ring rendering, sub-pixel positioning) can vary slightly across engines.
- For production release, run manual smoke on latest Chrome + Safari in addition to CI test suite.
