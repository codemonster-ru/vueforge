# Link

Link provides a single abstraction for external anchors and internal router navigation.

## Import

```ts
import Link from '@/package/components/link.vue';
```

## Examples

### External Link

Use `href` or `url` for normal anchor navigation.

```vue
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
    External
</Link>
```

### Internal Navigation

Use `to` for Vue Router navigation and active-state integration.

```vue
<Link to="/settings">
    Router link
</Link>
```

### Disabled Link

Use `disabled` when navigation should remain visible but inactive.

```vue
<Link href="https://example.com" disabled>
    Disabled external
</Link>
```

### Controlled Active State

Provide `active` explicitly when router matching is not the right source of truth.

```vue
<Link href="/reports" :active="true">
    Reports
</Link>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `to` | `string \| RouteLocation \| undefined` | `undefined` |
| `href` | `string \| undefined` | `undefined` |
| `url` | `string \| undefined` | `undefined` |
| `as` | `'a' \| 'router-link' \| undefined` | `undefined` |
| `type` | `string \| undefined` | `undefined` |
| `label` | `string` | `''` |
| `active` | `boolean \| undefined` | `undefined` |
| `disabled` | `boolean \| undefined` | `undefined` |

### Events

| Name | Payload |
| --- | --- |
| `click` | `MouseEvent` |
| `active` | none |
| `update:active` | `boolean` |
| `onActive` | none |

### Slots

| Name | Description |
| --- | --- |
| `default` | Replaces the label text. |

## Theming

Override component tokens through `theme.overrides.components.link`.

## Tokens

- `hoverColor`
- `activeColor`

## Recipes

- Use `to` for in-app navigation and `href` or `url` for external destinations.
- Keep `target="_blank"` paired with `rel="noopener noreferrer"` for external tabs.

## Accessibility

- Disabled links set `aria-disabled`, remove tab focus, and block keyboard activation.
- Prefer clear link text instead of generic labels like `Read more` when surrounding context is weak.
