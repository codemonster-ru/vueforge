<template>
    <Modal
        ref="modal"
        class="vf-confirm-dialog"
        :model-value="modelValue"
        :title="title"
        :size="size"
        :close-on-overlay="closeOnOverlay"
        :close-on-esc="closeOnEsc"
        :show-close="showClose"
        :lock-scroll="lockScroll"
        @update:model-value="onModalUpdate"
        @open="emits('open')"
        @close="onModalClose"
    >
        <template #body>
            <div class="vf-confirm-dialog__message">
                <slot>{{ message }}</slot>
            </div>
        </template>
        <template #footer>
            <div class="vf-confirm-dialog__actions">
                <slot name="actions" :confirm="onConfirm" :cancel="onCancel">
                    <Button
                        class="vf-confirm-dialog__cancel"
                        :label="cancelLabel"
                        variant="outlined"
                        severity="secondary"
                        :disabled="loading"
                        @click="onCancel"
                    />
                    <Button
                        class="vf-confirm-dialog__confirm"
                        :label="confirmLabel"
                        :severity="confirmSeverity"
                        :loading="loading"
                        @click="onConfirm"
                    />
                </slot>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/package/components/modal.vue';
import Button from '@/package/components/button.vue';

type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

interface Props {
    modelValue?: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmSeverity?: ButtonSeverity;
    loading?: boolean;
    closeOnConfirm?: boolean;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

type CloseReason = 'confirm' | 'cancel' | null;

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: 'Confirm action',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmSeverity: 'danger',
    loading: false,
    closeOnConfirm: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
    size: 'sm',
});
const emits = defineEmits(['update:modelValue', 'confirm', 'cancel', 'open', 'close']);
const modal = ref<InstanceType<typeof Modal> | null>(null);
const closeReason = ref<CloseReason>(null);

const emitClose = () => {
    if (modal.value) {
        modal.value.close();

        return;
    }

    emits('update:modelValue', false);
    emits('close');
};

const onModalUpdate = (value: boolean) => {
    emits('update:modelValue', value);
};

const onModalClose = () => {
    emits('close');

    if (closeReason.value === 'confirm') {
        closeReason.value = null;

        return;
    }

    closeReason.value = null;

    emits('cancel');
};

const onCancel = () => {
    closeReason.value = 'cancel';

    emitClose();
};

const onConfirm = () => {
    if (props.loading) {
        return;
    }

    emits('confirm');

    if (!props.closeOnConfirm) {
        return;
    }

    closeReason.value = 'confirm';

    emitClose();
};

defineExpose({
    open: () => modal.value?.open(),
    close: () => {
        closeReason.value = 'cancel';

        emitClose();
    },
});
</script>

<style lang="scss">
.vf-confirm-dialog .vf-modal__panel {
    max-width: var(--vf-confirm-dialog-max-width);
}

.vf-confirm-dialog__message {
    color: var(--vf-confirm-dialog-message-color);
    font-size: var(--vf-confirm-dialog-message-font-size);
    line-height: var(--vf-confirm-dialog-message-line-height);
}

.vf-confirm-dialog__actions {
    display: inline-flex;
    justify-content: flex-end;
    gap: var(--vf-confirm-dialog-actions-gap);
    width: 100%;
}
</style>
