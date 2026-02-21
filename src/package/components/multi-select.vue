<template>
    <div ref="root" :class="getClass">
        <button
            ref="trigger"
            class="vf-multiselect__control"
            type="button"
            :disabled="disabled"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="listbox"
            @click="togglePanel"
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
            @keydown.enter.prevent="onEnter"
            @keydown.esc.prevent="close"
            @keydown.backspace.prevent="onBackspace"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span v-if="selectedOptions.length === 0" class="vf-multiselect__label vf-multiselect__label_placeholder">
                {{ displayLabel }}
            </span>
            <span v-else class="vf-multiselect__chips">
                <span v-for="option in selectedOptions" :key="option.value" class="vf-multiselect__chip">
                    <span class="vf-multiselect__chip-label">{{ option.label }}</span>
                    <span
                        v-if="!disabled && !readonly"
                        class="vf-multiselect__chip-remove"
                        role="button"
                        tabindex="-1"
                        aria-label="Remove item"
                        @mousedown.prevent.stop
                        @click.stop="removeOption(option.value)"
                    >
                        ×
                    </span>
                </span>
            </span>
            <span class="vf-multiselect__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <button
            v-if="clearable && selectedValues.length > 0 && !disabled && !readonly"
            class="vf-multiselect__clear"
            type="button"
            aria-label="Clear selection"
            @click.stop="clearSelection"
        >
            &#10005;
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-multiselect__panel"
                role="listbox"
                aria-multiselectable="true"
                :data-placement="currentPlacement"
            >
                <div v-if="filter" class="vf-multiselect__search">
                    <input
                        ref="searchInput"
                        class="vf-multiselect__search-control"
                        type="text"
                        :value="query"
                        :placeholder="searchPlaceholder"
                        :readonly="readonly"
                        @input="onSearchInput"
                        @keydown.down.prevent="onArrowDown"
                        @keydown.up.prevent="onArrowUp"
                        @keydown.enter.prevent="onEnter"
                        @keydown.esc.prevent="close"
                    />
                </div>
                <div v-if="loading" class="vf-multiselect__loading">{{ loadingText }}</div>
                <template v-else-if="filteredOptions.length > 0">
                    <button
                        v-for="(option, index) in filteredOptions"
                        :id="getOptionId(index)"
                        :key="option.value"
                        class="vf-multiselect__option"
                        :class="{
                            'is-active': isActive(option),
                            'is-disabled': option.disabled,
                            'is-highlighted': index === highlightedIndex,
                        }"
                        type="button"
                        role="option"
                        :disabled="option.disabled"
                        :aria-selected="isActive(option)"
                        @click="toggleOption(option)"
                    >
                        <span class="vf-multiselect__option-label">{{ option.label }}</span>
                        <span v-if="isActive(option)" class="vf-multiselect__option-check" aria-hidden="true"
                            >&#10003;</span
                        >
                    </button>
                </template>
                <div v-else class="vf-multiselect__empty">{{ emptyText }}</div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type OptionValue = string | number;

let multiSelectIdCounter = 0;

interface OptionItem {
    label: string;
    value: OptionValue;
    disabled?: boolean;
}

interface Props {
    modelValue?: Array<OptionValue>;
    options?: Array<OptionItem>;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    filter?: boolean;
    clearable?: boolean;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'change', 'search', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: '',
    searchPlaceholder: 'Search...',
    disabled: false,
    readonly: false,
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No results',
    filter: true,
    clearable: false,
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
const searchInput = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref('');
const highlightedIndex = ref(-1);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-multiselect-panel-${++multiSelectIdCounter}`;
let floater: FloaterInstance = null;

const normalizedOptions = computed(() => {
    return props.options.map(option => {
        return {
            label: option[props.optionLabel as keyof OptionItem] as string,
            value: option[props.optionValue as keyof OptionItem] as OptionValue,
            disabled: option.disabled,
        };
    });
});

const selectedValues = computed<Array<OptionValue>>(() => {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const filteredOptions = computed(() => {
    if (!props.filter) {
        return normalizedOptions.value;
    }

    const search = query.value.trim().toLowerCase();

    if (!search) {
        return normalizedOptions.value;
    }

    return normalizedOptions.value.filter(option => option.label.toLowerCase().includes(search));
});

const selectedOptions = computed(() => {
    return normalizedOptions.value.filter(option => selectedValues.value.includes(option.value));
});

const displayLabel = computed(() => {
    if (selectedOptions.value.length === 0) {
        return props.placeholder;
    }

    return selectedOptions.value.map(option => option.label).join(', ');
});

const getClass = computed(() => {
    const classes = ['vf-multiselect', `vf-multiselect_${props.variant}`, open.value ? 'vf-multiselect_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-multiselect_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-multiselect_disabled');
    }

    return classes.filter(Boolean);
});

const getOptionId = (index: number) => `${panelId}-option-${index}`;

const firstEnabledIndex = () => filteredOptions.value.findIndex(option => !option.disabled);

const isActive = (option: { value: OptionValue }) => selectedValues.value.includes(option.value);

const emitValue = (nextValue: Array<OptionValue>) => {
    emits('update:modelValue', nextValue);
    emits('change', nextValue);
};

const toggleOption = (option: { value: OptionValue; disabled?: boolean }) => {
    if (option.disabled || props.readonly) {
        return;
    }

    if (isActive(option)) {
        emitValue(selectedValues.value.filter(value => value !== option.value));

        return;
    }

    emitValue([...selectedValues.value, option.value]);
};

const clearSelection = () => {
    if (props.readonly) {
        return;
    }

    emitValue([]);
};
const removeOption = (value: OptionValue) => {
    if (props.readonly) {
        return;
    }

    emitValue(selectedValues.value.filter(item => item !== value));
};

const highlightByStep = (step: number) => {
    const options = filteredOptions.value;

    if (!options.length) {
        highlightedIndex.value = -1;

        return;
    }

    let index = highlightedIndex.value;

    if (index < 0 || index >= options.length) {
        index = step > 0 ? -1 : options.length;
    }

    for (let i = 0; i < options.length; i += 1) {
        index = (index + step + options.length) % options.length;

        if (!options[index].disabled) {
            highlightedIndex.value = index;

            return;
        }
    }

    highlightedIndex.value = -1;
};

const openPanel = async () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';

    if (highlightedIndex.value < 0) {
        highlightedIndex.value = firstEnabledIndex();
    }

    if (props.filter) {
        await nextTick();

        searchInput.value?.focus();
    }
};

const close = () => {
    open.value = false;
    highlightedIndex.value = -1;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
    query.value = '';
};

const togglePanel = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (open.value) {
        close();

        return;
    }

    void openPanel();
};

const onArrowDown = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!open.value) {
        void openPanel();

        return;
    }

    highlightByStep(1);
};

const onArrowUp = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!open.value) {
        void openPanel();

        return;
    }

    highlightByStep(-1);
};

const onEnter = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!open.value) {
        void openPanel();

        return;
    }

    const option = filteredOptions.value[highlightedIndex.value];

    if (option && !option.disabled) {
        toggleOption(option);
    }
};
const onBackspace = () => {
    if (props.readonly || selectedValues.value.length === 0) {
        return;
    }

    emitValue(selectedValues.value.slice(0, -1));
};

const onSearchInput = (event: Event) => {
    if (props.readonly) {
        return;
    }

    const target = event.target as HTMLInputElement;

    query.value = target.value;

    emits('search', target.value);

    highlightedIndex.value = firstEnabledIndex();
};

const onFocus = (event: FocusEvent) => emits('focus', event);

const onBlur = (event: FocusEvent) => emits('blur', event);

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

watch(
    () => props.options,
    () => {
        if (highlightedIndex.value >= filteredOptions.value.length) {
            highlightedIndex.value = firstEnabledIndex();
        }

        void floater?.update();
    },
    { deep: true },
);

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

watch(filteredOptions, () => {
    if (highlightedIndex.value >= filteredOptions.value.length) {
        highlightedIndex.value = firstEnabledIndex();
    }
});

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
.vf-multiselect {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: var(--vf-multiselect-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    gap: 0;
    border-radius: var(--vf-multiselect-border-radius);
    border: var(--vf-border-width) solid var(--vf-multiselect-border-color);
    background-color: var(--vf-multiselect-background-color);
    color: var(--vf-multiselect-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-multiselect_outlined {
    background-color: transparent;
}

.vf-multiselect__control {
    width: 100%;
    min-width: 0;
    flex: 1 1 0%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-multiselect-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-multiselect-control-gap);
    padding: var(--vf-multiselect-padding);
    cursor: pointer;
}

.vf-multiselect__label {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vf-multiselect__label_placeholder {
    color: var(--vf-multiselect-placeholder-color);
}

.vf-multiselect__chips {
    flex: 1 1 auto;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    overflow: hidden;
}

.vf-multiselect__chip {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background-color: var(--vf-multiselect-option-active-background-color);
    color: var(--vf-multiselect-option-active-text-color);
    font-size: 0.85em;
}

.vf-multiselect__chip-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 9rem;
}

.vf-multiselect__chip-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    cursor: pointer;
    line-height: 1;
}

.vf-multiselect__chip-remove:hover {
    background-color: var(--vf-multiselect-clear-hover-background-color);
}

.vf-multiselect__chevron {
    flex: 0 0 auto;
    font-size: var(--vf-multiselect-chevron-size);
    opacity: 0.7;
}

.vf-multiselect__clear {
    flex: 0 0 auto;
    width: var(--vf-multiselect-clear-size);
    height: var(--vf-multiselect-clear-size);
    margin-right: 0.35rem;
    padding: 0;
    border: none;
    border-radius: var(--vf-multiselect-clear-radius);
    background: transparent;
    color: inherit;
    font-size: 0.75rem;
    cursor: pointer;
}

.vf-multiselect__clear:hover {
    background-color: var(--vf-multiselect-clear-hover-background-color);
}

.vf-multiselect__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-multiselect-panel-padding);
    max-height: var(--vf-multiselect-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-multiselect-border-radius) + var(--vf-multiselect-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-multiselect-panel-border-color);
    background-color: var(--vf-multiselect-panel-background-color);
    box-shadow: var(--vf-multiselect-panel-shadow);
    color: var(--vf-multiselect-text-color);
}

.vf-multiselect__search {
    padding: var(--vf-multiselect-search-padding);
}

.vf-multiselect__search-control {
    width: 100%;
    border-radius: var(--vf-multiselect-search-border-radius);
    border: var(--vf-border-width) solid var(--vf-multiselect-search-border-color);
    background: transparent;
    color: inherit;
    padding: 0.35rem 0.45rem;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
}

.vf-multiselect__search-control:focus {
    border-color: var(--vf-multiselect-focus-border-color);
}

.vf-multiselect__option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-multiselect-option-padding);
    border-radius: var(--vf-multiselect-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.vf-multiselect__option:hover:not(.is-disabled),
.vf-multiselect__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-multiselect-option-hover-background-color);
    outline: none;
}

.vf-multiselect__option.is-highlighted:not(.is-disabled) {
    background-color: var(--vf-multiselect-option-highlighted-background-color);
}

.vf-multiselect__option.is-active {
    background-color: var(--vf-multiselect-option-active-background-color);
    color: var(--vf-multiselect-option-active-text-color);
}

.vf-multiselect__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-multiselect__option-check {
    font-size: 0.85em;
}

.vf-multiselect__empty {
    padding: var(--vf-multiselect-empty-padding);
    color: var(--vf-multiselect-empty-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-multiselect__loading {
    padding: var(--vf-multiselect-loading-padding);
    color: var(--vf-multiselect-loading-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-multiselect_open {
    border-color: var(--vf-multiselect-focus-border-color);
    box-shadow: var(--vf-multiselect-focus-ring-shadow);
}

.vf-multiselect:hover:not(.vf-multiselect_disabled) {
    border-color: var(--vf-multiselect-hover-border-color);
}

.vf-multiselect:focus-within:not(.vf-multiselect_disabled) {
    border-color: var(--vf-multiselect-focus-border-color);
}

.vf-multiselect_small {
    .vf-multiselect__control {
        padding: var(--vf-multiselect-small-padding);
        font-size: var(--vf-multiselect-small-font-size);
    }
}

.vf-multiselect_large {
    .vf-multiselect__control {
        padding: var(--vf-multiselect-large-padding);
        font-size: var(--vf-multiselect-large-font-size);
    }
}

.vf-multiselect_disabled {
    opacity: var(--vf-multiselect-disabled-opacity);
    cursor: not-allowed;

    .vf-multiselect__control {
        cursor: not-allowed;
    }
}
</style>
