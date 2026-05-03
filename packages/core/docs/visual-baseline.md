# VueForge Core Visual Baseline 1.0

This document defines the visual contract for `@codemonster-ru/vueforge-core` `1.0`.

## Principles

- `core` is a foundation layer, not a decorative showcase layer.
- Controls, surfaces, overlays, and feedback elements should feel related.
- Visual changes after `1.0` should be evolutionary, not stylistic rewrites.
- Tokens are the source of truth for size, radius, spacing, and semantic color.

## Canonical Tokens

Primary source: [src/theme/default-preset.ts](../src/theme/default-preset.ts)

CSS fallback baseline: [src/styles/tokens.css](../src/styles/tokens.css)

- Control heights
  - `sm`: `--vf-control-height-sm`
  - `md`: `--vf-control-height-md`
  - `lg`: `--vf-control-height-lg`
- Radius levels
  - `control`: `--vf-radius-control`
  - `control-tight`: `--vf-radius-control-tight`
  - `surface`: `--vf-radius-surface`
  - `overlay`: `--vf-radius-overlay`
- Spacing levels
  - `button`: `--vf-button-padding-*`
  - `field`: `--vf-field-padding-*`
  - `surface`: `--vf-surface-padding`, `--vf-surface-gap`
  - `section`: `--vf-section-padding`, `--vf-section-gap`
  - `overlay`: `--vf-overlay-padding`, `--vf-overlay-gap`

## Component Scale

- `VfButton`, `VfIconButton`, `VfInput`, `VfTabs` tabs use the control scale.
- `VfBadge` and `VfTag` use a smaller label scale and should remain visually lighter than controls.
- `VfCard`, `VfPanel`, `VfAlert`, `VfDialog`, `VfPopover`, `VfDropdown` use the surface or overlay scale.

## Focus Contract

- Interactive controls use:
  - `border-color: var(--vf-color-primary)`
  - `box-shadow: 0 0 0 2px var(--vf-color-focus-ring)`
- Links may be slightly lighter, but should still follow the same ring language.
- Focus should never rely on inconsistent native outlines.

## Surface Contract

- `surface` is the default component plane.
- `surface-muted` is reserved for supportive or grouped regions such as tabs lists and dropdown menus.
- Shadows are not part of the baseline visual language.
- Separation should come from border, radius, spacing, and surface level.

## Typography Rhythm

- Titles use the heading typography layer, typically `--vf-line-height-tight`.
- Body content uses the body typography layer, typically `--vf-text-body-line-height`.
- Components should avoid arbitrary line-height values unless there is a clear reason.

## Semantic Color Contract

- `primary`, `success`, and `danger` use semantic tokens.
- Feedback colors should not be hardcoded in component styles.
- Soft fills and softened borders should come from tokenized mixes.

## Freeze Rules

- Do not introduce new radius or height values without a system reason.
- Prefer updating tokens over component-local magic numbers.
- New components must reuse existing focus, spacing, and surface language.
