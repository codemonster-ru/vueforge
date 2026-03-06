# Badge

Show compact status and metadata markers inline without adding interactive behavior.

## Import

```ts
import { Badge } from '@codemonster-ru/vueforge';
```

## Examples

Use `Badge` for short, passive labels that support scanning and status recognition.

### Basic

Use the default soft badge for neutral metadata and lightweight labels.

```vue
<template>
    <Inline gap="0.5rem">
        <Badge label="Beta" />
        <Badge label="Internal" />
    </Inline>
</template>
```

### Severities

Use severity to communicate state without changing layout.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Badge severity="neutral">Draft</Badge>
        <Badge severity="info">Queued</Badge>
        <Badge severity="success">Active</Badge>
        <Badge severity="warn">Pending</Badge>
        <Badge severity="danger">Blocked</Badge>
    </Inline>
</template>
```

### Variants

Switch variant to match the visual weight of the surrounding surface.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <Badge variant="solid" severity="info">Solid</Badge>
        <Badge variant="soft" severity="info">Soft</Badge>
        <Badge variant="outline" severity="info">Outline</Badge>
    </Inline>
</template>
```

### Sizes

Adjust size for dense tables or roomier page headers.

```vue
<template>
    <Inline gap="0.5rem" align="center">
        <Badge size="small">Small</Badge>
        <Badge>Default</Badge>
        <Badge size="large">Large</Badge>
    </Inline>
</template>
```

## Props

- `label?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'solid' | 'soft' | 'outline'` (default `soft`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `ariaLabel?: string`

## Events

- This component does not emit component-specific events.

## Slots

- `default` - badge content (fallbacks to `label`)

## Theming

- Override via `theme.overrides.components.badge`.

## Tokens

Component tokens (override via `theme.overrides.components.badge`):

- `fontSize`, `lineHeight`, `paddingX`, `paddingY`, `borderRadius`, `gap`
- `backgroundColor`, `textColor`, `borderColor`
- `softBackgroundColor`, `softTextColor`, `softBorderColor`
- `outlineTextColor`, `outlineBorderColor`
- `info.*`, `success.*`, `warn.*`, `danger.*`
- `small.fontSize`, `small.paddingX`, `small.paddingY`
- `large.fontSize`, `large.paddingX`, `large.paddingY`

## Recipes

- Use `Badge` for short, passive status markers rather than actions or dismissible UI.
- Keep badge text brief and standardized across the product so users learn the vocabulary quickly.
- Prefer `soft` for most metadata and reserve `solid` for states that should stand out strongly.

## Accessibility

- Badge renders with `role="status"` and should describe meaningful state, not decorative noise.
- Keep accessible labels concise when `ariaLabel` is used.
- Ensure sufficient color contrast in usage contexts.
