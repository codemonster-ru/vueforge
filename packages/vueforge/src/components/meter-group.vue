<template>
    <section class="vf-meter-group" :aria-label="ariaLabel">
        <ul class="vf-meter-group__list" role="list">
            <li
                v-for="(item, index) in normalizedItems"
                :key="item.key"
                class="vf-meter-group__item"
                :data-state="item.state"
            >
                <slot name="item" :item="item.source" :index="index" :percent="item.percent" :state="item.state">
                    <div class="vf-meter-group__header">
                        <span class="vf-meter-group__label">{{ item.source.label }}</span>
                        <span class="vf-meter-group__value">
                            {{ formatValue(item.source.value) }} / {{ formatValue(item.max) }}
                        </span>
                    </div>
                    <div
                        class="vf-meter-group__track"
                        role="progressbar"
                        aria-valuemin="0"
                        :aria-valuemax="item.max"
                        :aria-valuenow="item.source.value"
                    >
                        <span class="vf-meter-group__bar" :style="{ width: `${item.percent}%` }" />
                    </div>
                    <p v-if="item.source.description" class="vf-meter-group__description">
                        {{ item.source.description }}
                    </p>
                </slot>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type MeterState = 'normal' | 'warn' | 'danger';

export interface MeterGroupThresholds {
    warn?: number;
    danger?: number;
}

export interface MeterGroupItem {
    id?: string | number;
    label: string;
    value: number;
    max?: number;
    description?: string;
    thresholds?: MeterGroupThresholds;
}

interface Props {
    items?: Array<MeterGroupItem>;
    max?: number;
    ariaLabel?: string;
    locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    max: 100,
    ariaLabel: 'Meter group',
    locale: 'en',
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const resolveState = (percent: number, thresholds?: MeterGroupThresholds): MeterState => {
    const warn = thresholds?.warn ?? 75;
    const danger = thresholds?.danger ?? 90;

    if (percent >= danger) {
        return 'danger';
    }
    if (percent >= warn) {
        return 'warn';
    }
    return 'normal';
};

const normalizedItems = computed(() =>
    props.items.map((item, index) => {
        const max = item.max ?? props.max;
        const safeMax = max > 0 ? max : 100;
        const percent = clamp((item.value / safeMax) * 100, 0, 100);
        const state = resolveState(percent, item.thresholds);

        return {
            key: `${String(item.id ?? item.label)}_${index.toString()}`,
            source: item,
            max: safeMax,
            percent,
            state,
        };
    }),
);

const formatValue = (value: number) =>
    new Intl.NumberFormat(props.locale, {
        maximumFractionDigits: 2,
    }).format(value);
</script>

<style lang="scss">
.vf-meter-group {
    display: grid;
    gap: var(--vf-meter-group-gap);
}

.vf-meter-group__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--vf-meter-group-item-gap);
}

.vf-meter-group__item {
    border: var(--vf-border-width) solid var(--vf-meter-group-item-border-color);
    border-radius: var(--vf-meter-group-item-border-radius);
    background-color: var(--vf-meter-group-item-background-color);
    padding: var(--vf-meter-group-item-padding);
}

.vf-meter-group__header {
    display: flex;
    justify-content: space-between;
    gap: var(--vf-meter-group-header-gap);
    margin-bottom: 0.4rem;
}

.vf-meter-group__label {
    font-size: var(--vf-meter-group-label-font-size);
    font-weight: var(--vf-meter-group-label-font-weight);
}

.vf-meter-group__value {
    font-size: var(--vf-meter-group-value-font-size);
    color: var(--vf-meter-group-value-color);
}

.vf-meter-group__track {
    width: 100%;
    height: var(--vf-meter-group-track-height);
    border-radius: var(--vf-meter-group-track-border-radius);
    background-color: var(--vf-meter-group-track-background-color);
    overflow: hidden;
}

.vf-meter-group__bar {
    display: block;
    height: 100%;
    border-radius: inherit;
    background-color: var(--vf-meter-group-bar-color);
    transition: width 0.2s ease;
}

.vf-meter-group__description {
    margin: 0.45rem 0 0;
    font-size: var(--vf-meter-group-description-font-size);
    color: var(--vf-meter-group-description-color);
}

.vf-meter-group__item[data-state='warn'] .vf-meter-group__bar {
    background-color: var(--vf-meter-group-warn-bar-color);
}

.vf-meter-group__item[data-state='danger'] .vf-meter-group__bar {
    background-color: var(--vf-meter-group-danger-bar-color);
}
</style>
