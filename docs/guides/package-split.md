# Package Split

VueForge is now organized as a small package family instead of one flat package with every component mixed together.

## Packages

- `@codemonster-ru/vueforge`: core components, theme/config runtime, directives, services
- `@codemonster-ru/vueforge-layouts`: `AppShell`, `PageLayout`, `NavigationRail`, `PageHeader`, and related layout shell components

## Recommended Imports

```ts
import { Button, Input, DataTable } from '@codemonster-ru/vueforge';
import { AppShell, PageHeader } from '@codemonster-ru/vueforge-layouts';
```

## Current Package Boundary

`@codemonster-ru/vueforge-layouts` is the companion package published next to core.

## Migration Pattern

1. Keep core imports on `@codemonster-ru/vueforge`.
2. Move layout shell imports to `@codemonster-ru/vueforge-layouts`.

## CSS

Import CSS for each package you use:

```ts
import '@codemonster-ru/vueforge/dist/index.css';
import '@codemonster-ru/vueforge-layouts/dist/index.css';
```

## Independent Releases

Package publishing is independent.

- `vueforge-vx.y.z` publishes `@codemonster-ru/vueforge`
- `layouts-vx.y.z` publishes `@codemonster-ru/vueforge-layouts`

Release and versioning rules are documented in [`docs/contributing/package-versioning.md`](../contributing/package-versioning.md).
