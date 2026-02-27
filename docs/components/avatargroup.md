# AvatarGroup

## Purpose

Render compact grouped avatar stacks for member lists, assignees, and participant summaries.

## Props

- `items?: Array<AvatarGroupItem>`
- `max?: number | null` (limits visible avatars; renders `+N` overflow)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `shape?: 'circle' | 'rounded'` (default `circle`)
- `overlap?: boolean` (default `true`)
- `ariaLabel?: string` (default `Avatar group`)
- `overflowLabel?: string` (default `more`)
- `disabled?: boolean` (default `false`)

## Slots

- `item` (scoped: `{ item, index }`)
- `overflow` (scoped: `{ count }`)

## Example

```vue
<AvatarGroup :items="members" :max="4" />
```

## Tokens

Component tokens (override via `theme.overrides.components.avatarGroup`):

- `gap`, `overlapOffset`
- `ringWidth`, `ringColor`
- `overflowBackgroundColor`, `overflowTextColor`
- `disabledOpacity`

## Accessibility

- Uses `group` semantics with configurable `ariaLabel`.
- Overflow item exposes readable `alt` text (`N more`).
