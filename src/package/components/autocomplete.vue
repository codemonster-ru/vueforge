<template>
    <div ref="root" :class="getClass">
        <div class="vf-autocomplete__input-wrap">
            <span v-if="multiple && selectedOptions.length > 0" class="vf-autocomplete__chips">
                <span v-for="option in selectedOptions" :key="option.value" class="vf-autocomplete__chip">
                    <span class="vf-autocomplete__chip-label">{{ option.label }}</span>
                    <button
                        v-if="!disabled && !readonly"
                        type="button"
                        class="vf-autocomplete__chip-remove"
                        :aria-label="removeChipLabel"
                        @mousedown.prevent.stop
                        @click.stop="removeOption(option.value)"
                    >
                        x
                    </button>
                </span>
            </span>
            <input
                ref="control"
                class="vf-autocomplete__control"
                type="text"
                role="combobox"
                :value="query"
                :placeholder="resolvedPlaceholder"
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
                @keydown.backspace="onBackspace"
                @keydown.tab="close"
            />
        </div>
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
                @scroll.passive="onPanelScroll"
            >
                <div v-if="loading" class="vf-autocomplete__loading">{{ resolvedLoadingText }}</div>
                <template v-else-if="flatFilteredOptions.length > 0">
                    <template v-if="shouldUseVirtual">
                        <div class="vf-autocomplete__virtual-spacer" :style="virtualSpacerStyle">
                            <button
                                v-for="renderedOption in renderedOptions"
                                :id="getOptionId(renderedOption.index)"
                                :key="renderedOption.option.value"
                                class="vf-autocomplete__option"
                                :class="{
                                    'is-active': isActive(renderedOption.option),
                                    'is-disabled': renderedOption.option.disabled,
                                    'is-highlighted': renderedOption.index === highlightedIndex,
                                }"
                                type="button"
                                role="option"
                                :disabled="renderedOption.option.disabled"
                                :aria-selected="isActive(renderedOption.option)"
                                @mousedown.prevent
                                @mouseenter="highlightedIndex = renderedOption.index"
                                @click="selectOption(renderedOption.option)"
                            >
                                {{ renderedOption.option.label }}
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="group in displayGroups" :key="group.key" class="vf-autocomplete__group">
                            <div v-if="group.label" class="vf-autocomplete__group-label">{{ group.label }}</div>
                            <button
                                v-for="option in group.options"
                                :id="getOptionId(option.flatIndex)"
                                :key="option.value"
                                class="vf-autocomplete__option"
                                :class="{
                                    'is-active': isActive(option),
                                    'is-disabled': option.disabled,
                                    'is-highlighted': option.flatIndex === highlightedIndex,
                                }"
                                type="button"
                                role="option"
                                :disabled="option.disabled"
                                :aria-selected="isActive(option)"
                                @mousedown.prevent
                                @mouseenter="highlightedIndex = option.flatIndex"
                                @click="selectOption(option)"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </template>
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
    label?: string;
    value?: OptionValue;
    disabled?: boolean;
    [key: string]: unknown;
}

interface OptionGroupItem {
    label?: string;
    items?: Array<OptionItem>;
    [key: string]: unknown;
}

interface NormalizedOption {
    label: string;
    value: OptionValue;
    disabled?: boolean;
    groupLabel?: string;
    flatIndex: number;
}

interface OptionGroup {
    key: string;
    label: string;
    options: Array<NormalizedOption>;
}

interface Props {
    modelValue?: OptionValue | Array<OptionValue>;
    options?: Array<OptionItem | OptionGroupItem>;
    optionLabel?: string;
    optionValue?: string;
    optionGroupLabel?: string;
    optionGroupChildren?: string;
    grouped?: boolean;
    groupBy?: string | ((option: OptionItem) => string);
    multiple?: boolean;
    removeChipLabel?: string;
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
    virtual?: boolean;
    virtualItemHeight?: number;
    virtualOverscan?: number;
    virtualThreshold?: number;
    loadMoreOffset?: number;
    variant?: Variant;
    size?: Size;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'search', 'loadMore']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    optionLabel: 'label',
    optionValue: 'value',
    optionGroupLabel: 'label',
    optionGroupChildren: 'items',
    grouped: false,
    groupBy: undefined,
    multiple: false,
    removeChipLabel: 'Remove item',
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
const control = ref<HTMLInputElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const query = ref('');
const highlightedIndex = ref(-1);
const panelScrollTop = ref(0);
const panelViewportHeight = ref(0);
const basePlacement = ref<'bottom' | 'top'>('bottom');
const currentPlacement = ref<'bottom' | 'top'>('bottom');
const panelId = `vf-autocomplete-panel-${++autocompleteIdCounter}`;
let floater: FloaterInstance = null;
const localeText = useLocaleText();
const lastLoadMoreKey = ref('');
const resolvedLoadingText = computed(() => props.loadingText ?? localeText.autocomplete.loadingText);
const resolvedEmptyText = computed(() => props.emptyText ?? localeText.autocomplete.emptyText);
const resolvedPlaceholder = computed(() => {
    if (props.multiple && selectedOptions.value.length > 0) {
        return '';
    }

    return props.placeholder;
});

const toNormalizedOption = (option: OptionItem, groupLabel = '', flatIndex = -1): NormalizedOption => ({
    label: String(option[props.optionLabel] ?? ''),
    value: option[props.optionValue] as OptionValue,
    disabled: Boolean(option.disabled),
    groupLabel,
    flatIndex,
});

const groupedOptions = computed<Array<OptionGroup>>(() => {
    if (props.grouped) {
        let flatIndex = 0;
        const groups: Array<OptionGroup> = [];

        props.options.forEach((group, groupIndex) => {
            const groupItem = group as OptionGroupItem;
            const label = String(groupItem[props.optionGroupLabel] ?? '');
            const children = (groupItem[props.optionGroupChildren] as Array<OptionItem>) ?? [];
            const options = children.map(child => {
                const normalized = toNormalizedOption(child, label, flatIndex);
                flatIndex += 1;
                return normalized;
            });

            groups.push({
                key: `${label || 'group'}-${groupIndex}`,
                label,
                options,
            });
        });

        return groups;
    }

    const normalized = (props.options as Array<OptionItem>).map((option, index) =>
        toNormalizedOption(option, '', index),
    );

    if (!props.groupBy) {
        return [
            {
                key: 'default',
                label: '',
                options: normalized,
            },
        ];
    }

    const map = new Map<string, Array<NormalizedOption>>();
    normalized.forEach(option => {
        const source = props.options[option.flatIndex] as OptionItem;
        const label =
            typeof props.groupBy === 'function'
                ? props.groupBy(source)
                : String(source[props.groupBy as keyof OptionItem] ?? 'Other');
        const key = label || 'Other';
        const bucket = map.get(key) ?? [];
        bucket.push({
            ...option,
            groupLabel: key,
        });
        map.set(key, bucket);
    });

    return Array.from(map.entries()).map(([label, options], index) => ({
        key: `${label}-${index}`,
        label,
        options,
    }));
});

const displayGroups = computed<Array<OptionGroup>>(() => {
    const source = groupedOptions.value;
    if (!props.filter) {
        return source;
    }

    const search = query.value.trim().toLowerCase();
    if (!search) {
        return source;
    }

    return source
        .map(group => ({
            ...group,
            options: group.options.filter(option => option.label.toLowerCase().includes(search)),
        }))
        .filter(group => group.options.length > 0);
});

const flatFilteredOptions = computed(() => displayGroups.value.flatMap(group => group.options));

const selectedValues = computed<Array<OptionValue>>(() => {
    if (!props.multiple) {
        return [];
    }

    return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const allNormalizedOptions = computed(() => groupedOptions.value.flatMap(group => group.options));

const selectedOptions = computed(() => {
    if (props.multiple) {
        const values = new Set(selectedValues.value);
        return allNormalizedOptions.value.filter(option => values.has(option.value));
    }

    const target = props.modelValue as OptionValue | undefined;
    if (target === undefined) {
        return [];
    }

    const selected = allNormalizedOptions.value.find(option => option.value === target);
    return selected ? [selected] : [];
});

const shouldUseVirtual = computed(
    () =>
        props.virtual && !props.grouped && !props.groupBy && flatFilteredOptions.value.length >= props.virtualThreshold,
);
const virtualRange = computed(() => {
    const total = flatFilteredOptions.value.length;

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
    const options = flatFilteredOptions.value.slice(start, end);

    return options.map((option, localIndex) => ({
        option,
        index: start + localIndex,
    }));
});
const virtualSpacerStyle = computed(() => {
    if (!shouldUseVirtual.value) {
        return undefined;
    }

    const total = flatFilteredOptions.value.length;
    const { start, end } = virtualRange.value;
    const itemHeight = Math.max(1, props.virtualItemHeight);

    return {
        paddingTop: `${start * itemHeight}px`,
        paddingBottom: `${Math.max(0, total - end) * itemHeight}px`,
    };
});

const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0) {
        return undefined;
    }

    return getOptionId(highlightedIndex.value);
});

const getClass = computed(() => {
    const classes = [
        'vf-autocomplete',
        `vf-autocomplete_${props.variant}`,
        props.multiple ? 'vf-autocomplete_multiple' : '',
        open.value ? 'vf-autocomplete_open' : '',
    ];

    if (props.size !== 'normal') {
        classes.push(`vf-autocomplete_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-autocomplete_disabled');
    }

    return classes.filter(Boolean);
});

const getOptionId = (index: number) => `${panelId}-option-${index}`;
const isActive = (option: { value: OptionValue }) =>
    props.multiple ? selectedValues.value.includes(option.value) : option.value === props.modelValue;
const firstEnabledIndex = () => flatFilteredOptions.value.findIndex(option => !option.disabled);

const emitValue = (value: OptionValue | Array<OptionValue> | undefined) => {
    emits('update:modelValue', value);
    emits('change', value);
};

const highlightByStep = (step: number) => {
    const options = flatFilteredOptions.value;

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
            ensureOptionVisible(index);

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
    panelScrollTop.value = 0;
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

const removeOption = (value: OptionValue) => {
    if (!props.multiple || props.disabled || props.readonly) {
        return;
    }

    emitValue(selectedValues.value.filter(item => item !== value));
};

const selectOption = (option: { value: OptionValue; label: string; disabled?: boolean }) => {
    if (option.disabled) {
        return;
    }

    if (props.multiple) {
        const next = selectedValues.value.includes(option.value)
            ? selectedValues.value.filter(item => item !== option.value)
            : [...selectedValues.value, option.value];
        emitValue(next);
        query.value = '';
        openPanel();
        highlightedIndex.value = firstEnabledIndex();

        return;
    }

    query.value = option.label;
    emitValue(option.value);
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

const onBackspace = () => {
    if (!props.multiple || props.disabled || props.readonly) {
        return;
    }

    if (query.value.length > 0 || selectedValues.value.length === 0) {
        return;
    }

    const next = [...selectedValues.value];
    next.pop();
    emitValue(next);
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

    const option = flatFilteredOptions.value[highlightedIndex.value];

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
    const total = flatFilteredOptions.value.length;

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

    const total = flatFilteredOptions.value.length;
    if (total === 0) {
        return;
    }

    const lastVisible = getLastVisibleIndex();
    if (lastVisible < total - 1 - props.loadMoreOffset) {
        return;
    }

    const key = `${query.value}|${total}`;
    if (lastLoadMoreKey.value === key) {
        return;
    }

    lastLoadMoreKey.value = key;
    emits('loadMore', {
        query: query.value,
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

watch(
    () => props.modelValue,
    () => {
        if (props.multiple) {
            return;
        }

        query.value = selectedOptions.value[0]?.label ?? '';
    },
    { immediate: true },
);

watch(
    () => props.options,
    () => {
        if (!open.value && !props.multiple) {
            query.value = selectedOptions.value[0]?.label ?? '';
        }

        void floater?.update();
    },
    { deep: true },
);

watch(flatFilteredOptions, () => {
    if (highlightedIndex.value >= flatFilteredOptions.value.length) {
        highlightedIndex.value = firstEnabledIndex();
    }
    maybeEmitLoadMore();
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
    syncPanelMetrics();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});
watch(
    () => [query.value, flatFilteredOptions.value.length],
    () => {
        lastLoadMoreKey.value = '';
        syncPanelMetrics();
        maybeEmitLoadMore();
    },
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
.vf-autocomplete {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: var(--vf-autocomplete-min-width);
    min-height: var(--vf-controls-height);
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

.vf-autocomplete__input-wrap {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-autocomplete-chip-gap, 0.35rem);
    flex: 1;
}

.vf-autocomplete__control {
    flex: 1;
    width: 100%;
    min-width: 2.5rem;
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

.vf-autocomplete__chips {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-autocomplete-chip-gap, 0.35rem);
}

.vf-autocomplete__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--vf-autocomplete-chip-padding, 0.15rem 0.4rem);
    border-radius: var(--vf-autocomplete-chip-radius, var(--vf-radii-sm));
    background-color: var(--vf-autocomplete-chip-background-color, rgba(var(--vf-blue-600-rgb), 0.12));
    color: var(--vf-autocomplete-chip-text-color, var(--vf-text-color));
    font-size: var(--vf-autocomplete-chip-font-size, 0.8125rem);
}

.vf-autocomplete__chip-remove {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: inherit;
    line-height: 1;
    padding: 0;
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

.vf-autocomplete__group {
    display: grid;
    gap: 0.1rem;
}

.vf-autocomplete__group + .vf-autocomplete__group {
    margin-top: 0.25rem;
}

.vf-autocomplete__group-label {
    padding: var(--vf-autocomplete-group-label-padding, 0.25rem 0.6rem);
    color: var(--vf-autocomplete-group-label-color, var(--vf-secondary-text-color));
    font-size: var(--vf-autocomplete-group-label-font-size, 0.75rem);
    font-weight: var(--vf-autocomplete-group-label-font-weight, 600);
    text-transform: uppercase;
    letter-spacing: 0.02em;
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

.vf-autocomplete__virtual-spacer {
    display: grid;
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
