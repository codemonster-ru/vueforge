<template>
    <Drawer
        class="vf-sidebar"
        :model-value="resolvedVisible"
        :title="title"
        :position="position"
        :overlay="resolvedOverlay"
        :close-on-overlay="resolvedCloseOnOverlay"
        :close-on-esc="resolvedCloseOnEsc"
        :show-close="resolvedShowClose"
        :lock-scroll="resolvedLockScroll"
        :size="size"
        @update:model-value="onUpdateVisible"
        @open="onOpen"
        @close="onClose"
    >
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>
        <template v-if="$slots.body" #body>
            <slot name="body" />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
        <template v-if="$slots.close" #close="{ close }">
            <slot name="close" :close="close" />
        </template>
        <slot v-if="!$slots.body" />
    </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Drawer from '@/package/components/drawer.vue';

type SidebarPosition = 'left' | 'right' | 'top' | 'bottom';
type SidebarSize = 'sm' | 'md' | 'lg';

interface Props {
    modelValue?: boolean;
    visible?: boolean;
    title?: string;
    position?: SidebarPosition;
    size?: SidebarSize;
    modal?: boolean;
    overlay?: boolean;
    dismissable?: boolean;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    closeOnEsc?: boolean;
    showCloseIcon?: boolean;
    showClose?: boolean;
    blockScroll?: boolean;
    lockScroll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    visible: undefined,
    title: '',
    position: 'left',
    size: 'md',
    modal: undefined,
    overlay: undefined,
    dismissable: undefined,
    closeOnOverlay: undefined,
    closeOnEscape: undefined,
    closeOnEsc: undefined,
    showCloseIcon: undefined,
    showClose: undefined,
    blockScroll: undefined,
    lockScroll: undefined,
});

const emits = defineEmits(['update:modelValue', 'update:visible', 'show', 'hide', 'onShow', 'onHide', 'open', 'close']);

const resolvedVisible = computed(() =>
    typeof props.visible === 'boolean' ? props.visible : (props.modelValue ?? false),
);
const resolvedOverlay = computed(() => {
    if (typeof props.overlay === 'boolean') {
        return props.overlay;
    }

    if (typeof props.modal === 'boolean') {
        return props.modal;
    }

    return true;
});
const resolvedCloseOnOverlay = computed(() => {
    if (typeof props.closeOnOverlay === 'boolean') {
        return props.closeOnOverlay;
    }

    if (typeof props.dismissable === 'boolean') {
        return props.dismissable;
    }

    return true;
});
const resolvedCloseOnEsc = computed(() => {
    if (typeof props.closeOnEsc === 'boolean') {
        return props.closeOnEsc;
    }

    if (typeof props.closeOnEscape === 'boolean') {
        return props.closeOnEscape;
    }

    return true;
});
const resolvedShowClose = computed(() => {
    if (typeof props.showClose === 'boolean') {
        return props.showClose;
    }

    if (typeof props.showCloseIcon === 'boolean') {
        return props.showCloseIcon;
    }

    return true;
});
const resolvedLockScroll = computed(() => {
    if (typeof props.lockScroll === 'boolean') {
        return props.lockScroll;
    }

    if (typeof props.blockScroll === 'boolean') {
        return props.blockScroll;
    }

    return true;
});

const onUpdateVisible = (value: boolean) => {
    emits('update:modelValue', value);
    emits('update:visible', value);
};

const onOpen = () => {
    emits('open');
    emits('show');
    emits('onShow');
};

const onClose = () => {
    emits('close');
    emits('hide');
    emits('onHide');
};
</script>

<style lang="scss">
.vf-sidebar {
    display: contents;
}
</style>
