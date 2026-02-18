<template>
    <div :class="getClass" :style="panelStyle">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';
import { splitterKey } from './splitter-context';

interface Props {
    size?: number;
    minSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    size: undefined,
    minSize: undefined,
});

const splitter = inject(splitterKey, null);

if (!splitter) {
    throw new Error('SplitterPanel must be used inside Splitter');
}

const panelId = splitter.registerPanel({
    size: props.size,
    minSize: props.minSize,
});

onBeforeUnmount(() => {
    splitter.unregisterPanel(panelId);
});

const getClass = computed(() => {
    return [
        'vf-splitter__panel',
        splitter.direction.value === 'vertical' ? 'vf-splitter__panel_vertical' : '',
        splitter.disabled.value ? 'vf-splitter__panel_disabled' : '',
    ];
});
const panelStyle = computed(() => splitter.getPanelStyle(panelId));
</script>

<style lang="scss">
.vf-splitter__panel {
    position: relative;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    box-sizing: border-box;
    background-color: var(--vf-splitter-panel-background-color);
}

.vf-splitter__panel_disabled {
    user-select: none;
}
</style>
