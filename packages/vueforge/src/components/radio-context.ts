import type { ComputedRef } from 'vue';

export type RadioValue = string | number | boolean | null | undefined;
export type RadioVariant = 'filled' | 'outlined';

export type RadioGroupContext = {
    name: ComputedRef<string | undefined>;
    modelValue: ComputedRef<RadioValue>;
    disabled: ComputedRef<boolean>;
    variant: ComputedRef<RadioVariant>;
    onChange: (value: RadioValue, event: Event) => void;
};

export const radioGroupKey = Symbol('VueForgeRadioGroup');
