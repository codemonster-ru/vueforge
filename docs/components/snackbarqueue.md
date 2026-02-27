# SnackbarQueue

## Purpose

Queue and orchestrate snackbar/toast notifications so only a limited number are visible at once.

## Props

- `items?: Array<SnackbarQueueItem>`
- `maxVisible?: number` (default `1`)
- `defaultDuration?: number` (default `3500`)
- `dedupe?: boolean` (default `true`)
- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default `bottom-right`)
- `ariaLabel?: string` (default `Snackbar notifications`)

## Events

- `enqueue`
- `dequeue`
- `action`
- `change`

## Exposed Methods

- `enqueue(item)`
- `dequeueById(id)`
- `clear()`

## Example

```vue
<SnackbarQueue ref="snacks" :max-visible="1" />
```

## Tokens

Component tokens (override via `theme.overrides.components.snackbarQueue`):

- `actionGap`
- `actionPadding`
- `actionRadius`
- `actionBorderColor`
- `actionBackgroundColor`
- `actionTextColor`
- `actionHoverBackgroundColor`

## Accessibility

- Uses the same live-region semantics as `ToastContainer`/`Toast`.
- Action button remains keyboard accessible in each queued item.
