# LocaleProvider

LocaleProvider scopes VueForge locale text overrides to a subtree.

## Import

```ts
import { LocaleProvider } from '@codemonster-ru/vueforge';
```

## Examples

### Scoped Locale

```vue
<LocaleProvider
    :locale-text="{
        dataTable: {
            empty: 'Нет данных',
            loading: 'Загрузка...',
        },
    }"
>
    <DataTable :columns="columns" :rows="[]" />
</LocaleProvider>
```

## API

### Props

| Name         | Type                | Default |
| ------------ | ------------------- | ------- |
| `localeText` | `LocaleTextOptions` | `{}`    |
| `as`         | `string`            | `'div'` |

## Priority

1. Explicit component prop text
2. Nearest `LocaleProvider` scoped locale
3. Global locale from `setLocaleText` or `updateLocaleText`

## Recipes

- Use LocaleProvider for embedded localized regions, previews, and app sections that temporarily differ from the global locale policy.
