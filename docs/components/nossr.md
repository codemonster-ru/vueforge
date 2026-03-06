# NoSsr

NoSsr renders browser-only content only after client mount while keeping SSR and hydration markup deterministic.

## Import

```ts
import NoSsr from '@/package/components/no-ssr.vue';
```

## Examples

### Basic

```vue
<NoSsr>
    <RichTextEditor />
    <template #fallback>
        <div>Editor is loading...</div>
    </template>
</NoSsr>
```

### Built-In Placeholder

Use the built-in placeholder when a custom fallback is unnecessary.

```vue
<NoSsr placeholder fallback-tag="span">
    <ClientOnlyMap />
</NoSsr>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `placeholder` | `boolean` | `true` |
| `fallbackTag` | `string` | `'span'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Content rendered only after client mount. |
| `fallback` | SSR and initial hydration fallback content. |

## Recipes

- Use NoSsr for browser-only editors, charts, maps, and widgets that rely on DOM APIs during setup.
- Keep fallback output deterministic so hydration stays stable.

