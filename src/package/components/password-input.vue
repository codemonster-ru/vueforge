<template>
    <div :class="getClass">
        <div class="vf-password-input__field">
            <span v-if="$slots.prefix" class="vf-password-input__prefix">
                <slot name="prefix" />
            </span>
            <input
                class="vf-password-input__control"
                :type="isRevealed ? 'text' : 'password'"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :aria-label="ariaLabel"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
                @keydown="onKeyState"
                @keyup="onKeyState"
            />
            <button
                v-if="showToggle"
                class="vf-password-input__toggle"
                type="button"
                :disabled="disabled"
                :aria-label="isRevealed ? hideLabel : revealLabel"
                @click="toggleVisibility"
            >
                {{ isRevealed ? hideText : revealText }}
            </button>
            <span v-if="$slots.suffix" class="vf-password-input__suffix">
                <slot name="suffix" />
            </span>
        </div>
        <div v-if="showStrength && modelValue" class="vf-password-input__strength">
            <div class="vf-password-input__strength-track">
                <span :class="strengthFillClass" :style="{ width: `${strengthPercent}%` }" />
            </div>
            <span class="vf-password-input__strength-label">
                {{ strengthLabel }}
            </span>
        </div>
        <p v-if="showCapsLockHint && capsLockOn && !disabled" class="vf-password-input__caps-lock">
            {{ capsLockHint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Strength = 'weak' | 'medium' | 'strong';

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    autocomplete?: string;
    showToggle?: boolean;
    showStrength?: boolean;
    showCapsLockHint?: boolean;
    revealLabel?: string;
    hideLabel?: string;
    revealText?: string;
    hideText?: string;
    capsLockHint?: string;
    weakLabel?: string;
    mediumLabel?: string;
    strongLabel?: string;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'toggleVisibility']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    autocomplete: 'current-password',
    showToggle: true,
    showStrength: false,
    showCapsLockHint: true,
    revealLabel: 'Show password',
    hideLabel: 'Hide password',
    revealText: 'Show',
    hideText: 'Hide',
    capsLockHint: 'Caps Lock is on',
    weakLabel: 'Weak password',
    mediumLabel: 'Medium password',
    strongLabel: 'Strong password',
    ariaLabel: 'Password input',
});

const isRevealed = ref(false);
const capsLockOn = ref(false);

const getClass = computed(() => {
    const classes = ['vf-password-input', `vf-password-input_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-password-input_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-password-input_disabled');
    }

    return classes;
});

const strength = computed<Strength>(() => {
    const value = props.modelValue ?? '';

    if (!value) {
        return 'weak';
    }

    let score = 0;

    if (value.length >= 8) {
        score += 1;
    }

    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) {
        score += 1;
    }

    if (/\d/.test(value)) {
        score += 1;
    }

    if (/[^a-zA-Z0-9]/.test(value)) {
        score += 1;
    }

    if (score >= 4) {
        return 'strong';
    }

    if (score >= 2) {
        return 'medium';
    }

    return 'weak';
});

const strengthPercent = computed(() => {
    if (strength.value === 'strong') {
        return 100;
    }

    if (strength.value === 'medium') {
        return 66;
    }

    return 33;
});

const strengthLabel = computed(() => {
    if (strength.value === 'strong') {
        return props.strongLabel;
    }

    if (strength.value === 'medium') {
        return props.mediumLabel;
    }

    return props.weakLabel;
});

const strengthFillClass = computed(
    () => `vf-password-input__strength-fill vf-password-input__strength-fill_${strength.value}`,
);

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    emits('update:modelValue', target.value);
    emits('input', event);
};

const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => {
    capsLockOn.value = false;

    emits('blur', event);
};

const onKeyState = (event: KeyboardEvent) => {
    const hasModifierState = typeof event.getModifierState === 'function';
    const fallbackState = Boolean((event as KeyboardEvent & { capsLock?: boolean }).capsLock);

    capsLockOn.value = hasModifierState ? event.getModifierState('CapsLock') : fallbackState;
};

const toggleVisibility = () => {
    if (props.disabled) {
        return;
    }

    isRevealed.value = !isRevealed.value;

    emits('toggleVisibility', isRevealed.value);
};
</script>

<style lang="scss">
.vf-password-input {
    display: grid;
    gap: var(--vf-password-input-gap);
}

.vf-password-input__field {
    display: flex;
    align-items: center;
    gap: var(--vf-password-input-gap);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-password-input-padding);
    border-radius: var(--vf-password-input-border-radius);
    border: var(--vf-border-width) solid var(--vf-password-input-border-color);
    background-color: var(--vf-password-input-background-color);
    color: var(--vf-password-input-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-password-input__control {
    flex: 1;
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-password-input-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    min-width: 0;
}

.vf-password-input__control::placeholder {
    color: var(--vf-password-input-placeholder-color);
}

.vf-password-input__toggle {
    border: none;
    background: transparent;
    color: var(--vf-password-input-toggle-color);
    border-radius: var(--vf-password-input-toggle-radius);
    min-width: var(--vf-password-input-toggle-size);
    height: var(--vf-password-input-toggle-size);
    padding: 0 0.35rem;
    font: inherit;
    font-size: 0.75em;
    cursor: pointer;
}

.vf-password-input__toggle:hover:not(:disabled) {
    background-color: var(--vf-password-input-toggle-hover-background-color);
}

.vf-password-input__toggle:disabled {
    cursor: not-allowed;
}

.vf-password-input__strength {
    display: flex;
    align-items: center;
    gap: var(--vf-password-input-strength-gap);
}

.vf-password-input__strength-track {
    flex: 1;
    height: var(--vf-password-input-strength-track-height);
    border-radius: var(--vf-password-input-strength-track-radius);
    background-color: var(--vf-password-input-strength-track-background-color);
    overflow: hidden;
}

.vf-password-input__strength-fill {
    display: block;
    height: 100%;
    transition: width 0.2s ease;
}

.vf-password-input__strength-fill_weak {
    background-color: var(--vf-password-input-strength-weak-color);
}

.vf-password-input__strength-fill_medium {
    background-color: var(--vf-password-input-strength-medium-color);
}

.vf-password-input__strength-fill_strong {
    background-color: var(--vf-password-input-strength-strong-color);
}

.vf-password-input__strength-label {
    font-size: var(--vf-password-input-meta-font-size);
    color: var(--vf-password-input-hint-color);
    white-space: nowrap;
}

.vf-password-input__caps-lock {
    margin: 0;
    font-size: var(--vf-password-input-meta-font-size);
    color: var(--vf-password-input-hint-color);
}

.vf-password-input:hover:not(.vf-password-input_disabled) .vf-password-input__field {
    border-color: var(--vf-password-input-hover-border-color);
}

.vf-password-input:focus-within:not(.vf-password-input_disabled) .vf-password-input__field {
    border-color: var(--vf-password-input-focus-border-color);
    box-shadow: var(--vf-password-input-focus-ring-shadow);
}

.vf-password-input_outlined .vf-password-input__field {
    background-color: transparent;
}

.vf-password-input_small .vf-password-input__field {
    padding: var(--vf-password-input-small-padding);
}

.vf-password-input_small .vf-password-input__control {
    font-size: var(--vf-password-input-small-font-size);
}

.vf-password-input_large .vf-password-input__field {
    padding: var(--vf-password-input-large-padding);
}

.vf-password-input_large .vf-password-input__control {
    font-size: var(--vf-password-input-large-font-size);
}

.vf-password-input_disabled {
    opacity: var(--vf-password-input-disabled-opacity);
    cursor: not-allowed;
}
</style>
