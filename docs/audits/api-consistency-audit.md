# API Consistency Audit

Date: 2026-02-21
Scope: layout, navigation, data, overlays, form/input/select/date-time families.

## Layout Components Audit

Components: `Container`, `Section`, `Grid`, `Stack`, `Inline`.

- Conventions status: pass
- Notes:
    - Consistent non-interactive API shape (`as`, layout props, no component events).
    - Docs aligned to required sections and recipes.

## Navigation Components Audit

Components: `Menu`, `Link`, `PageHeader`, `Breadcrumbs`, `Tabs`.

- Conventions status: pass with legacy alias notes
- Notes:
    - `Menu` and `Link` keep `onActive` alias for compatibility in addition to canonical events.
    - Keyboard contracts documented and tested for `Menu` and `Tabs`.

## Data Components Audit

Components: `DataTable`, `Pagination`, `VirtualScroller`, `Card`, `Divider`.

- Conventions status: pass
- Notes:
    - `DataTable` follows `update:*` pattern for multi-model channels.
    - Display components (`Card`, `Divider`) use consistent non-event API.

## Overlay Components Audit

Components: `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`.

- Conventions status: pass with compatibility aliases
- Notes:
    - Overlay close flags normalized (`closeOnEsc`, `closeOnOverlay`/`closeOnOutside`).
    - Focus restore, outside-click, and keyboard dismiss contracts covered by tests.
    - `Popover` keeps legacy `click`/`onClick` while exposing canonical `update:modelValue`, `open`, `close`.

## Form/Input/Selection/Date-Time Families Audit

Components: `Form`, `FormField`, input family, selection family, date-time family.

- Conventions status: pass
- Notes:
    - Shared accessibility props and readonly/disabled semantics documented.
    - Family-level behavior docs added for parsing/constraints and selection patterns.

## High-Priority Inconsistencies and Normalization

- Normalized:
    - Overlay behavior contracts documented and test-covered across `Modal`, `Drawer`, `Dropdown`, `Popover`, `ContextMenu`, `Tooltip`.
    - Added canonical overlay events to `Popover` while preserving legacy aliases.
- Compatibility retained:
    - `onActive`, `onClick` aliases remain for backward compatibility.

## Test and Docs Notes

- Added/expanded regression tests for overlays and a11y suites (form/table/modal-drawer/navigation).
- Updated docs template and component docs to include required sections and interaction contracts.
