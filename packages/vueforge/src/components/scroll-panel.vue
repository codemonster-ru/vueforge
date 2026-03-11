<template>
    <div
        ref="viewport"
        class="vf-scrollpanel"
        :class="rootClass"
        :style="viewportStyle"
        :role="role"
        :aria-label="ariaLabel || undefined"
        :tabindex="tabIndex"
    >
        <div class="vf-scrollpanel__content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type ScrollToBehavior = 'auto' | 'smooth';

interface Props {
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    alwaysShow?: boolean;
    role?: string;
    ariaLabel?: string;
    tabIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    height: '16rem',
    minHeight: undefined,
    maxHeight: undefined,
    alwaysShow: false,
    role: 'region',
    ariaLabel: 'Scrollable region',
    tabIndex: 0,
});

const viewport = ref<HTMLElement | null>(null);

const rootClass = computed(() => {
    const classes: Array<string> = [];

    if (props.alwaysShow) {
        classes.push('vf-scrollpanel_always-show');
    }

    return classes;
});

const viewportStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.height) {
        styles.height = props.height;
    }
    if (props.minHeight) {
        styles.minHeight = props.minHeight;
    }
    if (props.maxHeight) {
        styles.maxHeight = props.maxHeight;
    }

    return styles;
});

defineExpose({
    getViewport: () => viewport.value,
    scrollTo: (top: number, behavior: ScrollToBehavior = 'smooth') => {
        viewport.value?.scrollTo({ top, behavior });
    },
});
</script>

<style lang="scss">
.vf-scrollpanel {
    overflow: auto;
    border: var(--vf-border-width) solid var(--vf-scrollpanel-border-color);
    border-radius: var(--vf-scrollpanel-border-radius);
    background-color: var(--vf-scrollpanel-background-color);
    color: var(--vf-scrollpanel-text-color);
    scrollbar-width: thin;
    scrollbar-color: var(--vf-scrollpanel-scrollbar-thumb-color) var(--vf-scrollpanel-scrollbar-track-color);
}

.vf-scrollpanel:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-scrollpanel-focus-ring-color);
}

.vf-scrollpanel__content {
    padding: var(--vf-scrollpanel-content-padding);
}

.vf-scrollpanel::-webkit-scrollbar {
    width: var(--vf-scrollpanel-scrollbar-size);
    height: var(--vf-scrollpanel-scrollbar-size);
}

.vf-scrollpanel::-webkit-scrollbar-track {
    background-color: var(--vf-scrollpanel-scrollbar-track-color);
    border-radius: 999px;
}

.vf-scrollpanel::-webkit-scrollbar-thumb {
    background-color: var(--vf-scrollpanel-scrollbar-thumb-color);
    border-radius: 999px;
}

.vf-scrollpanel_always-show {
    overflow: scroll;
}
</style>
