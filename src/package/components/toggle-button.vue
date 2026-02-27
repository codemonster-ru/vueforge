<template>
    <button
        type="button"
        class="vf-toggle-button"
        :class="rootClass"
        :disabled="disabled"
        :aria-pressed="modelValue ? 'true' : 'false'"
        :aria-label="resolvedAriaLabel || undefined"
        @click="onToggle"
    >
        <Icon v-if="resolvedIcon" :icon="resolvedIcon" class="vf-toggle-button__icon" decorative />
        <span v-if="hasLabel" class="vf-toggle-button__label">
            <slot>{{ resolvedLabel }}</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import Icon from './icon.vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined' | 'text';

interface Props {
    modelValue?: boolean;
    disabled?: boolean;
    size?: Size;
    variant?: Variant;
    label?: string;
    onLabel?: string;
    offLabel?: string;
    icon?: string;
    onIcon?: string;
    offIcon?: string;
    ariaLabel?: string;
    ariaLabelOn?: string;
    ariaLabelOff?: string;
}

defineOptions({ name: 'VfToggleButton' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    size: 'normal',
    variant: 'filled',
    label: '',
    onLabel: '',
    offLabel: '',
    icon: '',
    onIcon: '',
    offIcon: '',
    ariaLabel: '',
    ariaLabelOn: '',
    ariaLabelOff: '',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'change', value: boolean, eventRef: MouseEvent): void;
}>();

const slots = useSlots();

const resolvedLabel = computed(() => {
    if (props.modelValue && props.onLabel) {
        return props.onLabel;
    }
    if (!props.modelValue && props.offLabel) {
        return props.offLabel;
    }

    return props.label;
});

const resolvedIcon = computed(() => {
    if (props.modelValue && props.onIcon) {
        return props.onIcon;
    }
    if (!props.modelValue && props.offIcon) {
        return props.offIcon;
    }

    return props.icon;
});

const resolvedAriaLabel = computed(() => {
    if (props.modelValue && props.ariaLabelOn) {
        return props.ariaLabelOn;
    }
    if (!props.modelValue && props.ariaLabelOff) {
        return props.ariaLabelOff;
    }

    return props.ariaLabel || resolvedLabel.value;
});

const hasLabel = computed(() => !!slots.default || !!resolvedLabel.value);

const rootClass = computed(() => {
    const classes = [`vf-toggle-button_${props.variant}`];

    if (props.modelValue) {
        classes.push('vf-toggle-button_active');
    }

    if (props.size !== 'normal') {
        classes.push(`vf-toggle-button_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-toggle-button_disabled');
    }

    return classes;
});

const onToggle = (event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    const next = !props.modelValue;
    emits('update:modelValue', next);
    emits('change', next, event);
};
</script>

<style lang="scss">
.vf-toggle-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--vf-toggle-button-icon-gap);
    min-height: var(--vf-controls-height);
    padding: var(--vf-toggle-button-padding);
    border: var(--vf-border-width) solid var(--vf-toggle-button-border-color);
    border-radius: var(--vf-toggle-button-border-radius);
    background-color: var(--vf-toggle-button-background-color);
    color: var(--vf-toggle-button-text-color);
    font-size: var(--vf-toggle-button-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
}

.vf-toggle-button:hover:not(.vf-toggle-button_disabled) {
    background-color: var(--vf-toggle-button-hover-background-color);
}

.vf-toggle-button:focus-visible {
    outline: none;
    box-shadow: var(--vf-toggle-button-focus-ring-shadow);
}

.vf-toggle-button_active {
    border-color: var(--vf-toggle-button-active-border-color);
    background-color: var(--vf-toggle-button-active-background-color);
    color: var(--vf-toggle-button-active-text-color);
}

.vf-toggle-button_outlined {
    background-color: transparent;
}

.vf-toggle-button_text {
    background-color: transparent;
    border-color: transparent;
}

.vf-toggle-button_small {
    font-size: var(--vf-toggle-button-small-font-size);
    padding: var(--vf-toggle-button-small-padding);
}

.vf-toggle-button_large {
    font-size: var(--vf-toggle-button-large-font-size);
    padding: var(--vf-toggle-button-large-padding);
}

.vf-toggle-button_disabled {
    opacity: var(--vf-toggle-button-disabled-opacity);
    cursor: not-allowed;
}
</style>
