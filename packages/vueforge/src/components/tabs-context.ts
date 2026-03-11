import type { ComputedRef } from 'vue';

export type TabValue = string | number;
export type TabsOrientation = 'horizontal' | 'vertical';

export type TabsContext = {
    activeValue: ComputedRef<TabValue | undefined>;
    disabled: ComputedRef<boolean>;
    orientation: ComputedRef<TabsOrientation>;
    onChange: (value: TabValue, event: Event) => void;
    getTabId: (value: TabValue) => string;
    getPanelId: (value: TabValue) => string;
};

export const tabsKey = Symbol('VueForgeTabs');
