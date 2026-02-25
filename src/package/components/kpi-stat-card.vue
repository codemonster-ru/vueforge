<template>
    <article class="vf-kpi-stat-card" :data-trend="resolvedTrend" :aria-label="ariaLabel || undefined">
        <header class="vf-kpi-stat-card__header">
            <div class="vf-kpi-stat-card__titles">
                <h3 class="vf-kpi-stat-card__title">{{ title }}</h3>
                <p v-if="subtitle" class="vf-kpi-stat-card__subtitle">{{ subtitle }}</p>
            </div>
            <div v-if="$slots.sparkline" class="vf-kpi-stat-card__sparkline">
                <slot name="sparkline" />
            </div>
        </header>

        <div class="vf-kpi-stat-card__value-wrap">
            <slot name="value">
                <p class="vf-kpi-stat-card__value">{{ displayValue }}</p>
            </slot>
            <div v-if="showTrendBlock" class="vf-kpi-stat-card__trend">
                <span class="vf-kpi-stat-card__trend-icon" aria-hidden="true">{{ trendIcon }}</span>
                <span class="vf-kpi-stat-card__trend-label">{{ resolvedTrendLabel }}</span>
                <span v-if="showDelta && deltaLabel" class="vf-kpi-stat-card__delta">{{ deltaLabel }}</span>
            </div>
        </div>

        <footer v-if="caption || $slots.caption" class="vf-kpi-stat-card__footer">
            <slot name="caption">{{ caption }}</slot>
        </footer>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TrendDirection = 'up' | 'down' | 'neutral' | 'auto';
type DeltaFormat = 'number' | 'percent';

interface Props {
    title?: string;
    subtitle?: string;
    value?: string | number;
    caption?: string;
    trend?: TrendDirection;
    trendLabel?: string;
    delta?: number | null;
    deltaFormat?: DeltaFormat;
    showDelta?: boolean;
    ariaLabel?: string;
    locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
    value: '',
    caption: '',
    trend: 'auto',
    trendLabel: '',
    delta: null,
    deltaFormat: 'percent',
    showDelta: true,
    ariaLabel: '',
    locale: 'en',
});

const displayValue = computed(() => String(props.value ?? ''));

const resolvedTrend = computed<'up' | 'down' | 'neutral'>(() => {
    if (props.trend !== 'auto') {
        return props.trend;
    }

    if (props.delta == null || Number.isNaN(props.delta) || props.delta === 0) {
        return 'neutral';
    }

    return props.delta > 0 ? 'up' : 'down';
});

const trendIcon = computed(() => {
    if (resolvedTrend.value === 'up') {
        return '↗';
    }
    if (resolvedTrend.value === 'down') {
        return '↘';
    }
    return '→';
});

const resolvedTrendLabel = computed(() => {
    if (props.trendLabel) {
        return props.trendLabel;
    }

    if (resolvedTrend.value === 'up') {
        return 'Up';
    }
    if (resolvedTrend.value === 'down') {
        return 'Down';
    }
    return 'Stable';
});

const deltaLabel = computed(() => {
    if (props.delta == null || Number.isNaN(props.delta)) {
        return '';
    }

    if (props.deltaFormat === 'percent') {
        const sign = props.delta > 0 ? '+' : '';
        const formatted = new Intl.NumberFormat(props.locale, {
            maximumFractionDigits: 2,
        }).format(props.delta);

        return `${sign}${formatted}%`;
    }

    return new Intl.NumberFormat(props.locale, {
        signDisplay: 'exceptZero',
        maximumFractionDigits: 2,
    }).format(props.delta);
});

const showDelta = computed(() => props.showDelta && props.delta != null);
const showTrendBlock = computed(() => resolvedTrendLabel.value || showDelta.value);
</script>

<style lang="scss">
.vf-kpi-stat-card {
    border: var(--vf-border-width) solid var(--vf-kpi-stat-card-border-color);
    border-radius: var(--vf-kpi-stat-card-border-radius);
    background-color: var(--vf-kpi-stat-card-background-color);
    color: var(--vf-kpi-stat-card-text-color);
    padding: var(--vf-kpi-stat-card-padding);
    display: grid;
    gap: var(--vf-kpi-stat-card-gap);
}

.vf-kpi-stat-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--vf-kpi-stat-card-header-gap);
}

.vf-kpi-stat-card__titles {
    min-width: 0;
}

.vf-kpi-stat-card__title {
    margin: 0;
    font-size: var(--vf-kpi-stat-card-title-font-size);
    font-weight: var(--vf-kpi-stat-card-title-font-weight);
}

.vf-kpi-stat-card__subtitle {
    margin: 0.25rem 0 0;
    font-size: var(--vf-kpi-stat-card-subtitle-font-size);
    color: var(--vf-kpi-stat-card-subtitle-color);
}

.vf-kpi-stat-card__sparkline {
    flex: 0 0 auto;
}

.vf-kpi-stat-card__value-wrap {
    display: grid;
    gap: var(--vf-kpi-stat-card-value-gap);
}

.vf-kpi-stat-card__value {
    margin: 0;
    font-size: var(--vf-kpi-stat-card-value-font-size);
    font-weight: var(--vf-kpi-stat-card-value-font-weight);
    line-height: 1.1;
}

.vf-kpi-stat-card__trend {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-kpi-stat-card-trend-gap);
    font-size: var(--vf-kpi-stat-card-trend-font-size);
    color: var(--vf-kpi-stat-card-trend-color);
}

.vf-kpi-stat-card[data-trend='up'] .vf-kpi-stat-card__trend {
    color: var(--vf-kpi-stat-card-up-color);
}

.vf-kpi-stat-card[data-trend='down'] .vf-kpi-stat-card__trend {
    color: var(--vf-kpi-stat-card-down-color);
}

.vf-kpi-stat-card__footer {
    font-size: var(--vf-kpi-stat-card-caption-font-size);
    color: var(--vf-kpi-stat-card-caption-color);
}
</style>
