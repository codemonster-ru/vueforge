<template>
    <section class="vf-comment-thread" :aria-label="ariaLabel">
        <ul class="vf-comment-thread__list" role="list">
            <li
                v-for="(item, index) in normalizedItems"
                :key="item.__key"
                class="vf-comment-thread__item"
                :style="{ marginInlineStart: `calc(${item.depth.toString()} * var(--vf-comment-thread-indent-size))` }"
            >
                <article class="vf-comment-thread__card" :class="{ 'is-resolved': item.resolved }">
                    <header class="vf-comment-thread__header">
                        <span class="vf-comment-thread__author">{{ item.author.name }}</span>
                        <span v-if="item.author.meta" class="vf-comment-thread__author-meta">{{
                            item.author.meta
                        }}</span>
                        <time v-if="item.createdAt" class="vf-comment-thread__time">{{
                            formatTimestamp(item.createdAt)
                        }}</time>
                    </header>

                    <p class="vf-comment-thread__body">{{ item.body }}</p>

                    <div class="vf-comment-thread__actions">
                        <button type="button" class="vf-comment-thread__action" @click="toggleReply(item.id)">
                            {{ activeReplyId === item.id ? cancelReplyLabel : replyLabel }}
                        </button>
                        <button
                            v-if="item.resolved"
                            type="button"
                            class="vf-comment-thread__action"
                            @click="emitReopen(item, index)"
                        >
                            {{ reopenLabel }}
                        </button>
                        <button
                            v-else
                            type="button"
                            class="vf-comment-thread__action"
                            @click="emitResolve(item, index)"
                        >
                            {{ resolveLabel }}
                        </button>
                    </div>

                    <form
                        v-if="activeReplyId === item.id"
                        class="vf-comment-thread__reply-form"
                        @submit.prevent="submitReply(item, index)"
                    >
                        <textarea
                            v-model="replyDraft"
                            class="vf-comment-thread__reply-input"
                            :placeholder="replyPlaceholder"
                            :aria-label="replyAriaLabel"
                        />
                        <div class="vf-comment-thread__reply-actions">
                            <button type="submit" class="vf-comment-thread__submit" :disabled="!replyDraft.trim()">
                                {{ sendReplyLabel }}
                            </button>
                        </div>
                    </form>
                </article>
            </li>
        </ul>
        <p v-if="!normalizedItems.length" class="vf-comment-thread__empty">{{ emptyText }}</p>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type DateLike = string | number | Date;

export interface CommentThreadAuthor {
    id?: string | number;
    name: string;
    avatar?: string;
    meta?: string;
}

export interface CommentThreadItem {
    id: string | number;
    author: CommentThreadAuthor;
    body: string;
    createdAt?: DateLike;
    resolved?: boolean;
    parentId?: string | number | null;
}

type NormalizedComment = CommentThreadItem & {
    depth: number;
    __key: string;
};

interface Props {
    items?: Array<CommentThreadItem>;
    ariaLabel?: string;
    emptyText?: string;
    replyLabel?: string;
    cancelReplyLabel?: string;
    sendReplyLabel?: string;
    replyPlaceholder?: string;
    replyAriaLabel?: string;
    resolveLabel?: string;
    reopenLabel?: string;
    locale?: string;
    timeZone?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: 'Comment thread',
    emptyText: 'No comments yet.',
    replyLabel: 'Reply',
    cancelReplyLabel: 'Cancel',
    sendReplyLabel: 'Send',
    replyPlaceholder: 'Write a reply...',
    replyAriaLabel: 'Reply text',
    resolveLabel: 'Resolve',
    reopenLabel: 'Reopen',
    locale: 'en',
    timeZone: undefined,
});

const emits = defineEmits<{
    (
        event: 'reply',
        payload: { parent: CommentThreadItem; index: number; text: string; mentions: Array<string> },
    ): void;
    (event: 'resolve', payload: { item: CommentThreadItem; index: number }): void;
    (event: 'reopen', payload: { item: CommentThreadItem; index: number }): void;
}>();

const activeReplyId = ref<string | number | null>(null);
const replyDraft = ref('');

const resolveDate = (value?: DateLike) => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

const formatTimestamp = (value?: DateLike) => {
    const date = resolveDate(value);

    if (!date) {
        return '';
    }

    return date.toLocaleString(props.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: props.timeZone,
    });
};

const getMentions = (value: string) => {
    const matches = Array.from(value.matchAll(/@([a-zA-Z0-9_.-]+)\b/g));
    const unique = new Set(matches.map(([, username]) => username));

    return Array.from(unique);
};

const normalizedItems = computed<Array<NormalizedComment>>(() => {
    const source = props.items ?? [];
    const byParent = new Map<string, Array<CommentThreadItem>>();
    const root: Array<CommentThreadItem> = [];

    source.forEach(item => {
        if (item.parentId === null || item.parentId === undefined) {
            root.push(item);
            return;
        }

        const key = String(item.parentId);
        const existing = byParent.get(key);

        if (existing) {
            existing.push(item);
            return;
        }

        byParent.set(key, [item]);
    });

    const ordered: Array<NormalizedComment> = [];

    const walk = (nodes: Array<CommentThreadItem>, depth: number) => {
        nodes.forEach((node, index) => {
            ordered.push({
                ...node,
                depth,
                __key: `${String(node.id)}_${depth.toString()}_${index.toString()}`,
            });

            const children = byParent.get(String(node.id)) ?? [];

            if (children.length) {
                walk(children, depth + 1);
            }
        });
    };

    walk(root, 0);

    return ordered;
});

const toggleReply = (id: string | number) => {
    if (activeReplyId.value === id) {
        activeReplyId.value = null;
        replyDraft.value = '';
        return;
    }

    activeReplyId.value = id;
    replyDraft.value = '';
};

const submitReply = (parent: CommentThreadItem, index: number) => {
    const text = replyDraft.value.trim();

    if (!text) {
        return;
    }

    emits('reply', {
        parent,
        index,
        text,
        mentions: getMentions(text),
    });

    activeReplyId.value = null;
    replyDraft.value = '';
};

const emitResolve = (item: CommentThreadItem, index: number) => {
    emits('resolve', { item, index });
};

const emitReopen = (item: CommentThreadItem, index: number) => {
    emits('reopen', { item, index });
};
</script>

<style lang="scss">
.vf-comment-thread {
    display: grid;
    gap: var(--vf-comment-thread-gap);
}

.vf-comment-thread__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--vf-comment-thread-item-gap);
}

.vf-comment-thread__card {
    border: var(--vf-border-width) solid var(--vf-comment-thread-border-color);
    border-radius: var(--vf-comment-thread-border-radius);
    background-color: var(--vf-comment-thread-background-color);
    padding: var(--vf-comment-thread-padding);
}

.vf-comment-thread__card.is-resolved {
    background-color: var(--vf-comment-thread-resolved-background-color);
    border-color: var(--vf-comment-thread-resolved-border-color);
}

.vf-comment-thread__header {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-comment-thread-meta-gap);
    margin-bottom: 0.375rem;
}

.vf-comment-thread__author {
    font-weight: var(--vf-comment-thread-author-font-weight);
}

.vf-comment-thread__author-meta,
.vf-comment-thread__time {
    color: var(--vf-comment-thread-meta-color);
    font-size: var(--vf-comment-thread-meta-font-size);
}

.vf-comment-thread__body {
    margin: 0;
    white-space: pre-wrap;
}

.vf-comment-thread__actions {
    margin-top: 0.5rem;
    display: inline-flex;
    gap: var(--vf-comment-thread-actions-gap);
}

.vf-comment-thread__action,
.vf-comment-thread__submit {
    border: none;
    background: transparent;
    color: var(--vf-comment-thread-action-color);
    cursor: pointer;
    font-size: var(--vf-comment-thread-action-font-size);
}

.vf-comment-thread__reply-form {
    margin-top: 0.75rem;
    display: grid;
    gap: 0.5rem;
}

.vf-comment-thread__reply-input {
    width: 100%;
    min-height: var(--vf-comment-thread-reply-min-height);
    border: var(--vf-border-width) solid var(--vf-comment-thread-reply-border-color);
    border-radius: var(--vf-comment-thread-reply-border-radius);
    background-color: var(--vf-comment-thread-reply-background-color);
    color: inherit;
    padding: 0.5rem 0.625rem;
    resize: vertical;
    box-sizing: border-box;
}

.vf-comment-thread__reply-actions {
    display: flex;
    justify-content: flex-end;
}

.vf-comment-thread__submit:disabled {
    opacity: var(--vf-comment-thread-disabled-opacity);
    cursor: not-allowed;
}

.vf-comment-thread__empty {
    margin: 0;
    text-align: center;
    color: var(--vf-comment-thread-meta-color);
}
</style>
