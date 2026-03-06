# Banner

Show page-level announcements and action prompts inline within the document flow.

## Import

```ts
import { Banner } from '@codemonster-ru/vueforge';
```

## Examples

Use `Banner` for page-wide context that should stay visible in flow, not for field-local or transient feedback.

### Basic

Use a standard info banner for page-level announcements.

```vue
<template>
    <Banner severity="info" title="Billing update">
        Prices will be updated on March 1.
    </Banner>
</template>
```

### With Actions

Use the `actions` slot when the banner needs a follow-up action.

```vue
<template>
    <Banner severity="warn" title="Usage limit approaching">
        You have reached 85% of your monthly quota.
        <template #actions>
            <Button size="small">Upgrade</Button>
        </template>
    </Banner>
</template>
```

### Closable

Turn on `closable` when the banner is dismissible and not required for continued task understanding.

```vue
<template>
    <Banner severity="info" title="New navigation available" closable>
        Try the updated workspace sidebar.
    </Banner>
</template>
```

### Sticky

Use `sticky` for persistent page notices that should remain visible while the user scrolls.

```vue
<template>
    <Banner sticky severity="danger" title="Service disruption">
        Some reports may load slower than usual.
    </Banner>
</template>
```

## Props

- `as?: string` (default `section`)
- `modelValue?: boolean`
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `false`)
- `sticky?: boolean` (default `false`)
- `icon?: string`
- `role?: 'auto' | 'status' | 'alert' | 'region' | 'none'` (default `auto`)
- `ariaLive?: 'auto' | 'off' | 'polite' | 'assertive'` (default `auto`)
- `ariaLabel?: string`
- `actionsAriaLabel?: string` (default `Banner actions`)
- `closeLabel?: string` (default `Dismiss banner`)

## Events

- `update:modelValue`
- `close`

## Slots

- `icon`
- `title`
- `default`
- `actions`
- `close`

## Theming

- Override via `theme.overrides.components.banner`.

## Tokens

Component tokens (override via `theme.overrides.components.banner`):

- `gap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`
- `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `stickyTop`, `zIndex`
- `info.*`, `success.*`, `warn.*`, `danger.*`

## Recipes

- Use banners for page-wide operational context, onboarding nudges, or policy notices.
- Keep content concise and action-oriented; banners should inform quickly, not become mini-pages.
- Prefer `Alert` for inline content blocks inside forms or cards.

## Accessibility

- Auto role and live-region defaults follow severity:
- `warn` or `danger` -> `alert` and `assertive`
- other severities -> `status` and `polite`
- Ensure dismiss actions and follow-up actions remain keyboard reachable.
