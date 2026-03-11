<template>
    <div v-show="isActive" :id="panelId" class="vf-tab-panel" role="tabpanel" tabindex="0" :aria-labelledby="tabId">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { tabsKey, type TabsContext, type TabValue } from './tabs-context';

interface Props {
    value: TabValue;
}

const props = defineProps<Props>();
const context = inject<TabsContext | null>(tabsKey, null);

const isActive = computed(() => context?.activeValue.value === props.value);
const tabId = computed(() => (context ? context.getTabId(props.value) : undefined));
const panelId = computed(() => (context ? context.getPanelId(props.value) : undefined));
</script>

<style lang="scss">
.vf-tab-panel {
    padding: var(--vf-tabs-panel-padding);
    border-radius: var(--vf-tabs-panel-border-radius);
    background-color: var(--vf-tabs-panel-background-color);
    color: var(--vf-tabs-panel-text-color);
}
</style>
