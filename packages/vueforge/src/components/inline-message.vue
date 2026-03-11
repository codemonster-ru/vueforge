<template>
    <div
        v-if="hasContent"
        class="vf-inline-message"
        :class="getClass"
        :data-severity="severity"
        :role="resolvedRole"
        :aria-live="resolvedAriaLive"
    >
        <span v-if="$slots.icon || icon" class="vf-inline-message__icon" aria-hidden="true">
            <slot name="icon">{{ icon }}</slot>
        </span>
        <div class="vf-inline-message__body">
            <div v-if="title || $slots.title" class="vf-inline-message__title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div v-if="message || $slots.default" class="vf-inline-message__content">
                <slot>{{ message }}</slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type InlineMessageSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
type InlineMessageSize = 'small' | 'normal' | 'large';
type InlineMessageRole = 'auto' | 'status' | 'alert' | 'none';
type InlineMessageAriaLive = 'auto' | 'off' | 'polite' | 'assertive';

interface Props {
    title?: string;
    message?: string;
    severity?: InlineMessageSeverity;
    icon?: string;
    size?: InlineMessageSize;
    role?: InlineMessageRole;
    ariaLive?: InlineMessageAriaLive;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    message: '',
    severity: 'neutral',
    icon: '',
    size: 'normal',
    role: 'auto',
    ariaLive: 'auto',
});

const slots = useSlots();
const hasContent = computed(() => !!props.title || !!props.message || !!slots.title || !!slots.default);

const resolvedRole = computed(() => {
    if (props.role === 'none') {
        return undefined;
    }

    if (props.role !== 'auto') {
        return props.role;
    }

    return props.severity === 'danger' || props.severity === 'warn' ? 'alert' : 'status';
});

const resolvedAriaLive = computed(() => {
    if (props.ariaLive !== 'auto') {
        return props.ariaLive;
    }

    if (!resolvedRole.value) {
        return undefined;
    }

    return resolvedRole.value === 'alert' ? 'assertive' : 'polite';
});

const getClass = computed(() => {
    const classes: Array<string> = [];

    if (props.size !== 'normal') {
        classes.push(`vf-inline-message_size-${props.size}`);
    }

    return classes;
});
</script>

<style lang="scss">
.vf-inline-message {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--vf-inline-message-gap);
    padding: var(--vf-inline-message-padding-y) var(--vf-inline-message-padding-x);
    border-radius: var(--vf-inline-message-border-radius);
    border: var(--vf-border-width) solid var(--vf-inline-message-border-color);
    background-color: var(--vf-inline-message-background-color);
    color: var(--vf-inline-message-text-color);
    font-size: var(--vf-inline-message-font-size);
    line-height: var(--vf-inline-message-line-height);
}

.vf-inline-message__icon {
    flex-shrink: 0;
    font-size: var(--vf-inline-message-icon-size);
    color: var(--vf-inline-message-icon-color);
}

.vf-inline-message__body {
    min-width: 0;
    display: grid;
    gap: var(--vf-inline-message-body-gap);
}

.vf-inline-message__title {
    font-size: var(--vf-inline-message-title-font-size);
    font-weight: var(--vf-inline-message-title-font-weight);
    line-height: var(--vf-inline-message-line-height);
}

.vf-inline-message__content {
    font-size: inherit;
    line-height: inherit;
}

.vf-inline-message_size-small {
    font-size: var(--vf-inline-message-small-font-size);
    padding: var(--vf-inline-message-small-padding-y) var(--vf-inline-message-small-padding-x);
}

.vf-inline-message_size-large {
    font-size: var(--vf-inline-message-large-font-size);
    padding: var(--vf-inline-message-large-padding-y) var(--vf-inline-message-large-padding-x);
}

.vf-inline-message[data-severity='info'] {
    background-color: var(--vf-inline-message-info-background-color);
    border-color: var(--vf-inline-message-info-border-color);
    color: var(--vf-inline-message-info-text-color);
}

.vf-inline-message[data-severity='success'] {
    background-color: var(--vf-inline-message-success-background-color);
    border-color: var(--vf-inline-message-success-border-color);
    color: var(--vf-inline-message-success-text-color);
}

.vf-inline-message[data-severity='warn'] {
    background-color: var(--vf-inline-message-warn-background-color);
    border-color: var(--vf-inline-message-warn-border-color);
    color: var(--vf-inline-message-warn-text-color);
}

.vf-inline-message[data-severity='danger'] {
    background-color: var(--vf-inline-message-danger-background-color);
    border-color: var(--vf-inline-message-danger-border-color);
    color: var(--vf-inline-message-danger-text-color);
}
</style>
