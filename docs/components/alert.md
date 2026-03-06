# Alert

Display inline status, feedback, and recovery actions for forms, pages, and operational workflows.

## Import

```ts
import { Alert } from '@codemonster-ru/vueforge';
```

## Examples

Keep `Alert` examples compact and situational. In most screens, the component works best when the copy is short and actions are limited to one recovery path.

### Basic

Use the neutral variant for passive context, reminders, and inline notices.

```vue
<template>
    <Alert title="Team access" message="Changes to roles may take up to 5 minutes to propagate." />
</template>
```

### Severities

Use severity to communicate system state and urgency without changing the overall layout.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Alert severity="info" title="Deployment queued" message="Your release is waiting for a runner." />
        <Alert severity="success" title="Saved" message="Project settings were updated." />
        <Alert severity="warn" title="Unsaved changes" message="Leave this page only after saving." />
        <Alert severity="danger" title="Sync failed" message="We could not refresh the dataset." />
    </div>
</template>
```

### Closable

Use `closable` when the message is dismissible and not required for understanding the current screen.

```vue
<template>
    <Alert v-model="visible" severity="warn" title="Maintenance notice" closable>
        Scheduled maintenance starts at 22:00 UTC.
    </Alert>
</template>
```

### Actions

Use the `actions` slot for a single recovery action or follow-up step.

```vue
<template>
    <Alert severity="danger" title="Billing issue">
        The latest invoice could not be charged.
        <template #actions>
            <Button label="Retry payment" size="small" />
        </template>
    </Alert>
</template>
```

### Custom Content

Slots let you replace the icon, title, body, or close control when product copy needs more structure.

```vue
<template>
    <Alert severity="info" closable icon="circleInfo">
        <template #title>Workspace notice</template>
        New teammates can view dashboards immediately, but audit log access is provisioned separately.
    </Alert>
</template>
```

## Props

- `modelValue?: boolean` (optional v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `false`)
- `icon?: string`

## Events

- `update:modelValue`
- `close`

## Slots

- `default` - message content (fallbacks to `message`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)
- `close` (optional)

## Theming

- Override via `theme.overrides.components.alert`.

## Tokens

Component tokens (override via `theme.overrides.components.alert`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`, `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

## Recipes

- Use `neutral` or `info` for contextual guidance that should not interrupt the task.
- Use `warn` and `danger` only when the user needs to stop, fix, or confirm something.
- Keep the title short and let the body carry the recovery details.
- Prefer one action inside `actions`; multiple actions usually belong in a dialog instead.

## Accessibility

- The root uses `role="alert"` so content is announced as status feedback.
- If `closable` is enabled, the close button is keyboard reachable and needs a clear accessible label when overridden.
- Keep icon-only customizations decorative with `aria-hidden="true"` unless the icon itself carries meaning.
