# CommentThread

## Purpose

Render discussion threads with inline replies, mention extraction, and resolve/reopen moderation flows for SaaS detail pages.

## Props

- `items?: Array<CommentThreadItem>` (default `[]`)
- `ariaLabel?: string` (default `Comment thread`)
- `emptyText?: string` (default `No comments yet.`)
- `replyLabel?: string` (default `Reply`)
- `cancelReplyLabel?: string` (default `Cancel`)
- `sendReplyLabel?: string` (default `Send`)
- `replyPlaceholder?: string` (default `Write a reply...`)
- `replyAriaLabel?: string` (default `Reply text`)
- `resolveLabel?: string` (default `Resolve`)
- `reopenLabel?: string` (default `Reopen`)
- `locale?: string` (default `en`)
- `timeZone?: string` (optional IANA timezone)

`CommentThreadItem`:

- `id: string | number`
- `author: { id?: string | number; name: string; avatar?: string; meta?: string }`
- `body: string`
- `createdAt?: string | number | Date`
- `resolved?: boolean`
- `parentId?: string | number | null`

## Events

- `reply({ parent, index, text, mentions })`
- `resolve({ item, index })`
- `reopen({ item, index })`

## Slots

- N/A

## Examples

```vue
<CommentThread :items="comments" @reply="onReply" @resolve="onResolve" @reopen="onReopen" />
```

## Theming

- Override via `theme.overrides.components.commentThread`.

## Tokens

- `gap`, `itemGap`, `indentSize`
- `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- `resolvedBackgroundColor`, `resolvedBorderColor`
- `metaGap`, `authorFontWeight`, `metaColor`, `metaFontSize`
- `actionsGap`, `actionColor`, `actionFontSize`
- `replyMinHeight`, `replyBorderColor`, `replyBorderRadius`, `replyBackgroundColor`
- `disabledOpacity`

## Recipes

- Use as inline collaboration thread in issue/task/detail pages.
- Persist `resolve/reopen` on backend and project permission rules (UI state is optimistic by design).

## Accessibility

- Root uses semantic section labeling via `ariaLabel`.
- Reply/resolve/reopen actions are native buttons with keyboard accessibility.
- Reply input is a labeled textarea (`replyAriaLabel`).

## Responsive

- Nested replies use tokenized indentation and remain readable on narrow surfaces.
- Reply editor stretches full width and keeps vertical resize for small screens.

## SSR/Hydration

- Thread rendering is deterministic for static item data.
- Timestamp formatting depends on locale/timezone; keep them consistent between server and client.

## Testing

- Cover nested rendering, reply mention parsing, resolve/reopen event flows, and empty state behavior.
