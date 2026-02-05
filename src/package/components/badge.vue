<template>
    <span
        class="vf-badge"
        :class="getClass"
        :data-variant="variant"
        :data-severity="severity"
        role="status"
        :aria-label="ariaLabel || undefined"
    >
        <slot>{{ label }}</slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type BadgeVariant = 'solid' | 'soft' | 'outline';
type BadgeSize = 'small' | 'normal' | 'large';
type BadgeSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    label?: string;
    size?: BadgeSize;
    variant?: BadgeVariant;
    severity?: BadgeSeverity;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    size: 'normal',
    variant: 'soft',
    severity: 'neutral',
    ariaLabel: '',
});

const getClass = computed(() => {
    const classes = [`vf-badge_size-${props.size}`];

    return classes;
});
</script>

<style lang="scss">
.vf-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-badge-gap);
    padding: var(--vf-badge-padding-y) var(--vf-badge-padding-x);
    font-size: var(--vf-badge-font-size);
    line-height: var(--vf-badge-line-height);
    border-radius: var(--vf-badge-border-radius);
    border: var(--vf-border-width) solid var(--vf-badge-border-color);
    background-color: var(--vf-badge-background-color);
    color: var(--vf-badge-text-color);
    white-space: nowrap;
}

.vf-badge[data-variant='soft'] {
    background-color: var(--vf-badge-soft-background-color, var(--vf-badge-background-color));
    color: var(--vf-badge-soft-text-color, var(--vf-badge-text-color));
    border-color: var(--vf-badge-soft-border-color, var(--vf-badge-border-color));
}

.vf-badge[data-variant='outline'] {
    background-color: transparent;
    color: var(--vf-badge-outline-text-color, var(--vf-badge-text-color));
    border-color: var(--vf-badge-outline-border-color, var(--vf-badge-border-color));
}

.vf-badge_size-small {
    font-size: var(--vf-badge-small-font-size);
    padding: var(--vf-badge-small-padding-y) var(--vf-badge-small-padding-x);
}

.vf-badge_size-large {
    font-size: var(--vf-badge-large-font-size);
    padding: var(--vf-badge-large-padding-y) var(--vf-badge-large-padding-x);
}

.vf-badge[data-severity='info'] {
    --vf-badge-background-color: var(--vf-badge-info-background-color);
    --vf-badge-text-color: var(--vf-badge-info-text-color);
    --vf-badge-border-color: var(--vf-badge-info-border-color);
    --vf-badge-soft-background-color: var(--vf-badge-info-soft-background-color);
    --vf-badge-soft-text-color: var(--vf-badge-info-soft-text-color);
    --vf-badge-soft-border-color: var(--vf-badge-info-soft-border-color);
    --vf-badge-outline-text-color: var(--vf-badge-info-outline-text-color);
    --vf-badge-outline-border-color: var(--vf-badge-info-outline-border-color);
}

.vf-badge[data-severity='success'] {
    --vf-badge-background-color: var(--vf-badge-success-background-color);
    --vf-badge-text-color: var(--vf-badge-success-text-color);
    --vf-badge-border-color: var(--vf-badge-success-border-color);
    --vf-badge-soft-background-color: var(--vf-badge-success-soft-background-color);
    --vf-badge-soft-text-color: var(--vf-badge-success-soft-text-color);
    --vf-badge-soft-border-color: var(--vf-badge-success-soft-border-color);
    --vf-badge-outline-text-color: var(--vf-badge-success-outline-text-color);
    --vf-badge-outline-border-color: var(--vf-badge-success-outline-border-color);
}

.vf-badge[data-severity='warn'] {
    --vf-badge-background-color: var(--vf-badge-warn-background-color);
    --vf-badge-text-color: var(--vf-badge-warn-text-color);
    --vf-badge-border-color: var(--vf-badge-warn-border-color);
    --vf-badge-soft-background-color: var(--vf-badge-warn-soft-background-color);
    --vf-badge-soft-text-color: var(--vf-badge-warn-soft-text-color);
    --vf-badge-soft-border-color: var(--vf-badge-warn-soft-border-color);
    --vf-badge-outline-text-color: var(--vf-badge-warn-outline-text-color);
    --vf-badge-outline-border-color: var(--vf-badge-warn-outline-border-color);
}

.vf-badge[data-severity='danger'] {
    --vf-badge-background-color: var(--vf-badge-danger-background-color);
    --vf-badge-text-color: var(--vf-badge-danger-text-color);
    --vf-badge-border-color: var(--vf-badge-danger-border-color);
    --vf-badge-soft-background-color: var(--vf-badge-danger-soft-background-color);
    --vf-badge-soft-text-color: var(--vf-badge-danger-soft-text-color);
    --vf-badge-soft-border-color: var(--vf-badge-danger-soft-border-color);
    --vf-badge-outline-text-color: var(--vf-badge-danger-outline-text-color);
    --vf-badge-outline-border-color: var(--vf-badge-danger-outline-border-color);
}
</style>
