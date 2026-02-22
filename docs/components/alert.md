# Alert

## Purpose

Communicate system and domain state through inline status, metadata markers, loaders, and empty experiences.
Provide reusable feedback primitives for dashboards, tables, and long-running operations.

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

## Examples

```vue
<Alert v-model="alertOpen" severity="warn" title="Unsaved changes" closable>
    You have unsaved form changes.
    <template #actions>
        <Button label="Save" size="small" />
    </template>
</Alert>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.alert`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`, `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify text/icon/indicator layout and density at mobile/tablet/desktop breakpoints.
Ensure status content remains legible and non-overlapping in constrained containers.

## SSR/Hydration

Keep initial status/loading state deterministic in server-rendered output.
Start animations or timers only after hydration to avoid markup mismatch.

## Testing

Cover severity/variant rendering, visibility lifecycle, and accessibility announcements where relevant.
Add visual regression tests for key state combinations and contrast-sensitive variants.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
