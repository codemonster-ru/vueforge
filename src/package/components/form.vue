<template>
    <form
        ref="formRef"
        :class="getClass"
        :id="id"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :novalidate="novalidate"
        @submit.prevent="onSubmit"
        @reset="onReset"
        @input="onInput"
        @change="onChange"
        @focusout="onBlur"
    >
        <slot
            :values="values"
            :errors="errors"
            :touched="touched"
            :isValid="isValid"
            :isDirty="isDirty"
            :isSubmitting="isSubmitting"
            :setFieldValue="setFieldValue"
            :setFieldTouched="setFieldTouched"
            :setFieldError="setFieldError"
            :validate="validateForm"
            :submit="submitForm"
            :reset="resetForm"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type ValidateTrigger = 'submit' | 'input' | 'change' | 'blur';

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;
export type FormTouched = Record<string, boolean>;
export type FormValidateResult = FormErrors | string | boolean | null | undefined;
export type FormValidateHandler = (values: FormValues) => FormValidateResult | Promise<FormValidateResult>;

interface Props {
    modelValue?: FormValues;
    initialValues?: FormValues;
    validate?: FormValidateHandler;
    validateOn?: ValidateTrigger | Array<ValidateTrigger>;
    disabled?: boolean;
    novalidate?: boolean;
    id?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    initialValues: undefined,
    validate: undefined,
    validateOn: 'submit',
    disabled: false,
    novalidate: true,
    id: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
});

const emits = defineEmits([
    'update:modelValue',
    'change',
    'blur',
    'validate',
    'submit',
    'invalidSubmit',
    'reset',
]);

const formRef = ref<HTMLFormElement | null>(null);
const initialSnapshot = ref<FormValues>(cloneValue(mergeRecords(props.initialValues, props.modelValue)));
const values = ref<FormValues>(cloneValue(initialSnapshot.value));
const touched = ref<FormTouched>({});
const errors = ref<FormErrors>({});
const isSubmitting = ref(false);

watch(
    () => props.modelValue,
    nextModelValue => {
        if (nextModelValue === undefined) {
            return;
        }

        if (isDeepEqual(nextModelValue, values.value)) {
            return;
        }

        values.value = cloneValue(nextModelValue);
    },
    { deep: true },
);

watch(
    () => props.initialValues,
    nextInitialValues => {
        initialSnapshot.value = cloneValue(mergeRecords(nextInitialValues, props.modelValue));
    },
    { deep: true },
);

const validationTriggers = computed(() => {
    return new Set(Array.isArray(props.validateOn) ? props.validateOn : [props.validateOn]);
});
const isValid = computed(() => !Object.keys(errors.value).length);
const isDirty = computed(() => !isDeepEqual(values.value, initialSnapshot.value));
const getClass = computed(() => {
    const classes = ['vf-form'];

    if (props.disabled) {
        classes.push('vf-form_disabled');
    }

    return classes;
});

const setFieldValue = (name: string, value: unknown, options: { emitChange?: boolean } = {}) => {
    if (!name || props.disabled) {
        return;
    }

    values.value = {
        ...values.value,
        [name]: value,
    };

    emits('update:modelValue', cloneValue(values.value));

    if (options.emitChange !== false) {
        emits('change', cloneValue(values.value), name, value);
    }
};

const setFieldTouched = (name: string, state = true) => {
    if (!name) {
        return;
    }

    touched.value = {
        ...touched.value,
        [name]: state,
    };
};

const setFieldError = (name: string, message = '') => {
    if (!name) {
        return;
    }

    const next = { ...errors.value };

    if (message) {
        next[name] = message;
    } else {
        delete next[name];
    }

    errors.value = next;
};

const markAllTouched = () => {
    const nextTouched = { ...touched.value };

    for (const key in values.value) {
        nextTouched[key] = true;
    }

    touched.value = nextTouched;
};

const shouldValidate = (trigger: ValidateTrigger) => {
    return validationTriggers.value.has(trigger);
};

const validateForm = async (trigger: ValidateTrigger = 'submit') => {
    if (!props.validate) {
        if (trigger !== 'submit') {
            emits('validate', {}, cloneValue(values.value), trigger);
        }

        return true;
    }

    const result = await props.validate(cloneValue(values.value));
    const nextErrors = normalizeValidationResult(result);

    errors.value = nextErrors;
    emits('validate', cloneValue(nextErrors), cloneValue(values.value), trigger);

    return !Object.keys(nextErrors).length;
};

const submitForm = async (event?: Event) => {
    if (props.disabled) {
        return;
    }

    isSubmitting.value = true;
    markAllTouched();

    try {
        const isFormValid = await validateForm('submit');
        const snapshot = cloneValue(values.value);

        if (!isFormValid) {
            emits('invalidSubmit', cloneValue(errors.value), snapshot, event);

            return;
        }

        emits('submit', snapshot, event);
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = (event?: Event) => {
    if (props.disabled) {
        return;
    }

    values.value = cloneValue(initialSnapshot.value);
    touched.value = {};
    errors.value = {};

    emits('update:modelValue', cloneValue(values.value));
    emits('reset', cloneValue(values.value), event);
};

const onSubmit = async (event: Event) => {
    await submitForm(event);
};

const onReset = (event: Event) => {
    event.preventDefault();
    resetForm(event);
};

const onInput = async (event: Event) => {
    const target = getNamedControl(event.target);

    if (!target) {
        return;
    }

    const name = target.name.trim();
    const value = readControlValue(target);

    setFieldValue(name, value);

    if (shouldValidate('input')) {
        await validateForm('input');
    }
};

const onChange = async (event: Event) => {
    const target = getNamedControl(event.target);

    if (!target) {
        return;
    }

    const name = target.name.trim();
    const value = readControlValue(target);

    setFieldValue(name, value);

    if (shouldValidate('change')) {
        await validateForm('change');
    }
};

const onBlur = async (event: FocusEvent) => {
    const target = getNamedControl(event.target);

    if (!target) {
        return;
    }

    const name = target.name.trim();

    setFieldTouched(name, true);
    emits('blur', name, cloneValue(values.value));

    if (shouldValidate('blur')) {
        await validateForm('blur');
    }
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(item => cloneValue(item)) as T;
    }

    if (isPlainObject(value)) {
        const cloned: Record<string, unknown> = {};

        for (const key in value) {
            cloned[key] = cloneValue(value[key]);
        }

        return cloned as T;
    }

    return value;
}

function isDeepEqual(left: unknown, right: unknown): boolean {
    if (left === right) {
        return true;
    }

    if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length !== right.length) {
            return false;
        }

        for (let index = 0; index < left.length; index += 1) {
            if (!isDeepEqual(left[index], right[index])) {
                return false;
            }
        }

        return true;
    }

    if (isPlainObject(left) && isPlainObject(right)) {
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);

        if (leftKeys.length !== rightKeys.length) {
            return false;
        }

        for (const key of leftKeys) {
            if (!isDeepEqual(left[key], right[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}

function mergeRecords(...sources: Array<FormValues | undefined>) {
    const result: FormValues = {};

    for (const source of sources) {
        if (!source || !isPlainObject(source)) {
            continue;
        }

        for (const key in source) {
            result[key] = cloneValue(source[key]);
        }
    }

    return result;
}

function normalizeValidationResult(result: FormValidateResult): FormErrors {
    if (result === undefined || result === null || result === true) {
        return {};
    }

    if (result === false) {
        return { _form: 'Form is invalid' };
    }

    if (typeof result === 'string') {
        return { _form: result };
    }

    if (!isPlainObject(result)) {
        return {};
    }

    const normalized: FormErrors = {};

    for (const key in result) {
        const value = result[key];

        if (typeof value === 'string' && value) {
            normalized[key] = value;
        }
    }

    return normalized;
}

function getNamedControl(target: unknown): NamedControl | null {
    if (!target) {
        return null;
    }

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
    ) {
        const name = target.name?.trim();

        return name ? target : null;
    }

    return null;
}

function readControlValue(control: NamedControl): unknown {
    if (control instanceof HTMLInputElement) {
        if (control.type === 'checkbox') {
            return readCheckboxValue(control);
        }

        if (control.type === 'radio') {
            return readRadioValue(control);
        }

        if (control.type === 'file') {
            if (control.multiple) {
                return control.files ? Array.from(control.files) : [];
            }

            return control.files?.[0] ?? null;
        }

        if (control.type === 'number' || control.type === 'range') {
            return control.value === '' ? null : Number(control.value);
        }

        return control.value;
    }

    if (control instanceof HTMLSelectElement) {
        if (control.multiple) {
            return Array.from(control.selectedOptions).map(option => option.value);
        }

        return control.value;
    }

    return control.value;
}

function readCheckboxValue(control: HTMLInputElement) {
    const root = formRef.value;

    if (!root) {
        return control.checked;
    }

    const group = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).filter(
        candidate => candidate.name === control.name,
    );

    if (group.length > 1 || control.value !== 'on') {
        return group.filter(candidate => candidate.checked).map(candidate => candidate.value);
    }

    return control.checked;
}

function readRadioValue(control: HTMLInputElement) {
    const root = formRef.value;

    if (!root) {
        return control.value;
    }

    const selected = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]')).find(
        candidate => candidate.name === control.name && candidate.checked,
    );

    return selected?.value;
}

type NamedControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
</script>

<style lang="scss">
.vf-form {
    display: grid;
    gap: var(--vf-form-gap);
    color: var(--vf-form-text-color);
}

.vf-form_disabled {
    opacity: var(--vf-form-disabled-opacity);
    pointer-events: none;
}
</style>
