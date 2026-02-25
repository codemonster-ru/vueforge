<template>
    <Popover
        ref="popoverRef"
        class="vf-confirm-popup"
        :model-value="modelValue"
        :placement="placement"
        :offset="offset"
        :disabled="disabled"
        :close-on-outside="closeOnOutside"
        :close-on-esc="closeOnEsc"
        @update:model-value="onUpdateModelValue"
        @open="onOpen"
        @close="onClose"
    >
        <template #button>
            <slot name="trigger" />
        </template>

        <template #body>
            <div class="vf-confirm-popup__body">
                <slot>
                    <div v-if="title" class="vf-confirm-popup__title">{{ title }}</div>
                    <div class="vf-confirm-popup__message">{{ message }}</div>
                </slot>
            </div>
        </template>

        <template #footer>
            <div class="vf-confirm-popup__actions">
                <slot name="actions" :confirm="onConfirm" :cancel="onCancel">
                    <Button
                        class="vf-confirm-popup__cancel"
                        :label="cancelLabel"
                        variant="outlined"
                        severity="secondary"
                        :disabled="disabled || loading"
                        @click="onCancel"
                    />
                    <Button
                        class="vf-confirm-popup__confirm"
                        :label="confirmLabel"
                        :severity="confirmSeverity"
                        :loading="loading"
                        :disabled="disabled"
                        @click="onConfirm"
                    />
                </slot>
            </div>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Popover from './popover.vue';
import Button from './button.vue';

type Placement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

type PopoverExpose = {
    show: () => void;
    hide: () => void;
    toggle: () => void;
};

interface Props {
    modelValue?: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmSeverity?: ButtonSeverity;
    placement?: Placement;
    offset?: number;
    disabled?: boolean;
    loading?: boolean;
    closeOnEsc?: boolean;
    closeOnOutside?: boolean;
    closeOnConfirm?: boolean;
    closeOnCancel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmSeverity: 'danger',
    placement: 'bottom',
    offset: 8,
    disabled: false,
    loading: false,
    closeOnEsc: true,
    closeOnOutside: true,
    closeOnConfirm: true,
    closeOnCancel: true,
});

const emit = defineEmits([
    'update:modelValue',
    'confirm',
    'accept',
    'cancel',
    'reject',
    'show',
    'hide',
    'onShow',
    'onHide',
]);

const popoverRef = ref<PopoverExpose | null>(null);

const onUpdateModelValue = (value: boolean) => emit('update:modelValue', value);

const onOpen = () => {
    emit('show');
    emit('onShow');
};

const onClose = () => {
    emit('hide');
    emit('onHide');
};

const onConfirm = () => {
    if (props.disabled || props.loading) {
        return;
    }

    emit('confirm');
    emit('accept');

    if (props.closeOnConfirm) {
        popoverRef.value?.hide();
    }
};

const onCancel = () => {
    if (props.disabled) {
        return;
    }

    emit('cancel');
    emit('reject');

    if (props.closeOnCancel) {
        popoverRef.value?.hide();
    }
};

defineExpose({
    show: () => popoverRef.value?.show(),
    hide: () => popoverRef.value?.hide(),
    toggle: () => popoverRef.value?.toggle(),
});
</script>

<style lang="scss">
.vf-confirm-popup__body {
    display: grid;
    gap: var(--vf-confirm-popup-body-gap);
}

.vf-confirm-popup__title {
    font-size: var(--vf-confirm-popup-title-font-size);
    font-weight: var(--vf-confirm-popup-title-font-weight);
    color: var(--vf-confirm-popup-title-color);
}

.vf-confirm-popup__message {
    color: var(--vf-confirm-popup-message-color);
    font-size: var(--vf-confirm-popup-message-font-size);
    line-height: var(--vf-confirm-popup-message-line-height);
}

.vf-confirm-popup__actions {
    display: inline-flex;
    justify-content: flex-end;
    gap: var(--vf-confirm-popup-actions-gap);
    width: 100%;
}
</style>
