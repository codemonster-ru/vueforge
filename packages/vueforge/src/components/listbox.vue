<template>
    <div :class="rootClass">
        <div
            ref="listRef"
            class="vf-listbox__list"
            role="listbox"
            :aria-label="ariaLabel"
            :aria-multiselectable="multiple ? true : undefined"
            :tabindex="disabled ? -1 : 0"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
        >
            <template v-if="flatEntries.length">
                <template v-for="(entry, index) in flatEntries" :key="entry.key">
                    <div v-if="entry.kind === 'group'" class="vf-listbox__group" role="group" :aria-label="entry.label">
                        <div class="vf-listbox__group-label">{{ entry.label }}</div>
                    </div>
                    <button
                        v-else
                        :id="entry.id"
                        type="button"
                        class="vf-listbox__option"
                        :class="{
                            'vf-listbox__option_selected': isSelected(entry.option.value),
                            'vf-listbox__option_highlighted': highlightedIndex === index,
                        }"
                        role="option"
                        :aria-selected="isSelected(entry.option.value)"
                        :disabled="disabled || !!entry.option.disabled"
                        @click="onOptionClick(entry.option, $event)"
                        @mousemove="highlightedIndex = index"
                    >
                        <slot
                            name="option"
                            :option="entry.option"
                            :selected="isSelected(entry.option.value)"
                            :highlighted="highlightedIndex === index"
                        >
                            {{ entry.option.label }}
                        </slot>
                    </button>
                </template>
            </template>
            <div v-else class="vf-listbox__empty">
                <slot name="empty">{{ emptyText }}</slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
export type ListboxValue = string | number;

export interface ListboxOption {
    label: string;
    value: ListboxValue;
    disabled?: boolean;
}

export interface ListboxOptionGroup {
    label: string;
    options: Array<ListboxOption>;
}

type ListboxOptions = Array<ListboxOption | ListboxOptionGroup>;
type ModelValue = ListboxValue | Array<ListboxValue> | undefined;

interface Props {
    modelValue?: ModelValue;
    options?: ListboxOptions;
    multiple?: boolean;
    disabled?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
    emptyText?: string;
}

type FlatGroupEntry = {
    key: string;
    kind: 'group';
    label: string;
};
type FlatOptionEntry = {
    key: string;
    kind: 'option';
    id: string;
    option: ListboxOption;
};
type FlatEntry = FlatGroupEntry | FlatOptionEntry;

let listboxIdSeed = 0;

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    multiple: false,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Listbox',
    emptyText: 'No options',
});
const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
defineSlots<{
    option?: (props: { option: ListboxOption; selected: boolean; highlighted: boolean }) => unknown;
    empty?: () => unknown;
}>();

const listRef = ref<HTMLElement | null>(null);
const highlightedIndex = ref(-1);
const rootId = `vf-listbox-${++listboxIdSeed}`;

const selectedValues = computed<Array<ListboxValue>>(() => {
    if (Array.isArray(props.modelValue)) {
        return props.modelValue;
    }
    if (props.modelValue == null) {
        return [];
    }

    return [props.modelValue];
});
const selectedSet = computed(() => new Set(selectedValues.value));

const isOptionGroup = (value: ListboxOption | ListboxOptionGroup): value is ListboxOptionGroup => {
    return 'options' in value;
};

const flatEntries = computed<Array<FlatEntry>>(() => {
    const entries: Array<FlatEntry> = [];
    let optionCounter = 0;

    props.options.forEach((item, groupIndex) => {
        if (isOptionGroup(item)) {
            entries.push({
                key: `group-${groupIndex}`,
                kind: 'group',
                label: item.label,
            });

            item.options.forEach(option => {
                optionCounter += 1;
                entries.push({
                    key: `option-${optionCounter}`,
                    kind: 'option',
                    id: `${rootId}-opt-${optionCounter}`,
                    option,
                });
            });

            return;
        }

        optionCounter += 1;
        entries.push({
            key: `option-${optionCounter}`,
            kind: 'option',
            id: `${rootId}-opt-${optionCounter}`,
            option: item,
        });
    });

    return entries;
});

const optionEntries = computed(() =>
    flatEntries.value.filter((entry): entry is FlatOptionEntry => entry.kind === 'option'),
);
const enabledOptionIndices = computed(() =>
    flatEntries.value.reduce<Array<number>>((acc, entry, index) => {
        if (entry.kind === 'option' && !entry.option.disabled) {
            acc.push(index);
        }

        return acc;
    }, []),
);

const rootClass = computed(() => {
    const classes = ['vf-listbox', `vf-listbox_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-listbox_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-listbox_disabled');
    }

    return classes;
});

const isSelected = (value: ListboxValue) => selectedSet.value.has(value);

const clampHighlightToEnabled = () => {
    if (!enabledOptionIndices.value.length) {
        highlightedIndex.value = -1;

        return;
    }

    if (!enabledOptionIndices.value.includes(highlightedIndex.value)) {
        highlightedIndex.value = enabledOptionIndices.value[0];
    }
};

watch(
    () => [props.options, props.disabled] as const,
    () => {
        clampHighlightToEnabled();
    },
    { deep: true, immediate: true },
);

const emitValue = (nextValue: ModelValue, option: ListboxOption, event: Event) => {
    emits('update:modelValue', nextValue);
    emits('change', nextValue, option, event);
};

const onOptionClick = (option: ListboxOption, event: Event) => {
    if (props.disabled || option.disabled) {
        return;
    }

    if (props.multiple) {
        const exists = selectedSet.value.has(option.value);
        const next = exists
            ? selectedValues.value.filter(value => value !== option.value)
            : [...selectedValues.value, option.value];

        emitValue(next, option, event);

        return;
    }

    const next = props.modelValue === option.value ? undefined : option.value;
    emitValue(next, option, event);
};

const moveHighlight = (step: 1 | -1) => {
    const enabled = enabledOptionIndices.value;

    if (!enabled.length) {
        highlightedIndex.value = -1;

        return;
    }

    const current = enabled.indexOf(highlightedIndex.value);
    const start = current === -1 ? (step > 0 ? -1 : enabled.length) : current;
    const next = (start + step + enabled.length) % enabled.length;
    highlightedIndex.value = enabled[next];
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveHighlight(1);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveHighlight(-1);

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        highlightedIndex.value = enabledOptionIndices.value[0] ?? -1;

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        highlightedIndex.value = enabledOptionIndices.value.at(-1) ?? -1;

        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const entry = flatEntries.value[highlightedIndex.value];

        if (entry?.kind === 'option') {
            onOptionClick(entry.option, event);
        }
    }
};

const onFocus = (event: FocusEvent) => {
    clampHighlightToEnabled();
    emits('focus', event);
};

const onBlur = (event: FocusEvent) => {
    emits('blur', event);
};

defineExpose({
    focus: () => listRef.value?.focus(),
    blur: () => listRef.value?.blur(),
    selectAll: () => {
        if (!props.multiple || props.disabled) {
            return;
        }

        const allEnabledValues = optionEntries.value
            .filter(option => !option.option.disabled)
            .map(option => option.option.value);
        emits('update:modelValue', allEnabledValues);
        emits('change', allEnabledValues, null, null);
    },
    clearSelection: () => {
        const next = props.multiple ? [] : undefined;
        emits('update:modelValue', next);
        emits('change', next, null, null);
    },
});
</script>

<style lang="scss">
.vf-listbox {
    display: block;
}

.vf-listbox__list {
    border: var(--vf-border-width) solid var(--vf-listbox-border-color);
    border-radius: var(--vf-listbox-border-radius);
    background: var(--vf-listbox-background-color);
    color: var(--vf-listbox-text-color);
    padding: var(--vf-listbox-padding);
    min-height: var(--vf-listbox-min-height);
    max-height: var(--vf-listbox-max-height);
    overflow: auto;
    outline: none;
}

.vf-listbox__list:focus-visible {
    box-shadow: var(--vf-listbox-focus-ring-shadow);
    border-color: var(--vf-listbox-focus-border-color);
}

.vf-listbox__group {
    padding-top: var(--vf-listbox-group-gap-top);
}

.vf-listbox__group-label {
    padding: var(--vf-listbox-group-label-padding);
    color: var(--vf-listbox-group-label-color);
    font-size: var(--vf-listbox-group-label-font-size);
    font-weight: 600;
}

.vf-listbox__option {
    width: 100%;
    text-align: left;
    border: 0;
    border-radius: var(--vf-listbox-option-border-radius);
    background: transparent;
    color: inherit;
    padding: var(--vf-listbox-option-padding);
}

.vf-listbox__option_highlighted {
    background: var(--vf-listbox-option-highlighted-background-color);
}

.vf-listbox__option_selected {
    background: var(--vf-listbox-option-selected-background-color);
    color: var(--vf-listbox-option-selected-text-color);
}

.vf-listbox__empty {
    padding: var(--vf-listbox-empty-padding);
    color: var(--vf-listbox-empty-color);
    text-align: center;
}

.vf-listbox_disabled {
    opacity: var(--vf-listbox-disabled-opacity);
}

.vf-listbox_small .vf-listbox__option {
    padding: var(--vf-listbox-small-option-padding);
    font-size: var(--vf-listbox-small-font-size);
}

.vf-listbox_large .vf-listbox__option {
    padding: var(--vf-listbox-large-option-padding);
    font-size: var(--vf-listbox-large-font-size);
}
</style>
