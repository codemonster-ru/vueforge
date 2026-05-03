# VueForge Overlay API

This document describes the current embedding contract for overlay and floating components in `@codemonster-ru/vueforge-core`.

## Supported Teleport API

These components support the same teleport contract:

- `VfDialog`
- `VfDrawer`
- `VfDropdown`
- `VfPopover`
- `VfTooltip`

Available props:

- `teleportTo?: string | HTMLElement | null | false`
- `disableTeleport?: boolean`

Behavior:

- default: render through `Teleport` into `body`
- `disableTeleport`: render in place
- `teleportTo`: render into a custom target
- `teleportTo={false}` or `teleportTo={null}`: render in place

## Drawer Embedding Hooks

`VfDrawer` also supports shell-friendly embedding controls:

- `offsetTop?: string | number`
- `bodyPadding?: string | number`

Useful CSS variables:

- `--vf-drawer-offset-top`
- `--vf-drawer-body-padding`
- `--vf-drawer-radius-top-left`
- `--vf-drawer-radius-top-right`
- `--vf-drawer-radius-bottom-left`
- `--vf-drawer-radius-bottom-right`

`VfDrawer` forwards `class`, `style`, and `data-*` attrs to the root overlay element, so shell packages can adapt it without brittle selectors.

## Layering Tokens

Overlay and floating layers now use theme tokens instead of hardcoded z-index values:

- `zOverlay`
- `zDrawer`
- `zDropdown`
- `zPopover`
- `zTooltip`

The fallback CSS variables are:

- `--vf-z-overlay`
- `--vf-z-drawer`
- `--vf-z-dropdown`
- `--vf-z-popover`
- `--vf-z-tooltip`
