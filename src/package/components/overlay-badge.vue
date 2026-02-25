<template>
    <component :is="as" class="vf-overlay-badge">
        <slot />
        <span
            v-if="resolved.visible"
            class="vf-overlay-badge__badge"
            :data-severity="resolved.severity"
            :data-position="resolved.position"
            :data-dot="resolved.dot ? 'true' : 'false'"
            :aria-hidden="resolved.ariaLabel ? undefined : 'true'"
            :aria-label="resolved.ariaLabel || undefined"
        >
            <template v-if="!resolved.dot">{{ resolved.text }}</template>
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OverlayBadgeBinding, OverlayBadgePosition, OverlayBadgeSeverity } from './overlay-badge-utils';
import { resolveOverlayBadge } from './overlay-badge-utils';

interface Props {
    value?: string | number | null;
    hidden?: boolean;
    dot?: boolean;
    max?: number;
    showZero?: boolean;
    severity?: OverlayBadgeSeverity;
    position?: OverlayBadgePosition;
    ariaLabel?: string;
    as?: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    hidden: false,
    dot: false,
    max: 99,
    showZero: false,
    severity: 'danger',
    position: 'top-right',
    ariaLabel: '',
    as: 'span',
});

const resolved = computed(() =>
    resolveOverlayBadge({
        value: props.value,
        hidden: props.hidden,
        dot: props.dot,
        max: props.max,
        showZero: props.showZero,
        severity: props.severity,
        position: props.position,
        ariaLabel: props.ariaLabel,
    } satisfies OverlayBadgeBinding),
);
</script>

<style lang="scss">
.vf-overlay-badge {
    position: relative;
    display: inline-flex;
    width: fit-content;
    vertical-align: middle;
}

.vf-overlay-badge__badge {
    position: absolute;
    z-index: var(--vf-overlay-badge-z-index);
    min-width: var(--vf-overlay-badge-min-size);
    height: var(--vf-overlay-badge-min-size);
    padding: 0 var(--vf-overlay-badge-padding-x);
    border: var(--vf-border-width) solid var(--vf-overlay-badge-border-color);
    border-radius: var(--vf-overlay-badge-border-radius);
    background-color: var(--vf-overlay-badge-background-color);
    color: var(--vf-overlay-badge-text-color);
    font-size: var(--vf-overlay-badge-font-size);
    font-weight: var(--vf-overlay-badge-font-weight);
    line-height: var(--vf-overlay-badge-line-height);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    pointer-events: none;
}

.vf-overlay-badge__badge[data-dot='true'] {
    width: var(--vf-overlay-badge-dot-size);
    min-width: var(--vf-overlay-badge-dot-size);
    height: var(--vf-overlay-badge-dot-size);
    padding: 0;
}

.vf-overlay-badge__badge[data-position='top-right'] {
    top: var(--vf-overlay-badge-top-offset);
    right: var(--vf-overlay-badge-right-offset);
    transform: translate(50%, -50%);
}

.vf-overlay-badge__badge[data-position='top-left'] {
    top: var(--vf-overlay-badge-top-offset);
    left: var(--vf-overlay-badge-left-offset);
    transform: translate(-50%, -50%);
}

.vf-overlay-badge__badge[data-position='bottom-right'] {
    bottom: var(--vf-overlay-badge-bottom-offset);
    right: var(--vf-overlay-badge-right-offset);
    transform: translate(50%, 50%);
}

.vf-overlay-badge__badge[data-position='bottom-left'] {
    bottom: var(--vf-overlay-badge-bottom-offset);
    left: var(--vf-overlay-badge-left-offset);
    transform: translate(-50%, 50%);
}

.vf-overlay-badge__badge[data-severity='info'] {
    --vf-overlay-badge-background-color: var(--vf-overlay-badge-info-background-color);
    --vf-overlay-badge-text-color: var(--vf-overlay-badge-info-text-color);
    --vf-overlay-badge-border-color: var(--vf-overlay-badge-info-border-color);
}

.vf-overlay-badge__badge[data-severity='success'] {
    --vf-overlay-badge-background-color: var(--vf-overlay-badge-success-background-color);
    --vf-overlay-badge-text-color: var(--vf-overlay-badge-success-text-color);
    --vf-overlay-badge-border-color: var(--vf-overlay-badge-success-border-color);
}

.vf-overlay-badge__badge[data-severity='warn'] {
    --vf-overlay-badge-background-color: var(--vf-overlay-badge-warn-background-color);
    --vf-overlay-badge-text-color: var(--vf-overlay-badge-warn-text-color);
    --vf-overlay-badge-border-color: var(--vf-overlay-badge-warn-border-color);
}

.vf-overlay-badge__badge[data-severity='danger'] {
    --vf-overlay-badge-background-color: var(--vf-overlay-badge-danger-background-color);
    --vf-overlay-badge-text-color: var(--vf-overlay-badge-danger-text-color);
    --vf-overlay-badge-border-color: var(--vf-overlay-badge-danger-border-color);
}

.vf-overlay-badge__badge[data-severity='neutral'] {
    --vf-overlay-badge-background-color: var(--vf-overlay-badge-neutral-background-color);
    --vf-overlay-badge-text-color: var(--vf-overlay-badge-neutral-text-color);
    --vf-overlay-badge-border-color: var(--vf-overlay-badge-neutral-border-color);
}
</style>
