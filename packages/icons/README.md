# VueIconify

[![npm version](https://img.shields.io/npm/v/%40codemonster-ru%2Fvueforge-icons?logo=npm)](https://www.npmjs.com/package/@codemonster-ru/vueforge-icons)
[![npm downloads/week](https://img.shields.io/npm/dw/%40codemonster-ru%2Fvueforge-icons?logo=npm)](https://www.npmjs.com/package/@codemonster-ru/vueforge-icons)
[![License](https://img.shields.io/npm/l/%40codemonster-ru%2Fvueforge-icons)](./LICENSE.md)

Lightweight Vue 3 icon library with a single generic `VueIconify` wrapper.

The current direction is `solid`-first: new icons are created and refined as `solid`, while the small existing `regular` layer is kept as an experimental secondary style.

## Installation

```bash
npm install @codemonster-ru/vueforge-icons
```

Peer dependency:

```bash
npm install vue
```

Minimum supported Vue version: `3.5.0`.

## Usage

Generic icon component:

```vue
<script setup lang="ts">
import { VueIconify, icons } from '@codemonster-ru/vueforge-icons';
</script>

<template>
    <VueIconify :icon="icons.calendar" />
    <VueIconify :icon="icons.shield" :size="24" />
    <VueIconify :icon="icons.circleNotch" spin />
    <VueIconify icon="warning" width="24" height="24" aria-label="Warning" />
</template>
```

Category-oriented example:

```vue
<script setup lang="ts">
import { VueIconify, icons } from '@codemonster-ru/vueforge-icons';
</script>

<template>
    <VueIconify :icon="icons.arrowLeft" />
    <VueIconify :icon="icons.copy" />
    <VueIconify :icon="icons.folder" />
    <VueIconify :icon="icons.info" />
</template>
```

## API

### `VueIconify`

Props:

- `icon: string` - icon name or imported token from `icons` (recommended). Invalid values fall back to `moon`.
- `style: 'solid' | 'regular'` - visual variant for icons that provide a regular version. Falls back to `solid` when the requested variant is unavailable.
- `size: string | number` - sets both `width` and `height`. Default: `16`.
- `spin: boolean` - applies continuous rotation animation.

Existing dual-style icons:

- `bars`
- `check`
- `xmark`
- `calendar`
- `bell`
- `mail`
- `message`
- `user`
- `lock`
- `gear`

Attributes:

- Standard Vue attributes are forwarded to the rendered SVG component, including `class`, `style`, `width`, `height`, `role`, and `aria-*`.
- Explicit `width` and `height` attributes can still be used when you need non-square sizing.

Supported icon names:

<!-- generated-category-summary:start -->

- **Movement**: 25 icons
- **Editing And Commands**: 21 icons
- **Interface Objects**: 49 icons
- **Status And Messaging**: 21 icons

<!-- generated-category-summary:end -->

<!-- generated-icon-names:start -->

Movement:

- `arrowDown`
- `arrowDownLong`
- `arrowLeft`
- `arrowLeftLong`
- `arrowRight`
- `arrowRightLong`
- `arrowTurnLeftDown`
- `arrowTurnRightUp`
- `arrowTurnUpLeft`
- `arrowTurnUpRight`
- `arrowUp`
- `arrowUpLong`
- `bars`
- `caretDown`
- `caretLeft`
- `caretRight`
- `caretUp`
- `chevronDown`
- `chevronLeft`
- `chevronRight`
- `chevronUp`
- `collapse`
- `columns`
- `expand`
- `grid`

Editing And Commands:

- `check`
- `clipboard`
- `copy`
- `download`
- `ellipsis`
- `externalLink`
- `filter`
- `funnelX`
- `link`
- `logIn`
- `logOut`
- `minus`
- `pencil`
- `plus`
- `refresh`
- `send`
- `sliders`
- `sort`
- `trash`
- `upload`
- `xmark`

Interface Objects:

- `archive`
- `bell`
- `bookmark`
- `briefcase`
- `building`
- `calendar`
- `chartBar`
- `cloud`
- `code`
- `cpu`
- `creditCard`
- `database`
- `facebook`
- `file`
- `fileText`
- `folder`
- `folderOpen`
- `gear`
- `github`
- `globe`
- `hardDrive`
- `heart`
- `house`
- `inbox`
- `instagram`
- `key`
- `layers`
- `lock`
- `magnifyingGlass`
- `mail`
- `message`
- `phone`
- `plug`
- `receipt`
- `server`
- `share`
- `star`
- `telegram`
- `terminal`
- `unlock`
- `user`
- `userCheck`
- `userMinus`
- `userPlus`
- `users`
- `vk`
- `wallet`
- `x`
- `youtube`

Status And Messaging:

- `activity`
- `alertCircle`
- `ban`
- `checkCircle`
- `circleHalf`
- `circleNotch`
- `clock`
- `eye`
- `eyeSlash`
- `history`
- `info`
- `infoCircle`
- `moon`
- `question`
- `questionCircle`
- `rotateRight`
- `shield`
- `sparkles`
- `sun`
- `warning`
- `xCircle`

<!-- generated-icon-names:end -->

## Available Exports

Primary exports:

<!-- generated-exports:start -->

- `VueIconify`
- `icons`

<!-- generated-exports:end -->

## Design Principles

- Icons follow a custom UI-solid style built for compact product interfaces.
- Shapes use soft geometry, large negative space, and readable silhouettes at `16px` and `20px`.
- Most icons avoid tracing or reproducing third-party icon paths and keep their own proportions and corner treatment.
- Brand icons are the explicit exception and should be sourced from official assets/guidelines.
- New icons should be checked for optical balance, consistent thickness, and clear meaning before merge.

## Brand Icons And Trademarks

- Brand icons and names are trademarks of their respective owners.
- Use brand icons only to reference the corresponding brand/product/service and never to imply endorsement.
- Brand-specific usage rules vary and can change over time. Check each brand's official guidelines before shipping.
- If a rights holder requests updates or removal, keepers of this package should prioritize prompt compliance.
- `github` icon source and guidelines: [GitHub Logos and Usage](https://github.com/logos).

## Core Set

- The preferred starter set for product UIs is defined in [`src/lib/iconCore.json`](./src/lib/iconCore.json).
- It is intentionally smaller than the full pack and biased toward SaaS/admin dashboards, forms, tables, auth, billing, messaging, and infrastructure views.
- Semantic guidance for near-duplicates lives in [`docs/icon-audit.md`](./docs/icon-audit.md).

The public API intentionally uses a single rendering entry point:

- use `VueIconify` for rendering
- pass icon tokens from `icons` to the `icon` prop

## Development

```bash
npm ci
npm run create-icon -- alertTriangle feedback
npm run generate
npm run validate-icons
npm run lint
npm run typecheck
npm run build
npm run smoke
npm run render
```

`npm run create-icon -- <iconName> <categoryId>` scaffolds a new `solid` icon component, registers it in `src/lib/iconMeta.json`, and seeds title/keyword metadata in `src/lib/iconCatalog.json`.

`npm run validate-icons` fails if metadata, catalog entries, generated exports, `icons.json`, or README blocks are out of sync.

`npm run render` mounts a few public icons through Vue SSR to catch runtime regressions in the published bundle.

## Releases

- Bump version manually in `package.json` and `package-lock.json`.
- Add release notes manually to `CHANGELOG.md`.
- Run `npm run release` to build, verify, and publish to npm.

## Showcase

- `npm run dev` starts the local showcase.
- `npm run build:showcase` builds the demo app.
- The showcase is local-only for now and can later be embedded into your own site.

## License

[MIT](./LICENSE.md)
