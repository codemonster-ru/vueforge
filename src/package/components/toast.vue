<template>
    <div v-show="modelValue" class="vf-toast" role="status" aria-live="polite" :data-severity="severity">
        <div class="vf-toast__body">
            <div v-if="title" class="vf-toast__title">{{ title }}</div>
            <div v-if="message || $slots.default" class="vf-toast__message">
                <slot>{{ message }}</slot>
            </div>
        </div>
        <button v-if="closable" class="vf-toast__close" type="button" aria-label="Close toast" @click="close">
            <slot name="close">&times;</slot>
        </button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

type ToastSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    modelValue?: boolean;
    title?: string;
    message?: string;
    severity?: ToastSeverity;
    closable?: boolean;
    duration?: number;
}

const emits = defineEmits(['update:modelValue', 'open', 'close']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    message: '',
    severity: 'neutral',
    closable: true,
    duration: 0,
});

let timer: number | null = null;

const clearTimer = () => {
    if (timer !== null) {
        clearTimeout(timer);

        timer = null;
    }
};

const startTimer = () => {
    clearTimer();

    if (!props.modelValue || props.duration <= 0) {
        return;
    }

    timer = window.setTimeout(() => {
        emits('update:modelValue', false);
        emits('close');
    }, props.duration);
};

const close = () => {
    clearTimer();

    emits('update:modelValue', false);
    emits('close');
};

watch(
    () => props.modelValue,
    value => {
        if (value) {
            emits('open');
        }

        startTimer();
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    clearTimer();
});
</script>

<style lang="scss">
.vf-toast {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--vf-toast-gap);
    padding: var(--vf-toast-padding);
    border-radius: var(--vf-toast-border-radius);
    background-color: var(--vf-toast-background-color);
    color: var(--vf-toast-text-color);
    box-shadow: var(--vf-toast-shadow);
    border: var(--vf-border-width) solid var(--vf-toast-border-color);
    min-width: var(--vf-toast-min-width);
}

.vf-toast__body {
    display: grid;
    gap: var(--vf-toast-body-gap);
}

.vf-toast__title {
    font-weight: var(--vf-toast-title-font-weight);
    font-size: var(--vf-toast-title-font-size);
}

.vf-toast__message {
    font-size: var(--vf-toast-font-size);
    line-height: var(--vf-toast-line-height);
}

.vf-toast__close {
    margin-left: auto;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-toast-close-size);
    line-height: 1;
    padding: 0;
    opacity: 0.7;
}

.vf-toast__close:hover {
    opacity: 1;
}

.vf-toast[data-severity='info'] {
    background-color: var(--vf-toast-info-background-color);
    border-color: var(--vf-toast-info-border-color);
    color: var(--vf-toast-info-text-color);
}

.vf-toast[data-severity='success'] {
    background-color: var(--vf-toast-success-background-color);
    border-color: var(--vf-toast-success-border-color);
    color: var(--vf-toast-success-text-color);
}

.vf-toast[data-severity='warn'] {
    background-color: var(--vf-toast-warn-background-color);
    border-color: var(--vf-toast-warn-border-color);
    color: var(--vf-toast-warn-text-color);
}

.vf-toast[data-severity='danger'] {
    background-color: var(--vf-toast-danger-background-color);
    border-color: var(--vf-toast-danger-border-color);
    color: var(--vf-toast-danger-text-color);
}
</style>
