# InfiniteScroll

## Purpose

Provide a sentinel-based infinite loading utility with automatic intersection/scroll triggers and retry recovery state.

## Props

- `loading?: boolean` (default `false`)
- `error?: boolean` (default `false`)
- `hasMore?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `root?: HTMLElement | null` (intersection root)
- `scrollTarget?: Window | HTMLElement | null` (fallback mode target)
- `rootMargin?: string` (default `0px 0px 220px 0px`)
- `threshold?: number` (default `0`)
- `fallbackOffset?: number` (default `160`)
- `debounceMs?: number` (default `180`)
- `observeOnMount?: boolean` (default `true`)
- `loadingText?: string` (default `Loading more...`)
- `endText?: string` (default `No more items`)
- `retryLabel?: string` (default `Retry`)

## Events

- `load` payload: `{ trigger: 'intersection' | 'scroll' | 'retry' | 'manual' }`
- `retry`

## Slots

- `default` (list/content area)
- `sentinel` (idle sentinel content when more items are available)
- `loading` (loading state)
- `error` (retry state, slot props: `{ retry }`)
- `end` (terminal state when `hasMore=false`)

## Examples

```vue
<InfiniteScroll :loading="loading" :error="error" :has-more="hasMore" @load="onLoadMore" @retry="onRetry">
    <ul>
        <li v-for="item in items" :key="item.id">{{ item.title }}</li>
    </ul>
</InfiniteScroll>
```

## Theming

- Override via `theme.overrides.components.infiniteScroll`.

## Tokens

- Layout/state: `gap`, `sentinelMinHeight`, `sentinelPadding`, `textColor`, `fontSize`, `loadingColor`, `errorColor`, `endColor`, `disabledOpacity`
- Sentinel hint: `hintWidth`, `hintHeight`, `hintColor`
- Retry action: `retryBorderColor`, `retryRadius`, `retryBackgroundColor`, `retryTextColor`, `retryPadding`, `retryFontSize`, `retryHoverBackgroundColor`, `focusRingColor`

## Recipes

- Feed/timeline pagination with cursor API.
- Table/list pages with progressive loading and explicit retry flow.

## Accessibility

- Sentinel area uses `role="status"` with polite live updates during loading.
- Retry action is keyboard accessible and supports focus-visible ring tokens.

## Responsive

- Works with viewport or custom scroll containers for mobile/desktop list surfaces.

## SSR/Hydration

- Safe for SSR: observers/listeners are attached only on client mount.

## Testing

- Cover intersection trigger, scroll fallback trigger, retry recovery, and end-state behavior.
