# NotificationCenter

## Purpose

Render and manage high-density operational data with scalable interaction patterns.
Support filtering, navigation, and bulk workflows used in core SaaS backoffice screens.

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ id: string | number; title: string; message?: string; date?: string; read?: boolean; severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'; avatar?: string; group?: string; actionLabel?: string; actionHref?: string; actionTarget?: string; actionRel?: string }>`
- `title?: string` (default `Notifications`)
- `emptyText?: string` (default `No notifications`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `markAllLabel?: string` (default `Mark all as read`)
- `clearLabel?: string` (default `Clear`)
- `closeLabel?: string` (default `Close notifications`)
- `readLabel?: string` (default `Mark as read`)
- `unreadLabel?: string` (default `Mark as unread`)
- `showFilters?: boolean` (default `false`)
- `filter?: 'all' | 'unread' | 'read'`
- `groupBy?: 'none' | 'date' | 'severity' | 'group'` (default `none`)
- `persistKey?: string`
- `persistReadState?: boolean` (default `false`)
- `persistFilterState?: boolean` (default `false`)

## Events

- `update:modelValue`
- `update:items`
- `update:filter`
- `open`
- `close`
- `click`
- `read`
- `readAll`
- `clear`
- `action`
- `filterChange`
- `persist` (payload: `{ filter, readMap, updatedAt }`, reason: `hydrate|filter|toggleRead|markAll|clear`)

## Slots

- `item` (optional) - slot props `{ item, index, toggleRead }`
- `empty` (optional)

## Examples

```vue
<NotificationCenter v-model="open" v-model:items="notifications" />
```

```vue
<NotificationCenter
    v-model="open"
    v-model:items="notifications"
    show-filters
    group-by="group"
    persist-key="workspace.notifications"
    persist-read-state
    persist-filter-state
    @persist="saveNotificationState"
/>
```

## Recipes

- Header bell pattern: open panel from a header icon button and sync `items` from app store.
- Inbox workflow: use `readAll` and `clear` events to trigger API mutations and optimistic UI updates.
- Non-blocking center: set `closeOnOverlay=false` for persistent side panel behavior during multitasking.
- SaaS grouping: use `groupBy="group"` (or `date` / `severity`) to partition dense event streams.
- Action links: provide `actionLabel` + optional `actionHref` per item for deep-link handling from notifications.
- Persistence contract: use `persist` payload with `persistKey` for local restore; sync to backend store when required.

## Theming

- Override via theme component overrides for each component documented on this page.

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

## Responsive

Validate table/list density, horizontal overflow strategy, and virtualization behavior across breakpoints.
Ensure row/item actions remain accessible and discoverable on touch devices.

## SSR/Hydration

Render initial viewport slice and structural wrappers deterministically to avoid hydration drift.
Defer measurement-driven virtualization logic until client mount.

## Testing

Cover sorting/filtering/selection/navigation flows and large-dataset edge cases.
Add performance-sensitive regression tests and ARIA verification for interactive data regions.

## Accessibility

- Panel uses `role="dialog"` and `aria-modal="true"`.
- On open, focus moves into the panel; on close, focus is restored to previously active element.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.
- Filter controls expose tab-like toggles with `aria-selected`.

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
