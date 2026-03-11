# Toast / ToastContainer

Display non-blocking transient notifications in a positioned stack.

## Import

```ts
import { Toast, ToastContainer } from '@codemonster-ru/vueforge';
```

## Examples

Use `Toast` for lightweight global feedback that should not interrupt the current task.

### Basic

Use one container near the app root and render toasts inside it.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const toastOpen = ref(true);
</script>

<template>
    <ToastContainer position="top-right">
        <Toast v-model="toastOpen" title="Saved" message="Changes are saved." severity="success" :duration="2500" />
    </ToastContainer>
</template>
```

### Persistent Warning

Set `duration="0"` for user-dismissed notifications.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const toastOpen = ref(true);
</script>

<template>
    <ToastContainer position="bottom-right">
        <Toast
            v-model="toastOpen"
            title="Sync delayed"
            message="The background job is still running."
            severity="warn"
            :duration="0"
        />
    </ToastContainer>
</template>
```

### Custom Body Content

Use the default slot when the message body needs richer inline content.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const toastOpen = ref(true);
</script>

<template>
    <ToastContainer>
        <Toast v-model="toastOpen" title="Deployment finished" severity="success">
            Workspace metrics are ready to review.
        </Toast>
    </ToastContainer>
</template>
```

## Toast Props

- `modelValue?: boolean` (v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `true`)
- `duration?: number` (ms, default `0`, no auto-close)

## ToastContainer Props

- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default `top-right`)
- `ariaLabel?: string` (default `Notifications`)

## Events

- `Toast`: `update:modelValue`, `open`, `close`
- `ToastContainer`: this component does not emit component-specific events

## Slots

- `Toast`: `default` (message body), `close` (close control content)
- `ToastContainer`: `default` for stacked `Toast` items

## Theming

- Override via `theme.overrides.components.toast`.

## Tokens

Component tokens (override via `theme.overrides.components.toast`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `shadow`, `minWidth`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`, `closeSize`
- `containerGap`, `containerPadding`, `containerMaxWidth`, `zIndex`
- `info.*`, `success.*`, `warn.*`, `danger.*`

## Recipes

- Use short-lived success toasts for save or completion feedback.
- Use persistent warning toasts only when the user can safely dismiss them later.
- Keep a single `ToastContainer` near the app root and feed it from app or feature state.

## Accessibility

- Toast uses `role="status"` with `aria-live="polite"` for non-blocking announcements.
- `ToastContainer` uses a live region and supports `ariaLabel`.
- Close control is a native button with accessible label `Close toast`.
