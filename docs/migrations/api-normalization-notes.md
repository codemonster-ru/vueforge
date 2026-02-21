# Migration Notes: API Normalization

Date: 2026-02-21

## Overlay Contracts

Overlay components now follow a documented common contract for:

- keyboard dismiss (`Escape`) behavior
- outside-click dismiss behavior
- focus restore after close
- z-index policy documentation

Affected docs/components: `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`.

## Popover Event Model

`Popover` now exposes canonical overlay events:

- `update:modelValue`
- `open`
- `close`

Legacy compatibility events remain:

- `click`
- `onClick`

No immediate breaking migration is required; consumers can incrementally move to canonical events.

## Legacy Alias Guidance

Legacy alias events (`onActive`, `onClick`) are kept for compatibility where present.
For new integrations, prefer canonical event names (`active`, `click`/`select`, `open`, `close`, `update:*`).
