<template>
    <div :class="getClass">
        <div
            ref="list"
            class="vf-tabs__list"
            role="tablist"
            :aria-orientation="orientation"
            :aria-label="ariaLabel || undefined"
            :aria-labelledby="ariaLabelledby || undefined"
            @keydown="onKeydown"
        >
            <slot name="tabs" />
        </div>
        <div class="vf-tabs__panels">
            <slot name="panels" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { tabsKey, type TabsContext, type TabsOrientation, type TabValue } from './tabs-context';

let tabsIdCounter = 0;

interface Props {
    modelValue?: TabValue;
    disabled?: boolean;
    orientation?: TabsOrientation;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    disabled: false,
    orientation: 'horizontal',
});

const uid = ++tabsIdCounter;
const normalizeId = (value: TabValue) =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');

const getClass = computed(() => {
    const classes = ['vf-tabs'];

    if (props.orientation === 'vertical') {
        classes.push('vf-tabs_vertical');
    }

    if (props.disabled) {
        classes.push('vf-tabs_disabled');
    }

    return classes;
});

const list = ref<HTMLElement | null>(null);

const getEnabledTabs = () => {
    if (!list.value) {
        return [];
    }

    return Array.from(list.value.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
};

const focusTab = (next: HTMLButtonElement | undefined) => {
    if (!next) {
        return;
    }

    next.focus();
    next.click();
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled) {
        return;
    }

    const isHorizontal = props.orientation === 'horizontal';
    const key = event.key;
    const nextKeys = isHorizontal ? ['ArrowRight'] : ['ArrowDown'];
    const prevKeys = isHorizontal ? ['ArrowLeft'] : ['ArrowUp'];

    if (![...nextKeys, ...prevKeys, 'Home', 'End'].includes(key)) {
        return;
    }

    const tabs = getEnabledTabs();

    if (!tabs.length) {
        return;
    }

    const activeIndex = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    const focusedIndex = tabs.findIndex(tab => tab === document.activeElement);
    const currentIndex = focusedIndex >= 0 ? focusedIndex : Math.max(activeIndex, 0);

    let nextIndex = currentIndex;

    if (nextKeys.includes(key)) {
        nextIndex = (currentIndex + 1) % tabs.length;
    } else if (prevKeys.includes(key)) {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === 'Home') {
        nextIndex = 0;
    } else if (key === 'End') {
        nextIndex = tabs.length - 1;
    }

    event.preventDefault();

    focusTab(tabs[nextIndex]);
};

const onChange = (value: TabValue, event: Event) => {
    emits('update:modelValue', value);
    emits('change', value, event);
};

const context: TabsContext = {
    activeValue: computed(() => props.modelValue),
    disabled: computed(() => props.disabled),
    orientation: computed(() => props.orientation),
    onChange,
    getTabId: (value: TabValue) => `vf-tab-${uid}-${normalizeId(value)}`,
    getPanelId: (value: TabValue) => `vf-tabpanel-${uid}-${normalizeId(value)}`,
};

provide(tabsKey, context);
</script>

<style lang="scss">
.vf-tabs {
    display: flex;
    flex-direction: column;
    gap: var(--vf-tabs-gap);
}

.vf-tabs__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-tabs-list-gap);
    border-bottom: var(--vf-tabs-list-border-width) solid var(--vf-tabs-list-border-color);
}

.vf-tabs__panels {
    display: block;
}

.vf-tabs_vertical {
    flex-direction: row;
    align-items: flex-start;

    .vf-tabs__list {
        flex-direction: column;
        border-bottom: none;
        border-right: var(--vf-tabs-list-border-width) solid var(--vf-tabs-list-border-color);
        padding-right: var(--vf-tabs-list-vertical-padding);
    }

    .vf-tabs__panels {
        flex: 1;
    }
}

.vf-tabs_disabled {
    opacity: var(--vf-tabs-disabled-opacity);
}
</style>
