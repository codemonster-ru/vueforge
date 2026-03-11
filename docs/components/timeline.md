# Timeline

Timeline presents ordered events, milestones, or status changes in vertical or horizontal form.

## Import

```ts
import { Timeline } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use Timeline for audit steps, release milestones, and process history.

```vue
<Timeline
    :items="[
        { title: 'Created', description: 'Issue created', date: '2026-02-17', status: 'info' },
        { title: 'In progress', description: 'Developer started work', date: '2026-02-18', status: 'warn' },
        { title: 'Done', description: 'Issue closed', date: '2026-02-19', status: 'success' },
    ]"
/>
```

### Horizontal

Switch to `horizontal` when the timeline acts more like a compact milestone strip.

```vue
<Timeline :items="events" orientation="horizontal" size="small" />
```

### Custom Marker

Use the `marker` slot to render custom icons, badges, or avatars.

```vue
<Timeline :items="events">
    <template #marker="{ item }">
        <StatusBadge :severity="item.status" />
    </template>
</Timeline>
```

### Custom Item Content

Override the `item` slot when each step needs richer content than title, date, and description.

```vue
<Timeline :items="events">
    <template #item="{ item }">
        <article>
            <time>{{ item.date }}</time>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
            <Button size="sm" variant="text">Inspect</Button>
        </article>
    </template>
</Timeline>
```

## API

### Types

```ts
type TimelineStatus = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface TimelineItem {
    id?: string | number;
    title?: string;
    description?: string;
    date?: string;
    icon?: string;
    status?: TimelineStatus;
}
```

### Props

| Name             | Type                             | Default      |
| ---------------- | -------------------------------- | ------------ |
| `items`          | `TimelineItem[]`                 | `[]`         |
| `orientation`    | `'vertical' \| 'horizontal'`     | `'vertical'` |
| `size`           | `'small' \| 'normal' \| 'large'` | `'normal'`   |
| `ariaLabel`      | `string`                         | `''`         |
| `ariaLabelledby` | `string`                         | `''`         |

### Slots

| Name     | Description                            |
| -------- | -------------------------------------- |
| `marker` | Custom marker with `{ item, index }`.  |
| `item`   | Custom content with `{ item, index }`. |

## Theming

Override component tokens through `theme.overrides.components.timeline`.

## Tokens

- Layout: `gap`, `itemGap`
- Marker: `markerSize`, `markerBorderRadius`, `markerBorderWidth`, `markerBackgroundColor`, `markerBorderColor`, `markerTextColor`, `markerIconSize`, `dotSize`
- Line and text: `lineThickness`, `lineLength`, `lineColor`, `titleFontSize`, `titleColor`, `descriptionFontSize`, `descriptionColor`, `dateFontSize`, `dateColor`
- Status variants: `info.*`, `success.*`, `warn.*`, `danger.*`
- Size variants: `small.*`, `large.*`

## Recipes

- Use Timeline for issue history, deployment milestones, order tracking, and workflow progress snapshots.
- Prefer `CommentThread` when entries need richer participant and action context.

## Accessibility

- Timeline can be labeled via `ariaLabel` or `ariaLabelledby` depending on surrounding headings.
- Custom marker and item slots should preserve sufficient contrast and readable ordering in both orientations.
