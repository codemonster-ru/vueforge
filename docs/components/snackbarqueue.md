# SnackbarQueue

Queue and orchestrate toast-style notifications so only a limited number are visible at once.

## Import

```ts
import { SnackbarQueue } from '@codemonster-ru/vueforge';
```

## Examples

Use `SnackbarQueue` when the app should manage notification flow centrally instead of rendering each toast manually.

### Basic

Use the queue near the app shell and feed it via its exposed methods or `items` prop.

```vue
<template>
    <SnackbarQueue ref="snacks" :max-visible="1" />
</template>
```

### Multiple Queued Items

Use `items` when the queue is driven declaratively from state.

```vue
<template>
    <SnackbarQueue
        :items="[
            { id: 'saved', title: 'Saved', message: 'Changes were stored.', severity: 'success' },
            { id: 'sync', title: 'Sync delayed', message: 'Background sync is still running.', severity: 'warn' },
        ]"
        :max-visible="2"
    />
</template>
```

### With Action Button

Use `actionLabel` for a single immediate follow-up action.

```vue
<template>
    <SnackbarQueue
        :items="[
            {
                id: 'undo-delete',
                title: 'Project archived',
                message: 'You can restore it from the archive.',
                actionLabel: 'Undo',
            },
        ]"
    />
</template>
```

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

## Architecture

- `SnackbarQueue` is an orchestration wrapper over `ToastContainer` and `Toast`.
- Use `Toast` directly when a single feature owns notification rendering.
- Use `SnackbarQueue` when multiple features may emit notifications concurrently.

## Theming

- Queue action affordances are overridden via `theme.overrides.components.snackbarQueue`.
- Toast surface styling still comes from `theme.overrides.components.toast`.

## Tokens

Component tokens (override via `theme.overrides.components.snackbarQueue`):

- `actionGap`
- `actionPadding`
- `actionRadius`
- `actionBorderColor`
- `actionBackgroundColor`
- `actionTextColor`
- `actionHoverBackgroundColor`

## Recipes

- Keep dedupe enabled unless repeated identical notifications are genuinely useful.
- Limit visible count so notifications inform without overwhelming the viewport.
- Prefer one action per snackbar; complex interaction belongs in the page, not the queue item.

## Accessibility

- Uses the same live-region semantics as `ToastContainer` and `Toast`.
- Action buttons remain keyboard accessible in each queued item.
