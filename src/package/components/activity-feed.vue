<template>
    <section class="vf-activity-feed" role="feed" :aria-label="resolvedAriaLabel">
        <template v-if="groups.length">
            <div v-for="group in groups" :key="group.key" class="vf-activity-feed__group">
                <h3 v-if="group.label" class="vf-activity-feed__group-title">{{ group.label }}</h3>
                <ul class="vf-activity-feed__list" role="list">
                    <li
                        v-for="entry in group.entries"
                        :key="entry.key"
                        class="vf-activity-feed__item"
                        :data-type="entry.item.type ?? 'neutral'"
                    >
                        <slot
                            name="item"
                            :item="entry.item"
                            :index="entry.index"
                            :relative-time="entry.relativeTimeLabel"
                            :timestamp="entry.timestampLabel"
                            :actor-label="getActorLabel(entry.item)"
                            :on-click="() => onItemClick(entry.item, entry.index)"
                            :on-action="() => onActionClick(entry.item, entry.index)"
                        >
                            <button
                                type="button"
                                class="vf-activity-feed__item-main"
                                @click="onItemClick(entry.item, entry.index)"
                            >
                                <span class="vf-activity-feed__avatar" aria-hidden="true">{{
                                    getActorLabel(entry.item)
                                }}</span>
                                <span class="vf-activity-feed__content">
                                    <span class="vf-activity-feed__title">{{ entry.item.title }}</span>
                                    <span v-if="entry.item.description" class="vf-activity-feed__description">
                                        {{ entry.item.description }}
                                    </span>
                                    <span class="vf-activity-feed__meta">
                                        <span v-if="entry.item.actor?.name" class="vf-activity-feed__actor">
                                            {{ entry.item.actor.name }}
                                        </span>
                                        <span v-if="entry.item.actor?.meta" class="vf-activity-feed__actor-meta">
                                            {{ entry.item.actor.meta }}
                                        </span>
                                        <span v-if="entry.relativeTimeLabel" class="vf-activity-feed__time">
                                            {{ entry.relativeTimeLabel }}
                                        </span>
                                        <span v-else-if="entry.timestampLabel" class="vf-activity-feed__time">
                                            {{ entry.timestampLabel }}
                                        </span>
                                    </span>
                                </span>
                            </button>
                            <button
                                v-if="entry.item.actionLabel"
                                type="button"
                                class="vf-activity-feed__action"
                                @click="onActionClick(entry.item, entry.index)"
                            >
                                {{ entry.item.actionLabel }}
                            </button>
                        </slot>
                    </li>
                </ul>
            </div>
        </template>
        <p v-else class="vf-activity-feed__empty">
            <slot name="empty">{{ emptyText }}</slot>
        </p>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ActivityFeedType = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
type GroupByMode = 'date' | 'none';
type DateLike = string | number | Date;

export interface ActivityFeedActor {
    id?: string | number;
    name: string;
    avatar?: string;
    meta?: string;
}

export interface ActivityFeedItem {
    id?: string | number;
    title: string;
    description?: string;
    timestamp?: DateLike;
    type?: ActivityFeedType;
    actor?: ActivityFeedActor;
    actionLabel?: string;
    actionValue?: string;
    groupLabel?: string;
}

interface Props {
    items?: Array<ActivityFeedItem>;
    groupBy?: GroupByMode;
    relativeTime?: boolean;
    locale?: string;
    now?: DateLike | null;
    emptyText?: string;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    groupBy: 'date',
    relativeTime: true,
    locale: 'en',
    now: null,
    emptyText: 'No activity yet.',
    ariaLabel: 'Activity feed',
});

const emits = defineEmits<{
    (event: 'itemClick', item: ActivityFeedItem, index: number): void;
    (event: 'actionClick', payload: { item: ActivityFeedItem; index: number; action?: string }): void;
}>();

const resolvedAriaLabel = computed(() => props.ariaLabel || 'Activity feed');

const resolveDate = (value?: DateLike | null) => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

const formatAbsoluteTime = (value?: DateLike | null) => {
    const date = resolveDate(value);

    if (!date) {
        return '';
    }

    return date.toLocaleString(props.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const formatRelativeTime = (value?: DateLike | null) => {
    const date = resolveDate(value);

    if (!date || !props.relativeTime || typeof Intl === 'undefined' || !Intl.RelativeTimeFormat) {
        return '';
    }

    const baseNow = resolveDate(props.now) ?? new Date();
    const diffMs = date.getTime() - baseNow.getTime();
    const absMs = Math.abs(diffMs);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    const formatter = new Intl.RelativeTimeFormat(props.locale, { numeric: 'auto' });

    if (absMs < minute) {
        return formatter.format(Math.round(diffMs / 1000), 'second');
    }
    if (absMs < hour) {
        return formatter.format(Math.round(diffMs / minute), 'minute');
    }
    if (absMs < day) {
        return formatter.format(Math.round(diffMs / hour), 'hour');
    }
    if (absMs < week) {
        return formatter.format(Math.round(diffMs / day), 'day');
    }
    if (absMs < month) {
        return formatter.format(Math.round(diffMs / week), 'week');
    }
    if (absMs < year) {
        return formatter.format(Math.round(diffMs / month), 'month');
    }

    return formatter.format(Math.round(diffMs / year), 'year');
};

const getDateKey = (value?: DateLike | null) => {
    const date = resolveDate(value);

    if (!date) {
        return 'undated';
    }

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatGroupLabel = (item: ActivityFeedItem) => {
    if (item.groupLabel) {
        return item.groupLabel;
    }

    const date = resolveDate(item.timestamp);

    if (!date) {
        return '';
    }

    return date.toLocaleDateString(props.locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

type FeedEntry = {
    key: string;
    index: number;
    item: ActivityFeedItem;
    relativeTimeLabel: string;
    timestampLabel: string;
};

const groups = computed(() => {
    const indexed = (props.items ?? []).map((item, index) => ({
        key: `${String(item.id ?? item.title)}_${index.toString()}`,
        index,
        item,
        relativeTimeLabel: formatRelativeTime(item.timestamp),
        timestampLabel: formatAbsoluteTime(item.timestamp),
    }));

    if (props.groupBy === 'none') {
        return [
            {
                key: 'all',
                label: '',
                entries: indexed,
            },
        ];
    }

    const grouped = new Map<string, { key: string; label: string; entries: Array<FeedEntry> }>();

    indexed.forEach(entry => {
        const groupKey = getDateKey(entry.item.timestamp);
        const existing = grouped.get(groupKey);

        if (existing) {
            existing.entries.push(entry);

            return;
        }

        grouped.set(groupKey, {
            key: groupKey,
            label: formatGroupLabel(entry.item),
            entries: [entry],
        });
    });

    return Array.from(grouped.values());
});

const getActorLabel = (item: ActivityFeedItem) => {
    const source = (item.actor?.avatar || item.actor?.name || item.title || '').trim();

    return source ? source.charAt(0).toUpperCase() : 'A';
};

const onItemClick = (item: ActivityFeedItem, index: number) => {
    emits('itemClick', item, index);
};

const onActionClick = (item: ActivityFeedItem, index: number) => {
    emits('actionClick', {
        item,
        index,
        action: item.actionValue,
    });
};
</script>

<style lang="scss">
.vf-activity-feed {
    display: grid;
    gap: var(--vf-activity-feed-gap);
}

.vf-activity-feed__group {
    display: grid;
    gap: var(--vf-activity-feed-group-gap);
}

.vf-activity-feed__group-title {
    margin: 0;
    font-size: var(--vf-activity-feed-group-title-font-size);
    color: var(--vf-activity-feed-group-title-color);
    font-weight: var(--vf-activity-feed-group-title-font-weight);
}

.vf-activity-feed__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--vf-activity-feed-item-gap);
}

.vf-activity-feed__item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--vf-activity-feed-item-gap);
    padding: var(--vf-activity-feed-item-padding);
    border: var(--vf-border-width) solid var(--vf-activity-feed-item-border-color);
    border-radius: var(--vf-activity-feed-item-border-radius);
    background-color: var(--vf-activity-feed-item-background-color);
}

.vf-activity-feed__item-main {
    display: flex;
    align-items: flex-start;
    gap: var(--vf-activity-feed-content-gap);
    border: none;
    background: transparent;
    padding: 0;
    text-align: start;
    color: inherit;
    cursor: pointer;
}

.vf-activity-feed__avatar {
    width: var(--vf-activity-feed-avatar-size);
    height: var(--vf-activity-feed-avatar-size);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vf-activity-feed-avatar-background-color);
    color: var(--vf-activity-feed-avatar-text-color);
    font-size: var(--vf-activity-feed-avatar-font-size);
    font-weight: 600;
    flex: 0 0 auto;
}

.vf-activity-feed__content {
    min-width: 0;
    display: grid;
    gap: 0.2rem;
}

.vf-activity-feed__title {
    font-size: var(--vf-activity-feed-title-font-size);
    color: var(--vf-activity-feed-title-color);
    font-weight: var(--vf-activity-feed-title-font-weight);
}

.vf-activity-feed__description {
    font-size: var(--vf-activity-feed-description-font-size);
    color: var(--vf-activity-feed-description-color);
}

.vf-activity-feed__meta {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-activity-feed-meta-gap);
    font-size: var(--vf-activity-feed-meta-font-size);
    color: var(--vf-activity-feed-meta-color);
}

.vf-activity-feed__actor {
    font-weight: var(--vf-activity-feed-actor-font-weight);
}

.vf-activity-feed__action {
    border: none;
    background: transparent;
    color: var(--vf-activity-feed-action-color);
    font-size: var(--vf-activity-feed-action-font-size);
    cursor: pointer;
}

.vf-activity-feed__item[data-type='info'] {
    border-color: var(--vf-activity-feed-info-border-color);
}

.vf-activity-feed__item[data-type='success'] {
    border-color: var(--vf-activity-feed-success-border-color);
}

.vf-activity-feed__item[data-type='warn'] {
    border-color: var(--vf-activity-feed-warn-border-color);
}

.vf-activity-feed__item[data-type='danger'] {
    border-color: var(--vf-activity-feed-danger-border-color);
}

.vf-activity-feed__empty {
    margin: 0;
    padding: var(--vf-activity-feed-empty-padding);
    text-align: center;
    color: var(--vf-activity-feed-empty-color);
}
</style>
