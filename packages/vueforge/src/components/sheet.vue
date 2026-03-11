<template>
    <component
        :is="as"
        class="vf-sheet"
        :class="rootClass"
        :aria-label="ariaLabel || undefined"
        :aria-disabled="disabled ? 'true' : undefined"
    >
        <div v-if="$slots.header" class="vf-sheet__header">
            <slot name="header" />
        </div>

        <div class="vf-sheet__body">
            <slot />
        </div>

        <div v-if="$slots.footer" class="vf-sheet__footer">
            <slot name="footer" />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SheetVariant = 'elevated' | 'flat' | 'outlined' | 'tonal';

interface Props {
    as?: string;
    variant?: SheetVariant;
    bordered?: boolean;
    rounded?: boolean;
    interactive?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}

defineOptions({ name: 'VfSheet' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    variant: 'elevated',
    bordered: false,
    rounded: true,
    interactive: false,
    disabled: false,
    ariaLabel: '',
});

const rootClass = computed(() => {
    const classes = [`vf-sheet_${props.variant}`];

    if (props.bordered) {
        classes.push('vf-sheet_bordered');
    }
    if (props.rounded) {
        classes.push('vf-sheet_rounded');
    }
    if (props.interactive) {
        classes.push('vf-sheet_interactive');
    }
    if (props.disabled) {
        classes.push('vf-sheet_disabled');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-sheet {
    border: var(--vf-border-width) solid transparent;
    background-color: var(--vf-sheet-background-color);
    color: var(--vf-sheet-text-color);
}

.vf-sheet_rounded {
    border-radius: var(--vf-sheet-border-radius);
}

.vf-sheet_bordered {
    border-color: var(--vf-sheet-border-color);
}

.vf-sheet_elevated {
    box-shadow: var(--vf-sheet-shadow);
}

.vf-sheet_flat {
    box-shadow: none;
}

.vf-sheet_outlined {
    border-color: var(--vf-sheet-border-color);
    box-shadow: none;
}

.vf-sheet_tonal {
    background-color: var(--vf-sheet-tonal-background-color);
    color: var(--vf-sheet-tonal-text-color);
}

.vf-sheet_interactive {
    transition: var(--vf-sheet-transition);
}

.vf-sheet_interactive:hover:not(.vf-sheet_disabled) {
    box-shadow: var(--vf-sheet-shadow-hover);
}

.vf-sheet_disabled {
    opacity: var(--vf-sheet-disabled-opacity);
}

.vf-sheet__header {
    padding: var(--vf-sheet-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-sheet-section-border-color);
}

.vf-sheet__body {
    padding: var(--vf-sheet-body-padding);
}

.vf-sheet__footer {
    padding: var(--vf-sheet-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-sheet-section-border-color);
}
</style>
