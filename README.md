# VueForge

[![npm](https://img.shields.io/npm/v/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![downloads](https://img.shields.io/npm/dw/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![license](https://img.shields.io/npm/l/@codemonster-ru/vueforge)](LICENSE)

Open source UI library for Vue 3, split into core components and layouts.

## Install

```bash
npm i @codemonster-ru/vueforge
```

Optional companion packages:

```bash
npm i @codemonster-ru/vueforge-layouts
```

Peer dependencies:

- `vue` (v3)
- `vue-router` (v4)
- `@codemonster-ru/vueiconify`

## Quick Start

```ts
import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@codemonster-ru/vueforge';
import '@codemonster-ru/vueforge/dist/index.css';
import '@codemonster-ru/vueforge-layouts/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(VueForge, {
    theme: {
        preset: DefaultTheme,
    },
});
```

```vue
<template>
    <Container size="lg">
        <PageHeader title="Dashboard" subtitle="Manage projects and teams">
            <template #actions>
                <Button label="Create project" />
            </template>
        </PageHeader>
    </Container>
</template>

<script setup lang="ts">
import { Container, Button } from '@codemonster-ru/vueforge';
import { PageHeader } from '@codemonster-ru/vueforge-layouts';
</script>
```

## Packages

- `@codemonster-ru/vueforge`: core primitives, forms, overlays, data display, services, theme/config runtime
- `@codemonster-ru/vueforge-layouts`: app shell and layout composition

`@codemonster-ru/vueforge-layouts` complements the core package for app-shell and page layout composition.

Full catalog: [`docs/components/README.md`](docs/components/README.md)

## Documentation

- Theming: [`docs/theming.md`](docs/theming.md)
- Date/time locale setup: [`docs/guides/date-time-locale-setup.md`](docs/guides/date-time-locale-setup.md)
- Locale text setup: [`docs/guides/locale-text-setup.md`](docs/guides/locale-text-setup.md)
- i18n + RTL setup: [`docs/guides/i18n-rtl-setup.md`](docs/guides/i18n-rtl-setup.md)
- Live examples recipe: [`docs/recipes/live-playground.md`](docs/recipes/live-playground.md)
- Core copy-paste cookbook: [`docs/recipes/core-cookbook.md`](docs/recipes/core-cookbook.md)
- Components catalog: [`docs/components/README.md`](docs/components/README.md)
- Package split migration: [`docs/guides/package-split.md`](docs/guides/package-split.md)
- Package versioning / release tags: [`docs/contributing/package-versioning.md`](docs/contributing/package-versioning.md)
- Roadmap / execution checklist: [`CHECKLIST.md`](CHECKLIST.md)
- Release notes: [`CHANGELOG.md`](CHANGELOG.md)

## Development

```bash
npm run dev
npm run test
npm run typecheck
npm run build
```

## Release Tags

- `vueforge-vx.y.z` publishes `@codemonster-ru/vueforge`
- `layouts-vx.y.z` publishes `@codemonster-ru/vueforge-layouts`

## License

[MIT](LICENSE)

## Author

[@KolesnikovKirill](https://github.com/kolesnikovKirill)
