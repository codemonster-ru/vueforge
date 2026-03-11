<template>
    <div
        :class="getClass"
        role="progressbar"
        :aria-label="ariaLabel || undefined"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="ariaValueNow"
        :data-severity="severity"
    >
        <div v-if="variant === 'linear'" class="vf-progress__track">
            <div class="vf-progress__bar" :style="barStyle"></div>
        </div>
        <div v-else class="vf-progress__circle">
            <svg viewBox="0 0 100 100" class="vf-progress__svg" aria-hidden="true">
                <circle class="vf-progress__circle-track" cx="50" cy="50" r="45" />
                <circle class="vf-progress__circle-bar" cx="50" cy="50" r="45" :style="circleStyle" />
            </svg>
        </div>
        <span v-if="labelContent || hasLabelSlot" class="vf-progress__label">
            <slot>{{ labelContent }}</slot>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type ProgressVariant = 'linear' | 'circular';
type ProgressSize = 'small' | 'normal' | 'large';
type ProgressSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    value?: number | null;
    variant?: ProgressVariant;
    size?: ProgressSize;
    label?: string;
    showValue?: boolean;
    severity?: ProgressSeverity;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: null,
    variant: 'linear',
    size: 'normal',
    label: '',
    showValue: false,
    severity: 'neutral',
    ariaLabel: '',
});

const slots = useSlots();
const clampValue = (value: number) => Math.min(100, Math.max(0, value));
const isIndeterminate = computed(() => props.value === undefined || props.value === null || Number.isNaN(props.value));
const normalizedValue = computed(() => (isIndeterminate.value ? 0 : clampValue(Number(props.value))));
const ariaValueNow = computed(() => (isIndeterminate.value ? undefined : normalizedValue.value));

const hasLabelSlot = computed(() => Boolean(slots.default));
const labelContent = computed(() => {
    if (props.label) {
        return props.label;
    }

    if (props.showValue && !isIndeterminate.value) {
        return `${Math.round(normalizedValue.value)}%`;
    }

    return '';
});

const getClass = computed(() => {
    const classes = ['vf-progress', `vf-progress_${props.variant}`, `vf-progress_size-${props.size}`];

    if (isIndeterminate.value) {
        classes.push('vf-progress_indeterminate');
    }

    return classes;
});

const barStyle = computed(() => {
    if (isIndeterminate.value) {
        return undefined;
    }

    return { width: `${normalizedValue.value}%` };
});

const circumference = 2 * Math.PI * 45;
const circleStyle = computed(() => {
    if (isIndeterminate.value) {
        return {
            strokeDasharray: `${circumference}px`,
            strokeDashoffset: `${circumference * 0.75}px`,
        };
    }

    const dashOffset = circumference - (normalizedValue.value / 100) * circumference;

    return {
        strokeDasharray: `${circumference}px`,
        strokeDashoffset: `${dashOffset}px`,
    };
});
</script>

<style lang="scss">
@keyframes vf-progress-linear-indeterminate {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(300%);
    }
}

@keyframes vf-progress-circle-rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes vf-progress-circle-dash {
    0% {
        stroke-dasharray: 40, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 140, 200;
        stroke-dashoffset: -50;
    }
    100% {
        stroke-dasharray: 40, 200;
        stroke-dashoffset: -190;
    }
}

.vf-progress {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-progress-gap);
    color: var(--vf-progress-label-color);
    font-size: var(--vf-progress-label-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-progress__track {
    position: relative;
    width: var(--vf-progress-width);
    height: var(--vf-progress-height);
    border-radius: var(--vf-progress-border-radius);
    background-color: var(--vf-progress-background-color);
    overflow: hidden;
}

.vf-progress__bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--vf-progress-bar-color);
    border-radius: inherit;
    transition: width 0.2s ease;
}

.vf-progress_indeterminate .vf-progress__bar {
    width: 35%;
    animation: vf-progress-linear-indeterminate var(--vf-progress-animation-duration) ease-in-out infinite;
}

.vf-progress__label {
    white-space: nowrap;
}

.vf-progress__circle {
    width: var(--vf-progress-circular-size);
    height: var(--vf-progress-circular-size);
}

.vf-progress__svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.vf-progress__circle-track {
    fill: none;
    stroke: var(--vf-progress-background-color);
    stroke-width: var(--vf-progress-circular-thickness);
}

.vf-progress__circle-bar {
    fill: none;
    stroke: var(--vf-progress-bar-color);
    stroke-width: var(--vf-progress-circular-thickness);
    stroke-linecap: round;
    transition: stroke-dashoffset 0.2s ease;
}

.vf-progress_indeterminate .vf-progress__svg {
    animation: vf-progress-circle-rotate var(--vf-progress-animation-duration) linear infinite;
}

.vf-progress_indeterminate .vf-progress__circle-bar {
    animation: vf-progress-circle-dash var(--vf-progress-animation-duration) ease-in-out infinite;
}

.vf-progress_size-small {
    font-size: var(--vf-progress-small-label-font-size);
}

.vf-progress_size-small .vf-progress__track {
    height: var(--vf-progress-small-height);
}

.vf-progress_size-small .vf-progress__circle {
    width: var(--vf-progress-small-circular-size);
    height: var(--vf-progress-small-circular-size);
}

.vf-progress_size-small .vf-progress__circle-track,
.vf-progress_size-small .vf-progress__circle-bar {
    stroke-width: var(--vf-progress-small-circular-thickness);
}

.vf-progress_size-large {
    font-size: var(--vf-progress-large-label-font-size);
}

.vf-progress_size-large .vf-progress__track {
    height: var(--vf-progress-large-height);
}

.vf-progress_size-large .vf-progress__circle {
    width: var(--vf-progress-large-circular-size);
    height: var(--vf-progress-large-circular-size);
}

.vf-progress_size-large .vf-progress__circle-track,
.vf-progress_size-large .vf-progress__circle-bar {
    stroke-width: var(--vf-progress-large-circular-thickness);
}

.vf-progress[data-severity='info'] {
    --vf-progress-bar-color: var(--vf-progress-info-bar-color);
}

.vf-progress[data-severity='success'] {
    --vf-progress-bar-color: var(--vf-progress-success-bar-color);
}

.vf-progress[data-severity='warn'] {
    --vf-progress-bar-color: var(--vf-progress-warn-bar-color);
}

.vf-progress[data-severity='danger'] {
    --vf-progress-bar-color: var(--vf-progress-danger-bar-color);
}
</style>
