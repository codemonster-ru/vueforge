<template>
    <div ref="root" class="vf-popover" :class="{ 'vf-popover_disabled': disabled }">
        <div
            ref="trigger"
            class="vf-popover__button"
            role="button"
            tabindex="0"
            aria-haspopup="dialog"
            :aria-expanded="open"
            :aria-controls="panelId"
            :aria-disabled="disabled ? 'true' : 'false'"
            @click="onClick"
            @keydown.enter.prevent="onClick"
            @keydown.space.prevent="onClick"
            @keydown.esc.prevent="hideAndRestoreFocus"
        >
            <slot name="button" />
        </div>
        <Teleport to="body">
            <Card
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-popover__wrapper"
                role="dialog"
                tabindex="-1"
                :data-placement="currentPlacement"
                @keydown.esc.prevent="hideAndRestoreFocus"
            >
                <template v-if="$slots.default" #default>
                    <slot name="default" />
                </template>
                <template v-if="$slots.header || $slots.popoverHeader" #header>
                    <slot name="header" />
                    <slot v-if="!$slots.header" name="popoverHeader" />
                </template>
                <template v-if="$slots.body || $slots.popoverBody" #body>
                    <slot name="body" />
                    <slot v-if="!$slots.body" name="popoverBody" />
                </template>
                <template v-if="$slots.footer || $slots.popoverFooter" #footer>
                    <slot name="footer" />
                    <slot v-if="!$slots.footer" name="popoverFooter" />
                </template>
                <div class="vf-popover__arrow"></div>
            </Card>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset as offsetMiddleware } from '@codemonster-ru/floater.js';
import Card from '@/package/components/card.vue';

type Placement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

interface Props {
    modelValue?: boolean;
    placement?: Placement;
    offset?: number;
    disabled?: boolean;
    closeOnEsc?: boolean;
    closeOnOutside?: boolean;
}

const emits = defineEmits(['update:modelValue', 'open', 'close', 'click', 'onClick']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placement: 'bottom',
    offset: 8,
    disabled: false,
    closeOnEsc: true,
    closeOnOutside: true,
});

const POPOVER_COUNTER_KEY = '__vf_popover_id_counter__';
const getGlobalObject = (): Record<string, unknown> => globalThis as Record<string, unknown>;
const nextPopoverId = () => {
    const globalObject = getGlobalObject();
    const current =
        typeof globalObject[POPOVER_COUNTER_KEY] === 'number' ? (globalObject[POPOVER_COUNTER_KEY] as number) : 0;
    const next = current + 1;

    globalObject[POPOVER_COUNTER_KEY] = next;

    return next;
};

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | { $el?: HTMLElement } | null>(null);
const open = ref(false);
const panelId = `vf-popover-panel-${nextPopoverId()}`;
const basePlacement = ref<Placement>(props.placement);
const currentPlacement = ref<Placement>(props.placement);
const isControlled = computed(() => props.modelValue !== undefined);
let floater: FloaterInstance = null;
let lastActiveElement: HTMLElement | null = null;

const getPanelElement = (): HTMLElement | null => {
    const value = panel.value;

    if (!value) {
        return null;
    }

    if (value instanceof HTMLElement) {
        return value;
    }

    if (value.$el instanceof HTMLElement) {
        return value.$el;
    }

    return null;
};

const setOpen = (value: boolean) => {
    if (props.disabled) {
        return;
    }

    emits('update:modelValue', value);

    if (!isControlled.value) {
        open.value = value;
    }
};
const show = () => {
    if (props.disabled) {
        return;
    }

    if (typeof document !== 'undefined') {
        lastActiveElement = document.activeElement as HTMLElement | null;
    }

    setOpen(true);
};
const hide = () => setOpen(false);
const hideAndRestoreFocus = () => {
    hide();
    lastActiveElement?.focus();
};
const toggle = () => {
    if (open.value) {
        hideAndRestoreFocus();
        return;
    }

    show();
};
const onClick = () => {
    toggle();
    emits('click');
    emits('onClick');
};

const fallbackPlacements = (placement: Placement): Array<Placement> => {
    switch (placement) {
        case 'bottom-start':
            return ['top-start'];
        case 'bottom-end':
            return ['top-end'];
        case 'top-start':
            return ['bottom-start'];
        case 'top-end':
            return ['bottom-end'];
        case 'top':
            return ['bottom'];
        case 'bottom':
        default:
            return ['top'];
    }
};

const mountFloater = () => {
    const floatingElement = getPanelElement();

    if (!trigger.value || !floatingElement) {
        return;
    }

    const reference = trigger.value;
    const floating = floatingElement;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offsetMiddleware(props.offset), flip({ placements: fallbackPlacements(basePlacement.value) })],
        });

        currentPlacement.value = (resolvedPlacement as Placement) ?? basePlacement.value;
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };

    const update = async () => {
        await applyPosition();
    };

    const cleanup = autoUpdate(reference, () => {
        void update();
    });

    const onScrollOrResize = () => {
        void update();
    };

    document.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, false);

    floater = {
        update,
        destroy: () => {
            cleanup();
            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize, false);
        },
    };

    void floater.update();
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !props.closeOnOutside || !root.value) {
        return;
    }

    const target = event.target as Node;
    const floating = getPanelElement();

    if (root.value.contains(target) || floating?.contains(target)) {
        return;
    }

    hideAndRestoreFocus();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open.value || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        hideAndRestoreFocus();
    }
};

watch(
    () => props.modelValue,
    value => {
        if (!isControlled.value) {
            return;
        }

        open.value = !!value;
    },
    { immediate: true },
);

watch(
    () => props.placement,
    value => {
        basePlacement.value = value;
        currentPlacement.value = value;
    },
);

watch(open, async value => {
    if (value) {
        emits('open');
    } else {
        emits('close');
    }

    if (!value) {
        if (floater) {
            floater.destroy();
            floater = null;
        }

        return;
    }

    await nextTick();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    floater?.destroy();
    floater = null;
});

defineExpose({ show, hide, toggle });
</script>

<style lang="scss">
.vf-popover {
    position: relative;
}

.vf-popover__button {
    cursor: pointer;
    user-select: none;
}

.vf-popover__wrapper {
    position: fixed;
    z-index: var(--vf-popover-z-index);
    border-radius: var(--vf-popover-border-radius);
    border-color: var(--vf-popover-border-color);
    background-color: var(--vf-popover-background-color);
    box-shadow: var(--vf-popover-shadow);
}

.vf-popover_disabled .vf-popover__button {
    cursor: not-allowed;
    opacity: var(--vf-states-disabled-opacity);
}
</style>
