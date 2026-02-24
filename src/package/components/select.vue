<template>
    <div ref="root" :class="getClass">
        <button
            ref="trigger"
            class="vf-select__control"
            type="button"
            :disabled="disabled"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-label="ariaLabel"
            :aria-expanded="open"
            :aria-controls="panelId"
            :aria-activedescendant="activeDescendantId"
            aria-haspopup="listbox"
            @click="onTriggerClick"
            @keydown="onTriggerKeydown"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-select__label" :class="{ 'vf-select__label_placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder }}
            </span>
            <span v-if="!showClear" class="vf-select__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <button
            v-if="showClear"
            class="vf-select__clear"
            type="button"
            :aria-label="clearLabel"
            @click.stop="clearValue"
        >
            ×
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-select__panel"
                role="listbox"
                :data-placement="currentPlacement"
                :aria-label="panelAriaLabel"
                @scroll.passive="onPanelScroll"
            >
                <div v-if="loading" class="vf-select__loading">{{ resolvedLoadingText }}</div>
                <template v-else-if="normalizedOptions.length > 0">
                    <div class="vf-select__virtual-spacer" :style="virtualSpacerStyle">
                        <button
                            v-for="renderedOption in renderedOptions"
                            :id="getOptionId(renderedOption.index)"
                            :key="renderedOption.option.value"
                            class="vf-select__option"
                            :class="{
                                'is-active': isActive(renderedOption.option),
                                'is-disabled': renderedOption.option.disabled,
                                'is-focused': renderedOption.index === focusedIndex,
                            }"
                            type="button"
                            role="option"
                            :disabled="renderedOption.option.disabled"
                            :aria-selected="isActive(renderedOption.option)"
                            @mouseenter="onOptionMouseenter(renderedOption.index)"
                            @click="selectOption(renderedOption.option)"
                        >
                            {{ renderedOption.option.label }}
                        </button>
                    </div>
                </template>
                <div v-else class="vf-select__empty">{{ resolvedEmptyText }}</div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';
import { useLocaleText } from '@/package/config/locale-text';

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
    readonly?: boolean;
    clearable?: boolean;
    clearLabel?: string;
    ariaLabel?: string;
    panelAriaLabel?: string;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    virtual?: boolean;
    virtualItemHeight?: number;
    virtualOverscan?: number;
    virtualThreshold?: number;
    loadMoreOffset?: number;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'loadMore']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    clearLabel: 'Clear selection',
    ariaLabel: 'Select option',
    panelAriaLabel: 'Options',
    loading: false,
    loadingText: undefined,
    emptyText: undefined,
    virtual: false,
    virtualItemHeight: 36,
    virtualOverscan: 4,
    virtualThreshold: 100,
    loadMoreOffset: 3,
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
const focusedIndex = ref(-1);
const panelScrollTop = ref(0);
const panelViewportHeight = ref(0);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-select-panel-${++selectIdCounter}`;
let floater: FloaterInstance = null;
const localeText = useLocaleText();
const lastLoadMoreTotal = ref(-1);

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
const showClear = computed(
    () => props.clearable && props.modelValue !== undefined && !props.disabled && !props.readonly,
);
const resolvedLoadingText = computed(() => props.loadingText ?? localeText.common.loadingText);
const resolvedEmptyText = computed(() => props.emptyText ?? localeText.common.emptyText);
const shouldUseVirtual = computed(() => props.virtual && normalizedOptions.value.length >= props.virtualThreshold);
const virtualRange = computed(() => {
    const total = normalizedOptions.value.length;

    if (!shouldUseVirtual.value || total === 0) {
        return {
            start: 0,
            end: total,
        };
    }

    const itemHeight = Math.max(1, props.virtualItemHeight);
    const viewport = Math.max(itemHeight, panelViewportHeight.value);
    const visibleCount = Math.max(1, Math.ceil(viewport / itemHeight));
    const start = Math.max(0, Math.floor(panelScrollTop.value / itemHeight) - props.virtualOverscan);
    const end = Math.min(total, start + visibleCount + props.virtualOverscan * 2);

    return {
        start,
        end,
    };
});
const renderedOptions = computed(() => {
    const { start, end } = virtualRange.value;
    const options = normalizedOptions.value.slice(start, end);

    return options.map((option, localIndex) => ({
        option,
        index: start + localIndex,
    }));
});
const virtualSpacerStyle = computed(() => {
    if (!shouldUseVirtual.value) {
        return undefined;
    }

    const total = normalizedOptions.value.length;
    const { start, end } = virtualRange.value;
    const itemHeight = Math.max(1, props.virtualItemHeight);

    return {
        paddingTop: `${start * itemHeight}px`,
        paddingBottom: `${Math.max(0, total - end) * itemHeight}px`,
    };
});
const activeDescendantId = computed(() => {
    if (!open.value || focusedIndex.value < 0 || focusedIndex.value >= normalizedOptions.value.length) {
        return undefined;
    }

    return getOptionId(focusedIndex.value);
});

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
const getOptionId = (index: number) => `${panelId}-option-${index}`;

const firstEnabledIndex = () => normalizedOptions.value.findIndex(option => !option.disabled);
const lastEnabledIndex = () => {
    for (let index = normalizedOptions.value.length - 1; index >= 0; index -= 1) {
        if (!normalizedOptions.value[index].disabled) {
            return index;
        }
    }

    return -1;
};
const focusOption = (index: number) => {
    if (index < 0 || index >= normalizedOptions.value.length) {
        return;
    }

    focusedIndex.value = index;
    ensureOptionVisible(index);
};
const moveFocus = (step: 1 | -1) => {
    if (!normalizedOptions.value.length) {
        return;
    }

    let index = focusedIndex.value;
    const size = normalizedOptions.value.length;

    if (index < 0 || index >= size) {
        index = step > 0 ? -1 : size;
    }

    for (let i = 0; i < size; i += 1) {
        index = (index + step + size) % size;
        if (!normalizedOptions.value[index].disabled) {
            focusOption(index);

            return;
        }
    }
};
const selectOption = (option: { value: string | number; disabled?: boolean }) => {
    if (option.disabled || props.readonly) {
        return;
    }

    emits('update:modelValue', option.value);
    emits('change', option.value);

    close();
};
const clearValue = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    emits('update:modelValue', undefined);
    emits('change', undefined);
};
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const close = () => {
    open.value = false;
    focusedIndex.value = -1;
    panelScrollTop.value = 0;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};
const toggle = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = !open.value;

    if (open.value) {
        focusedIndex.value = firstEnabledIndex();
        basePlacement.value = 'bottom';
        currentPlacement.value = 'bottom';
    }
};
const openAndFocus = async (direction: 'first' | 'last' = 'first') => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!open.value) {
        open.value = true;
        await nextTick();
    }

    if (direction === 'last') {
        focusOption(lastEnabledIndex());

        return;
    }

    focusOption(firstEnabledIndex());
};

const onTriggerClick = () => {
    toggle();
};
const onTriggerKeydown = (event: KeyboardEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (open.value && event.key === 'ArrowDown') {
        event.preventDefault();
        moveFocus(1);

        return;
    }

    if (open.value && event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocus(-1);

        return;
    }

    if (open.value && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const option = normalizedOptions.value[focusedIndex.value];

        if (option) {
            selectOption(option);
        }

        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        void openAndFocus('first');

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        void openAndFocus('last');

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
const onOptionMouseenter = (index: number) => {
    focusedIndex.value = index;
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
        syncPanelMetrics();
        maybeEmitLoadMore();
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

const syncPanelMetrics = () => {
    panelViewportHeight.value = panel.value?.clientHeight ?? 0;
    panelScrollTop.value = panel.value?.scrollTop ?? 0;
};

const getLastVisibleIndex = () => {
    const total = normalizedOptions.value.length;

    if (total === 0) {
        return -1;
    }

    if (!shouldUseVirtual.value) {
        return total - 1;
    }

    const itemHeight = Math.max(1, props.virtualItemHeight);
    const viewport = Math.max(itemHeight, panelViewportHeight.value);
    const visibleCount = Math.max(1, Math.ceil(viewport / itemHeight));

    return Math.min(
        total - 1,
        Math.floor(panelScrollTop.value / itemHeight) + visibleCount + props.virtualOverscan - 1,
    );
};

const maybeEmitLoadMore = () => {
    if (props.loading) {
        return;
    }

    const total = normalizedOptions.value.length;
    if (total === 0) {
        return;
    }

    const lastVisible = getLastVisibleIndex();
    if (lastVisible < total - 1 - props.loadMoreOffset) {
        return;
    }

    if (lastLoadMoreTotal.value === total) {
        return;
    }

    lastLoadMoreTotal.value = total;
    emits('loadMore', {
        visibleEndIndex: lastVisible,
        total,
    });
};

const onPanelScroll = () => {
    syncPanelMetrics();
    maybeEmitLoadMore();
};

const ensureOptionVisible = (index: number) => {
    if (!open.value || !shouldUseVirtual.value || !panel.value) {
        return;
    }

    const itemHeight = Math.max(1, props.virtualItemHeight);
    const itemTop = index * itemHeight;
    const itemBottom = itemTop + itemHeight;
    const viewportTop = panel.value.scrollTop;
    const viewportBottom = viewportTop + panel.value.clientHeight;

    if (itemTop < viewportTop) {
        panel.value.scrollTop = itemTop;
    } else if (itemBottom > viewportBottom) {
        panel.value.scrollTop = Math.max(0, itemBottom - panel.value.clientHeight);
    }

    syncPanelMetrics();
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
    syncPanelMetrics();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});
watch(
    () => props.modelValue,
    value => {
        const selectedIndex = normalizedOptions.value.findIndex(option => option.value === value && !option.disabled);
        focusedIndex.value = selectedIndex >= 0 ? selectedIndex : -1;
    },
    { immediate: true },
);
watch(
    () => normalizedOptions.value.length,
    () => {
        lastLoadMoreTotal.value = -1;
        syncPanelMetrics();
        maybeEmitLoadMore();
    },
);
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

.vf-select__clear {
    position: absolute;
    top: 50%;
    right: calc(var(--vf-select-control-gap) + 0.15rem);
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font: inherit;
}

.vf-select__clear:hover {
    background-color: var(--vf-select-option-hover-background-color);
}

.vf-select__clear:focus-visible {
    outline: none;
    box-shadow: var(--vf-select-focus-ring-shadow);
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

.vf-select__option.is-focused:not(.is-disabled) {
    background-color: var(--vf-select-option-hover-background-color);
}

.vf-select__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-select__virtual-spacer {
    display: grid;
}

.vf-select__loading,
.vf-select__empty {
    padding: var(--vf-select-option-padding);
    color: var(--vf-secondary-text-color);
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
