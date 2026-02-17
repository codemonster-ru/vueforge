<template>
    <div ref="root" :class="getClass">
        <input
            ref="control"
            class="vf-combobox__control"
            type="text"
            role="combobox"
            :value="query"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :aria-expanded="open"
            aria-autocomplete="list"
            :aria-controls="panelId"
            :aria-activedescendant="activeDescendantId"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @click="openPanel"
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
            @keydown.enter.prevent="onEnter"
            @keydown.esc.prevent="close"
            @keydown.tab="close"
        />
        <button
            v-if="clearable && query.length > 0 && !disabled && !readonly"
            class="vf-combobox__clear"
            type="button"
            aria-label="Clear value"
            @mousedown.prevent
            @click="clearValue"
        >
            &#10005;
        </button>
        <button
            class="vf-combobox__chevron"
            type="button"
            :disabled="disabled"
            aria-hidden="true"
            tabindex="-1"
            @mousedown.prevent
            @click="togglePanel"
        >
            &#9662;
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-combobox__panel"
                role="listbox"
                :data-placement="currentPlacement"
            >
                <div v-if="loading" class="vf-combobox__loading">{{ loadingText }}</div>
                <template v-else-if="filteredOptions.length > 0">
                    <button
                        v-for="(option, index) in filteredOptions"
                        :id="getOptionId(index)"
                        :key="option.value"
                        class="vf-combobox__option"
                        :class="{
                            'is-active': isActive(option),
                            'is-disabled': option.disabled,
                            'is-highlighted': index === highlightedIndex,
                        }"
                        type="button"
                        role="option"
                        :disabled="option.disabled"
                        :aria-selected="isActive(option)"
                        @mousedown.prevent
                        @click="selectOption(option)"
                    >
                        {{ option.label }}
                    </button>
                </template>
                <div v-else class="vf-combobox__empty">{{ emptyText }}</div>
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

let comboboxIdCounter = 0;

interface OptionItem {
    label: string;
    value: OptionValue;
    disabled?: boolean;
}

interface Props {
    modelValue?: OptionValue;
    inputValue?: string;
    options?: Array<OptionItem>;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    filter?: boolean;
    strict?: boolean;
    allowCreate?: boolean;
    clearable?: boolean;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'update:inputValue', 'change', 'focus', 'blur', 'search', 'create']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    inputValue: undefined,
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: '',
    disabled: false,
    readonly: false,
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No results',
    filter: true,
    strict: true,
    allowCreate: false,
    clearable: false,
    variant: 'filled',
    size: 'normal',
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLInputElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const query = ref('');
const highlightedIndex = ref(-1);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-combobox-panel-${++comboboxIdCounter}`;
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

const selectedOption = computed(() => {
    return normalizedOptions.value.find(option => option.value === props.modelValue);
});

const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const filteredOptions = computed(() => {
    if (!props.filter) {
        return normalizedOptions.value;
    }

    if (!normalizedQuery.value) {
        return normalizedOptions.value;
    }

    return normalizedOptions.value.filter(option => option.label.toLowerCase().includes(normalizedQuery.value));
});

const hasExactOptionMatch = computed(() => {
    if (!normalizedQuery.value) {
        return false;
    }

    return normalizedOptions.value.some(
        option => option.label.toLowerCase() === normalizedQuery.value && !option.disabled,
    );
});

const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0) {
        return undefined;
    }

    return getOptionId(highlightedIndex.value);
});

const canCommitCustom = computed(() => {
    return !props.strict || props.allowCreate;
});

const getClass = computed(() => {
    const classes = ['vf-combobox', `vf-combobox_${props.variant}`, open.value ? 'vf-combobox_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-combobox_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-combobox_disabled');
    }

    return classes.filter(Boolean);
});

const getOptionId = (index: number) => `${panelId}-option-${index}`;
const isActive = (option: { value: OptionValue }) => option.value === props.modelValue;
const firstEnabledIndex = () => filteredOptions.value.findIndex(option => !option.disabled);

const emitInputValue = (value: string) => {
    emits('update:inputValue', value);
};

const emitSelection = (value: OptionValue) => {
    emits('update:modelValue', value);
    emits('change', value);
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

const openPanel = () => {
    if (props.disabled) {
        return;
    }

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';

    if (highlightedIndex.value < 0) {
        highlightedIndex.value = firstEnabledIndex();
    }
};

const close = () => {
    open.value = false;
    highlightedIndex.value = -1;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};

const togglePanel = () => {
    if (open.value) {
        close();

        return;
    }

    openPanel();
};

const commitQueryToSelection = () => {
    const value = query.value.trim();

    if (!value || !canCommitCustom.value) {
        return false;
    }

    if (props.allowCreate && !hasExactOptionMatch.value) {
        emits('create', value);
    }

    emitSelection(value);
    emitInputValue(value);
    close();

    return true;
};

const resetQueryFromSelection = () => {
    const nextQuery = selectedOption.value?.label ?? '';

    query.value = nextQuery;

    emitInputValue(nextQuery);
};

const selectOption = (option: { value: OptionValue; label: string; disabled?: boolean }) => {
    if (option.disabled) {
        return;
    }

    query.value = option.label;

    emitInputValue(option.label);
    emitSelection(option.value);
    close();
};

const clearValue = () => {
    query.value = '';

    emitInputValue('');
    emits('update:modelValue', undefined);
    emits('change', undefined);
    close();
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    query.value = target.value;

    emitInputValue(target.value);
    emits('search', target.value);

    openPanel();

    highlightedIndex.value = firstEnabledIndex();
};

const onFocus = (event: FocusEvent) => {
    emits('focus', event);
    openPanel();
};

const onBlur = (event: FocusEvent) => {
    emits('blur', event);

    if (!props.strict) {
        return;
    }

    if (query.value.trim() === selectedOption.value?.label) {
        return;
    }

    resetQueryFromSelection();
};

const onArrowDown = () => {
    if (!open.value) {
        openPanel();

        return;
    }

    highlightByStep(1);
};

const onArrowUp = () => {
    if (!open.value) {
        openPanel();

        return;
    }

    highlightByStep(-1);
};

const onEnter = () => {
    if (!open.value) {
        openPanel();

        return;
    }

    const option = filteredOptions.value[highlightedIndex.value];

    if (option && !option.disabled) {
        selectOption(option);

        return;
    }

    if (commitQueryToSelection()) {
        return;
    }

    if (props.strict) {
        resetQueryFromSelection();
    }
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
    if (!control.value || !panel.value) {
        return;
    }

    const reference = control.value;
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
    () => props.inputValue,
    nextInputValue => {
        if (typeof nextInputValue === 'string') {
            query.value = nextInputValue;
        }
    },
    { immediate: true },
);

watch(
    () => props.modelValue,
    () => {
        if (typeof props.inputValue === 'string') {
            return;
        }

        query.value = selectedOption.value?.label ?? '';
    },
    { immediate: true },
);

watch(
    () => props.options,
    () => {
        if (!open.value && props.strict && typeof props.inputValue !== 'string') {
            query.value = selectedOption.value?.label ?? '';
        }

        void floater?.update();
    },
    { deep: true },
);

watch(filteredOptions, () => {
    if (highlightedIndex.value >= filteredOptions.value.length) {
        highlightedIndex.value = firstEnabledIndex();
    }
});

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
.vf-combobox {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: var(--vf-combobox-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    gap: var(--vf-combobox-control-gap);
    padding: var(--vf-combobox-padding);
    border-radius: var(--vf-combobox-border-radius);
    border: var(--vf-border-width) solid var(--vf-combobox-border-color);
    background-color: var(--vf-combobox-background-color);
    color: var(--vf-combobox-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-combobox_outlined {
    background-color: transparent;
}

.vf-combobox__control {
    flex: 1;
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-combobox-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;

    &::placeholder {
        color: var(--vf-combobox-placeholder-color);
    }
}

.vf-combobox__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: var(--vf-combobox-clear-size);
    height: var(--vf-combobox-clear-size);
    border-radius: var(--vf-combobox-clear-radius);
    background: transparent;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
}

.vf-combobox__clear:hover,
.vf-combobox__clear:focus-visible {
    background-color: var(--vf-combobox-clear-hover-background-color);
    outline: none;
}

.vf-combobox__chevron {
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: var(--vf-combobox-chevron-size);
    opacity: 0.7;
    cursor: pointer;
}

.vf-combobox__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-combobox-panel-padding);
    max-height: var(--vf-combobox-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-combobox-border-radius) + var(--vf-combobox-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-combobox-panel-border-color);
    background-color: var(--vf-combobox-panel-background-color);
    box-shadow: var(--vf-combobox-panel-shadow);
    color: var(--vf-combobox-text-color);
}

.vf-combobox__option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-combobox-option-padding);
    border-radius: var(--vf-combobox-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-combobox__option:hover:not(.is-disabled),
.vf-combobox__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-combobox-option-hover-background-color);
    outline: none;
}

.vf-combobox__option.is-highlighted:not(.is-disabled) {
    background-color: var(--vf-combobox-option-highlighted-background-color);
    outline: none;
}

.vf-combobox__option.is-active {
    background-color: var(--vf-combobox-option-active-background-color);
    color: var(--vf-combobox-option-active-text-color);
}

.vf-combobox__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-combobox__empty {
    padding: var(--vf-combobox-empty-padding);
    color: var(--vf-combobox-empty-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-combobox__loading {
    padding: var(--vf-combobox-loading-padding);
    color: var(--vf-combobox-loading-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-combobox_open {
    border-color: var(--vf-combobox-focus-border-color);
    box-shadow: var(--vf-combobox-focus-ring-shadow);
}

.vf-combobox:hover:not(.vf-combobox_disabled) {
    border-color: var(--vf-combobox-hover-border-color);
}

.vf-combobox:focus-within:not(.vf-combobox_disabled) {
    border-color: var(--vf-combobox-focus-border-color);
}

.vf-combobox_small {
    padding: var(--vf-combobox-small-padding);

    .vf-combobox__control {
        font-size: var(--vf-combobox-small-font-size);
    }
}

.vf-combobox_large {
    padding: var(--vf-combobox-large-padding);

    .vf-combobox__control {
        font-size: var(--vf-combobox-large-font-size);
    }
}

.vf-combobox_disabled {
    opacity: var(--vf-combobox-disabled-opacity);
    cursor: not-allowed;

    .vf-combobox__chevron {
        cursor: not-allowed;
    }
}
</style>
