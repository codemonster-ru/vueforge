# LocaleProvider

LocaleProvider scopes VueForge locale text overrides to a subtree.

## Import

```ts
import LocaleProvider from '@/package/components/locale-provider.vue';
```

## Examples

### Scoped Locale

```vue
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
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `localeText` | `LocaleTextOptions` | `{}` |
| `as` | `string` | `'div'` |

## Priority

1. Explicit component prop text
2. Nearest `LocaleProvider` scoped locale
3. Global locale from `setLocaleText` or `updateLocaleText`

## Recipes

- Use LocaleProvider for embedded localized regions, previews, and app sections that temporarily differ from the global locale policy.

