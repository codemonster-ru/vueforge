<template>
    <div :class="getClass">
        <span class="vf-search-input__icon" aria-hidden="true" />
        <input
            :id="id"
            ref="control"
            class="vf-search-input__control"
            type="search"
            :name="name"
            :value="query"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :inputmode="inputmode"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
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
            @input="onInput"
            @change="onChange"
            @keydown.enter.prevent="onEnter"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span v-if="loading" class="vf-search-input__spinner" aria-hidden="true" />
        <button
            v-else-if="clearable && query"
            class="vf-search-input__clear"
            type="button"
            :disabled="disabled || readonly"
            aria-label="Clear search"
            @click="clearValue"
        >
            ×
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    autocomplete?: string;
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    debounce?: number;
    loading?: boolean;
    clearable?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    ariaInvalid?: boolean | 'true' | 'false';
    ariaRequired?: boolean | 'true' | 'false';
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'search', 'clear', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    id: undefined,
    name: undefined,
    autocomplete: 'off',
    inputmode: 'search',
    debounce: 300,
    loading: false,
    clearable: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Search input',
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
    ariaInvalid: undefined,
    ariaRequired: undefined,
});

const control = ref<HTMLInputElement | null>(null);
const query = ref(`${props.modelValue ?? ''}`);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const getClass = computed(() => {
    const classes = ['vf-search-input', `vf-search-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-search-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-search-input_disabled');
    }

    return classes;
});

watch(
    () => props.modelValue,
    value => {
        query.value = `${value ?? ''}`;
    },
);

const clearTimer = () => {
    if (!searchTimer) {
        return;
    }

    clearTimeout(searchTimer);

    searchTimer = null;
};

const emitSearch = (value: string, immediate = false) => {
    if (props.disabled || props.readonly) {
        return;
    }

    clearTimer();

    if (immediate || props.debounce <= 0) {
        emits('search', value);

        return;
    }

    searchTimer = setTimeout(() => {
        emits('search', value);

        searchTimer = null;
    }, props.debounce);
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    query.value = value;

    emits('update:modelValue', value);
    emits('input', event);
    emitSearch(value);
};

const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const onEnter = () => {
    emitSearch(query.value, true);
};

const clearValue = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    query.value = '';

    emits('update:modelValue', '');
    emits('change', '');
    emits('clear');
    emitSearch('', true);

    control.value?.focus();
};

onBeforeUnmount(() => {
    clearTimer();
});
</script>

<style lang="scss">
.vf-search-input {
    display: flex;
    align-items: center;
    gap: var(--vf-search-input-gap);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-search-input-padding);
    border-radius: var(--vf-search-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-search-input-border-color);
    background-color: var(--vf-search-input-background-color);
    color: var(--vf-search-input-text-color);
    transition: border-color 0.2s ease;
}

.vf-search-input__icon {
    width: var(--vf-search-input-icon-size);
    height: var(--vf-search-input-icon-size);
    box-sizing: border-box;
    border: var(--vf-border-width) solid var(--vf-search-input-icon-color);
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
}

.vf-search-input__icon::after {
    content: '';
    position: absolute;
    width: calc(var(--vf-search-input-icon-size) * 0.42);
    height: var(--vf-border-width);
    background-color: var(--vf-search-input-icon-color);
    right: calc(var(--vf-search-input-icon-size) * -0.36);
    bottom: calc(var(--vf-search-input-icon-size) * -0.06);
    transform: rotate(45deg);
    transform-origin: left center;
}

.vf-search-input__control {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-search-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    appearance: none;
}

.vf-search-input__control::placeholder {
    color: var(--vf-search-input-placeholder-color);
}

.vf-search-input__control::-webkit-search-decoration,
.vf-search-input__control::-webkit-search-cancel-button,
.vf-search-input__control::-webkit-search-results-button,
.vf-search-input__control::-webkit-search-results-decoration {
    display: none;
    -webkit-appearance: none;
}

.vf-search-input__clear {
    width: var(--vf-search-input-clear-size);
    height: var(--vf-search-input-clear-size);
    border: none;
    border-radius: var(--vf-search-input-clear-radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font: inherit;
    line-height: 1;
}

.vf-search-input__clear:hover:not(:disabled) {
    background-color: var(--vf-search-input-clear-hover-background-color);
}

.vf-search-input__spinner {
    width: var(--vf-search-input-loading-size);
    height: var(--vf-search-input-loading-size);
    border-radius: 50%;
    border: var(--vf-border-width) solid var(--vf-search-input-loading-border-color);
    border-top-color: var(--vf-search-input-loading-top-border-color);
    animation: vf-search-input-spin 0.7s linear infinite;
    flex-shrink: 0;
}

.vf-search-input:hover:not(.vf-search-input_disabled) {
    border-color: var(--vf-search-input-hover-border-color);
}

.vf-search-input:focus-within:not(.vf-search-input_disabled) {
    border-color: var(--vf-search-input-focus-border-color);
    box-shadow: var(--vf-search-input-focus-ring-shadow);
}

.vf-search-input_outlined {
    background-color: transparent;
}

.vf-search-input_small {
    padding: var(--vf-search-input-small-padding);

    .vf-search-input__control {
        font-size: var(--vf-search-input-small-font-size);
    }

    .vf-search-input__icon {
        width: var(--vf-search-input-small-icon-size);
        height: var(--vf-search-input-small-icon-size);
    }

    .vf-search-input__clear {
        width: var(--vf-search-input-small-clear-size);
        height: var(--vf-search-input-small-clear-size);
    }
}

.vf-search-input_large {
    padding: var(--vf-search-input-large-padding);

    .vf-search-input__control {
        font-size: var(--vf-search-input-large-font-size);
    }

    .vf-search-input__icon {
        width: var(--vf-search-input-large-icon-size);
        height: var(--vf-search-input-large-icon-size);
    }

    .vf-search-input__clear {
        width: var(--vf-search-input-large-clear-size);
        height: var(--vf-search-input-large-clear-size);
    }
}

.vf-search-input_disabled {
    opacity: var(--vf-search-input-disabled-opacity);
    cursor: not-allowed;
}

@keyframes vf-search-input-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
