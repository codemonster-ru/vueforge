<template>
    <div v-show="visible" class="vf-alert" role="alert" :data-severity="severity">
        <div v-if="$slots.icon || icon" class="vf-alert__icon" aria-hidden="true">
            <slot name="icon">{{ icon }}</slot>
        </div>
        <div class="vf-alert__body">
            <div v-if="title || $slots.title" class="vf-alert__title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div v-if="message || $slots.default" class="vf-alert__message">
                <slot>{{ message }}</slot>
            </div>
        </div>
        <div v-if="$slots.actions" class="vf-alert__actions">
            <slot name="actions" />
        </div>
        <button v-if="closable" class="vf-alert__close" type="button" aria-label="Close" @click="close">
            <slot name="close">&times;</slot>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type AlertSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    modelValue?: boolean;
    title?: string;
    message?: string;
    severity?: AlertSeverity;
    closable?: boolean;
    icon?: string;
}

const emits = defineEmits(['update:modelValue', 'close']);
const props = withDefaults(defineProps<Props>(), {
    title: '',
    message: '',
    severity: 'neutral',
    closable: false,
    icon: '',
});

const localVisible = ref(true);
const controlled = computed(() => typeof props.modelValue === 'boolean');
const visible = computed(() => (controlled.value ? props.modelValue : localVisible.value));

watch(
    () => props.modelValue,
    value => {
        if (typeof value === 'boolean') {
            localVisible.value = value;
        }
    },
    { immediate: true },
);

const close = () => {
    if (controlled.value) {
        emits('update:modelValue', false);
    } else {
        localVisible.value = false;
    }

    emits('close');
};
</script>

<style lang="scss">
.vf-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--vf-alert-gap);
    padding: var(--vf-alert-padding);
    border-radius: var(--vf-alert-border-radius);
    background-color: var(--vf-alert-background-color);
    color: var(--vf-alert-text-color);
    border: var(--vf-border-width) solid var(--vf-alert-border-color);
}

.vf-alert__icon {
    color: var(--vf-alert-icon-color);
    line-height: var(--vf-alert-line-height);
}

.vf-alert__body {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: var(--vf-alert-body-gap);
}

.vf-alert__title {
    font-weight: var(--vf-alert-title-font-weight);
    font-size: var(--vf-alert-title-font-size);
    line-height: var(--vf-alert-line-height);
}

.vf-alert__message {
    font-size: var(--vf-alert-font-size);
    line-height: var(--vf-alert-line-height);
}

.vf-alert__actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-alert-actions-gap);
}

.vf-alert__close {
    margin-left: auto;
    border: none;
    border-radius: var(--vf-alert-close-radius);
    width: var(--vf-alert-close-size);
    height: var(--vf-alert-close-size);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-alert-close-font-size);
    line-height: 1;
}

.vf-alert__close:hover {
    background-color: var(--vf-alert-close-hover-background-color);
}

.vf-alert[data-severity='info'] {
    background-color: var(--vf-alert-info-background-color);
    border-color: var(--vf-alert-info-border-color);
    color: var(--vf-alert-info-text-color);
}

.vf-alert[data-severity='success'] {
    background-color: var(--vf-alert-success-background-color);
    border-color: var(--vf-alert-success-border-color);
    color: var(--vf-alert-success-text-color);
}

.vf-alert[data-severity='warn'] {
    background-color: var(--vf-alert-warn-background-color);
    border-color: var(--vf-alert-warn-border-color);
    color: var(--vf-alert-warn-text-color);
}

.vf-alert[data-severity='danger'] {
    background-color: var(--vf-alert-danger-background-color);
    border-color: var(--vf-alert-danger-border-color);
    color: var(--vf-alert-danger-text-color);
}
</style>
