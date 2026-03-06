# Chip

Show compact labeled pills that can optionally include an icon or a close action.

## Import

```ts
import { Chip } from '@codemonster-ru/vueforge';
```

## Examples

Use `Chip` when the content may need an icon or explicit removal action, not just a passive label.

### Basic

Use the default chip for simple labels and lightweight entity tags.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Chip label="New" />
        <Chip label="Design" />
    </Inline>
</template>
```

### With Severity

Use severity to reflect category or state while keeping the compact chip shape.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Chip severity="info">Info</Chip>
        <Chip severity="success">Ready</Chip>
        <Chip severity="warn">Needs review</Chip>
        <Chip severity="danger">Blocked</Chip>
    </Inline>
</template>
```

### Closable

Turn on `closable` when the chip represents something the user can remove from the current context.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Chip closable>Vue</Chip>
        <Chip closable severity="info">TypeScript</Chip>
    </Inline>
</template>
```

### With Icon

Use an icon when it improves recognition and the chip still stays short.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Chip icon="circleInfo">Info</Chip>
        <Chip icon="check" severity="success">Synced</Chip>
    </Inline>
</template>
```

## Props

- `label?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'solid' | 'soft' | 'outline'` (default `soft`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `disabled?: boolean`
- `closable?: boolean` (default `false`)
- `icon?: string`
- `ariaLabel?: string`
- `closeLabel?: string` (default locale `Remove`)

## Events

- `close`

## Slots

- `default` - chip content (fallbacks to `label`)
- `icon` (optional)
- `close` (optional)

## Theming

- Override via `theme.overrides.components.chip`.

## Tokens

Component tokens (override via `theme.overrides.components.chip`):

- `fontSize`, `lineHeight`, `paddingX`, `paddingY`, `borderRadius`, `gap`
- `backgroundColor`, `textColor`, `borderColor`
- `softBackgroundColor`, `softTextColor`, `softBorderColor`
- `outlineTextColor`, `outlineBorderColor`
- `iconSize`, `closeSize`, `closeFontSize`, `closeRadius`, `closeColor`, `closeHoverBackgroundColor`, `disabledOpacity`
- `info.*`, `success.*`, `warn.*`, `danger.*`
- `small.fontSize`, `small.paddingX`, `small.paddingY`
- `large.fontSize`, `large.paddingX`, `large.paddingY`

## Recipes

- Use `Chip` for removable tags, selected filters, and compact labeled entities.
- Prefer `Badge` when no icon or close action is needed.
- Keep closeable chips clearly user-owned so removal does not feel destructive or ambiguous.

## Accessibility

- Chip renders with `role="status"` for passive state communication.
- The close control is a native button and should have a clear accessible label.
- Ensure sufficient color contrast in usage contexts.
