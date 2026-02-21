<template>
    <div :class="getClass" :aria-label="ariaLabel || undefined" :aria-labelledby="ariaLabelledby || undefined">
        <nav class="vf-wizard__header" aria-label="Wizard steps">
            <ol class="vf-wizard__list" role="tablist" aria-orientation="horizontal" @keydown="onHeaderKeydown">
                <li
                    v-for="(step, index) in normalizedSteps"
                    :key="String(step.value)"
                    class="vf-wizard__item"
                    :class="getStepClass(step, index)"
                >
                    <button
                        :id="getStepId(step.value)"
                        class="vf-wizard__step"
                        type="button"
                        role="tab"
                        :aria-selected="isActive(step.value) ? 'true' : 'false'"
                        :aria-controls="getPanelId(step.value)"
                        :disabled="isStepDisabled(step, index)"
                        :tabindex="isActive(step.value) ? 0 : -1"
                        @click="onStepClick(index)"
                    >
                        <span class="vf-wizard__indicator">
                            <slot name="indicator" :step="step" :index="index">
                                {{ index + 1 }}
                            </slot>
                        </span>
                        <span class="vf-wizard__meta">
                            <span class="vf-wizard__title">{{ step.title || `Step ${index + 1}` }}</span>
                            <span v-if="step.description" class="vf-wizard__description">{{ step.description }}</span>
                        </span>
                    </button>
                </li>
            </ol>
        </nav>

        <div class="vf-wizard__content">
            <slot />
        </div>

        <div class="vf-wizard__footer">
            <slot
                name="actions"
                :step="activeStep"
                :index="activeIndex"
                :is-first="isFirst"
                :is-last="isLast"
                :next="goNext"
                :prev="goPrev"
                :complete="completeWizard"
            >
                <button
                    class="vf-wizard__button vf-wizard__button_secondary"
                    type="button"
                    :disabled="isFirst"
                    @click="goPrev"
                >
                    {{ prevLabel }}
                </button>
                <button class="vf-wizard__button vf-wizard__button_primary" type="button" @click="goNext">
                    {{ isLast ? finishLabel : nextLabel }}
                </button>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { wizardKey, type WizardValue } from './wizard-context';

type ValidateResult = boolean | string | null | undefined;
type ValidateHandler = (
    step: WizardStepItem,
    index: number,
    value: WizardValue,
) => ValidateResult | Promise<ValidateResult>;

export interface WizardStepItem {
    value: WizardValue;
    title?: string;
    description?: string;
    optional?: boolean;
    disabled?: boolean;
    validate?: (value: WizardValue, index: number) => ValidateResult | Promise<ValidateResult>;
}

interface Props {
    modelValue?: WizardValue;
    steps?: Array<WizardStepItem>;
    linear?: boolean;
    disabled?: boolean;
    nextLabel?: string;
    prevLabel?: string;
    finishLabel?: string;
    validateStep?: ValidateHandler;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'next', 'prev', 'complete', 'invalidStep']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    steps: () => [],
    linear: true,
    disabled: false,
    nextLabel: 'Next',
    prevLabel: 'Back',
    finishLabel: 'Finish',
    validateStep: undefined,
    ariaLabel: '',
    ariaLabelledby: '',
});

let wizardIdCounter = 0;
const uid = ++wizardIdCounter;
const activeValue = ref<WizardValue | undefined>(undefined);
const invalidSteps = ref<Record<string, string>>({});

const normalizedSteps = computed(() => props.steps ?? []);
const activeIndex = computed(() => {
    if (activeValue.value === undefined) {
        return -1;
    }

    return normalizedSteps.value.findIndex(step => step.value === activeValue.value);
});
const activeStep = computed(() => {
    if (activeIndex.value < 0) {
        return undefined;
    }

    return normalizedSteps.value[activeIndex.value];
});
const isFirst = computed(() => activeIndex.value <= 0);
const isLast = computed(() => activeIndex.value >= normalizedSteps.value.length - 1);

const getClass = computed(() => {
    const classes = ['vf-wizard'];

    if (props.disabled) {
        classes.push('vf-wizard_disabled');
    }

    return classes;
});

const normalizeId = (value: WizardValue) =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');

const getStepId = (value: WizardValue) => `vf-wizard-step-${uid}-${normalizeId(value)}`;
const getPanelId = (value: WizardValue) => `vf-wizard-panel-${uid}-${normalizeId(value)}`;
const isActive = (value: WizardValue) => activeValue.value === value;
const isCompleted = (index: number) => index < activeIndex.value;
const getError = (value: WizardValue) => invalidSteps.value[String(value)];
const getStepClass = (step: WizardStepItem, index: number) => ({
    'is-active': isActive(step.value),
    'is-completed': isCompleted(index),
    'is-error': !!getError(step.value),
    'is-disabled': isStepDisabled(step, index),
});
const isStepDisabled = (step: WizardStepItem, index: number) => {
    if (props.disabled || step.disabled) {
        return true;
    }

    if (!props.linear) {
        return false;
    }

    if (activeIndex.value < 0) {
        return false;
    }

    return index > activeIndex.value + 1;
};

const findInitialStep = () => {
    if (!normalizedSteps.value.length) {
        return undefined;
    }

    if (props.modelValue !== undefined) {
        const existing = normalizedSteps.value.find(step => step.value === props.modelValue && !step.disabled);

        if (existing) {
            return existing.value;
        }
    }

    return normalizedSteps.value.find(step => !step.disabled)?.value ?? normalizedSteps.value[0].value;
};

const setActiveValue = (value: WizardValue, trigger: 'next' | 'prev' | 'change') => {
    activeValue.value = value;
    emits('update:modelValue', value);
    emits('change', value, activeStep.value, activeIndex.value);
    emits(trigger, value, activeStep.value, activeIndex.value);
};

const runStepValidation = async (index: number) => {
    const step = normalizedSteps.value[index];

    if (!step) {
        return true;
    }

    const value = step.value;
    const localResult = step.validate ? await step.validate(value, index) : true;
    const globalResult = props.validateStep ? await props.validateStep(step, index, value) : true;
    const normalize = (result: ValidateResult) => {
        if (result === undefined || result === null || result === true) {
            return '';
        }

        if (result === false) {
            return 'Step is invalid';
        }

        return String(result);
    };
    const localMessage = normalize(localResult);
    const globalMessage = normalize(globalResult);
    const message = localMessage || globalMessage;

    if (message) {
        invalidSteps.value = {
            ...invalidSteps.value,
            [String(value)]: message,
        };
        emits('invalidStep', message, step, index);

        return false;
    }

    const nextErrors = { ...invalidSteps.value };

    delete nextErrors[String(value)];
    invalidSteps.value = nextErrors;

    return true;
};

const moveToIndex = async (index: number, trigger: 'next' | 'prev' | 'change') => {
    const target = normalizedSteps.value[index];

    if (!target || isStepDisabled(target, index)) {
        return;
    }

    if (activeIndex.value >= 0 && index > activeIndex.value) {
        const valid = await runStepValidation(activeIndex.value);

        if (!valid) {
            return;
        }
    }

    setActiveValue(target.value, trigger);
};

const goPrev = async () => {
    if (activeIndex.value <= 0) {
        return;
    }

    await moveToIndex(activeIndex.value - 1, 'prev');
};

const completeWizard = async () => {
    if (activeIndex.value < 0) {
        return;
    }

    const valid = await runStepValidation(activeIndex.value);

    if (!valid) {
        return;
    }

    emits('complete', activeValue.value, activeStep.value, activeIndex.value);
};

const goNext = async () => {
    if (isLast.value) {
        await completeWizard();

        return;
    }

    await moveToIndex(activeIndex.value + 1, 'next');
};

const onStepClick = async (index: number) => {
    if (props.disabled || index === activeIndex.value) {
        return;
    }

    await moveToIndex(index, index > activeIndex.value ? 'next' : 'prev');
};

const getEnabledWizardTabs = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    const root = element?.closest('.vf-wizard__list');

    if (!root) {
        return [];
    }

    return Array.from(root.querySelectorAll<HTMLButtonElement>('.vf-wizard__step[role="tab"]:not(:disabled)'));
};

const onHeaderKeydown = (event: KeyboardEvent) => {
    const supported = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

    if (!supported.includes(event.key)) {
        return;
    }

    const tabs = getEnabledWizardTabs(event.target);

    if (!tabs.length) {
        return;
    }

    const current = event.target as HTMLElement;
    let currentIndex = tabs.findIndex(tab => tab === current);

    if (currentIndex < 0) {
        currentIndex = tabs.findIndex(tab => tab === document.activeElement);
    }

    if (currentIndex < 0) {
        return;
    }

    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
        nextIndex = 0;
    } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
    }

    event.preventDefault();
    const next = tabs[nextIndex];
    next?.focus();
    next?.click();
};

watch(
    () => props.steps,
    () => {
        const initial = findInitialStep();

        if (initial !== undefined && !normalizedSteps.value.some(step => step.value === activeValue.value)) {
            activeValue.value = initial;
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.modelValue,
    value => {
        if (value === undefined || value === activeValue.value) {
            return;
        }

        if (normalizedSteps.value.some(step => step.value === value && !step.disabled)) {
            activeValue.value = value;
        }
    },
);

provide(wizardKey, {
    activeValue: computed(() => activeValue.value),
    getPanelId,
    getStepId,
    isActive,
});
</script>

<style lang="scss">
.vf-wizard {
    display: grid;
    gap: var(--vf-wizard-gap);
}

.vf-wizard__header {
    border-bottom: var(--vf-border-width) solid var(--vf-wizard-border-color);
    padding-bottom: var(--vf-wizard-header-padding-bottom);
}

.vf-wizard__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-wizard-item-gap);
    margin: 0;
    padding: 0;
    list-style: none;
}

.vf-wizard__item {
    min-width: 0;
}

.vf-wizard__step {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--vf-wizard-step-gap);
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
}

.vf-wizard__indicator {
    width: var(--vf-wizard-indicator-size);
    height: var(--vf-wizard-indicator-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--vf-wizard-indicator-border-radius);
    border: var(--vf-border-width) solid var(--vf-wizard-indicator-border-color);
    background-color: var(--vf-wizard-indicator-background-color);
    color: var(--vf-wizard-indicator-text-color);
    font-size: var(--vf-wizard-indicator-font-size);
    box-sizing: border-box;
}

.vf-wizard__meta {
    display: grid;
    gap: 0.1rem;
}

.vf-wizard__title {
    font-size: var(--vf-wizard-title-font-size);
    color: var(--vf-wizard-title-color);
    line-height: var(--vf-typography-line-height);
}

.vf-wizard__description {
    font-size: var(--vf-wizard-description-font-size);
    color: var(--vf-wizard-description-color);
    line-height: var(--vf-typography-line-height);
}

.vf-wizard__item.is-active .vf-wizard__indicator {
    border-color: var(--vf-wizard-active-indicator-border-color);
    background-color: var(--vf-wizard-active-indicator-background-color);
    color: var(--vf-wizard-active-indicator-text-color);
}

.vf-wizard__item.is-completed .vf-wizard__indicator {
    border-color: var(--vf-wizard-completed-indicator-border-color);
    background-color: var(--vf-wizard-completed-indicator-background-color);
    color: var(--vf-wizard-completed-indicator-text-color);
}

.vf-wizard__item.is-error .vf-wizard__indicator {
    border-color: var(--vf-wizard-error-indicator-border-color);
    background-color: var(--vf-wizard-error-indicator-background-color);
    color: var(--vf-wizard-error-indicator-text-color);
}

.vf-wizard__item.is-disabled .vf-wizard__step {
    cursor: not-allowed;
}

.vf-wizard__content {
    min-width: 0;
}

.vf-wizard__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--vf-wizard-actions-gap);
}

.vf-wizard__button {
    min-width: var(--vf-wizard-button-min-width);
    padding: var(--vf-wizard-button-padding);
    border-radius: var(--vf-wizard-button-border-radius);
    border: var(--vf-border-width) solid var(--vf-wizard-button-border-color);
    background-color: var(--vf-wizard-button-background-color);
    color: var(--vf-wizard-button-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-wizard__button:hover:not(:disabled) {
    background-color: var(--vf-wizard-button-hover-background-color);
}

.vf-wizard__button:disabled {
    opacity: var(--vf-wizard-disabled-opacity);
    cursor: not-allowed;
}

.vf-wizard__button_secondary {
    border-color: var(--vf-wizard-secondary-button-border-color);
    background-color: var(--vf-wizard-secondary-button-background-color);
    color: var(--vf-wizard-secondary-button-text-color);
}

.vf-wizard__button_secondary:hover:not(:disabled) {
    background-color: var(--vf-wizard-secondary-button-hover-background-color);
}

.vf-wizard_disabled {
    opacity: var(--vf-wizard-disabled-opacity);
}

.vf-wizard_disabled * {
    pointer-events: none;
}
</style>
