# NotificationCenter

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ id: string | number; title: string; message?: string; date?: string; read?: boolean; severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'; avatar?: string }>`
- `title?: string` (default `Notifications`)
- `emptyText?: string` (default `No notifications`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `markAllLabel?: string` (default `Mark all as read`)
- `clearLabel?: string` (default `Clear`)
- `closeLabel?: string` (default `Close notifications`)
- `readLabel?: string` (default `Mark as read`)
- `unreadLabel?: string` (default `Mark as unread`)

## Events

- `update:modelValue`
- `update:items`
- `open`
- `close`
- `click`
- `read`
- `readAll`
- `clear`

## Slots

- `item` (optional) - slot props `{ item, index, toggleRead }`
- `empty` (optional)

## Examples

```vue
<NotificationCenter v-model="open" v-model:items="notifications" />
```

## Tokens

Component tokens (override via `theme.overrides.components.notificationCenter`):

- `zIndex`, `overlayBackgroundColor`
- `top`, `right`, `width`, `maxWidth`, `maxHeight`
- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `shadow`
- `dividerColor`, `headerGap`, `headerPadding`
- `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `badgeSize`, `badgeBackgroundColor`, `badgeTextColor`, `badgeFontSize`
- `actionsGap`, `closeSize`, `closeHoverBackgroundColor`, `disabledOpacity`
- `itemGap`, `itemPadding`, `unreadBackgroundColor`
- `avatarSize`, `avatarBackgroundColor`, `avatarTextColor`, `avatarFontSize`
- `itemTitleFontSize`, `itemTitleFontWeight`, `itemMetaFontSize`, `itemMetaColor`
- `emptyPadding`, `emptyColor`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
