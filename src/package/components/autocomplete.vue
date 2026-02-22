<template>
    <div ref="root" :class="getClass">
        <input
            ref="control"
            class="vf-autocomplete__control"
            type="text"
            role="combobox"
            :value="query"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
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
            class="vf-autocomplete__chevron"
            type="button"
            :disabled="disabled || readonly"
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
                class="vf-autocomplete__panel"
                role="listbox"
                :data-placement="currentPlacement"
            >
                <div v-if="loading" class="vf-autocomplete__loading">{{ resolvedLoadingText }}</div>
                <template v-else-if="filteredOptions.length > 0">
                    <button
                        v-for="(option, index) in filteredOptions"
                        :id="getOptionId(index)"
                        :key="option.value"
                        class="vf-autocomplete__option"
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
                <div v-else class="vf-autocomplete__empty">{{ resolvedEmptyText }}</div>
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
type OptionValue = string | number;

let autocompleteIdCounter = 0;

interface OptionItem {
    label: string;
    value: OptionValue;
    disabled?: boolean;
}

interface Props {
    modelValue?: OptionValue;
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
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'search']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    placeholder: '',
    disabled: false,
    readonly: false,
    loading: false,
    loadingText: undefined,
    emptyText: undefined,
    filter: true,
    ariaLabel: 'Autocomplete input',
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
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
const panelId = `vf-autocomplete-panel-${++autocompleteIdCounter}`;
let floater: FloaterInstance = null;
const localeText = useLocaleText();
const resolvedLoadingText = computed(() => props.loadingText ?? localeText.autocomplete.loadingText);
const resolvedEmptyText = computed(() => props.emptyText ?? localeText.autocomplete.emptyText);

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

const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0) {
        return undefined;
    }

    return getOptionId(highlightedIndex.value);
});

const getClass = computed(() => {
    const classes = ['vf-autocomplete', `vf-autocomplete_${props.variant}`, open.value ? 'vf-autocomplete_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-autocomplete_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-autocomplete_disabled');
    }

    return classes.filter(Boolean);
});

const getOptionId = (index: number) => `${panelId}-option-${index}`;
const isActive = (option: { value: OptionValue }) => option.value === props.modelValue;
const firstEnabledIndex = () => filteredOptions.value.findIndex(option => !option.disabled);

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
    if (props.disabled || props.readonly) {
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

const selectOption = (option: { value: OptionValue; label: string; disabled?: boolean }) => {
    if (option.disabled) {
        return;
    }

    query.value = option.label;

    emits('update:modelValue', option.value);
    emits('change', option.value);

    close();
};

const onInput = (event: Event) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const target = event.target as HTMLInputElement;

    query.value = target.value;

    emits('search', target.value);

    openPanel();

    highlightedIndex.value = firstEnabledIndex();
};

const onFocus = (event: FocusEvent) => {
    emits('focus', event);

    if (!props.readonly) {
        openPanel();
    }
};

const onBlur = (event: FocusEvent) => {
    emits('blur', event);
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
    () => props.modelValue,
    () => {
        query.value = selectedOption.value?.label ?? '';
    },
    { immediate: true },
);

watch(
    () => props.options,
    () => {
        if (!open.value) {
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
.vf-autocomplete {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: var(--vf-autocomplete-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    gap: var(--vf-autocomplete-control-gap);
    padding: var(--vf-autocomplete-padding);
    border-radius: var(--vf-autocomplete-border-radius);
    border: var(--vf-border-width) solid var(--vf-autocomplete-border-color);
    background-color: var(--vf-autocomplete-background-color);
    color: var(--vf-autocomplete-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-autocomplete_outlined {
    background-color: transparent;
}

.vf-autocomplete__control {
    flex: 1;
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-autocomplete-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;

    &::placeholder {
        color: var(--vf-autocomplete-placeholder-color);
    }
}

.vf-autocomplete__chevron {
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: var(--vf-autocomplete-chevron-size);
    opacity: 0.7;
    cursor: pointer;
}

.vf-autocomplete__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-autocomplete-panel-padding);
    max-height: var(--vf-autocomplete-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-autocomplete-border-radius) + var(--vf-autocomplete-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-autocomplete-panel-border-color);
    background-color: var(--vf-autocomplete-panel-background-color);
    box-shadow: var(--vf-autocomplete-panel-shadow);
    color: var(--vf-autocomplete-text-color);
}

.vf-autocomplete__option {
    width: 100%;
    text-align: start;
    border: none;
    background: transparent;
    padding: var(--vf-autocomplete-option-padding);
    border-radius: var(--vf-autocomplete-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-autocomplete__option:hover:not(.is-disabled),
.vf-autocomplete__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-autocomplete-option-hover-background-color);
    outline: none;
}

.vf-autocomplete__option.is-highlighted:not(.is-disabled) {
    background-color: var(--vf-autocomplete-option-highlighted-background-color);
    outline: none;
}

.vf-autocomplete__option.is-active {
    background-color: var(--vf-autocomplete-option-active-background-color);
    color: var(--vf-autocomplete-option-active-text-color);
}

.vf-autocomplete__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-autocomplete__empty {
    padding: var(--vf-autocomplete-empty-padding);
    color: var(--vf-autocomplete-empty-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-autocomplete__loading {
    padding: var(--vf-autocomplete-loading-padding);
    color: var(--vf-autocomplete-loading-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-autocomplete_open {
    border-color: var(--vf-autocomplete-focus-border-color);
    box-shadow: var(--vf-autocomplete-focus-ring-shadow);
}

.vf-autocomplete:hover:not(.vf-autocomplete_disabled) {
    border-color: var(--vf-autocomplete-hover-border-color);
}

.vf-autocomplete:focus-within:not(.vf-autocomplete_disabled) {
    border-color: var(--vf-autocomplete-focus-border-color);
}

.vf-autocomplete_small {
    padding: var(--vf-autocomplete-small-padding);

    .vf-autocomplete__control {
        font-size: var(--vf-autocomplete-small-font-size);
    }
}

.vf-autocomplete_large {
    padding: var(--vf-autocomplete-large-padding);

    .vf-autocomplete__control {
        font-size: var(--vf-autocomplete-large-font-size);
    }
}

.vf-autocomplete_disabled {
    opacity: var(--vf-autocomplete-disabled-opacity);
    cursor: not-allowed;

    .vf-autocomplete__chevron {
        cursor: not-allowed;
    }
}
</style>
