# Locale Text Setup

VueForge provides a global runtime locale text API for default `loading`, `empty`, and related fallback labels.

## Runtime API

```ts
import { setLocaleText, updateLocaleText, getLocaleText } from '@codemonster-ru/vueforge';

setLocaleText({
    common: {
        loadingText: 'Loading...',
        emptyText: 'No results',
    },
    dataTable: {
        emptyText: 'No rows',
        selectAllAriaLabel: 'Select all rows',
    },
});

updateLocaleText({
    autocomplete: {
        emptyText: 'No matches',
    },
});

const current = getLocaleText();
```

## Plugin Setup

```ts
import { createApp } from 'vue';
import { VueForge } from '@codemonster-ru/vueforge';

createApp(App).use(VueForge, {
    localeText: {
        commandPalette: {
            emptyText: 'No commands',
        },
        notificationCenter: {
            emptyText: 'No notifications',
        },
    },
});
```

## Priority

- Component prop value has highest priority.
- If prop is not provided, VueForge uses global locale text config.
- If locale text config is not provided, VueForge uses built-in defaults.

## Built-in Strings Coverage

Built-in component strings are now localized through `localeText`, including:

- loading/empty state text for data and selection components
- component action labels (`DataTable`, `NotificationCenter`, `FilterChips`)
- default placeholders and panel labels (`CommandPalette`, `MultiSelect`, `TreeSelect`)
- default clear/remove accessibility labels (`Combobox`, `TagInput`, `Chip`)

For combined locale text + RTL setup, see: [i18n and RTL Setup](./i18n-rtl-setup.md)
