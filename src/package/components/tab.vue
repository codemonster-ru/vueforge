<template>
    <button
        :id="tabId"
        class="vf-tab"
        :class="{ 'vf-tab_active': isActive, 'vf-tab_disabled': isDisabled }"
        type="button"
        role="tab"
        :aria-selected="isActive"
        :aria-controls="panelId"
        :disabled="isDisabled"
        :tabindex="tabIndex"
        @click="onClick"
    >
        <slot>{{ label }}</slot>
    </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { tabsKey, type TabsContext, type TabValue } from './tabs-context';

interface Props {
    value: TabValue;
    label?: string;
    disabled?: boolean;
}

const emits = defineEmits(['change']);
const props = withDefaults(defineProps<Props>(), {
    label: '',
    disabled: false,
});

const context = inject<TabsContext | null>(tabsKey, null);

const isActive = computed(() => context?.activeValue.value === props.value);
const isDisabled = computed(() => (context?.disabled.value ?? false) || props.disabled);
const tabId = computed(() => (context ? context.getTabId(props.value) : undefined));
const panelId = computed(() => (context ? context.getPanelId(props.value) : undefined));
const tabIndex = computed(() => {
    if (isDisabled.value) {
        return -1;
    }

    return isActive.value ? 0 : -1;
});

const onClick = (event: Event) => {
    if (!context || isDisabled.value) {
        return;
    }

    context.onChange(props.value, event);

    emits('change', props.value, event);
};
</script>

<style lang="scss">
.vf-tab {
    padding: var(--vf-tabs-tab-padding);
    border: none;
    border-bottom: var(--vf-tabs-tab-active-border-width) solid transparent;
    background-color: var(--vf-tabs-tab-background-color);
    color: var(--vf-tabs-tab-text-color);
    font-size: var(--vf-tabs-tab-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    border-radius: var(--vf-tabs-tab-border-radius);
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
}

.vf-tab:hover:not(.vf-tab_disabled) {
    background-color: var(--vf-tabs-tab-hover-background-color);
}

.vf-tab_active {
    color: var(--vf-tabs-tab-active-text-color);
    background-color: var(--vf-tabs-tab-active-background-color);
    border-bottom-color: var(--vf-tabs-tab-active-border-color);
}

.vf-tabs_vertical .vf-tab_active {
    border-bottom-color: transparent;
    border-right: var(--vf-tabs-tab-active-border-width) solid var(--vf-tabs-tab-active-border-color);
}

.vf-tabs_vertical .vf-tab {
    border-bottom: none;
    border-right: var(--vf-tabs-tab-active-border-width) solid transparent;
}

.vf-tab_disabled {
    opacity: var(--vf-tabs-disabled-opacity);
    cursor: not-allowed;
}
</style>
