# Lazy

Lazy defers mounting of heavy subtree content until it becomes visible, with optional placeholder, delay, and one-time activation behavior.

## Import

```ts
import Lazy from '@/package/components/lazy.vue';
```

## Examples

### Basic

```vue
<Lazy :once="true" root-margin="250px">
    <HeavyChart />
    <template #placeholder>
        <Skeleton height="220px" />
    </template>
</Lazy>
```

### Eager Fallback

Use `eager` to bypass intersection logic while still keeping the same wrapper API.

```vue
<Lazy eager>
    <ExpensiveSection />
</Lazy>
```

### Re-Enter Behavior

Set `once="false"` when the content should mount and unmount as visibility changes.

```vue
<Lazy :once="false" @enter="trackVisible" @leave="trackHidden">
    <VideoPreview />
</Lazy>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'div'` |
| `when` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `eager` | `boolean` | `false` |
| `once` | `boolean` | `true` |
| `delay` | `number` | `0` |
| `rootMargin` | `string` | `'200px'` |
| `threshold` | `number` | `0` |
| `placeholderTag` | `string` | `'div'` |
| `ariaLabel` | `string` | `''` |

### Events

| Name | Payload |
| --- | --- |
| `enter` | none |
| `leave` | none |

### Slots

| Name | Description |
| --- | --- |
| `default` | Content mounted when active. |
| `placeholder` | Fallback content before activation. |

## Theming

Override component tokens through `theme.overrides.components.lazy`.

## Tokens

- `placeholderMinHeight`
- `placeholderBorderRadius`
- `placeholderBackgroundColor`
- `disabledOpacity`

## Recipes

- Use Lazy for charts, code editors, media previews, and other expensive subtrees below the fold.
- Prefer route-level code splitting for whole-page boundaries; use Lazy for in-page deferral.

## Accessibility

- Placeholder content should remain meaningful when the deferred content is important for page comprehension.
- When `IntersectionObserver` is unavailable, Lazy falls back to immediate mount instead of failing silently.

