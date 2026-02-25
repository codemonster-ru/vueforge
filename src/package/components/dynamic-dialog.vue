<template>
    <Modal
        class="vf-dynamic-dialog"
        :model-value="isVisible"
        :title="activeDialog?.options.title ?? ''"
        :size="resolvedModalOptions.size"
        :close-on-overlay="resolvedModalOptions.closeOnOverlay"
        :close-on-esc="resolvedModalOptions.closeOnEsc"
        :show-close="resolvedModalOptions.showClose"
        :lock-scroll="resolvedModalOptions.lockScroll"
        @update:model-value="onModalUpdate"
    >
        <template #body>
            <div class="vf-dynamic-dialog__body">
                <component
                    :is="activeDialog.options.component"
                    v-if="activeDialog?.options.component"
                    v-bind="resolvedComponentProps"
                    v-on="resolvedComponentListeners"
                />
                <slot
                    v-else-if="$slots.default"
                    :entry="activeDialog"
                    :close="closeCurrent"
                    :dismiss="dismissCurrent"
                />
                <p v-else-if="activeDialog?.options.message" class="vf-dynamic-dialog__message">
                    {{ activeDialog.options.message }}
                </p>
            </div>
        </template>
        <template v-if="$slots.footer && activeDialog" #footer>
            <slot name="footer" :entry="activeDialog" :close="closeCurrent" :dismiss="dismissCurrent" />
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Modal from '@/package/components/modal.vue';
import {
    dynamicDialogService,
    type DynamicDialogModalOptions,
    type DynamicDialogService,
} from '@/package/services/dynamic-dialog-service';

interface Props {
    service?: DynamicDialogService;
}

const props = withDefaults(defineProps<Props>(), {
    service: () => dynamicDialogService,
});

const DEFAULT_MODAL_OPTIONS: Required<DynamicDialogModalOptions> = {
    size: 'md',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
};

type ComponentDialogBindings = {
    id: string;
    payload: unknown;
    close: <TResult = unknown>(result?: TResult) => boolean;
    dismiss: () => boolean;
};

type ComponentProps = Record<string, unknown> & {
    dialog?: ComponentDialogBindings;
};

const activeDialog = computed(() => props.service.currentDialog.value);
const isVisible = computed(() => !!activeDialog.value);
const closeCurrent = <TResult = unknown,>(result?: TResult) => props.service.closeCurrent(result);
const dismissCurrent = () => props.service.dismissCurrent();

const resolvedModalOptions = computed<Required<DynamicDialogModalOptions>>(() => {
    const modalOptions = activeDialog.value?.options.modal;

    return {
        size: modalOptions?.size ?? DEFAULT_MODAL_OPTIONS.size,
        closeOnOverlay: modalOptions?.closeOnOverlay ?? DEFAULT_MODAL_OPTIONS.closeOnOverlay,
        closeOnEsc: modalOptions?.closeOnEsc ?? DEFAULT_MODAL_OPTIONS.closeOnEsc,
        showClose: modalOptions?.showClose ?? DEFAULT_MODAL_OPTIONS.showClose,
        lockScroll: modalOptions?.lockScroll ?? DEFAULT_MODAL_OPTIONS.lockScroll,
    };
});

const resolvedComponentProps = computed<ComponentProps>(() => {
    const dialog = activeDialog.value;
    const baseProps = (dialog?.options.componentProps ?? {}) as ComponentProps;

    if (!dialog) {
        return baseProps;
    }

    return {
        ...baseProps,
        dialog: {
            id: dialog.id,
            payload: dialog.options.payload,
            close: closeCurrent,
            dismiss: dismissCurrent,
        },
    };
});

const resolvedComponentListeners = computed<Record<string, (...args: Array<unknown>) => void>>(
    () => activeDialog.value?.options.listeners ?? {},
);

const onModalUpdate = (value: boolean) => {
    if (value || !activeDialog.value) {
        return;
    }

    dismissCurrent();
};

defineExpose({
    closeCurrent,
    dismissCurrent,
});
</script>

<style lang="scss">
.vf-dynamic-dialog {
    display: contents;
}

.vf-dynamic-dialog__body {
    display: block;
}

.vf-dynamic-dialog__message {
    margin: 0;
    color: var(--vf-secondary-text-color);
    line-height: 1.5;
}
</style>
