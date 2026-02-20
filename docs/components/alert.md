# Alert

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

## Tokens

Component tokens (override via `theme.overrides.components.alert`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`, `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
