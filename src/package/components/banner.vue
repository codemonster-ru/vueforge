<template>
    <component
        :is="as"
        v-show="visible"
        class="vf-banner"
        :class="{ 'vf-banner_sticky': sticky }"
        :data-severity="severity"
        :role="resolvedRole || undefined"
        :aria-live="resolvedAriaLive || undefined"
        :aria-label="ariaLabel || undefined"
    >
        <div v-if="$slots.icon || icon" class="vf-banner__icon" aria-hidden="true">
            <slot name="icon">{{ icon }}</slot>
        </div>

        <div class="vf-banner__body">
            <div v-if="title || $slots.title" class="vf-banner__title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div v-if="message || $slots.default" class="vf-banner__message">
                <slot>{{ message }}</slot>
            </div>
        </div>

        <div v-if="$slots.actions" class="vf-banner__actions" role="group" :aria-label="actionsAriaLabel || undefined">
            <slot name="actions" />
        </div>

        <button v-if="closable" type="button" class="vf-banner__close" :aria-label="closeLabel" @click="onClose">
            <slot name="close">&times;</slot>
        </button>
    </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type BannerSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
type BannerRole = 'auto' | 'status' | 'alert' | 'region' | 'none';
type BannerAriaLive = 'auto' | 'off' | 'polite' | 'assertive';

interface Props {
    as?: string;
    modelValue?: boolean;
    title?: string;
    message?: string;
    severity?: BannerSeverity;
    closable?: boolean;
    sticky?: boolean;
    icon?: string;
    role?: BannerRole;
    ariaLive?: BannerAriaLive;
    ariaLabel?: string;
    actionsAriaLabel?: string;
    closeLabel?: string;
}

defineOptions({ name: 'VfBanner' });

const props = withDefaults(defineProps<Props>(), {
    as: 'section',
    modelValue: undefined,
    title: '',
    message: '',
    severity: 'neutral',
    closable: false,
    sticky: false,
    icon: '',
    role: 'auto',
    ariaLive: 'auto',
    ariaLabel: '',
    actionsAriaLabel: 'Banner actions',
    closeLabel: 'Dismiss banner',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'close'): void;
}>();

const localVisible = ref(true);
const controlled = computed(() => typeof props.modelValue === 'boolean');
const visible = computed(() => (controlled.value ? props.modelValue : localVisible.value));

const resolvedRole = computed(() => {
    if (props.role === 'none') {
        return '';
    }

    if (props.role !== 'auto') {
        return props.role;
    }

    return props.severity === 'warn' || props.severity === 'danger' ? 'alert' : 'status';
});

const resolvedAriaLive = computed(() => {
    if (props.ariaLive !== 'auto') {
        return props.ariaLive;
    }

    if (!resolvedRole.value) {
        return '';
    }

    return resolvedRole.value === 'alert' ? 'assertive' : 'polite';
});

watch(
    () => props.modelValue,
    value => {
        if (typeof value === 'boolean') {
            localVisible.value = value;
        }
    },
    { immediate: true },
);

const onClose = () => {
    if (controlled.value) {
        emits('update:modelValue', false);
    } else {
        localVisible.value = false;
    }

    emits('close');
};
</script>

<style lang="scss">
.vf-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--vf-banner-gap);
    padding: var(--vf-banner-padding);
    border-radius: var(--vf-banner-border-radius);
    border: var(--vf-border-width) solid var(--vf-banner-border-color);
    background-color: var(--vf-banner-background-color);
    color: var(--vf-banner-text-color);
}

.vf-banner_sticky {
    position: sticky;
    top: var(--vf-banner-sticky-top);
    z-index: var(--vf-banner-z-index);
}

.vf-banner__icon {
    color: var(--vf-banner-icon-color);
    line-height: var(--vf-banner-line-height);
}

.vf-banner__body {
    min-width: 0;
    flex: 1 1 auto;
    display: grid;
    gap: var(--vf-banner-body-gap);
}

.vf-banner__title {
    font-size: var(--vf-banner-title-font-size);
    font-weight: var(--vf-banner-title-font-weight);
    line-height: var(--vf-banner-line-height);
}

.vf-banner__message {
    font-size: var(--vf-banner-font-size);
    line-height: var(--vf-banner-line-height);
}

.vf-banner__actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-banner-actions-gap);
}

.vf-banner__close {
    border: none;
    border-radius: var(--vf-banner-close-radius);
    width: var(--vf-banner-close-size);
    height: var(--vf-banner-close-size);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-banner-close-font-size);
    line-height: 1;
}

.vf-banner__close:hover {
    background-color: var(--vf-banner-close-hover-background-color);
}

.vf-banner[data-severity='info'] {
    background-color: var(--vf-banner-info-background-color);
    border-color: var(--vf-banner-info-border-color);
    color: var(--vf-banner-info-text-color);
}

.vf-banner[data-severity='success'] {
    background-color: var(--vf-banner-success-background-color);
    border-color: var(--vf-banner-success-border-color);
    color: var(--vf-banner-success-text-color);
}

.vf-banner[data-severity='warn'] {
    background-color: var(--vf-banner-warn-background-color);
    border-color: var(--vf-banner-warn-border-color);
    color: var(--vf-banner-warn-text-color);
}

.vf-banner[data-severity='danger'] {
    background-color: var(--vf-banner-danger-background-color);
    border-color: var(--vf-banner-danger-border-color);
    color: var(--vf-banner-danger-text-color);
}
</style>
