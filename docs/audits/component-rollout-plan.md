# Component Rollout Plan

Current scope: `@codemonster-ru/vueforge` and `@codemonster-ru/vueforge-layouts`.

This document was reset after narrowing the public package surface back to `core + layouts`.

## Active rollout tracks

- Core primitives and data components ship from `@codemonster-ru/vueforge`.
- App shell and page composition components ship from `@codemonster-ru/vueforge-layouts`.

## Working rule

- New rollout planning must cover only components that are currently exported from the active packages.
- Deferred experiments that are not part of the public package surface should not be tracked here.
