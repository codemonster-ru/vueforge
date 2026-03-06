# CommentThread

CommentThread renders discussion threads with nested replies, mention extraction, and resolve or reopen flows.

## Import

```ts
import CommentThread from '@/package/components/comment-thread.vue';
```

## Examples

### Basic

Use CommentThread for issue details, review conversations, and inline collaboration.

```vue
<CommentThread :items="comments" @reply="onReply" @resolve="onResolve" @reopen="onReopen" />
```

### Threaded Replies

Replies are derived from `parentId`, so flat data can still render as a nested conversation.

```vue
<script setup lang="ts">
const comments = [
    { id: 1, author: { name: 'Anna' }, body: 'Please update the copy.' },
    { id: 2, parentId: 1, author: { name: 'Max' }, body: 'Updated in the latest commit.' },
];
</script>

<template>
    <CommentThread :items="comments" />
</template>
```

### Moderation Flow

Use resolve and reopen actions to mark threads that no longer need attention.

```vue
<CommentThread
    :items="comments"
    resolve-label="Resolve thread"
    reopen-label="Reopen thread"
    @resolve="markResolved"
    @reopen="markOpen"
/>
```

### Reply Drafts And Mentions

The `reply` event returns parsed `@mentions` so consumers can attach notification or assignee logic.

```vue
<CommentThread
    :items="comments"
    @reply="({ parent, text, mentions }) => saveReply(parent.id, text, mentions)"
/>
```

## API

### Types

```ts
interface CommentThreadAuthor {
    id?: string | number;
    name: string;
    avatar?: string;
    meta?: string;
}

interface CommentThreadItem {
    id: string | number;
    author: CommentThreadAuthor;
    body: string;
    createdAt?: string | number | Date;
    resolved?: boolean;
    parentId?: string | number | null;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `CommentThreadItem[]` | `[]` |
| `ariaLabel` | `string` | `'Comment thread'` |
| `emptyText` | `string` | `'No comments yet.'` |
| `replyLabel` | `string` | `'Reply'` |
| `cancelReplyLabel` | `string` | `'Cancel'` |
| `sendReplyLabel` | `string` | `'Send'` |
| `replyPlaceholder` | `string` | `'Write a reply...'` |
| `replyAriaLabel` | `string` | `'Reply text'` |
| `resolveLabel` | `string` | `'Resolve'` |
| `reopenLabel` | `string` | `'Reopen'` |
| `locale` | `string` | `'en'` |
| `timeZone` | `string \| undefined` | `undefined` |

### Events

| Name | Payload |
| --- | --- |
| `reply` | `{ parent, index, text, mentions }` |
| `resolve` | `{ item, index }` |
| `reopen` | `{ item, index }` |

## Theming

Override component tokens through `theme.overrides.components.commentThread`.

## Tokens

- Layout: `gap`, `itemGap`, `indentSize`
- Card: `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- Resolved state: `resolvedBackgroundColor`, `resolvedBorderColor`
- Meta text: `metaGap`, `authorFontWeight`, `metaColor`, `metaFontSize`
- Actions: `actionsGap`, `actionColor`, `actionFontSize`
- Reply editor: `replyMinHeight`, `replyBorderColor`, `replyBorderRadius`, `replyBackgroundColor`
- State: `disabledOpacity`

## Recipes

- Use CommentThread for issue comments, annotation sidebars, and lightweight review discussion.
- Persist resolve and reopen state in the backend because the component only emits workflow events.

## Accessibility

- CommentThread exposes reply and moderation actions as native buttons and labels the reply textarea via `replyAriaLabel`.
- Timestamp formatting depends on `locale` and `timeZone`, so keep them aligned in SSR environments.

