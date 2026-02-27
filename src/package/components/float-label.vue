<template>
    <div class="vf-float-label" :class="rootClass" @focusin="onFocusIn" @focusout="onFocusOut">
        <div class="vf-float-label__control">
            <slot />
        </div>
        <label v-if="label || $slots.label" class="vf-float-label__label" :for="forId || undefined">
            <slot name="label">{{ label }}</slot>
            <span v-if="required" class="vf-float-label__required" aria-hidden="true">*</span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';

interface Props {
    label?: string;
    modelValue?: unknown;
    value?: unknown;
    active?: boolean;
    alwaysFloat?: boolean;
    forId?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    size?: Size;
}

defineOptions({ name: 'VfFloatLabel' });

const props = withDefaults(defineProps<Props>(), {
    label: '',
    modelValue: undefined,
    value: undefined,
    active: false,
    alwaysFloat: false,
    forId: '',
    required: false,
    disabled: false,
    invalid: false,
    size: 'normal',
});

const focused = ref(false);

const resolvedValue = computed(() => (props.value !== undefined ? props.value : props.modelValue));

const isFilled = computed(() => {
    const value = resolvedValue.value;

    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return true;
});

const isFloating = computed(() => props.alwaysFloat || props.active || focused.value || isFilled.value);

const rootClass = computed(() => {
    const classes: Array<string> = [];

    if (isFloating.value) {
        classes.push('vf-float-label_floating');
    }
    if (props.disabled) {
        classes.push('vf-float-label_disabled');
    }
    if (props.invalid) {
        classes.push('vf-float-label_invalid');
    }
    if (props.size !== 'normal') {
        classes.push(`vf-float-label_${props.size}`);
    }

    return classes;
});

const onFocusIn = () => {
    focused.value = true;
};

const onFocusOut = (event: FocusEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;

    if (target && next && target.contains(next)) {
        return;
    }

    focused.value = false;
};
</script>

<style lang="scss">
.vf-float-label {
    position: relative;
    display: block;
}

.vf-float-label__control {
    min-width: 0;
}

.vf-float-label__label {
    position: absolute;
    left: var(--vf-float-label-label-offset-x);
    top: 50%;
    transform: translateY(-50%);
    padding: var(--vf-float-label-label-padding);
    font-size: var(--vf-float-label-label-font-size);
    color: var(--vf-float-label-label-color);
    background-color: var(--vf-float-label-label-background-color);
    line-height: 1;
    pointer-events: none;
    transform-origin: left center;
    transition: var(--vf-float-label-transition);
}

.vf-float-label_floating .vf-float-label__label {
    top: var(--vf-float-label-label-floating-top);
    font-size: var(--vf-float-label-label-floating-font-size);
    color: var(--vf-float-label-label-floating-color);
}

.vf-float-label__required {
    margin-inline-start: 0.2rem;
    color: var(--vf-float-label-required-color);
}

.vf-float-label_invalid .vf-float-label__label {
    color: var(--vf-float-label-invalid-color);
}

.vf-float-label_small .vf-float-label__label {
    font-size: var(--vf-float-label-small-label-font-size);
}

.vf-float-label_large .vf-float-label__label {
    font-size: var(--vf-float-label-large-label-font-size);
}

.vf-float-label_disabled {
    opacity: var(--vf-float-label-disabled-opacity);
}
</style>
