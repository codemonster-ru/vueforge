# NotificationCenter

NotificationCenter presents a dismissible, focus-managed overlay for notifications, read state, filtering, grouping, and persistence.

## Import

```ts
import NotificationCenter from '@/package/components/notification-center.vue';
```

## Examples

### Basic

Use `v-model` for visibility and `v-model:items` when the panel manages read state locally.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
const notifications = ref([
    { id: 1, title: 'Build finished', message: 'Production deployment succeeded.', read: false, severity: 'success' },
    { id: 2, title: 'Review requested', message: 'Anna mentioned you in API changes.', read: false, severity: 'info' },
]);
</script>

<template>
    <Button @click="open = true">
        Open notifications
    </Button>

    <NotificationCenter v-model="open" v-model:items="notifications" />
</template>
```

### Filters And Grouping

Enable filters and grouped rendering for denser operator-facing inboxes.

```vue
<NotificationCenter
    v-model="open"
    v-model:items="notifications"
    show-filters
    group-by="group"
/>
```

### Persistence

Persist read and filter state when the center should remember the last session locally.

```vue
<NotificationCenter
    v-model="open"
    v-model:items="notifications"
    show-filters
    persist-key="workspace.notifications"
    persist-read-state
    persist-filter-state
    @persist="saveNotificationState"
/>
```

### Custom Item Rendering

Use the `item` slot for branded rows, custom actions, or tighter integration with your navigation model.

```vue
<NotificationCenter v-model="open" v-model:items="notifications">
    <template #item="{ item, toggleRead }">
        <article class="notification-row">
            <strong>{{ item.title }}</strong>
            <p>{{ item.message }}</p>
            <Button size="sm" variant="text" @click="toggleRead()">
                Toggle read
            </Button>
        </article>
    </template>
</NotificationCenter>
```

## API

### Types

```ts
type NotificationFilter = 'all' | 'unread' | 'read';
type NotificationGroupBy = 'none' | 'date' | 'severity' | 'group';

interface NotificationCenterItem {
    id: string | number;
    title: string;
    message?: string;
    date?: string;
    read?: boolean;
    severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
    avatar?: string;
    group?: string;
    actionLabel?: string;
    actionHref?: string;
    actionTarget?: string;
    actionRel?: string;
}

interface NotificationCenterPersistState {
    filter: NotificationFilter;
    readMap: Record<string, boolean>;
    updatedAt: string;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `items` | `NotificationCenterItem[]` | `[]` |
| `title` | `string \| undefined` | `undefined` |
| `emptyText` | `string \| undefined` | `undefined` |
| `closeOnOverlay` | `boolean` | `true` |
| `closeOnEsc` | `boolean` | `true` |
| `markAllLabel` | `string \| undefined` | `undefined` |
| `clearLabel` | `string \| undefined` | `undefined` |
| `closeLabel` | `string \| undefined` | `undefined` |
| `readLabel` | `string \| undefined` | `undefined` |
| `unreadLabel` | `string \| undefined` | `undefined` |
| `showFilters` | `boolean` | `false` |
| `filter` | `NotificationFilter \| undefined` | `undefined` |
| `groupBy` | `NotificationGroupBy` | `'none'` |
| `persistKey` | `string \| undefined` | `undefined` |
| `persistReadState` | `boolean` | `false` |
| `persistFilterState` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `update:items` | `NotificationCenterItem[]` |
| `update:filter` | `NotificationFilter` |
| `open` | none |
| `close` | none |
| `click` | notification payload |
| `read` | notification payload |
| `readAll` | notifications payload |
| `clear` | notifications payload |
| `action` | notification payload |
| `filterChange` | `NotificationFilter` |
| `persist` | `NotificationCenterPersistState, reason` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom row with `{ item, index, toggleRead }`. |
| `empty` | Replaces the default empty state. |

## Theming

Override component tokens through `theme.overrides.components.notificationCenter`.

## Tokens

- Layering and placement: `zIndex`, `overlayBackgroundColor`, `top`, `right`, `width`, `maxWidth`, `maxHeight`
- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `shadow`, `dividerColor`
- Header: `headerGap`, `headerPadding`, `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- Badge and actions: `badgeSize`, `badgeBackgroundColor`, `badgeTextColor`, `badgeFontSize`, `actionsGap`, `closeSize`, `closeHoverBackgroundColor`, `disabledOpacity`
- Items: `itemGap`, `itemPadding`, `unreadBackgroundColor`, `avatarSize`, `avatarBackgroundColor`, `avatarTextColor`, `avatarFontSize`, `itemTitleFontSize`, `itemTitleFontWeight`, `itemMetaFontSize`, `itemMetaColor`
- Empty state: `emptyPadding`, `emptyColor`

## Recipes

- Use NotificationCenter for header bell panels, operational inboxes, and side-panel notification review.
- Prefer `Toast` for transient alerts that do not require persistence, filtering, or bulk actions.

## Accessibility

- NotificationCenter renders a `dialog` with `aria-modal="true"`, moves focus into the panel on open, and restores focus on close.
- Overlay and escape dismissal are configurable for workflows that should remain open while users review multiple items.
- Filter controls use tab-like semantics with `aria-selected`.
