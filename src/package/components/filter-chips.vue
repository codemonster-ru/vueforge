<template>
    <div
        :class="getClass"
        role="group"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
    >
        <button
            v-for="option in options"
            :key="String(option.value)"
            class="vf-filter-chips__chip"
            type="button"
            :class="{ 'is-active': isSelected(option.value) }"
            :disabled="disabled || option.disabled"
            :data-value="String(option.value)"
            @click="toggleOption(option.value, $event)"
        >
            <span class="vf-filter-chips__label">{{ option.label }}</span>
            <span v-if="typeof option.count === 'number'" class="vf-filter-chips__count">{{ option.count }}</span>
        </button>
        <button
            v-if="clearable && hasSelection"
            class="vf-filter-chips__clear"
            type="button"
            :disabled="disabled"
            :aria-label="resolvedClearLabel"
            @click="clearSelection"
        >
            {{ resolvedClearText }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleText } from '@/package/config/locale-text';

type FilterValue = string | number;
type FilterModel = FilterValue | Array<FilterValue> | null;
type FilterVariant = 'soft' | 'outline' | 'solid';
type FilterSize = 'small' | 'normal' | 'large';

interface FilterChipOption {
    label: string;
    value: FilterValue;
    disabled?: boolean;
    count?: number;
}

interface Props {
    modelValue?: FilterModel;
    options?: Array<FilterChipOption>;
    multiple?: boolean;
    allowEmpty?: boolean;
    clearable?: boolean;
    clearText?: string;
    clearLabel?: string;
    disabled?: boolean;
    wrap?: boolean;
    size?: FilterSize;
    variant?: FilterVariant;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'clear']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    options: () => [],
    multiple: true,
    allowEmpty: true,
    clearable: false,
    clearText: undefined,
    clearLabel: '',
    disabled: false,
    wrap: true,
    size: 'normal',
    variant: 'soft',
    ariaLabel: '',
    ariaLabelledby: '',
});

const selectedValues = computed(() => {
    if (props.multiple) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
    }

    if (props.modelValue === null || Array.isArray(props.modelValue) || props.modelValue === undefined) {
        return [] as Array<FilterValue>;
    }

    return [props.modelValue];
});
const localeText = useLocaleText();
const resolvedClearText = computed(() => props.clearText ?? localeText.filterChips.clearText);
const resolvedClearLabel = computed(() => props.clearLabel || localeText.filterChips.clearLabel);

const hasSelection = computed(() => selectedValues.value.length > 0);

const getClass = computed(() => {
    const classes = ['vf-filter-chips', `vf-filter-chips_${props.variant}`];

    if (!props.wrap) {
        classes.push('vf-filter-chips_nowrap');
    }

    if (props.size !== 'normal') {
        classes.push(`vf-filter-chips_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-filter-chips_disabled');
    }

    return classes;
});

const isSelected = (value: FilterValue) => selectedValues.value.includes(value);

const toggleOption = (value: FilterValue, event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    const option = props.options.find(item => item.value === value);

    if (!option || option.disabled) {
        return;
    }

    if (props.multiple) {
        const next = new Set(selectedValues.value);

        if (next.has(value)) {
            next.delete(value);
        } else {
            next.add(value);
        }

        const payload = Array.from(next);

        emits('update:modelValue', payload);
        emits('change', payload, event);

        return;
    }

    if (isSelected(value)) {
        if (!props.allowEmpty) {
            return;
        }

        emits('update:modelValue', null);
        emits('change', null, event);

        return;
    }

    emits('update:modelValue', value);
    emits('change', value, event);
};

const clearSelection = (event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    const payload = props.multiple ? [] : null;

    emits('update:modelValue', payload);
    emits('change', payload, event);
    emits('clear', event);
};
</script>

<style lang="scss">
.vf-filter-chips {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-filter-chips-gap);
}

.vf-filter-chips_nowrap {
    flex-wrap: nowrap;
    overflow-x: auto;
}

.vf-filter-chips__chip,
.vf-filter-chips__clear {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-filter-chips-chip-gap);
    border: var(--vf-border-width) solid var(--vf-filter-chips-chip-border-color);
    border-radius: var(--vf-filter-chips-chip-border-radius);
    background-color: var(--vf-filter-chips-chip-background-color);
    color: var(--vf-filter-chips-chip-text-color);
    padding: var(--vf-filter-chips-chip-padding);
    font-size: var(--vf-filter-chips-font-size);
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.vf-filter-chips__chip:hover:not(:disabled),
.vf-filter-chips__chip:focus-visible:not(:disabled),
.vf-filter-chips__clear:hover:not(:disabled),
.vf-filter-chips__clear:focus-visible:not(:disabled) {
    background-color: var(--vf-filter-chips-chip-hover-background-color);
    border-color: var(--vf-filter-chips-chip-hover-border-color);
    outline: none;
}

.vf-filter-chips__chip.is-active {
    background-color: var(--vf-filter-chips-chip-active-background-color);
    border-color: var(--vf-filter-chips-chip-active-border-color);
    color: var(--vf-filter-chips-chip-active-text-color);
}

.vf-filter-chips__count {
    border-radius: 999px;
    padding: var(--vf-filter-chips-count-padding);
    font-size: var(--vf-filter-chips-count-font-size);
    background-color: var(--vf-filter-chips-count-background-color);
    color: var(--vf-filter-chips-count-text-color);
}

.vf-filter-chips__chip.is-active .vf-filter-chips__count {
    background-color: var(--vf-filter-chips-count-active-background-color);
    color: var(--vf-filter-chips-count-active-text-color);
}

.vf-filter-chips__chip:disabled,
.vf-filter-chips__clear:disabled {
    opacity: var(--vf-filter-chips-disabled-opacity);
    cursor: not-allowed;
}

.vf-filter-chips_disabled {
    opacity: var(--vf-filter-chips-disabled-opacity);
}

.vf-filter-chips_small {
    .vf-filter-chips__chip,
    .vf-filter-chips__clear {
        font-size: var(--vf-filter-chips-small-font-size);
        padding: var(--vf-filter-chips-small-chip-padding);
    }
}

.vf-filter-chips_large {
    .vf-filter-chips__chip,
    .vf-filter-chips__clear {
        font-size: var(--vf-filter-chips-large-font-size);
        padding: var(--vf-filter-chips-large-chip-padding);
    }
}

.vf-filter-chips_outline {
    .vf-filter-chips__chip,
    .vf-filter-chips__clear {
        background-color: transparent;
    }
}

.vf-filter-chips_solid {
    .vf-filter-chips__chip.is-active {
        background-color: var(--vf-filter-chips-chip-solid-active-background-color);
        border-color: var(--vf-filter-chips-chip-solid-active-border-color);
        color: var(--vf-filter-chips-chip-solid-active-text-color);
    }
}
</style>
