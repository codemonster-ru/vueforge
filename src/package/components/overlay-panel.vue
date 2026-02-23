<template>
    <div v-bind="rootAttrs">
        <Popover
            ref="popoverRef"
            :model-value="modelValue"
            :placement="placement"
            :offset="offset"
            :disabled="disabled"
            :close-on-outside="dismissable"
            :close-on-esc="closeOnEscape"
            @update:model-value="onUpdateModelValue"
            @open="onOpen"
            @close="onClose"
            @click="onClick"
            @on-click="onOnClick"
        >
            <template #button>
                <slot name="trigger" />
                <slot v-if="!$slots.trigger" name="button" />
            </template>
            <template #header>
                <div v-bind="headerAttrs">
                    <slot name="header" />
                    <slot v-if="!$slots.header" name="popoverHeader" />
                    <button
                        v-if="showCloseIcon"
                        type="button"
                        v-bind="closeAttrs"
                        :aria-label="closeLabel"
                        @click.stop="hide()"
                    >
                        &times;
                    </button>
                </div>
            </template>
            <template #default>
                <slot />
            </template>
            <template #body>
                <slot name="body" />
                <slot v-if="!$slots.body" name="popoverBody" />
            </template>
            <template #footer>
                <slot name="footer" />
                <slot v-if="!$slots.footer" name="popoverFooter" />
            </template>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Popover from '@/package/components/popover.vue';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

type Placement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface Props {
    modelValue?: boolean;
    placement?: Placement;
    offset?: number;
    disabled?: boolean;
    dismissable?: boolean;
    closeOnEscape?: boolean;
    showCloseIcon?: boolean;
    closeLabel?: string;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placement: 'bottom',
    offset: 8,
    disabled: false,
    dismissable: true,
    closeOnEscape: true,
    showCloseIcon: false,
    closeLabel: 'Close overlay panel',
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits(['update:modelValue', 'show', 'hide', 'onShow', 'onHide', 'click', 'onClick']);

const popoverRef = ref<{
    show: () => void;
    hide: () => void;
    toggle: () => void;
} | null>(null);

const ptContext = computed(() => ({
    disabled: props.disabled,
    showCloseIcon: props.showCloseIcon,
}));
const rootAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'root', ptContext.value), 'vf-overlaypanel', props.unstyled),
);
const headerAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'header', ptContext.value), 'vf-overlaypanel__header', props.unstyled),
);
const closeAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'close', ptContext.value), 'vf-overlaypanel__close', props.unstyled),
);

const onUpdateModelValue = (value: boolean) => emits('update:modelValue', value);
const onOpen = () => {
    emits('show');
    emits('onShow');
};
const onClose = () => {
    emits('hide');
    emits('onHide');
};
const onClick = () => emits('click');
const onOnClick = () => emits('onClick');

const show = () => popoverRef.value?.show();
const hide = () => popoverRef.value?.hide();
const toggle = () => popoverRef.value?.toggle();

defineExpose({ show, hide, toggle });
</script>

<style lang="scss">
.vf-overlaypanel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.vf-overlaypanel__close {
    border: var(--vf-border-width) solid var(--vf-popover-border-color);
    border-radius: var(--vf-radii-sm);
    background: transparent;
    color: inherit;
}
</style>
