# InlineMessage

Show compact field-local status, helper, or validation text near form controls.

## Import

```ts
import { InlineMessage } from '@codemonster-ru/vueforge';
```

## Examples

Use `InlineMessage` for local form feedback that should stay attached to a nearby field or control group.

### Basic

Use an info message for helper guidance below a field.

```vue
<template>
    <InlineMessage severity="info" title="Billing email">
        This address is used for invoices and payment alerts.
    </InlineMessage>
</template>
```

### Validation Error

Use warning or danger for field-local problems that need correction.

```vue
<template>
    <InlineMessage severity="danger" title="Invalid VAT ID">
        Check the country code and registration number.
    </InlineMessage>
</template>
```

### Sizes

Adjust size for dense forms or more spacious form layouts.

```vue
<template>
    <Stack gap="0.5rem">
        <InlineMessage size="small" severity="info">Small helper text</InlineMessage>
        <InlineMessage severity="warn">Default warning text</InlineMessage>
        <InlineMessage size="large" severity="success">Large success text</InlineMessage>
    </Stack>
</template>
```

### Custom Announcement Behavior

Override `role` and `ariaLive` only when the default automatic behavior is not appropriate.

```vue
<template>
    <InlineMessage severity="info" role="status" aria-live="polite"> Search results update as you type. </InlineMessage>
</template>
```

## Props

- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `role?: 'auto' | 'status' | 'alert' | 'none'` (default `auto`)
- `ariaLive?: 'auto' | 'off' | 'polite' | 'assertive'` (default `auto`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - message content (fallbacks to `message`)
- `title` (optional)
- `icon` (optional)

## Theming

- Override via `theme.overrides.components.inlineMessage`.

## Tokens

- `gap`, `paddingX`, `paddingY`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`
- `iconColor`, `iconSize`
- `fontSize`, `lineHeight`
- `bodyGap`, `titleFontSize`, `titleFontWeight`
- `info.*`, `success.*`, `warn.*`, `danger.*`
- `small.*`, `large.*`

## Recipes

- Place `InlineMessage` directly below inputs or selects for local correction guidance.
- Use `severity="info"` for helper guidance and `severity="danger"` for invalid state messaging.
- Keep titles short; the body should carry the actionable correction detail.

## Accessibility

- Default `role` and `aria-live` are automatic:
- `warn` or `danger` -> `alert` and `assertive`
- `neutral`, `info`, or `success` -> `status` and `polite`
- Override with `role` or `ariaLive` only when announcement behavior must be customized.
