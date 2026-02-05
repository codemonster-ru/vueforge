import type { ComputedRef } from 'vue';

export type AccordionValue = string | number;
export type AccordionVariant = 'filled' | 'outlined';
export type AccordionSize = 'small' | 'normal' | 'large';

export type AccordionContext = {
    modelValue: ComputedRef<AccordionValue | AccordionValue[] | undefined>;
    multiple: ComputedRef<boolean>;
    disabled: ComputedRef<boolean>;
    variant: ComputedRef<AccordionVariant>;
    size: ComputedRef<AccordionSize>;
    onToggle: (value: AccordionValue, event: Event) => void;
    getHeaderId: (value: AccordionValue) => string;
    getPanelId: (value: AccordionValue) => string;
};

export const accordionKey = Symbol('VueForgeAccordion');
