<template>
    <span
        class="vf-chip"
        :class="getClass"
        :data-variant="variant"
        :data-severity="severity"
        role="status"
        :aria-label="ariaLabel || undefined"
    >
        <span v-if="$slots.icon || icon" class="vf-chip__icon">
            <slot name="icon">
                <v-icon :icon="icon" />
            </slot>
        </span>
        <span class="vf-chip__label">
            <slot>{{ label }}</slot>
        </span>
        <button
            v-if="closable"
            type="button"
            class="vf-chip__close"
            :disabled="disabled"
            :aria-label="resolvedCloseLabel"
            @click="onClose"
        >
            <slot name="close">&times;</slot>
        </button>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';
import { useLocaleText } from '@/package/config/locale-text';

type ChipVariant = 'solid' | 'soft' | 'outline';
type ChipSize = 'small' | 'normal' | 'large';
type ChipSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    label?: string;
    size?: ChipSize;
    variant?: ChipVariant;
    severity?: ChipSeverity;
    disabled?: boolean;
    closable?: boolean;
    icon?: string;
    ariaLabel?: string;
    closeLabel?: string;
}

const emits = defineEmits(['close']);
const props = withDefaults(defineProps<Props>(), {
    label: '',
    size: 'normal',
    variant: 'soft',
    severity: 'neutral',
    disabled: false,
    closable: false,
    icon: '',
    ariaLabel: '',
    closeLabel: '',
});
const localeText = useLocaleText();
const resolvedCloseLabel = computed(() => props.closeLabel || localeText.chip.closeLabel);

const getClass = computed(() => {
    const classes = [`vf-chip_size-${props.size}`];

    if (props.disabled) {
        classes.push('vf-chip_disabled');
    }

    return classes;
});

const onClose = (event: MouseEvent) => {
    if (props.disabled) {
        return;
    }

    emits('close', event);
};
</script>

<style lang="scss">
.vf-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-chip-gap);
    padding: var(--vf-chip-padding-y) var(--vf-chip-padding-x);
    font-size: var(--vf-chip-font-size);
    line-height: var(--vf-chip-line-height);
    border-radius: var(--vf-chip-border-radius);
    border: var(--vf-border-width) solid var(--vf-chip-border-color);
    background-color: var(--vf-chip-background-color);
    color: var(--vf-chip-text-color);
    white-space: nowrap;
}

.vf-chip__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--vf-chip-icon-size);
}

.vf-chip__label {
    display: inline-flex;
    align-items: center;
}

.vf-chip__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    margin: 0;
    width: var(--vf-chip-close-size);
    height: var(--vf-chip-close-size);
    border-radius: var(--vf-chip-close-radius);
    color: var(--vf-chip-close-color);
    font-size: var(--vf-chip-close-font-size);
    cursor: pointer;
}

.vf-chip__close:hover {
    background-color: var(--vf-chip-close-hover-background-color);
}

.vf-chip__close:disabled {
    cursor: not-allowed;
    opacity: var(--vf-chip-disabled-opacity);
}

.vf-chip_disabled {
    opacity: var(--vf-chip-disabled-opacity);
}

.vf-chip[data-variant='soft'] {
    background-color: var(--vf-chip-soft-background-color, var(--vf-chip-background-color));
    color: var(--vf-chip-soft-text-color, var(--vf-chip-text-color));
    border-color: var(--vf-chip-soft-border-color, var(--vf-chip-border-color));
}

.vf-chip[data-variant='outline'] {
    background-color: transparent;
    color: var(--vf-chip-outline-text-color, var(--vf-chip-text-color));
    border-color: var(--vf-chip-outline-border-color, var(--vf-chip-border-color));
}

.vf-chip_size-small {
    font-size: var(--vf-chip-small-font-size);
    padding: var(--vf-chip-small-padding-y) var(--vf-chip-small-padding-x);
}

.vf-chip_size-large {
    font-size: var(--vf-chip-large-font-size);
    padding: var(--vf-chip-large-padding-y) var(--vf-chip-large-padding-x);
}

.vf-chip[data-severity='info'] {
    --vf-chip-background-color: var(--vf-chip-info-background-color);
    --vf-chip-text-color: var(--vf-chip-info-text-color);
    --vf-chip-border-color: var(--vf-chip-info-border-color);
    --vf-chip-soft-background-color: var(--vf-chip-info-soft-background-color);
    --vf-chip-soft-text-color: var(--vf-chip-info-soft-text-color);
    --vf-chip-soft-border-color: var(--vf-chip-info-soft-border-color);
    --vf-chip-outline-text-color: var(--vf-chip-info-outline-text-color);
    --vf-chip-outline-border-color: var(--vf-chip-info-outline-border-color);
}

.vf-chip[data-severity='success'] {
    --vf-chip-background-color: var(--vf-chip-success-background-color);
    --vf-chip-text-color: var(--vf-chip-success-text-color);
    --vf-chip-border-color: var(--vf-chip-success-border-color);
    --vf-chip-soft-background-color: var(--vf-chip-success-soft-background-color);
    --vf-chip-soft-text-color: var(--vf-chip-success-soft-text-color);
    --vf-chip-soft-border-color: var(--vf-chip-success-soft-border-color);
    --vf-chip-outline-text-color: var(--vf-chip-success-outline-text-color);
    --vf-chip-outline-border-color: var(--vf-chip-success-outline-border-color);
}

.vf-chip[data-severity='warn'] {
    --vf-chip-background-color: var(--vf-chip-warn-background-color);
    --vf-chip-text-color: var(--vf-chip-warn-text-color);
    --vf-chip-border-color: var(--vf-chip-warn-border-color);
    --vf-chip-soft-background-color: var(--vf-chip-warn-soft-background-color);
    --vf-chip-soft-text-color: var(--vf-chip-warn-soft-text-color);
    --vf-chip-soft-border-color: var(--vf-chip-warn-soft-border-color);
    --vf-chip-outline-text-color: var(--vf-chip-warn-outline-text-color);
    --vf-chip-outline-border-color: var(--vf-chip-warn-outline-border-color);
}

.vf-chip[data-severity='danger'] {
    --vf-chip-background-color: var(--vf-chip-danger-background-color);
    --vf-chip-text-color: var(--vf-chip-danger-text-color);
    --vf-chip-border-color: var(--vf-chip-danger-border-color);
    --vf-chip-soft-background-color: var(--vf-chip-danger-soft-background-color);
    --vf-chip-soft-text-color: var(--vf-chip-danger-soft-text-color);
    --vf-chip-soft-border-color: var(--vf-chip-danger-soft-border-color);
    --vf-chip-outline-text-color: var(--vf-chip-danger-outline-text-color);
    --vf-chip-outline-border-color: var(--vf-chip-danger-outline-border-color);
}
</style>
