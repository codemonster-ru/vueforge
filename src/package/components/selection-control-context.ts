import type { ComputedRef, InjectionKey } from 'vue';

export type SelectionControlType = 'checkbox' | 'radio' | 'switch';
export type SelectionControlValue = string | number | boolean;

export interface SelectionControlGroupContext {
    type: ComputedRef<SelectionControlType>;
    modelValue: ComputedRef<unknown>;
    disabled: ComputedRef<boolean>;
    name: ComputedRef<string | undefined>;
    multiple: ComputedRef<boolean>;
    onControlChange: (payload: { checked: boolean; value: SelectionControlValue; event: Event }) => void;
}

export const selectionControlGroupKey: InjectionKey<SelectionControlGroupContext> =
    Symbol('vf-selection-control-group');
