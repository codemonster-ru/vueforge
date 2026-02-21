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

## Recipes

- Header bell pattern: open panel from a header icon button and sync `items` from app store.
- Inbox workflow: use `readAll` and `clear` events to trigger API mutations and optimistic UI updates.
- Non-blocking center: set `closeOnOverlay=false` for persistent side panel behavior during multitasking.

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

- Panel uses `role="dialog"` and `aria-modal="true"`.
- On open, focus moves into the panel; on close, focus is restored to previously active element.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.

## Interaction Contract

- `modelValue=true`:
    - emits `open`
    - focuses panel container for keyboard users
- Close triggers:
    - overlay click when `closeOnOverlay=true`
    - `Escape` when `closeOnEsc=true`
    - close button
- On close:
    - emits `update:modelValue=false`
    - emits `close`
    - restores focus to the element active before open

## Z-Index Policy

- Uses `--vf-notification-center-z-index` (default `125`).
- Default layer intent:
    - above modal/drawer (`100`) and command palette (`110`)
    - above toast/tour (`120`)
- Override via theme tokens only when project-specific stacking order is required.
