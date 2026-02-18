<template>
    <div :class="getClass" role="status" aria-live="polite">
        <div v-if="$slots.icon || icon" class="vf-empty-state__icon" aria-hidden="true">
            <slot name="icon">{{ icon }}</slot>
        </div>
        <div class="vf-empty-state__body">
            <div v-if="title || $slots.title" class="vf-empty-state__title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div v-if="description || $slots.default" class="vf-empty-state__description">
                <slot>{{ description }}</slot>
            </div>
        </div>
        <div v-if="$slots.actions" class="vf-empty-state__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    title?: string;
    description?: string;
    icon?: string;
    size?: Size;
    variant?: Variant;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    icon: '',
    size: 'normal',
    variant: 'filled',
});

const getClass = computed(() => {
    const classes = ['vf-empty-state', `vf-empty-state_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-empty-state_${props.size}`);
    }

    return classes;
});
</script>

<style lang="scss">
.vf-empty-state {
    display: grid;
    justify-items: center;
    gap: var(--vf-empty-state-gap);
    width: 100%;
    box-sizing: border-box;
    padding: var(--vf-empty-state-padding);
    border: var(--vf-border-width) solid var(--vf-empty-state-border-color);
    border-radius: var(--vf-empty-state-border-radius);
    background-color: var(--vf-empty-state-background-color);
    color: var(--vf-empty-state-text-color);
    text-align: center;
}

.vf-empty-state_outlined {
    background-color: transparent;
}

.vf-empty-state__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-empty-state-icon-size);
    height: var(--vf-empty-state-icon-size);
    color: var(--vf-empty-state-icon-color);
    font-size: var(--vf-empty-state-icon-size);
    line-height: 1;
}

.vf-empty-state__body {
    display: grid;
    justify-items: center;
    gap: var(--vf-empty-state-body-gap);
    max-width: var(--vf-empty-state-max-width);
}

.vf-empty-state__title {
    font-size: var(--vf-empty-state-title-font-size);
    line-height: var(--vf-empty-state-title-line-height);
    font-weight: var(--vf-empty-state-title-font-weight);
    color: var(--vf-empty-state-title-color);
}

.vf-empty-state__description {
    font-size: var(--vf-empty-state-description-font-size);
    line-height: var(--vf-empty-state-description-line-height);
    color: var(--vf-empty-state-description-color);
}

.vf-empty-state__actions {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-empty-state-actions-gap);
}

.vf-empty-state_small {
    padding: var(--vf-empty-state-small-padding);
}

.vf-empty-state_small .vf-empty-state__icon {
    width: var(--vf-empty-state-small-icon-size);
    height: var(--vf-empty-state-small-icon-size);
    font-size: var(--vf-empty-state-small-icon-size);
}

.vf-empty-state_small .vf-empty-state__title {
    font-size: var(--vf-empty-state-small-title-font-size);
}

.vf-empty-state_small .vf-empty-state__description {
    font-size: var(--vf-empty-state-small-description-font-size);
}

.vf-empty-state_large {
    padding: var(--vf-empty-state-large-padding);
}

.vf-empty-state_large .vf-empty-state__icon {
    width: var(--vf-empty-state-large-icon-size);
    height: var(--vf-empty-state-large-icon-size);
    font-size: var(--vf-empty-state-large-icon-size);
}

.vf-empty-state_large .vf-empty-state__title {
    font-size: var(--vf-empty-state-large-title-font-size);
}

.vf-empty-state_large .vf-empty-state__description {
    font-size: var(--vf-empty-state-large-description-font-size);
}
</style>
