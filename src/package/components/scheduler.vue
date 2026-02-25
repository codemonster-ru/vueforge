<template>
    <section class="vf-scheduler" :aria-label="ariaLabel">
        <header class="vf-scheduler__header">
            <div class="vf-scheduler__title-wrap">
                <h3 class="vf-scheduler__title">{{ title }}</h3>
                <p class="vf-scheduler__subtitle">{{ rangeLabel }}</p>
            </div>
        </header>

        <div class="vf-scheduler__viewport">
            <div class="vf-scheduler__grid" :style="{ '--vf-scheduler-slot-count': String(slots.length) }">
                <div class="vf-scheduler__head-cell vf-scheduler__head-cell_resource">Resource</div>
                <div class="vf-scheduler__head-cell vf-scheduler__head-cell_timeline">
                    <div class="vf-scheduler__slots vf-scheduler__slots_head">
                        <span v-for="slot in slots" :key="slot.key" class="vf-scheduler__slot-label">{{
                            slot.label
                        }}</span>
                    </div>
                </div>

                <template v-for="resource in normalizedResources" :key="String(resource.id)">
                    <div class="vf-scheduler__resource-cell">
                        <p class="vf-scheduler__resource-label">{{ resource.label }}</p>
                        <p v-if="resource.meta" class="vf-scheduler__resource-meta">{{ resource.meta }}</p>
                    </div>
                    <div class="vf-scheduler__timeline-cell">
                        <div class="vf-scheduler__slots">
                            <button
                                v-for="slot in slots"
                                :key="`${String(resource.id)}-${slot.key}`"
                                type="button"
                                class="vf-scheduler__slot"
                                :disabled="disabled || readonly"
                                :aria-label="`${resource.label} ${slot.label}`"
                                @click="onSlotClick(resource.id, slot.minutes)"
                            />
                        </div>

                        <div class="vf-scheduler__events" :style="{ height: `${getTrackHeight(resource.id)}px` }">
                            <button
                                v-for="entry in eventsByResource.get(resource.id) ?? []"
                                :key="entry.key"
                                type="button"
                                class="vf-scheduler__event"
                                :class="{ 'vf-scheduler__event_selected': entry.event.id === modelValue }"
                                :style="entry.style"
                                :disabled="disabled || !!entry.event.disabled"
                                :aria-label="entry.event.title"
                                @click="onEventClick(entry.event)"
                            >
                                <span class="vf-scheduler__event-title">{{ entry.event.title }}</span>
                                <span class="vf-scheduler__event-time">{{
                                    formatTimeRange(entry.event.start, entry.event.end)
                                }}</span>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SchedulerId = string | number;
type SchedulerTimeValue = string | number;

export interface SchedulerResource {
    id: SchedulerId;
    label: string;
    meta?: string;
}

export interface SchedulerEvent {
    id: SchedulerId;
    resourceId: SchedulerId;
    title: string;
    start: SchedulerTimeValue;
    end: SchedulerTimeValue;
    color?: string;
    disabled?: boolean;
}

interface Props {
    resources?: Array<SchedulerResource>;
    events?: Array<SchedulerEvent>;
    modelValue?: SchedulerId | null;
    title?: string;
    startHour?: number;
    endHour?: number;
    slotMinutes?: number;
    locale?: string;
    disabled?: boolean;
    readonly?: boolean;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    resources: () => [],
    events: () => [],
    modelValue: null,
    title: 'Scheduler',
    startHour: 8,
    endHour: 20,
    slotMinutes: 30,
    locale: 'en',
    disabled: false,
    readonly: false,
    ariaLabel: 'Scheduler timeline',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: SchedulerId | null): void;
    (event: 'eventClick', payload: SchedulerEvent): void;
    (event: 'slotClick', payload: { resourceId: SchedulerId; start: string; end: string }): void;
}>();

const startMinutes = computed(() => Math.max(0, Math.min(23, Math.floor(props.startHour))) * 60);
const endMinutes = computed(() => Math.max(startMinutes.value + 60, Math.min(24, Math.ceil(props.endHour)) * 60));
const slotSize = computed(() => Math.max(5, props.slotMinutes));
const totalMinutes = computed(() => endMinutes.value - startMinutes.value);

const normalizedResources = computed(() => props.resources);

const slots = computed(() => {
    const list: Array<{ key: string; minutes: number; label: string }> = [];
    for (let minutes = startMinutes.value; minutes < endMinutes.value; minutes += slotSize.value) {
        list.push({
            key: String(minutes),
            minutes,
            label: formatMinutes(minutes, props.locale),
        });
    }

    return list;
});

const rangeLabel = computed(
    () => `${formatMinutes(startMinutes.value, props.locale)} - ${formatMinutes(endMinutes.value, props.locale)}`,
);

const toMinutes = (value: SchedulerTimeValue) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(0, Math.min(24 * 60, Math.floor(value)));
    }

    if (typeof value !== 'string') {
        return null;
    }

    const match = value.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (
        !Number.isFinite(hours) ||
        !Number.isFinite(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return hours * 60 + minutes;
};

const clampToRange = (value: number) => Math.min(endMinutes.value, Math.max(startMinutes.value, value));

const formatMinutes = (value: number, locale: string) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const date = new Date(2026, 0, 1, hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
};

const formatTimeRange = (start: SchedulerTimeValue, end: SchedulerTimeValue) => {
    const startParsed = toMinutes(start);
    const endParsed = toMinutes(end);
    if (startParsed === null || endParsed === null) {
        return '-';
    }

    return `${formatMinutes(startParsed, props.locale)} - ${formatMinutes(endParsed, props.locale)}`;
};

type PositionedEvent = {
    key: string;
    event: SchedulerEvent;
    lane: number;
    style: Record<string, string>;
};

const laneHeight = 30;
const laneGap = 4;

const eventsByResource = computed(() => {
    const map = new Map<SchedulerId, Array<PositionedEvent>>();

    normalizedResources.value.forEach(resource => {
        const events = props.events
            .filter(event => event.resourceId === resource.id)
            .map(event => {
                const rawStart = toMinutes(event.start);
                const rawEnd = toMinutes(event.end);
                if (rawStart === null || rawEnd === null) {
                    return null;
                }

                const clampedStart = clampToRange(rawStart);
                const clampedEnd = clampToRange(Math.max(rawStart + 1, rawEnd));
                if (
                    clampedEnd <= startMinutes.value ||
                    clampedStart >= endMinutes.value ||
                    clampedEnd <= clampedStart
                ) {
                    return null;
                }

                return {
                    event,
                    start: clampedStart,
                    end: clampedEnd,
                };
            })
            .filter((value): value is { event: SchedulerEvent; start: number; end: number } => value !== null)
            .sort((left, right) => left.start - right.start || left.end - right.end);

        const laneEnds: Array<number> = [];
        const positioned: Array<PositionedEvent> = events.map(item => {
            let lane = laneEnds.findIndex(end => end <= item.start);
            if (lane === -1) {
                lane = laneEnds.length;
                laneEnds.push(item.end);
            } else {
                laneEnds[lane] = item.end;
            }

            const leftPercent = ((item.start - startMinutes.value) / totalMinutes.value) * 100;
            const widthPercent = ((item.end - item.start) / totalMinutes.value) * 100;
            const topPx = lane * (laneHeight + laneGap);

            return {
                key: `${String(item.event.id)}_${String(resource.id)}_${String(item.start)}`,
                event: item.event,
                lane,
                style: {
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 0.8)}%`,
                    top: `${topPx}px`,
                    backgroundColor: item.event.color || 'var(--vf-scheduler-event-background-color)',
                },
            };
        });

        map.set(resource.id, positioned);
    });

    return map;
});

const getTrackHeight = (resourceId: SchedulerId) => {
    const rows = eventsByResource.value.get(resourceId) ?? [];
    const laneCount = rows.length ? Math.max(...rows.map(row => row.lane)) + 1 : 1;
    return laneCount * laneHeight + Math.max(0, laneCount - 1) * laneGap;
};

const onEventClick = (event: SchedulerEvent) => {
    if (props.disabled || event.disabled) {
        return;
    }

    emits('update:modelValue', event.id);
    emits('eventClick', event);
};

const onSlotClick = (resourceId: SchedulerId, minutes: number) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const end = Math.min(minutes + slotSize.value, endMinutes.value);

    emits('slotClick', {
        resourceId,
        start: toTimeString(minutes),
        end: toTimeString(end),
    });
};

const toTimeString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};
</script>

<style lang="scss">
.vf-scheduler {
    display: grid;
    gap: var(--vf-scheduler-gap);
    border: var(--vf-border-width) solid var(--vf-scheduler-border-color);
    border-radius: var(--vf-scheduler-border-radius);
    background: var(--vf-scheduler-background-color);
    color: var(--vf-scheduler-text-color);
    padding: var(--vf-scheduler-padding);
}

.vf-scheduler__title {
    margin: 0;
    font-size: var(--vf-scheduler-title-font-size);
    font-weight: var(--vf-scheduler-title-font-weight);
}

.vf-scheduler__subtitle {
    margin: 0.2rem 0 0;
    font-size: var(--vf-scheduler-subtitle-font-size);
    color: var(--vf-scheduler-subtitle-color);
}

.vf-scheduler__viewport {
    overflow: auto;
}

.vf-scheduler__grid {
    display: grid;
    grid-template-columns: var(--vf-scheduler-resource-width) minmax(var(--vf-scheduler-min-timeline-width), 1fr);
    gap: var(--vf-scheduler-grid-gap);
    min-width: var(--vf-scheduler-min-grid-width);
}

.vf-scheduler__head-cell {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--vf-scheduler-head-background-color);
    border: var(--vf-border-width) solid var(--vf-scheduler-divider-color);
    border-radius: var(--vf-scheduler-head-border-radius);
    padding: var(--vf-scheduler-head-padding);
    font-size: var(--vf-scheduler-head-font-size);
    font-weight: var(--vf-scheduler-head-font-weight);
}

.vf-scheduler__slots {
    display: grid;
    grid-template-columns: repeat(var(--vf-scheduler-slot-count), minmax(var(--vf-scheduler-slot-min-width), 1fr));
}

.vf-scheduler__slots_head {
    gap: 0;
}

.vf-scheduler__slot-label {
    border-inline-end: var(--vf-border-width) solid var(--vf-scheduler-divider-color);
    padding: 0 0.25rem;
    font-size: var(--vf-scheduler-slot-label-font-size);
    color: var(--vf-scheduler-slot-label-color);
}

.vf-scheduler__resource-cell {
    border: var(--vf-border-width) solid var(--vf-scheduler-divider-color);
    border-radius: var(--vf-scheduler-row-border-radius);
    padding: var(--vf-scheduler-resource-padding);
    background: var(--vf-scheduler-resource-background-color);
}

.vf-scheduler__resource-label {
    margin: 0;
    font-size: var(--vf-scheduler-resource-font-size);
    font-weight: var(--vf-scheduler-resource-font-weight);
}

.vf-scheduler__resource-meta {
    margin: 0.2rem 0 0;
    font-size: var(--vf-scheduler-resource-meta-font-size);
    color: var(--vf-scheduler-resource-meta-color);
}

.vf-scheduler__timeline-cell {
    border: var(--vf-border-width) solid var(--vf-scheduler-divider-color);
    border-radius: var(--vf-scheduler-row-border-radius);
    background: var(--vf-scheduler-track-background-color);
    padding: var(--vf-scheduler-track-padding);
    display: grid;
    gap: var(--vf-scheduler-track-gap);
}

.vf-scheduler__slot {
    height: var(--vf-scheduler-slot-height);
    border: 0;
    border-inline-end: var(--vf-border-width) solid var(--vf-scheduler-divider-color);
    background: transparent;
}

.vf-scheduler__slot:hover:not(:disabled) {
    background: var(--vf-scheduler-slot-hover-background-color);
}

.vf-scheduler__events {
    position: relative;
}

.vf-scheduler__event {
    position: absolute;
    height: var(--vf-scheduler-event-height);
    border: var(--vf-border-width) solid var(--vf-scheduler-event-border-color);
    border-radius: var(--vf-scheduler-event-border-radius);
    background: var(--vf-scheduler-event-background-color);
    color: var(--vf-scheduler-event-text-color);
    padding: var(--vf-scheduler-event-padding);
    font-size: var(--vf-scheduler-event-font-size);
    text-align: left;
    overflow: hidden;
}

.vf-scheduler__event_selected {
    box-shadow: 0 0 0 1px var(--vf-scheduler-event-selected-outline-color);
}

.vf-scheduler__event-title {
    display: block;
    font-weight: var(--vf-scheduler-event-title-font-weight);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.vf-scheduler__event-time {
    display: block;
    font-size: var(--vf-scheduler-event-time-font-size);
    opacity: 0.86;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
