<template>
    <component
        :is="as"
        class="vf-hover"
        :class="{
            'vf-hover_active': isActive,
            'vf-hover_disabled': disabled,
        }"
        :aria-label="ariaLabel || undefined"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
    >
        <slot :hovered="isHovered" :focused="isFocused" :active="isActive" />
    </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

interface Props {
    as?: string;
    modelValue?: boolean;
    disabled?: boolean;
    openDelay?: number;
    closeDelay?: number;
    ariaLabel?: string;
}

defineOptions({ name: 'VfHover' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    modelValue: undefined,
    disabled: false,
    openDelay: 0,
    closeDelay: 0,
    ariaLabel: '',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'change', value: boolean): void;
}>();

const isHovered = ref(false);
const isFocused = ref(false);
const localActive = ref(false);
const controlled = computed(() => typeof props.modelValue === 'boolean');

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimers = () => {
    if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
    }
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

const setActive = (next: boolean) => {
    if (props.disabled) {
        return;
    }

    if (controlled.value) {
        emits('update:modelValue', next);
        emits('change', next);
        return;
    }

    localActive.value = next;
    emits('change', next);
};

const isActive = computed(() => (controlled.value ? !!props.modelValue : localActive.value));

const scheduleOpen = () => {
    if (props.disabled) {
        return;
    }

    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }

    if (props.openDelay <= 0) {
        setActive(true);
        return;
    }

    if (openTimer) {
        clearTimeout(openTimer);
    }

    openTimer = setTimeout(() => {
        setActive(true);
        openTimer = null;
    }, props.openDelay);
};

const scheduleCloseIfIdle = () => {
    if (props.disabled || isHovered.value || isFocused.value) {
        return;
    }

    if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
    }

    if (props.closeDelay <= 0) {
        setActive(false);
        return;
    }

    if (closeTimer) {
        clearTimeout(closeTimer);
    }

    closeTimer = setTimeout(() => {
        setActive(false);
        closeTimer = null;
    }, props.closeDelay);
};

const onMouseEnter = () => {
    if (props.disabled) {
        return;
    }

    isHovered.value = true;
    scheduleOpen();
};

const onMouseLeave = () => {
    isHovered.value = false;
    scheduleCloseIfIdle();
};

const onFocusIn = () => {
    if (props.disabled) {
        return;
    }

    isFocused.value = true;
    scheduleOpen();
};

const onFocusOut = (event: FocusEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;

    if (target && next && target.contains(next)) {
        return;
    }

    isFocused.value = false;
    scheduleCloseIfIdle();
};

watch(
    () => props.disabled,
    value => {
        if (value) {
            isHovered.value = false;
            isFocused.value = false;
            clearTimers();
            if (!controlled.value) {
                localActive.value = false;
            }
        }
    },
);

onBeforeUnmount(() => {
    clearTimers();
});
</script>

<style lang="scss">
.vf-hover {
    display: inline-block;
}

.vf-hover_disabled {
    opacity: var(--vf-hover-disabled-opacity);
}
</style>
