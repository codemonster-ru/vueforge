# ActivityFeed

## Purpose

Render chronological product activity with actor metadata, date grouping, and relative-time labels for SaaS audit-style surfaces.

## Props

- `items?: Array<ActivityFeedItem>` (default `[]`)
- `groupBy?: 'date' | 'none'` (default `date`)
- `relativeTime?: boolean` (default `true`)
- `locale?: string` (default `en`)
- `now?: string | number | Date | null` (default `null`)
- `emptyText?: string` (default `No activity yet.`)
- `ariaLabel?: string` (default `Activity feed`)

`ActivityFeedItem`:

- `id?: string | number`
- `title: string`
- `description?: string`
- `timestamp?: string | number | Date`
- `type?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'`
- `actor?: { id?: string | number; name: string; avatar?: string; meta?: string }`
- `actionLabel?: string`
- `actionValue?: string`
- `groupLabel?: string`

## Events

- `itemClick(item, index)` - entry surface was selected.
- `actionClick({ item, index, action })` - secondary action was selected.

## Slots

- `item` - custom item rendering; props: `{ item, index, relativeTime, timestamp, actorLabel, onClick, onAction }`
- `empty` - custom empty state

## Examples

```vue
<ActivityFeed
    :items="events"
    group-by="date"
    :now="new Date('2026-02-24T12:00:00Z')"
    @itemClick="openEvent"
    @actionClick="handleAction"
/>
```

## Theming

- Override via `theme.overrides.components.activityFeed`.

## Tokens

- `gap`, `groupGap`, `groupTitleFontSize`, `groupTitleColor`, `groupTitleFontWeight`
- `itemGap`, `itemPadding`, `itemBorderColor`, `itemBorderRadius`, `itemBackgroundColor`
- `contentGap`
- `avatarSize`, `avatarFontSize`, `avatarBackgroundColor`, `avatarTextColor`
- `titleFontSize`, `titleColor`, `titleFontWeight`
- `descriptionFontSize`, `descriptionColor`
- `metaGap`, `metaFontSize`, `metaColor`
- `actorFontWeight`
- `actionColor`, `actionFontSize`
- `infoBorderColor`, `successBorderColor`, `warnBorderColor`, `dangerBorderColor`
- `emptyPadding`, `emptyColor`

## Recipes

- Use `groupBy="date"` on list/detail pages where events are consumed by operators or support teams.
- Provide deterministic `now` for SSR pages to keep relative-time output stable across server/client render.

## Accessibility

- Root container uses `role="feed"` with configurable `ariaLabel`.
- Default item and action controls are keyboard-accessible native `<button>` elements.
- Custom slot rendering should preserve semantic controls and visible focus states.

## Responsive

- Entries are stacked and remain readable on narrow mobile widths.
- Metadata wraps by default to avoid overflow in dense event rows.

## SSR/Hydration

- Relative-time labels use runtime time calculations; pass `now` for deterministic SSR/hydration output.
- If `now` is omitted, labels are computed from current render time.

## Testing

- Cover date grouping, relative-time rendering, actor metadata, and event emissions.
