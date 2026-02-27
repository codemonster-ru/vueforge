# LocaleProvider

## Purpose

Provide subtree-scoped locale text overrides for VueForge components using `useLocaleText`.

## Props

- `localeText?: LocaleTextOptions` - local i18n overrides.
- `as?: string` (default `div`) - root element tag.

## Example

```vue
<script setup lang="ts">
import { LocaleProvider, CommandPalette } from '@codemonster-ru/vueforge';
</script>

<template>
    <LocaleProvider
        :locale-text="{
            commandPalette: {
                placeholder: 'Введите команду...',
                emptyText: 'Команды не найдены',
            },
        }"
    >
        <CommandPalette />
    </LocaleProvider>
</template>
```

## Priority

1. Explicit component prop text
2. Nearest `LocaleProvider` scoped locale
3. Global locale from `setLocaleText` / `updateLocaleText`
