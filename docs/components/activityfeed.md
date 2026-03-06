# ActivityFeed

ActivityFeed renders chronological product activity with actor metadata, optional date grouping, and relative-time labels.

## Import

```ts
import ActivityFeed from '@/package/components/activity-feed.vue';
```

## Examples

### Basic

Use ActivityFeed for audit surfaces, workspace history, and support timelines.

```vue
<ActivityFeed
    :items="events"
    group-by="date"
    :now="new Date('2026-02-24T12:00:00Z')"
    @itemClick="openEvent"
    @actionClick="handleAction"
/>
```

### Ungrouped Feed

Set `groupBy="none"` when the feed should read as one continuous stream.

```vue
<ActivityFeed :items="events" group-by="none" />
```

### Custom Item Rendering

Use the `item` slot when feed entries need richer controls or product-specific layout.

```vue
<ActivityFeed :items="events">
    <template #item="{ item, relativeTime, onClick, onAction }">
        <article class="feed-item">
            <button type="button" @click="onClick()">
                <strong>{{ item.title }}</strong>
                <span>{{ relativeTime }}</span>
            </button>
            <Button v-if="item.actionLabel" size="sm" variant="text" @click="onAction()">
                {{ item.actionLabel }}
            </Button>
        </article>
    </template>
</ActivityFeed>
```

### Empty State

Override the empty slot for branded or workflow-specific fallback content.

```vue
<ActivityFeed :items="[]">
    <template #empty>
        <EmptyState title="No activity yet" description="Changes will appear here once the team starts working." />
    </template>
</ActivityFeed>
```

## API

### Types

```ts
type ActivityFeedType = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface ActivityFeedActor {
    id?: string | number;
    name: string;
    avatar?: string;
    meta?: string;
}

interface ActivityFeedItem {
    id?: string | number;
    title: string;
    description?: string;
    timestamp?: string | number | Date;
    type?: ActivityFeedType;
    actor?: ActivityFeedActor;
    actionLabel?: string;
    actionValue?: string;
    groupLabel?: string;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `ActivityFeedItem[]` | `[]` |
| `groupBy` | `'date' \| 'none'` | `'date'` |
| `relativeTime` | `boolean` | `true` |
| `locale` | `string` | `'en'` |
| `timeZone` | `string \| undefined` | `undefined` |
| `now` | `string \| number \| Date \| null` | `null` |
| `emptyText` | `string` | `'No activity yet.'` |
| `ariaLabel` | `string` | `'Activity feed'` |

### Events

| Name | Payload |
| --- | --- |
| `itemClick` | `item, index` |
| `actionClick` | `{ item, index, action }` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom feed entry with `{ item, index, relativeTime, timestamp, actorLabel, onClick, onAction }`. |
| `empty` | Replaces the default empty state. |

## Theming

Override component tokens through `theme.overrides.components.activityFeed`.

## Tokens

- Grouping: `gap`, `groupGap`, `groupTitleFontSize`, `groupTitleColor`, `groupTitleFontWeight`
- Items: `itemGap`, `itemPadding`, `itemBorderColor`, `itemBorderRadius`, `itemBackgroundColor`
- Content: `contentGap`, `avatarSize`, `avatarFontSize`, `avatarBackgroundColor`, `avatarTextColor`
- Text: `titleFontSize`, `titleColor`, `titleFontWeight`, `descriptionFontSize`, `descriptionColor`, `metaGap`, `metaFontSize`, `metaColor`, `actorFontWeight`
- Action and variants: `actionColor`, `actionFontSize`, `infoBorderColor`, `successBorderColor`, `warnBorderColor`, `dangerBorderColor`
- Empty state: `emptyPadding`, `emptyColor`

## Recipes

- Use ActivityFeed for operator-facing activity streams, audit history, and workspace events.
- Pass a fixed `now` on SSR pages to keep relative-time output deterministic.

## Accessibility

- ActivityFeed uses `role="feed"` and exposes item and action controls as native buttons by default.
- Custom slot content should keep semantic interactive elements and visible focus states.

