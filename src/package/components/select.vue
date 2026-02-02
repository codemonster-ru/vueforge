<template>
    <div ref="root" :class="getClass">
        <button
            ref="trigger"
            class="vf-select__control"
            type="button"
            :disabled="disabled"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="listbox"
            @click="toggle"
            @keydown.down.prevent="openAndFocus"
            @keydown.enter.prevent="toggle"
            @keydown.esc.prevent="close"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-select__label" :class="{ 'vf-select__label_placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder }}
            </span>
            <span class="vf-select__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-select__panel"
                role="listbox"
                :data-placement="currentPlacement"
            >
                <button
                    v-for="option in normalizedOptions"
                    :key="option.value"
                    class="vf-select__option"
                    :class="{ 'is-active': isActive(option), 'is-disabled': option.disabled }"
                    type="button"
                    role="option"
                    :disabled="option.disabled"
                    :aria-selected="isActive(option)"
                    @click="selectOption(option)"
                >
                    {{ option.label }}
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

let selectIdCounter = 0;

interface OptionItem {
    label: string;
    value: string | number;
    disabled?: boolean;
}

interface Props {
    modelValue?: string | number;
    options?: Array<OptionItem>;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: '',
    disabled: false,
    variant: 'filled',
    size: 'normal',
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-select-panel-${++selectIdCounter}`;
let floater: FloaterInstance = null;

const normalizedOptions = computed(() => {
    return props.options.map(option => {
        return {
            label: option[props.optionLabel as keyof OptionItem] as string,
            value: option[props.optionValue as keyof OptionItem] as string | number,
            disabled: option.disabled,
        };
    });
});
const selectedOption = computed(() => {
    return normalizedOptions.value.find(option => option.value === props.modelValue);
});
const selectedLabel = computed(() => selectedOption.value?.label ?? '');

const getClass = computed(() => {
    const classes = ['vf-select', `vf-select_${props.variant}`, open.value ? 'vf-select_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-select_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-select_disabled');
    }

    return classes.filter(Boolean);
});

const isActive = (option: { value: string | number }) => option.value === props.modelValue;
const selectOption = (option: { value: string | number; disabled?: boolean }) => {
    if (option.disabled) {
        return;
    }

    emits('update:modelValue', option.value);
    emits('change', option.value);

    close();
};
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const close = () => {
    open.value = false;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};
const toggle = () => {
    if (props.disabled) {
        return;
    }

    open.value = !open.value;

    if (open.value) {
        basePlacement.value = 'bottom';
        currentPlacement.value = 'bottom';
    }
};
const openAndFocus = async () => {
    if (!open.value) {
        open.value = true;
        await nextTick();
    }

    panel.value?.querySelector<HTMLButtonElement>('.vf-select__option:not(.is-disabled)')?.focus();
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    const target = event.target as Node;

    if (root.value.contains(target) || panel.value?.contains(target)) {
        return;
    }

    close();
};

const mountFloater = () => {
    if (!trigger.value || !panel.value) {
        return;
    }

    const reference = trigger.value;
    const floating = panel.value;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offset(2), flip({ placements: ['bottom', 'top'] })],
        });
        currentPlacement.value = (resolvedPlacement as 'bottom' | 'top') ?? basePlacement.value;
        floating.style.minWidth = `${reference.getBoundingClientRect().width}px`;
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

watch(open, async value => {
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
watch(
    () => props.options,
    () => {
        void floater?.update();
    },
    { deep: true },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    floater?.destroy();
    floater = null;
});
</script>

<style lang="scss">
.vf-select {
    position: relative;
    display: inline-block;
    min-width: var(--vf-select-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-select-border-radius);
    border: var(--vf-border-width) solid var(--vf-select-border-color);
    background-color: var(--vf-select-background-color);
    color: var(--vf-select-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-select_outlined {
    background-color: transparent;
}

.vf-select__control {
    width: 100%;
    padding: var(--vf-select-padding);
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-select-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    gap: var(--vf-select-control-gap);
    cursor: pointer;
}

.vf-select__label {
    text-align: left;
}

.vf-select__label_placeholder {
    color: var(--vf-secondary-text-color);
}

.vf-select__chevron {
    font-size: var(--vf-select-chevron-size);
    opacity: 0.7;
}

.vf-select__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-select-panel-padding);
    max-height: var(--vf-select-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-select-border-radius) + var(--vf-select-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-select-panel-border-color);
    background-color: var(--vf-select-panel-background-color);
    box-shadow: var(--vf-select-panel-shadow);
    color: var(--vf-select-text-color);
}

.vf-select__option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-select-option-padding);
    border-radius: var(--vf-select-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-select__option:hover:not(.is-disabled),
.vf-select__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-select-option-hover-background-color);
    outline: none;
}

.vf-select__option.is-active {
    background-color: var(--vf-select-option-active-background-color);
    color: var(--vf-select-option-active-text-color);
}

.vf-select__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-select_open {
    border-color: var(--vf-select-focus-border-color);
    box-shadow: var(--vf-select-focus-ring-shadow);
}

.vf-select:hover:not(.vf-select_disabled) {
    border-color: var(--vf-select-hover-border-color);
}

.vf-select:focus-within:not(.vf-select_disabled) {
    border-color: var(--vf-select-focus-border-color);
}

.vf-select_small {
    .vf-select__control {
        padding: var(--vf-select-small-padding);
        font-size: var(--vf-select-small-font-size);
    }
}

.vf-select_large {
    .vf-select__control {
        padding: var(--vf-select-large-padding);
        font-size: var(--vf-select-large-font-size);
    }
}

.vf-select_disabled {
    opacity: var(--vf-select-disabled-opacity);
    cursor: not-allowed;

    .vf-select__control {
        cursor: not-allowed;
    }
}
</style>
