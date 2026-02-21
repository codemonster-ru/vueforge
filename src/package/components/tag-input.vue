<template>
    <div ref="root" :class="getClass" @click="focusInput">
        <div class="vf-tag-input__tags">
            <span v-for="(tag, index) in selectedValues" :key="`${String(tag)}-${index}`" class="vf-tag-input__tag">
                <span class="vf-tag-input__tag-label">{{ getTagLabel(tag) }}</span>
                <button
                    class="vf-tag-input__tag-remove"
                    type="button"
                    :disabled="disabled || readonly"
                    :aria-label="`Remove ${getTagLabel(tag)}`"
                    @click.stop="removeTagByIndex(index)"
                >
                    &times;
                </button>
            </span>
            <input
                ref="control"
                class="vf-tag-input__control"
                type="text"
                role="combobox"
                :value="query"
                :placeholder="selectedValues.length === 0 ? placeholder : ''"
                :disabled="disabled"
                :readonly="readonly"
                :aria-expanded="open"
                aria-autocomplete="list"
                :aria-controls="panelId"
                :aria-activedescendant="activeDescendantId"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter.prevent="onEnter"
                @keydown.esc.prevent="close"
                @keydown.tab="onTab"
                @keydown.backspace="onBackspace"
                @keydown="onKeydown"
            />
        </div>
        <button
            v-if="clearable && selectedValues.length > 0 && !disabled && !readonly"
            class="vf-tag-input__clear"
            type="button"
            aria-label="Clear tags"
            @click.stop="clearTags"
        >
            &#10005;
        </button>
        <button
            class="vf-tag-input__chevron"
            type="button"
            :disabled="disabled || readonly"
            aria-hidden="true"
            tabindex="-1"
            @mousedown.prevent
            @click.stop="togglePanel"
        >
            &#9662;
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-tag-input__panel"
                role="listbox"
                :data-placement="currentPlacement"
            >
                <div v-if="loading" class="vf-tag-input__loading">{{ loadingText }}</div>
                <template v-else-if="filteredOptions.length > 0">
                    <button
                        v-for="(option, index) in filteredOptions"
                        :id="getOptionId(index)"
                        :key="option.value"
                        class="vf-tag-input__option"
                        :class="{
                            'is-disabled': option.disabled,
                            'is-highlighted': index === highlightedIndex,
                        }"
                        type="button"
                        role="option"
                        :disabled="option.disabled"
                        @mousedown.prevent
                        @click="addFromOption(option)"
                    >
                        {{ option.label }}
                    </button>
                </template>
                <div v-else class="vf-tag-input__empty">{{ emptyText }}</div>
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

type RejectReason = 'duplicate' | 'maxTags' | 'invalid' | 'readonly';
type RejectPayload = {
    reason: RejectReason;
    value: string;
};

let tagInputIdCounter = 0;

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
    disabled?: boolean;
    readonly?: boolean;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    filter?: boolean;
    allowCustom?: boolean;
    maxTags?: number;
    clearable?: boolean;
    variant?: Variant;
    size?: Size;
    validateTag?: (value: string) => boolean;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'search', 'add', 'remove', 'reject']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
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
    allowCustom: true,
    maxTags: undefined,
    clearable: false,
    variant: 'filled',
    size: 'normal',
    validateTag: undefined,
});

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLInputElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const query = ref('');
const open = ref(false);
const highlightedIndex = ref(-1);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-tag-input-panel-${++tagInputIdCounter}`;
let floater: FloaterInstance = null;

const selectedValues = computed<Array<OptionValue>>(() => {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const normalizedOptions = computed(() => {
    return props.options.map(option => {
        return {
            label: option[props.optionLabel as keyof OptionItem] as string,
            value: option[props.optionValue as keyof OptionItem] as OptionValue,
            disabled: option.disabled,
        };
    });
});

const selectedValueSet = computed(() => {
    return new Set(selectedValues.value.map(value => String(value)));
});

const filteredOptions = computed(() => {
    const available = normalizedOptions.value.filter(option => !selectedValueSet.value.has(String(option.value)));

    if (!props.filter) {
        return available;
    }

    const search = query.value.trim().toLowerCase();

    if (!search) {
        return available;
    }

    return available.filter(option => option.label.toLowerCase().includes(search));
});

const optionLabelMap = computed(() => {
    return new Map(normalizedOptions.value.map(option => [String(option.value), option.label]));
});

const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0) {
        return undefined;
    }

    return getOptionId(highlightedIndex.value);
});

const getClass = computed(() => {
    const classes = ['vf-tag-input', `vf-tag-input_${props.variant}`, open.value ? 'vf-tag-input_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-tag-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-tag-input_disabled');
    }

    return classes.filter(Boolean);
});

const getOptionId = (index: number) => `${panelId}-option-${index}`;
const firstEnabledIndex = () => filteredOptions.value.findIndex(option => !option.disabled);

const getTagLabel = (value: OptionValue) => optionLabelMap.value.get(String(value)) ?? String(value);

const emitValue = (nextValue: Array<OptionValue>) => {
    emits('update:modelValue', nextValue);
    emits('change', nextValue);
};

const emitReject = (reason: RejectReason, value: string) => {
    const payload: RejectPayload = { reason, value };

    emits('reject', payload);
};

const canAddTag = (value: string) => {
    if (props.readonly) {
        emitReject('readonly', value);

        return false;
    }

    if (!value) {
        return false;
    }

    if (selectedValueSet.value.has(value)) {
        emitReject('duplicate', value);

        return false;
    }

    if (typeof props.maxTags === 'number' && selectedValues.value.length >= props.maxTags) {
        emitReject('maxTags', value);

        return false;
    }

    if (props.validateTag && !props.validateTag(value)) {
        emitReject('invalid', value);

        return false;
    }

    return true;
};

const addTag = (value: OptionValue, source: 'option' | 'custom') => {
    const normalizedValue = typeof value === 'string' ? value.trim() : String(value);

    if (!canAddTag(normalizedValue)) {
        return false;
    }

    emitValue([...selectedValues.value, value]);
    emits('add', { value, source });

    query.value = '';
    highlightedIndex.value = firstEnabledIndex();

    return true;
};

const addFromOption = (option: { value: OptionValue; disabled?: boolean }) => {
    if (option.disabled || props.readonly) {
        return;
    }

    addTag(option.value, 'option');
};

const addFromQuery = () => {
    if (!props.allowCustom) {
        return false;
    }

    const value = query.value.trim();

    if (!value) {
        return false;
    }

    return addTag(value, 'custom');
};

const removeTagByIndex = (index: number) => {
    if (props.readonly) {
        return;
    }

    const target = selectedValues.value[index];

    if (target === undefined) {
        return;
    }

    const nextValue = selectedValues.value.filter((_item, itemIndex) => itemIndex !== index);

    emitValue(nextValue);
    emits('remove', target);
};

const clearTags = () => {
    if (props.readonly) {
        return;
    }

    if (selectedValues.value.length === 0) {
        return;
    }

    emitValue([]);
    emits('remove', [...selectedValues.value]);
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
    focusInput();
};

const focusInput = () => {
    control.value?.focus();
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
    if (open.value) {
        const option = filteredOptions.value[highlightedIndex.value];

        if (option && !option.disabled) {
            addFromOption(option);

            return;
        }
    }

    addFromQuery();
};

const onTab = () => {
    addFromQuery();
};

const onBackspace = () => {
    if (query.value || props.readonly || selectedValues.value.length === 0) {
        return;
    }

    removeTagByIndex(selectedValues.value.length - 1);
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== ',') {
        return;
    }

    event.preventDefault();

    void addFromQuery();
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
    if (!root.value || !panel.value) {
        return;
    }

    const reference = root.value;
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
.vf-tag-input {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-width: var(--vf-taginput-min-width);
    min-height: var(--vf-taginput-min-height);
    box-sizing: border-box;
    gap: var(--vf-taginput-control-gap);
    padding: var(--vf-taginput-padding);
    border-radius: var(--vf-taginput-border-radius);
    border: var(--vf-border-width) solid var(--vf-taginput-border-color);
    background-color: var(--vf-taginput-background-color);
    color: var(--vf-taginput-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-tag-input_outlined {
    background-color: transparent;
}

.vf-tag-input__tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-taginput-chip-gap);
    flex: 1 1 auto;
    min-width: 0;
}

.vf-tag-input__tag {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    gap: 0.25rem;
    padding: var(--vf-taginput-chip-padding);
    border-radius: var(--vf-taginput-chip-radius);
    background-color: var(--vf-taginput-chip-background-color);
    color: var(--vf-taginput-chip-text-color);
    font-size: var(--vf-taginput-chip-font-size);
    line-height: 1.2;
}

.vf-tag-input__tag-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vf-tag-input__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-taginput-chip-remove-size);
    height: var(--vf-taginput-chip-remove-size);
    border: none;
    border-radius: var(--vf-taginput-chip-remove-radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 0;
    font-size: 0.9em;
}

.vf-tag-input__tag-remove:hover {
    background-color: var(--vf-taginput-chip-remove-hover-background-color);
}

.vf-tag-input__control {
    min-width: var(--vf-taginput-input-min-width);
    flex: 1 1 5rem;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-taginput-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    padding: 0;
    margin: 0;

    &::placeholder {
        color: var(--vf-taginput-placeholder-color);
    }
}

.vf-tag-input__chevron {
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: var(--vf-taginput-chevron-size);
    opacity: 0.7;
    cursor: pointer;
}

.vf-tag-input__clear {
    width: var(--vf-taginput-clear-size);
    height: var(--vf-taginput-clear-size);
    border: none;
    border-radius: var(--vf-taginput-clear-radius);
    padding: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
}

.vf-tag-input__clear:hover {
    background-color: var(--vf-taginput-clear-hover-background-color);
}

.vf-tag-input__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-taginput-panel-padding);
    max-height: var(--vf-taginput-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-taginput-border-radius) + var(--vf-taginput-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-taginput-panel-border-color);
    background-color: var(--vf-taginput-panel-background-color);
    box-shadow: var(--vf-taginput-panel-shadow);
    color: var(--vf-taginput-text-color);
}

.vf-tag-input__option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-taginput-option-padding);
    border-radius: var(--vf-taginput-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-tag-input__option:hover:not(.is-disabled),
.vf-tag-input__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-taginput-option-hover-background-color);
    outline: none;
}

.vf-tag-input__option.is-highlighted:not(.is-disabled) {
    background-color: var(--vf-taginput-option-highlighted-background-color);
}

.vf-tag-input__option.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-tag-input__empty {
    padding: var(--vf-taginput-empty-padding);
    color: var(--vf-taginput-empty-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-tag-input__loading {
    padding: var(--vf-taginput-loading-padding);
    color: var(--vf-taginput-loading-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
}

.vf-tag-input_open {
    border-color: var(--vf-taginput-focus-border-color);
    box-shadow: var(--vf-taginput-focus-ring-shadow);
}

.vf-tag-input:hover:not(.vf-tag-input_disabled) {
    border-color: var(--vf-taginput-hover-border-color);
}

.vf-tag-input:focus-within:not(.vf-tag-input_disabled) {
    border-color: var(--vf-taginput-focus-border-color);
}

.vf-tag-input_small {
    padding: var(--vf-taginput-small-padding);

    .vf-tag-input__control {
        font-size: var(--vf-taginput-small-font-size);
    }

    .vf-tag-input__tag {
        padding: var(--vf-taginput-small-chip-padding);
        font-size: var(--vf-taginput-small-chip-font-size);
    }
}

.vf-tag-input_large {
    padding: var(--vf-taginput-large-padding);

    .vf-tag-input__control {
        font-size: var(--vf-taginput-large-font-size);
    }

    .vf-tag-input__tag {
        padding: var(--vf-taginput-large-chip-padding);
        font-size: var(--vf-taginput-large-chip-font-size);
    }
}

.vf-tag-input_disabled {
    opacity: var(--vf-taginput-disabled-opacity);
    cursor: not-allowed;

    .vf-tag-input__chevron,
    .vf-tag-input__control,
    .vf-tag-input__tag-remove,
    .vf-tag-input__clear {
        cursor: not-allowed;
    }
}
</style>
