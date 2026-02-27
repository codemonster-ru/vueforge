# Banner

## Purpose

Inline page-level announcement surface for important context, status updates, and action prompts.

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

## Example

```vue
<Banner severity="info" title="Billing update" closable>
    Prices will be updated on March 1.
    <template #actions>
        <Button size="sm">Review</Button>
    </template>
</Banner>
```

## Tokens

Component tokens (override via `theme.overrides.components.banner`):

- `gap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`
- `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `stickyTop`, `zIndex`
- severity overrides: `info.*`, `success.*`, `warn.*`, `danger.*`

## Accessibility

- Auto role/live defaults: `warn`/`danger` -> `alert` + `assertive`, others -> `status` + `polite`.
- Use `role='none'` and `ariaLive='off'` for purely decorative banners.
