<template>
    <div class="vf-ifta-label" :class="rootClass">
        <div class="vf-ifta-label__control">
            <slot />
        </div>
        <label v-if="label || $slots.label" class="vf-ifta-label__label" :for="forId || undefined">
            <slot name="label">{{ label }}</slot>
            <span v-if="required" class="vf-ifta-label__required" aria-hidden="true">*</span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'small' | 'normal' | 'large';

interface Props {
    label?: string;
    forId?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    size?: Size;
}

defineOptions({ name: 'VfIftaLabel' });

const props = withDefaults(defineProps<Props>(), {
    label: '',
    forId: '',
    required: false,
    disabled: false,
    invalid: false,
    size: 'normal',
});

const rootClass = computed(() => {
    const classes: Array<string> = [];

    if (props.disabled) {
        classes.push('vf-ifta-label_disabled');
    }
    if (props.invalid) {
        classes.push('vf-ifta-label_invalid');
    }
    if (props.size !== 'normal') {
        classes.push(`vf-ifta-label_${props.size}`);
    }

    return classes;
});
</script>

<style lang="scss">
.vf-ifta-label {
    position: relative;
    display: block;
}

.vf-ifta-label__control {
    min-width: 0;
}

.vf-ifta-label__label {
    position: absolute;
    left: var(--vf-ifta-label-offset-x);
    top: var(--vf-ifta-label-offset-y);
    padding: var(--vf-ifta-label-padding);
    font-size: var(--vf-ifta-label-font-size);
    color: var(--vf-ifta-label-color);
    background-color: var(--vf-ifta-label-background-color);
    line-height: 1;
    pointer-events: none;
}

.vf-ifta-label__required {
    margin-inline-start: 0.2rem;
    color: var(--vf-ifta-label-required-color);
}

.vf-ifta-label_invalid .vf-ifta-label__label {
    color: var(--vf-ifta-label-invalid-color);
}

.vf-ifta-label_small .vf-ifta-label__label {
    font-size: var(--vf-ifta-label-small-font-size);
}

.vf-ifta-label_large .vf-ifta-label__label {
    font-size: var(--vf-ifta-label-large-font-size);
}

.vf-ifta-label_disabled {
    opacity: var(--vf-ifta-label-disabled-opacity);
}
</style>
