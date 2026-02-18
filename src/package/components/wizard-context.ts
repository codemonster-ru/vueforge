import type { ComputedRef, InjectionKey } from 'vue';

export type WizardValue = string | number;

export type WizardContext = {
    activeValue: ComputedRef<WizardValue | undefined>;
    getPanelId: (value: WizardValue) => string;
    getStepId: (value: WizardValue) => string;
    isActive: (value: WizardValue) => boolean;
};

export const wizardKey: InjectionKey<WizardContext> = Symbol('VueForgeWizard');
