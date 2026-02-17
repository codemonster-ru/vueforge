<template>
    <nav :class="rootClass" :aria-label="ariaLabel || undefined" :aria-labelledby="ariaLabelledby || undefined">
        <ol class="vf-timeline__list">
            <li
                v-for="(item, index) in timelineItems"
                :key="getKey(item, index)"
                class="vf-timeline__item"
                :data-status="item.status ?? 'neutral'"
            >
                <div class="vf-timeline__rail">
                    <span class="vf-timeline__marker">
                        <slot name="marker" :item="item" :index="index">
                            <v-icon v-if="item.icon" :icon="item.icon" />
                            <span v-else class="vf-timeline__dot" />
                        </slot>
                    </span>
                    <span v-if="index < timelineItems.length - 1" class="vf-timeline__line" aria-hidden="true" />
                </div>
                <div class="vf-timeline__content">
                    <slot name="item" :item="item" :index="index">
                        <time v-if="item.date" class="vf-timeline__date">{{ item.date }}</time>
                        <h4 v-if="item.title" class="vf-timeline__title">{{ item.title }}</h4>
                        <p v-if="item.description" class="vf-timeline__description">{{ item.description }}</p>
                    </slot>
                </div>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';

type TimelineOrientation = 'vertical' | 'horizontal';
type TimelineSize = 'small' | 'normal' | 'large';
type TimelineStatus = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

export interface TimelineItem {
    id?: string | number;
    title?: string;
    description?: string;
    date?: string;
    icon?: string;
    status?: TimelineStatus;
}

interface Props {
    items?: Array<TimelineItem>;
    orientation?: TimelineOrientation;
    size?: TimelineSize;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    orientation: 'vertical',
    size: 'normal',
    ariaLabel: '',
    ariaLabelledby: '',
});

defineOptions({ name: 'VfTimeline' });

const timelineItems = computed(() => props.items ?? []);
const rootClass = computed(() => ['vf-timeline', `vf-timeline_${props.orientation}`, `vf-timeline_size-${props.size}`]);
const getKey = (item: TimelineItem, index: number) => `${String(item.id ?? item.title ?? 'item')}_${index.toString()}`;
</script>

<style lang="scss">
.vf-timeline {
    display: block;
}

.vf-timeline__list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.vf-timeline_vertical .vf-timeline__list {
    display: flex;
    flex-direction: column;
    gap: var(--vf-timeline-gap);
}

.vf-timeline_horizontal .vf-timeline__list {
    display: flex;
    gap: var(--vf-timeline-gap);
}

.vf-timeline_vertical .vf-timeline__item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: var(--vf-timeline-item-gap);
}

.vf-timeline_horizontal .vf-timeline__item {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.vf-timeline__rail {
    display: flex;
    align-items: center;
}

.vf-timeline_vertical .vf-timeline__rail {
    flex-direction: column;
}

.vf-timeline_horizontal .vf-timeline__rail {
    width: 100%;
    flex-direction: row;
}

.vf-timeline__marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-timeline-marker-size);
    height: var(--vf-timeline-marker-size);
    border-radius: var(--vf-timeline-marker-border-radius);
    border: var(--vf-timeline-marker-border-width) solid var(--vf-timeline-marker-border-color);
    background-color: var(--vf-timeline-marker-background-color);
    color: var(--vf-timeline-marker-text-color);
    font-size: var(--vf-timeline-marker-icon-size);
    box-sizing: border-box;
    flex: 0 0 auto;
}

.vf-timeline__dot {
    width: var(--vf-timeline-dot-size);
    height: var(--vf-timeline-dot-size);
    border-radius: 999px;
    background-color: currentColor;
}

.vf-timeline__line {
    display: block;
    background-color: var(--vf-timeline-line-color);
}

.vf-timeline_vertical .vf-timeline__line {
    width: var(--vf-timeline-line-thickness);
    min-height: var(--vf-timeline-line-length);
    flex: 1;
    margin-top: 0.25rem;
}

.vf-timeline_horizontal .vf-timeline__line {
    height: var(--vf-timeline-line-thickness);
    flex: 1;
    margin-left: var(--vf-timeline-item-gap);
}

.vf-timeline__content {
    min-width: 0;
}

.vf-timeline_horizontal .vf-timeline__content {
    margin-top: var(--vf-timeline-item-gap);
}

.vf-timeline__date {
    display: block;
    margin: 0 0 0.25rem;
    font-size: var(--vf-timeline-date-font-size);
    color: var(--vf-timeline-date-color);
    line-height: var(--vf-typography-line-height);
}

.vf-timeline__title {
    margin: 0;
    font-size: var(--vf-timeline-title-font-size);
    color: var(--vf-timeline-title-color);
    line-height: var(--vf-typography-line-height);
}

.vf-timeline__description {
    margin: 0.25rem 0 0;
    font-size: var(--vf-timeline-description-font-size);
    color: var(--vf-timeline-description-color);
    line-height: var(--vf-typography-line-height);
}

.vf-timeline__item[data-status='info'] {
    --vf-timeline-marker-background-color: var(--vf-timeline-info-marker-background-color);
    --vf-timeline-marker-border-color: var(--vf-timeline-info-marker-border-color);
    --vf-timeline-marker-text-color: var(--vf-timeline-info-marker-text-color);
    --vf-timeline-line-color: var(--vf-timeline-info-line-color);
}

.vf-timeline__item[data-status='success'] {
    --vf-timeline-marker-background-color: var(--vf-timeline-success-marker-background-color);
    --vf-timeline-marker-border-color: var(--vf-timeline-success-marker-border-color);
    --vf-timeline-marker-text-color: var(--vf-timeline-success-marker-text-color);
    --vf-timeline-line-color: var(--vf-timeline-success-line-color);
}

.vf-timeline__item[data-status='warn'] {
    --vf-timeline-marker-background-color: var(--vf-timeline-warn-marker-background-color);
    --vf-timeline-marker-border-color: var(--vf-timeline-warn-marker-border-color);
    --vf-timeline-marker-text-color: var(--vf-timeline-warn-marker-text-color);
    --vf-timeline-line-color: var(--vf-timeline-warn-line-color);
}

.vf-timeline__item[data-status='danger'] {
    --vf-timeline-marker-background-color: var(--vf-timeline-danger-marker-background-color);
    --vf-timeline-marker-border-color: var(--vf-timeline-danger-marker-border-color);
    --vf-timeline-marker-text-color: var(--vf-timeline-danger-marker-text-color);
    --vf-timeline-line-color: var(--vf-timeline-danger-line-color);
}

.vf-timeline_size-small {
    --vf-timeline-item-gap: var(--vf-timeline-small-item-gap);
    --vf-timeline-marker-size: var(--vf-timeline-small-marker-size);
    --vf-timeline-marker-icon-size: var(--vf-timeline-small-marker-icon-size);
    --vf-timeline-dot-size: var(--vf-timeline-small-dot-size);
    --vf-timeline-line-length: var(--vf-timeline-small-line-length);
    --vf-timeline-date-font-size: var(--vf-timeline-small-date-font-size);
    --vf-timeline-title-font-size: var(--vf-timeline-small-title-font-size);
    --vf-timeline-description-font-size: var(--vf-timeline-small-description-font-size);
}

.vf-timeline_size-large {
    --vf-timeline-item-gap: var(--vf-timeline-large-item-gap);
    --vf-timeline-marker-size: var(--vf-timeline-large-marker-size);
    --vf-timeline-marker-icon-size: var(--vf-timeline-large-marker-icon-size);
    --vf-timeline-dot-size: var(--vf-timeline-large-dot-size);
    --vf-timeline-line-length: var(--vf-timeline-large-line-length);
    --vf-timeline-date-font-size: var(--vf-timeline-large-date-font-size);
    --vf-timeline-title-font-size: var(--vf-timeline-large-title-font-size);
    --vf-timeline-description-font-size: var(--vf-timeline-large-description-font-size);
}
</style>
