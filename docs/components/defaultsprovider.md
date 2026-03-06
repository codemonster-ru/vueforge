# DefaultsProvider

DefaultsProvider scopes default prop policies for VueForge components to a subtree.

## Import

```ts
import DefaultsProvider from '@/package/components/defaults-provider.vue';
```

## Examples

### Scoped Defaults

```vue
<DefaultsProvider
    :defaults="{
        Button: {
            size: 'lg',
            rounded: true,
        },
    }"
>
    <Button>Large Rounded by Scope</Button>
</DefaultsProvider>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `defaults` | `ComponentDefaultsMap` | `{}` |
| `as` | `string` | `'div'` |

## Priority

1. Explicit component prop
2. Nearest `DefaultsProvider` scoped defaults
3. Component base defaults

## Recipes

- Use DefaultsProvider for local design policy shifts, demos, and app sections that need consistent defaults without repeating props.
- Nested providers are supported; inner scopes override outer defaults per component key.
