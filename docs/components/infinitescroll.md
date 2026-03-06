# InfiniteScroll

InfiniteScroll is a sentinel-based loading utility with intersection, scroll-fallback, and retry behavior.

## Import

```ts
import InfiniteScroll from '@/package/components/infinite-scroll.vue';
```

## Examples

### Basic

Use `InfiniteScroll` for feeds, activity lists, and paginated records that load progressively.

```vue
<InfiniteScroll :loading="loading" :error="error" :has-more="hasMore" @load="onLoadMore" @retry="onRetry">
    <ul>
        <li v-for="item in items" :key="item.id">
            {{ item.title }}
        </li>
    </ul>
</InfiniteScroll>
```

### Custom Error State

Use the `error` slot when retry UX needs product-specific messaging.

```vue
<InfiniteScroll :loading="loading" :error="error" :has-more="hasMore" @load="onLoadMore">
    <template #error="{ retry }">
        <Button label="Retry loading" @click="retry" />
    </template>
</InfiniteScroll>
```

### Manual Trigger Access

Use the exposed methods when loading should be refreshable from parent logic.

```vue
<InfiniteScroll ref="infiniteRef" :loading="loading" :has-more="hasMore" @load="onLoadMore">
    ...
</InfiniteScroll>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `loading` | `boolean` | `false` |
| `error` | `boolean` | `false` |
| `hasMore` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `root` | `HTMLElement \| null` | `null` |
| `scrollTarget` | `Window \| HTMLElement \| null` | `null` |
| `rootMargin` | `string` | `'0px 0px 220px 0px'` |
| `threshold` | `number` | `0` |
| `fallbackOffset` | `number` | `160` |
| `debounceMs` | `number` | `180` |
| `observeOnMount` | `boolean` | `true` |
| `loadingText` | `string` | `'Loading more...'` |
| `endText` | `string` | `'No more items'` |
| `retryLabel` | `string` | `'Retry'` |

### Events

| Name | Payload |
| --- | --- |
| `load` | `{ trigger: 'intersection' \| 'scroll' \| 'retry' \| 'manual' }` |
| `retry` | none |

### Slots

| Name | Description |
| --- | --- |
| `default` | Main list content. |
| `sentinel` | Idle sentinel content while more items are available. |
| `loading` | Loading state content. |
| `error` | Error state with `{ retry }`. |
| `end` | End state when `hasMore` is `false`. |

### Exposed Methods

| Name | Description |
| --- | --- |
| `loadMore()` | Triggers a manual load request. |
| `refresh()` | Rebinds observer or fallback listeners. |
| `retry()` | Emits retry flow and requests load again. |

## Theming

Override component tokens through `theme.overrides.components.infiniteScroll`.

## Tokens

- State layout: `gap`, `sentinelMinHeight`, `sentinelPadding`, `textColor`, `fontSize`, `loadingColor`, `errorColor`, `endColor`, `disabledOpacity`
- Sentinel hint: `hintWidth`, `hintHeight`, `hintColor`
- Retry action: `retryBorderColor`, `retryRadius`, `retryBackgroundColor`, `retryTextColor`, `retryPadding`, `retryFontSize`, `retryHoverBackgroundColor`, `focusRingColor`

## Recipes

- Use it for cursor-based or page-based progressive loading, not for replacing normal pagination everywhere.
- Keep retry UX explicit when upstream network failures are expected or frequent.

## Accessibility

- The sentinel area uses `role="status"` and can announce loading politely.
- Retry remains keyboard accessible through a native button.
