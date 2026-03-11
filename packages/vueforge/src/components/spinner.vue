<template>
    <div :class="getClass" role="status" :aria-label="ariaLabel || undefined" :data-severity="severity">
        <span class="vf-spinner__icon" aria-hidden="true"></span>
        <span v-if="labelContent || hasLabelSlot" class="vf-spinner__label">
            <slot>{{ labelContent }}</slot>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type SpinnerVariant = 'inline' | 'overlay';
type SpinnerSize = 'small' | 'normal' | 'large';
type SpinnerSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    variant?: SpinnerVariant;
    size?: SpinnerSize;
    severity?: SpinnerSeverity;
    label?: string;
    ariaLabel?: string;
}

defineOptions({ name: 'VfSpinner' });

const props = withDefaults(defineProps<Props>(), {
    variant: 'inline',
    size: 'normal',
    severity: 'neutral',
    label: '',
    ariaLabel: 'Loading',
});

const slots = useSlots();

const hasLabelSlot = computed(() => Boolean(slots.default));
const labelContent = computed(() => props.label || '');

const getClass = computed(() => {
    const classes = ['vf-spinner', `vf-spinner_${props.variant}`, `vf-spinner_size-${props.size}`];

    return classes;
});
</script>

<style lang="scss">
@keyframes vf-spinner-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.vf-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-spinner-gap);
    color: var(--vf-spinner-label-color);
    font-size: var(--vf-spinner-label-font-size);
    line-height: var(--vf-typography-line-height);
    --vf-spinner-current-color: var(--vf-spinner-color);
}

.vf-spinner__icon {
    width: var(--vf-spinner-size);
    height: var(--vf-spinner-size);
    border-radius: 999px;
    border: var(--vf-spinner-thickness) solid var(--vf-spinner-track-color);
    border-top-color: var(--vf-spinner-current-color);
    animation: vf-spinner-spin var(--vf-spinner-animation-duration) linear infinite;
    box-sizing: border-box;
}

.vf-spinner__label {
    white-space: nowrap;
}

.vf-spinner_overlay {
    display: flex;
    width: 100%;
    min-height: var(--vf-spinner-overlay-min-height);
    padding: var(--vf-spinner-overlay-padding);
    border-radius: var(--vf-spinner-overlay-border-radius);
    background-color: var(--vf-spinner-overlay-background-color);
}

.vf-spinner_size-small {
    font-size: var(--vf-spinner-small-label-font-size);
}

.vf-spinner_size-small .vf-spinner__icon {
    width: var(--vf-spinner-small-size);
    height: var(--vf-spinner-small-size);
    border-width: var(--vf-spinner-small-thickness);
}

.vf-spinner_size-large {
    font-size: var(--vf-spinner-large-label-font-size);
}

.vf-spinner_size-large .vf-spinner__icon {
    width: var(--vf-spinner-large-size);
    height: var(--vf-spinner-large-size);
    border-width: var(--vf-spinner-large-thickness);
}

.vf-spinner[data-severity='info'] {
    --vf-spinner-current-color: var(--vf-spinner-info-color);
}

.vf-spinner[data-severity='success'] {
    --vf-spinner-current-color: var(--vf-spinner-success-color);
}

.vf-spinner[data-severity='warn'] {
    --vf-spinner-current-color: var(--vf-spinner-warn-color);
}

.vf-spinner[data-severity='danger'] {
    --vf-spinner-current-color: var(--vf-spinner-danger-color);
}
</style>
