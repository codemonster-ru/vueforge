# AvatarGroup

AvatarGroup renders stacked or inline collections of avatars with optional overflow summarization.

## Import

```ts
import AvatarGroup from '@/package/components/avatar-group.vue';
```

## Examples

### Basic

Use `AvatarGroup` for assignee lists, participants, and reviewer summaries.

```vue
<script setup lang="ts">
const members = [
    { key: 1, name: 'Ada Lovelace' },
    { key: 2, name: 'Alan Turing' },
    { key: 3, name: 'Grace Hopper' },
];
</script>

<template>
    <AvatarGroup :items="members" />
</template>
```

### Overflow Count

Set `max` when the group should stay compact and summarize the rest as `+N`.

```vue
<AvatarGroup :items="members" :max="2" />
```

### Non-Overlapping Layout

Disable overlap when each avatar needs clearer separation.

```vue
<AvatarGroup :items="members" :overlap="false" shape="rounded" />
```

### Custom Item Rendering

Use the `item` slot when each avatar needs richer product-specific treatment.

```vue
<AvatarGroup :items="members" :max="3">
    <template #item="{ item }">
        <Avatar :name="item.name" :status="item.status" size="large" />
    </template>
</AvatarGroup>
```

## API

### Types

```ts
interface AvatarGroupItem {
    key?: string | number;
    src?: string;
    alt?: string;
    name?: string;
    size?: 'small' | 'normal' | 'large';
    shape?: 'circle' | 'rounded';
    status?: 'online' | 'offline' | 'busy' | 'away';
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `AvatarGroupItem[]` | `[]` |
| `max` | `number \| null` | `null` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` |
| `overlap` | `boolean` | `true` |
| `ariaLabel` | `string` | `'Avatar group'` |
| `overflowLabel` | `string` | `'more'` |
| `disabled` | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom item rendering with `{ item, index }`. |
| `overflow` | Custom overflow avatar rendering with `{ count }`. |

## Theming

Override component tokens through `theme.overrides.components.avatarGroup`.

## Tokens

- `gap`
- `overlapOffset`
- `ringWidth`
- `ringColor`
- `overflowBackgroundColor`
- `overflowTextColor`
- `disabledOpacity`

## Recipes

- Use overlap for compact summaries and non-overlap for denser identity-heavy surfaces.
- Keep `max` conservative in tables and toolbars so the group does not dominate the layout.

## Accessibility

- The root uses `role="group"` with a configurable `ariaLabel`.
- Overflow content should keep a readable accessible name such as `3 more`.
