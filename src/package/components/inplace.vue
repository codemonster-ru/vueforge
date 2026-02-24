<template>
    <section
        ref="rootRef"
        class="vf-inplace"
        :class="{ 'vf-inplace_active': isActive, 'vf-inplace_disabled': disabled }"
    >
        <div v-if="!isActive" class="vf-inplace__display">
            <slot name="display">
                <button
                    type="button"
                    class="vf-inplace__trigger"
                    :disabled="disabled"
                    :aria-label="ariaLabel"
                    @click="open"
                >
                    {{ editLabel }}
                </button>
            </slot>
        </div>
        <div
            v-else
            ref="contentRef"
            class="vf-inplace__content"
            role="group"
            :aria-label="ariaLabel"
            tabindex="-1"
            @keydown.esc.prevent="onEscape"
        >
            <div class="vf-inplace__body">
                <slot name="content">
                    <slot>{{ contentText }}</slot>
                </slot>
            </div>
            <div class="vf-inplace__actions">
                <slot name="actions" :close="close">
                    <button type="button" class="vf-inplace__action" :disabled="disabled" @click="close">
                        {{ closeLabel }}
                    </button>
                </slot>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
    modelValue?: boolean;
    disabled?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    contentText?: string;
    editLabel?: string;
    closeLabel?: string;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    contentText: 'Editable content',
    editLabel: 'Edit',
    closeLabel: 'Close',
    ariaLabel: 'Inplace editor',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'open'): void;
    (event: 'close'): void;
    (event: 'toggle', value: boolean): void;
}>();

defineSlots<{
    display?: () => unknown;
    content?: () => unknown;
    actions?: (props: { close: () => void }) => unknown;
    default?: () => unknown;
}>();

const rootRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const isActive = computed(() => props.modelValue);

const setActive = (next: boolean) => {
    if (props.disabled || next === isActive.value) {
        return;
    }

    emits('update:modelValue', next);
    emits('toggle', next);
    if (next) {
        emits('open');
    } else {
        emits('close');
    }
};

const open = () => setActive(true);
const close = () => setActive(false);

const onEscape = () => {
    if (!props.closeOnEscape) {
        return;
    }

    close();
};

const onDocumentClick = (event: MouseEvent) => {
    if (!props.closeOnOutsideClick || !isActive.value || !rootRef.value) {
        return;
    }

    const target = event.target as Node | null;
    if (!target || rootRef.value.contains(target)) {
        return;
    }

    close();
};

watch(
    () => isActive.value,
    async value => {
        if (!value) {
            return;
        }

        await nextTick();
        contentRef.value?.focus();
    },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
});
</script>

<style lang="scss">
.vf-inplace {
    display: inline-flex;
    align-items: center;
    min-height: var(--vf-controls-height);
    box-sizing: border-box;
    border: var(--vf-border-width) solid var(--vf-inplace-border-color);
    border-radius: var(--vf-inplace-border-radius);
    background-color: var(--vf-inplace-background-color);
    color: var(--vf-inplace-text-color);
    padding: var(--vf-inplace-padding);
}

.vf-inplace__display {
    display: inline-flex;
    align-items: center;
}

.vf-inplace__trigger,
.vf-inplace__action {
    border: var(--vf-border-width) solid var(--vf-inplace-button-border-color);
    border-radius: var(--vf-inplace-button-radius);
    background-color: var(--vf-inplace-button-background-color);
    color: var(--vf-inplace-button-text-color);
    padding: var(--vf-inplace-button-padding);
    font: inherit;
    line-height: 1;
    cursor: pointer;
}

.vf-inplace__trigger:hover:not(:disabled),
.vf-inplace__action:hover:not(:disabled),
.vf-inplace__trigger:focus-visible:not(:disabled),
.vf-inplace__action:focus-visible:not(:disabled) {
    background-color: var(--vf-inplace-button-hover-background-color);
    outline: none;
}

.vf-inplace__content {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-inplace-actions-gap);
    outline: none;
}

.vf-inplace__content:focus-visible {
    box-shadow: var(--vf-inplace-focus-ring-shadow);
}

.vf-inplace__body {
    padding: var(--vf-inplace-content-padding);
}

.vf-inplace_disabled {
    opacity: var(--vf-inplace-disabled-opacity);
}
</style>
