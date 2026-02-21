<template>
    <div ref="root" :class="getClass">
        <input
            :id="id"
            ref="control"
            class="vf-mention-input__control"
            type="text"
            :name="name"
            :value="modelValue"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :inputmode="inputmode"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            role="combobox"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
            :aria-expanded="open"
            :aria-controls="panelId"
            :aria-activedescendant="activeDescendantId"
            :aria-invalid="
                ariaInvalid === true || ariaInvalid === 'true' ? 'true' : ariaInvalid === 'false' ? 'false' : undefined
            "
            :aria-required="
                required
                    ? 'true'
                    : ariaRequired === true || ariaRequired === 'true'
                      ? 'true'
                      : ariaRequired === 'false'
                        ? 'false'
                        : undefined
            "
            aria-autocomplete="list"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
        />
        <div v-show="open" :id="panelId" class="vf-mention-input__panel" role="listbox">
            <div v-if="loading" class="vf-mention-input__loading">{{ loadingText }}</div>
            <template v-else-if="visibleOptions.length">
                <button
                    v-for="(option, index) in visibleOptions"
                    :id="getOptionId(index)"
                    :key="`${option.trigger ?? ''}-${String(option.value ?? option.label)}-${index}`"
                    class="vf-mention-input__option"
                    :class="{ 'is-highlighted': index === highlightedIndex }"
                    type="button"
                    role="option"
                    :aria-selected="index === highlightedIndex"
                    :disabled="option.disabled"
                    @mousedown.prevent
                    @click="selectOption(option)"
                >
                    <span class="vf-mention-input__option-trigger">{{ option.trigger ?? activeTrigger }}</span>
                    <span>{{ option.label }}</span>
                </button>
            </template>
            <div v-else class="vf-mention-input__empty">{{ emptyText }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface MentionOption {
    label: string;
    value?: string | number;
    trigger?: string;
    disabled?: boolean;
}

interface ActiveMention {
    trigger: string;
    query: string;
    start: number;
    end: number;
}

interface Props {
    modelValue?: string;
    suggestions?: Array<MentionOption>;
    triggers?: Array<string>;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    autocomplete?: string;
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    minQueryLength?: number;
    maxSuggestions?: number;
    appendSpace?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    ariaInvalid?: boolean | 'true' | 'false';
    ariaRequired?: boolean | 'true' | 'false';
}

let mentionInputIdCounter = 0;

const emits = defineEmits(['update:modelValue', 'input', 'change', 'search', 'insert', 'select', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    suggestions: () => [],
    triggers: () => ['@', '#'],
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    id: undefined,
    name: undefined,
    autocomplete: 'off',
    inputmode: 'text',
    loading: false,
    loadingText: 'Loading...',
    emptyText: 'No matches',
    minQueryLength: 1,
    maxSuggestions: 8,
    appendSpace: true,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Mention input',
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
    ariaInvalid: undefined,
    ariaRequired: undefined,
});

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLInputElement | null>(null);
const open = ref(false);
const highlightedIndex = ref(-1);
const panelId = `vf-mention-input-panel-${++mentionInputIdCounter}`;
const activeMention = ref<ActiveMention | null>(null);

const activeTrigger = computed(() => activeMention.value?.trigger ?? props.triggers[0] ?? '@');
const normalizedSuggestions = computed(() => {
    return props.suggestions.map(option => ({
        ...option,
        trigger: option.trigger ?? activeTrigger.value,
    }));
});
const matchedOptions = computed(() => {
    const mention = activeMention.value;

    if (!mention) {
        return [];
    }

    if (mention.query.length < props.minQueryLength) {
        return [];
    }

    const normalizedQuery = mention.query.toLowerCase();

    return normalizedSuggestions.value
        .filter(option => option.trigger === mention.trigger)
        .filter(option => option.label.toLowerCase().includes(normalizedQuery))
        .slice(0, Math.max(1, props.maxSuggestions));
});
const visibleOptions = computed(() => matchedOptions.value);
const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0 || highlightedIndex.value >= visibleOptions.value.length) {
        return undefined;
    }

    return `${panelId}-option-${highlightedIndex.value}`;
});
const getClass = computed(() => {
    const classes = [
        'vf-mention-input',
        `vf-mention-input_${props.variant}`,
        open.value ? 'vf-mention-input_open' : '',
    ];

    if (props.size !== 'normal') {
        classes.push(`vf-mention-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-mention-input_disabled');
    }

    return classes.filter(Boolean);
});

const closePanel = () => {
    open.value = false;
    highlightedIndex.value = -1;
};

const getOptionId = (index: number) => `${panelId}-option-${index}`;

const openPanel = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!visibleOptions.value.length) {
        closePanel();

        return;
    }

    open.value = true;

    if (highlightedIndex.value < 0) {
        highlightedIndex.value = firstEnabledIndex();
    }
};

const firstEnabledIndex = () => visibleOptions.value.findIndex(option => !option.disabled);

const detectActiveMention = (value: string, caret: number): ActiveMention | null => {
    const prefix = value.slice(0, caret);
    let bestIndex = -1;
    let bestTrigger = '';

    for (const trigger of props.triggers) {
        const index = prefix.lastIndexOf(trigger);

        if (index > bestIndex) {
            bestIndex = index;
            bestTrigger = trigger;
        }
    }

    if (bestIndex < 0) {
        return null;
    }

    if (bestIndex > 0 && !/\s/.test(prefix[bestIndex - 1])) {
        return null;
    }

    const query = prefix.slice(bestIndex + bestTrigger.length);

    if (!query || /\s/.test(query)) {
        return null;
    }

    return {
        trigger: bestTrigger,
        query,
        start: bestIndex,
        end: caret,
    };
};

const updateMentionState = (input: HTMLInputElement) => {
    const caret = input.selectionStart ?? input.value.length;
    const mention = detectActiveMention(input.value, caret);

    activeMention.value = mention;

    if (mention) {
        emits('search', { trigger: mention.trigger, query: mention.query });
        openPanel();

        return;
    }

    closePanel();
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    emits('update:modelValue', target.value);
    emits('input', event);

    updateMentionState(target);
};

const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => {
    emits('blur', event);

    window.setTimeout(() => {
        if (!root.value?.contains(document.activeElement)) {
            closePanel();
        }
    }, 0);
};

const moveHighlight = (step: number) => {
    if (!open.value || !visibleOptions.value.length) {
        return;
    }

    let index = highlightedIndex.value;

    if (index < 0 || index >= visibleOptions.value.length) {
        index = step > 0 ? -1 : visibleOptions.value.length;
    }

    for (let i = 0; i < visibleOptions.value.length; i += 1) {
        index = (index + step + visibleOptions.value.length) % visibleOptions.value.length;

        if (!visibleOptions.value[index].disabled) {
            highlightedIndex.value = index;

            return;
        }
    }
};

const onArrowDown = () => {
    if (!open.value) {
        openPanel();

        return;
    }

    moveHighlight(1);
};

const onArrowUp = () => {
    if (!open.value) {
        openPanel();

        return;
    }

    moveHighlight(-1);
};

const selectOption = (option: MentionOption) => {
    if (option.disabled || !activeMention.value || !control.value) {
        return;
    }

    const value = props.modelValue ?? '';
    const mention = activeMention.value;
    const before = value.slice(0, mention.start);
    const after = value.slice(mention.end);
    const insertLabel = String(option.value ?? option.label);
    const mentionText = `${mention.trigger}${insertLabel}${props.appendSpace ? ' ' : ''}`;
    const nextValue = `${before}${mentionText}${after}`;
    const nextCaret = before.length + mentionText.length;

    emits('update:modelValue', nextValue);
    emits('select', option);
    emits('insert', {
        trigger: mention.trigger,
        query: mention.query,
        option,
        text: mentionText,
        range: [mention.start, mention.end] as [number, number],
    });

    closePanel();

    requestAnimationFrame(() => {
        control.value?.focus();
        control.value?.setSelectionRange(nextCaret, nextCaret);
    });
};

const onEnter = () => {
    if (!open.value) {
        return;
    }

    const option = visibleOptions.value[highlightedIndex.value];

    if (option) {
        selectOption(option);
    }
};

const onKeydown = (event: KeyboardEvent) => {
    const key = event.key;

    if (key === 'ArrowDown') {
        event.preventDefault();

        onArrowDown();

        return;
    }

    if (key === 'ArrowUp') {
        event.preventDefault();

        onArrowUp();

        return;
    }

    if (key === 'Enter') {
        event.preventDefault();

        onEnter();

        return;
    }

    if (key === 'Escape') {
        event.preventDefault();

        closePanel();
    }
};

watch(
    () => props.modelValue,
    () => {
        if (!control.value) {
            return;
        }

        updateMentionState(control.value);
    },
);

watch(visibleOptions, () => {
    if (!visibleOptions.value.length) {
        closePanel();

        return;
    }

    if (highlightedIndex.value < 0 || highlightedIndex.value >= visibleOptions.value.length) {
        highlightedIndex.value = firstEnabledIndex();
    }
});
</script>

<style lang="scss">
.vf-mention-input {
    position: relative;
    display: inline-flex;
    width: 100%;
    min-width: var(--vf-mention-input-min-width);
    box-sizing: border-box;
    border-radius: var(--vf-mention-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-mention-input-border-color);
    background-color: var(--vf-mention-input-background-color);
    color: var(--vf-mention-input-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-mention-input_outlined {
    background-color: transparent;
}

.vf-mention-input__control {
    width: 100%;
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    padding: var(--vf-mention-input-padding);
    font-size: var(--vf-mention-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
}

.vf-mention-input__control::placeholder {
    color: var(--vf-mention-input-placeholder-color);
}

.vf-mention-input__panel {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    z-index: 30;
    max-height: var(--vf-mention-input-panel-max-height);
    overflow: auto;
    padding: var(--vf-mention-input-panel-padding);
    border: var(--vf-border-width) solid var(--vf-mention-input-panel-border-color);
    border-radius: calc(var(--vf-mention-input-border-radius) + var(--vf-mention-input-panel-radius-offset));
    background-color: var(--vf-mention-input-panel-background-color);
    box-shadow: var(--vf-mention-input-panel-shadow);
}

.vf-mention-input__option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--vf-mention-input-option-gap);
    text-align: left;
    border: none;
    border-radius: var(--vf-mention-input-option-border-radius);
    background: transparent;
    color: inherit;
    padding: var(--vf-mention-input-option-padding);
    font-size: var(--vf-mention-input-option-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
}

.vf-mention-input__option-trigger {
    color: var(--vf-mention-input-option-trigger-color);
}

.vf-mention-input__option:hover:not(:disabled),
.vf-mention-input__option:focus-visible:not(:disabled),
.vf-mention-input__option.is-highlighted:not(:disabled) {
    background-color: var(--vf-mention-input-option-hover-background-color);
    outline: none;
}

.vf-mention-input__option:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vf-mention-input__empty,
.vf-mention-input__loading {
    padding: var(--vf-mention-input-empty-padding);
    color: var(--vf-mention-input-empty-color);
    font-size: var(--vf-mention-input-option-font-size);
}

.vf-mention-input:hover:not(.vf-mention-input_disabled) {
    border-color: var(--vf-mention-input-hover-border-color);
}

.vf-mention-input_open,
.vf-mention-input:focus-within:not(.vf-mention-input_disabled) {
    border-color: var(--vf-mention-input-focus-border-color);
    box-shadow: var(--vf-mention-input-focus-ring-shadow);
}

.vf-mention-input_small {
    .vf-mention-input__control {
        padding: var(--vf-mention-input-small-padding);
        font-size: var(--vf-mention-input-small-font-size);
    }
}

.vf-mention-input_large {
    .vf-mention-input__control {
        padding: var(--vf-mention-input-large-padding);
        font-size: var(--vf-mention-input-large-font-size);
    }
}

.vf-mention-input_disabled {
    opacity: var(--vf-mention-input-disabled-opacity);
    cursor: not-allowed;
}
</style>
