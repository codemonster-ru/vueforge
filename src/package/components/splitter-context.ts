import type { ComputedRef, InjectionKey, StyleValue } from 'vue';

export type SplitterDirection = 'horizontal' | 'vertical';

export type SplitterPanelConfig = {
    id: string;
    size?: number;
    minSize?: number;
};

export type SplitterContext = {
    direction: ComputedRef<SplitterDirection>;
    disabled: ComputedRef<boolean>;
    registerPanel: (config: Omit<SplitterPanelConfig, 'id'>) => string;
    unregisterPanel: (id: string) => void;
    getPanelStyle: (id: string) => StyleValue;
};

export const splitterKey: InjectionKey<SplitterContext> = Symbol('VueForgeSplitter');
