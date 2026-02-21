# VueForge

[![npm](https://img.shields.io/npm/v/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![downloads](https://img.shields.io/npm/dw/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![license](https://img.shields.io/npm/l/@codemonster-ru/vueforge)](LICENSE)

Open source component-level UI library for Vue 3.

## Install

```bash
npm i @codemonster-ru/vueforge
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
import { Container, PageHeader, Button } from '@codemonster-ru/vueforge';
</script>
```

## Components

VueForge currently includes core building blocks for:

- Layout and navigation: `Container`, `Section`, `Grid`, `AppShell`, `Menu`, `Link`, `Breadcrumbs`, `PageHeader`, `Divider`
- Forms and inputs: `Form`, `FormField`, `Input`, `Textarea`, `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `Date*`, `Time*`
- Data display: `DataTable`, `Pagination`, `VirtualScroller`, `Card`, `EmptyState`
- Overlays and feedback: `Modal`, `Drawer`, `Popover`, `Dropdown`, `ContextMenu`, `Tooltip`, `Toast`, `Alert`, `NotificationCenter`
- Advanced interaction: `CommandPalette`, `Tour`, `KanbanBoard`, `Tree`, `TreeSelect`, `Wizard`, `Stepper`, `Tabs`, `Accordion`

Full catalog: [`docs/components/README.md`](docs/components/README.md)

## Documentation

- Theming: [`docs/theming.md`](docs/theming.md)
- Components catalog: [`docs/components/README.md`](docs/components/README.md)
- Roadmap / execution checklist: [`CHECKLIST.md`](CHECKLIST.md)
- Release notes: [`CHANGELOG.md`](CHANGELOG.md)

## Development

```bash
npm run dev
npm run test
npm run typecheck
npm run build
```

## License

[MIT](LICENSE)

## Author

[@KolesnikovKirill](https://github.com/kolesnikovKirill)
