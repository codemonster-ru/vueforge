# Message

Provide a compatibility-oriented alias for inline status messaging built on `Alert`.

## Import

```ts
import { Message } from '@codemonster-ru/vueforge';
```

## Examples

Use `Message` only when maintaining an older API or migration path. Prefer `Alert` in new code.

### Basic

Use the same content shape as `Alert` for quick migration.

```vue
<template>
    <Message severity="info" title="Draft mode"> Changes are saved locally until you publish. </Message>
</template>
```

### Closable

The alias forwards dismiss behavior and slots to `Alert`.

```vue
<template>
    <Message severity="warn" title="Unsaved changes" closable> Leave this page only after saving. </Message>
</template>
```

### With Actions

Use the same action slot contract as `Alert`.

```vue
<template>
    <Message severity="danger" title="Connection lost">
        Reconnect to continue syncing workspace updates.
        <template #actions>
            <Button size="small" severity="danger">Retry</Button>
        </template>
    </Message>
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

## Guidance Vs Alert

- `Alert` is the canonical component for new implementation.
- `Message` exists for migration compatibility and API familiarity.
- Behavior, semantics, and visual tokens are shared with `Alert`.

## Theming

- In practice this component follows the same visual contract as `Alert`.
- Prefer overriding `theme.overrides.components.alert`.

## Tokens

- Uses the `Alert` token contract: `gap`, `padding`, `border*`, `backgroundColor`, severity overrides, and action or close-control tokens.

## Recipes

- Use `Message` when preserving an older public API surface matters more than renaming to `Alert`.
- For all new docs and new implementation, standardize on `Alert`.
- Do not fork the visuals separately unless the alias intentionally diverges in your design system.

## Accessibility

- Inherits `role="alert"` semantics from `Alert`.
- Keep severity and message text concise for assistive announcements.
