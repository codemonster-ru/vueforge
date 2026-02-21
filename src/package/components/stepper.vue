<template>
    <nav
        :class="rootClass"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
        @keydown="onKeydown"
    >
        <ol class="vf-stepper__list">
            <li
                v-for="(step, index) in steps"
                :key="getKey(step, index)"
                class="vf-stepper__item"
                :class="getItemClass(step, index)"
            >
                <component
                    :is="getTag(step)"
                    class="vf-stepper__button"
                    :type="getButtonType(step)"
                    :disabled="getDisabledAttr(step)"
                    :aria-current="isActive(index) ? 'step' : undefined"
                    :aria-disabled="isDisabled(step) ? 'true' : undefined"
                    @click="onSelect(step, index, $event)"
                >
                    <span class="vf-stepper__indicator-wrap">
                        <span class="vf-stepper__indicator">
                            <slot
                                name="indicator"
                                :step="step"
                                :index="index"
                                :status="getStatus(step, index)"
                                :active="isActive(index)"
                                :completed="isCompleted(index)"
                                :upcoming="isUpcoming(index)"
                                :error="isError(step, index)"
                            >
                                {{ index + 1 }}
                            </slot>
                        </span>
                        <span v-if="index < steps.length - 1" class="vf-stepper__line" aria-hidden="true" />
                    </span>
                    <span class="vf-stepper__content">
                        <slot
                            name="step"
                            :step="step"
                            :index="index"
                            :status="getStatus(step, index)"
                            :active="isActive(index)"
                            :completed="isCompleted(index)"
                            :upcoming="isUpcoming(index)"
                            :error="isError(step, index)"
                        >
                            <span v-if="step.label" class="vf-stepper__label">{{ step.label }}</span>
                            <span v-if="step.description" class="vf-stepper__description">{{ step.description }}</span>
                        </slot>
                    </span>
                </component>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'small' | 'normal' | 'large';
type StepperStatus = 'completed' | 'active' | 'upcoming' | 'error';
type StepperValue = string | number;

export interface StepperStep {
    label?: string;
    description?: string;
    value?: StepperValue;
    disabled?: boolean;
    status?: StepperStatus;
}

interface Props {
    modelValue?: StepperValue;
    steps?: Array<StepperStep>;
    orientation?: StepperOrientation;
    size?: StepperSize;
    clickable?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    steps: () => [],
    orientation: 'horizontal',
    size: 'normal',
    clickable: false,
    disabled: false,
    ariaLabel: '',
    ariaLabelledby: '',
});

defineOptions({ name: 'VfStepper' });

const steps = computed(() => props.steps ?? []);
const getValue = (step: StepperStep, index: number) => step.value ?? index;
const activeIndex = computed(() => {
    if (props.modelValue === undefined || props.modelValue === null) {
        return 0;
    }

    const index = steps.value.findIndex((step, stepIndex) => getValue(step, stepIndex) === props.modelValue);

    return index >= 0 ? index : 0;
});

const rootClass = computed(() => {
    const classes = ['vf-stepper', `vf-stepper_${props.orientation}`, `vf-stepper_size-${props.size}`];

    if (props.clickable) {
        classes.push('vf-stepper_clickable');
    }

    if (props.disabled) {
        classes.push('vf-stepper_disabled');
    }

    return classes;
});

const getStatus = (step: StepperStep, index: number): StepperStatus => {
    if (step.status) {
        return step.status;
    }

    if (index < activeIndex.value) {
        return 'completed';
    }

    if (index === activeIndex.value) {
        return 'active';
    }

    return 'upcoming';
};

const isActive = (index: number) => getStatus(steps.value[index], index) === 'active';
const isCompleted = (index: number) => getStatus(steps.value[index], index) === 'completed';
const isUpcoming = (index: number) => getStatus(steps.value[index], index) === 'upcoming';
const isError = (step: StepperStep, index: number) => getStatus(step, index) === 'error';
const isDisabled = (step: StepperStep) => Boolean(props.disabled || step.disabled);

const getItemClass = (step: StepperStep, index: number) => ({
    'is-active': isActive(index),
    'is-completed': isCompleted(index),
    'is-upcoming': isUpcoming(index),
    'is-error': isError(step, index),
    'is-disabled': isDisabled(step),
});

const getTag = (step: StepperStep) => (props.clickable && !isDisabled(step) ? 'button' : 'div');
const getButtonType = (step: StepperStep) => (props.clickable && !isDisabled(step) ? 'button' : undefined);
const getDisabledAttr = (step: StepperStep) => (getTag(step) === 'button' ? isDisabled(step) : undefined);

const onSelect = (step: StepperStep, index: number, event: Event) => {
    if (!props.clickable || props.disabled || isDisabled(step)) {
        return;
    }

    const value = getValue(step, index);

    emits('update:modelValue', value);
    emits('change', value, step, index, event);
};

const getKey = (step: StepperStep, index: number) => {
    const base = step.value ?? step.label ?? 'step';

    return `${base}_${index.toString()}`;
};

const getFocusableStepButtons = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    const root = element?.closest('.vf-stepper');

    if (!root) {
        return [];
    }

    return Array.from(root.querySelectorAll<HTMLButtonElement>('button.vf-stepper__button:not(:disabled)'));
};

const onKeydown = (event: KeyboardEvent) => {
    if (!props.clickable || props.disabled) {
        return;
    }

    const isHorizontal = props.orientation === 'horizontal';
    const nextKeys = isHorizontal ? ['ArrowRight'] : ['ArrowDown'];
    const prevKeys = isHorizontal ? ['ArrowLeft'] : ['ArrowUp'];
    const supported = [...nextKeys, ...prevKeys, 'Home', 'End'];

    if (!supported.includes(event.key)) {
        return;
    }

    const buttons = getFocusableStepButtons(event.target);

    if (!buttons.length) {
        return;
    }

    const current = event.target as HTMLElement;
    const currentIndex = buttons.findIndex(button => button === current);

    if (currentIndex < 0) {
        return;
    }

    let nextIndex = currentIndex;

    if (nextKeys.includes(event.key)) {
        nextIndex = (currentIndex + 1) % buttons.length;
    } else if (prevKeys.includes(event.key)) {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === 'Home') {
        nextIndex = 0;
    } else if (event.key === 'End') {
        nextIndex = buttons.length - 1;
    }

    event.preventDefault();
    const next = buttons[nextIndex];
    next?.focus();
    next?.click();
};
</script>

<style lang="scss">
.vf-stepper {
    display: block;
}

.vf-stepper__list {
    display: flex;
    gap: var(--vf-stepper-gap);
    margin: 0;
    padding: 0;
    list-style: none;
}

.vf-stepper_horizontal .vf-stepper__list {
    flex-direction: row;
    align-items: flex-start;
}

.vf-stepper_vertical .vf-stepper__list {
    flex-direction: column;
    align-items: stretch;
}

.vf-stepper__item {
    display: flex;
    align-items: flex-start;
}

.vf-stepper_horizontal .vf-stepper__item {
    flex: 1;
}

.vf-stepper__button {
    display: flex;
    align-items: flex-start;
    gap: var(--vf-stepper-item-gap);
    padding: 0;
    border: none;
    background: none;
    text-align: left;
    color: inherit;
    font: inherit;
    cursor: default;
}

.vf-stepper_clickable .vf-stepper__button {
    cursor: pointer;
}

.vf-stepper__item.is-disabled .vf-stepper__button {
    cursor: default;
}

.vf-stepper_horizontal .vf-stepper__button {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
}

.vf-stepper_vertical .vf-stepper__button {
    flex-direction: row;
    align-items: flex-start;
}

.vf-stepper__indicator-wrap {
    display: flex;
    align-items: center;
}

.vf-stepper_horizontal .vf-stepper__indicator-wrap {
    width: 100%;
    flex-direction: row;
    align-items: center;
}

.vf-stepper_vertical .vf-stepper__indicator-wrap {
    flex-direction: column;
    align-items: center;
}

.vf-stepper__indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-stepper-indicator-size);
    height: var(--vf-stepper-indicator-size);
    border-radius: var(--vf-stepper-indicator-border-radius);
    border: var(--vf-stepper-indicator-border-width) solid var(--vf-stepper-indicator-border-color);
    background-color: var(--vf-stepper-indicator-background-color);
    color: var(--vf-stepper-indicator-text-color);
    font-size: var(--vf-stepper-indicator-font-size);
    font-weight: 600;
    box-sizing: border-box;
    flex: 0 0 auto;
}

.vf-stepper__line {
    display: block;
    background-color: var(--vf-stepper-line-color);
}

.vf-stepper_horizontal .vf-stepper__line {
    flex: 1;
    height: var(--vf-stepper-line-thickness);
    margin-left: var(--vf-stepper-item-gap);
}

.vf-stepper_vertical .vf-stepper__line {
    width: var(--vf-stepper-line-thickness);
    height: var(--vf-stepper-line-length);
    margin-top: var(--vf-stepper-item-gap);
}

.vf-stepper__content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.vf-stepper__label {
    font-size: var(--vf-stepper-label-font-size);
    color: var(--vf-stepper-label-color);
    line-height: var(--vf-typography-line-height);
}

.vf-stepper__description {
    font-size: var(--vf-stepper-description-font-size);
    color: var(--vf-stepper-description-color);
    line-height: var(--vf-typography-line-height);
}

.vf-stepper__item.is-active .vf-stepper__indicator {
    background-color: var(--vf-stepper-active-indicator-background-color);
    color: var(--vf-stepper-active-indicator-text-color);
    border-color: var(--vf-stepper-active-indicator-border-color);
}

.vf-stepper__item.is-completed .vf-stepper__indicator {
    background-color: var(--vf-stepper-completed-indicator-background-color);
    color: var(--vf-stepper-completed-indicator-text-color);
    border-color: var(--vf-stepper-completed-indicator-border-color);
}

.vf-stepper__item.is-completed .vf-stepper__line {
    background-color: var(--vf-stepper-completed-indicator-background-color);
}

.vf-stepper__item.is-error .vf-stepper__indicator {
    background-color: var(--vf-stepper-error-indicator-background-color);
    color: var(--vf-stepper-error-indicator-text-color);
    border-color: var(--vf-stepper-error-indicator-border-color);
}

.vf-stepper__item.is-disabled {
    opacity: var(--vf-stepper-disabled-opacity);
}

.vf-stepper_disabled {
    opacity: var(--vf-stepper-disabled-opacity);

    .vf-stepper__button {
        cursor: not-allowed;
    }
}

.vf-stepper_size-small .vf-stepper__indicator {
    width: var(--vf-stepper-small-indicator-size);
    height: var(--vf-stepper-small-indicator-size);
    font-size: var(--vf-stepper-small-indicator-font-size);
}

.vf-stepper_size-small .vf-stepper__label {
    font-size: var(--vf-stepper-small-label-font-size);
}

.vf-stepper_size-small .vf-stepper__description {
    font-size: var(--vf-stepper-small-description-font-size);
}

.vf-stepper_vertical.vf-stepper_size-small .vf-stepper__line {
    height: var(--vf-stepper-small-line-length);
}

.vf-stepper_size-large .vf-stepper__indicator {
    width: var(--vf-stepper-large-indicator-size);
    height: var(--vf-stepper-large-indicator-size);
    font-size: var(--vf-stepper-large-indicator-font-size);
}

.vf-stepper_size-large .vf-stepper__label {
    font-size: var(--vf-stepper-large-label-font-size);
}

.vf-stepper_size-large .vf-stepper__description {
    font-size: var(--vf-stepper-large-description-font-size);
}

.vf-stepper_vertical.vf-stepper_size-large .vf-stepper__line {
    height: var(--vf-stepper-large-line-length);
}
</style>
