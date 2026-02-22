# i18n and RTL Setup

This guide combines VueForge locale text configuration with RTL layout setup.

## 1) Configure Localized Built-in Text

Use VueForge plugin options (or runtime API) to localize built-in component strings.

```ts
import { createApp } from 'vue';
import { VueForge } from '@codemonster-ru/vueforge';

createApp(App).use(VueForge, {
    localeText: {
        dataTable: {
            loadingText: 'Cargando...',
            emptyText: 'Sin datos',
            selectedSuffix: 'seleccionados',
        },
        commandPalette: {
            placeholder: 'Escribe un comando...',
            emptyText: 'Sin comandos',
        },
        notificationCenter: {
            title: 'Notificaciones',
            markAllLabel: 'Marcar todas como leidas',
        },
    },
});
```

Runtime update example:

```ts
import { updateLocaleText } from '@codemonster-ru/vueforge';

updateLocaleText({
    multiSelect: {
        emptyText: 'Sin resultados',
    },
});
```

## 2) Enable RTL Direction

Set document direction at app bootstrap (or per page/container if required).

```ts
document.documentElement.setAttribute('dir', 'rtl');
```

Vue template example:

```vue
<template>
    <main dir="rtl">
        <DataTable :rows="rows" :columns="columns" />
    </main>
</template>
```

## 3) Recommended Verification

- Run RTL regression checks:
    - `npx vitest run src/package/components/__tests__/rtl-regression.test.ts`
- Run visual baseline checks:
    - `npm run test:visual`
- Run full quality gate:
    - `npm run lint`
    - `npm run typecheck`
    - `npm run test`

## Notes

- Component props still override global locale text.
- Prefer logical CSS properties (`inline-start/end`, `text-align: start/end`) in custom extensions.
- Keep RTL checks in PR scope for components that use directional layout.
