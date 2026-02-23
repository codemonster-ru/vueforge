<template>
    <div ref="rootRef" v-bind="rootAttrs">
        <button
            type="button"
            v-bind="triggerAttrs"
            :disabled="disabled"
            :aria-label="triggerAriaLabel"
            :aria-expanded="isOpen ? 'true' : 'false'"
            aria-haspopup="menu"
            @click="toggle()"
            @keydown="onTriggerKeydown"
        >
            <slot name="trigger" :open="isOpen">{{ isOpen ? closeLabel : openLabel }}</slot>
        </button>

        <ul v-if="isOpen && actions.length" v-bind="actionsAttrs" role="menu" :aria-label="ariaLabel">
            <li v-for="(action, index) in actions" :key="getActionKey(action, index)" v-bind="itemAttrs">
                <button
                    ref="actionRefs"
                    type="button"
                    :class="actionClass(action)"
                    v-bind="actionAttrs(action, index)"
                    role="menuitem"
                    :disabled="disabled || !!action.disabled"
                    :aria-label="action.ariaLabel ?? action.label"
                    @click="onActionClick(action, index)"
                    @keydown="onActionKeydown(index, $event)"
                >
                    <slot name="action" :action="action" :index="index">
                        <span v-bind="labelAttrs(action, index)">{{ action.label }}</span>
                    </slot>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

export interface SpeedDialAction {
    label: string;
    value?: string | number;
    disabled?: boolean;
    ariaLabel?: string;
    key?: string | number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

interface Props {
    modelValue?: boolean;
    actions?: Array<SpeedDialAction>;
    direction?: Direction;
    disabled?: boolean;
    ariaLabel?: string;
    openLabel?: string;
    closeLabel?: string;
    closeOnAction?: boolean;
    closeOnOutsideClick?: boolean;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    actions: () => [],
    direction: 'up',
    disabled: false,
    ariaLabel: 'Speed dial actions',
    openLabel: 'Open actions',
    closeLabel: 'Close actions',
    closeOnAction: true,
    closeOnOutsideClick: true,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'toggle', value: boolean): void;
    (event: 'action', payload: { action: SpeedDialAction; index: number; value: string | number | undefined }): void;
}>();

defineSlots<{
    trigger?: (props: { open: boolean }) => unknown;
    action?: (props: { action: SpeedDialAction; index: number }) => unknown;
}>();

const rootRef = ref<HTMLElement | null>(null);
const actionRefs = ref<Array<HTMLButtonElement>>([]);
const internalOpen = ref(false);

const isOpen = computed(() => internalOpen.value);
const triggerAriaLabel = computed(() => (isOpen.value ? props.closeLabel : props.openLabel));

const ptContext = computed(() => ({
    open: isOpen.value,
    disabled: props.disabled,
    direction: props.direction,
}));
const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        [
            'vf-speed-dial',
            `vf-speed-dial_${props.direction}`,
            isOpen.value ? 'vf-speed-dial_open' : null,
            props.disabled ? 'vf-speed-dial_disabled' : null,
        ]
            .filter(Boolean)
            .join(' '),
        props.unstyled,
    ),
);
const triggerAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'trigger', ptContext.value), 'vf-speed-dial__trigger', props.unstyled),
);
const actionsAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'actions', ptContext.value), 'vf-speed-dial__actions', props.unstyled),
);
const itemAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'item', ptContext.value), 'vf-speed-dial__item', props.unstyled),
);
const actionClass = (action: SpeedDialAction) =>
    props.unstyled ? undefined : ['vf-speed-dial__action', action.disabled ? 'vf-speed-dial__action_disabled' : null];
const actionAttrs = (action: SpeedDialAction, index: number) =>
    resolvePassThrough(props.pt, 'action', {
        ...ptContext.value,
        action,
        index,
    });
const labelAttrs = (action: SpeedDialAction, index: number) =>
    withPartClass(
        resolvePassThrough(props.pt, 'label', {
            ...ptContext.value,
            action,
            index,
        }),
        'vf-speed-dial__action-label',
        props.unstyled,
    );

const enabledActionIndices = computed(() =>
    props.actions.reduce<Array<number>>((indices, action, index) => {
        if (!action.disabled) {
            indices.push(index);
        }

        return indices;
    }, []),
);

const setOpen = (nextOpen: boolean) => {
    if (props.disabled || nextOpen === isOpen.value) {
        return;
    }

    internalOpen.value = nextOpen;
    emits('update:modelValue', nextOpen);
    emits('toggle', nextOpen);

    if (nextOpen) {
        nextTick(() => {
            const firstIndex = enabledActionIndices.value[0];
            if (firstIndex == null) {
                return;
            }

            actionRefs.value[firstIndex]?.focus();
        });
    }
};

const toggle = () => setOpen(!isOpen.value);
const close = () => setOpen(false);

const onActionClick = (action: SpeedDialAction, index: number) => {
    if (props.disabled || action.disabled) {
        return;
    }

    emits('action', {
        action,
        index,
        value: action.value,
    });

    if (props.closeOnAction) {
        close();
    }
};

const moveFocus = (current: number, step: 1 | -1) => {
    const enabled = enabledActionIndices.value;

    if (!enabled.length) {
        return;
    }

    const position = enabled.indexOf(current);
    const start = position === -1 ? (step > 0 ? -1 : enabled.length) : position;
    const nextPosition = (start + step + enabled.length) % enabled.length;
    const nextIndex = enabled[nextPosition];

    actionRefs.value[nextIndex]?.focus();
};

const onActionKeydown = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        close();
        rootRef.value?.querySelector<HTMLButtonElement>('.vf-speed-dial__trigger')?.focus();

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        const firstIndex = enabledActionIndices.value[0];
        if (firstIndex != null) {
            actionRefs.value[firstIndex]?.focus();
        }

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        const lastIndex = enabledActionIndices.value.at(-1);
        if (lastIndex != null) {
            actionRefs.value[lastIndex]?.focus();
        }

        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(index, 1);

        return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(index, -1);
    }
};

const onTriggerKeydown = (event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();
    }
};

const onDocumentClick = (event: MouseEvent) => {
    if (!props.closeOnOutsideClick || !isOpen.value) {
        return;
    }

    const target = event.target as Node | null;
    if (!target || !rootRef.value) {
        return;
    }

    if (!rootRef.value.contains(target)) {
        close();
    }
};

const getActionKey = (action: SpeedDialAction, index: number) => {
    if (action.key != null) {
        return action.key;
    }
    if (action.value != null) {
        return action.value;
    }

    return `${action.label}-${index}`;
};

watch(
    () => props.modelValue,
    value => {
        internalOpen.value = !!value;
    },
    { immediate: true },
);

watch(
    () => props.disabled,
    disabled => {
        if (disabled && isOpen.value) {
            close();
        }
    },
);

watch(
    () => isOpen.value,
    open => {
        if (open) {
            document.addEventListener('mousedown', onDocumentClick);
            nextTick(() => {
                const firstIndex = enabledActionIndices.value[0];
                if (firstIndex != null) {
                    actionRefs.value[firstIndex]?.focus();
                }
            });
        } else {
            document.removeEventListener('mousedown', onDocumentClick);
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentClick);
});

defineExpose({
    open: () => setOpen(true),
    close,
    toggle,
});
</script>

<style lang="scss">
.vf-speed-dial {
    position: fixed;
    right: var(--vf-speeddial-offset-x);
    bottom: var(--vf-speeddial-offset-y);
    z-index: var(--vf-speeddial-z-index);
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--vf-speeddial-gap);
}

.vf-speed-dial__trigger,
.vf-speed-dial__action {
    border: var(--vf-border-width) solid var(--vf-speeddial-trigger-border-color);
    border-radius: var(--vf-speeddial-trigger-border-radius);
    background: var(--vf-speeddial-trigger-background-color);
    color: var(--vf-speeddial-trigger-text-color);
    box-shadow: var(--vf-speeddial-trigger-shadow);
}

.vf-speed-dial__trigger {
    min-width: var(--vf-speeddial-trigger-size);
    height: var(--vf-speeddial-trigger-size);
    padding: 0 var(--vf-speeddial-trigger-padding-x);
}

.vf-speed-dial__actions {
    display: flex;
    gap: var(--vf-speeddial-gap);
    margin: 0;
    padding: 0;
    list-style: none;
    transition: all var(--vf-speeddial-transition-duration) var(--vf-speeddial-transition-easing);
}

.vf-speed-dial_up .vf-speed-dial__actions,
.vf-speed-dial_down .vf-speed-dial__actions {
    flex-direction: column;
}

.vf-speed-dial_left .vf-speed-dial__actions,
.vf-speed-dial_right .vf-speed-dial__actions {
    flex-direction: row;
}

.vf-speed-dial_down {
    flex-direction: column-reverse;
}

.vf-speed-dial_left {
    align-items: flex-end;
}

.vf-speed-dial__action {
    min-width: var(--vf-speeddial-action-size);
    height: var(--vf-speeddial-action-size);
    padding: 0 var(--vf-speeddial-action-padding-x);
    border-color: var(--vf-speeddial-action-border-color);
    border-radius: var(--vf-speeddial-action-border-radius);
    background: var(--vf-speeddial-action-background-color);
    color: var(--vf-speeddial-action-text-color);
    box-shadow: var(--vf-speeddial-action-shadow);
}

.vf-speed-dial__action-label {
    display: inline-block;
    padding: var(--vf-speeddial-label-padding);
    border-radius: var(--vf-radii-sm);
    background: var(--vf-speeddial-label-background-color);
    color: var(--vf-speeddial-label-text-color);
}

.vf-speed-dial__trigger:focus-visible,
.vf-speed-dial__action:focus-visible {
    outline: none;
    box-shadow: var(--vf-speeddial-focus-ring-shadow);
    border-color: var(--vf-speeddial-focus-border-color);
}

.vf-speed-dial_disabled {
    opacity: var(--vf-speeddial-disabled-opacity);
}

@media (max-width: 767px) {
    .vf-speed-dial {
        right: var(--vf-speeddial-offset-x-mobile);
        bottom: var(--vf-speeddial-offset-y-mobile);
    }
}
</style>
