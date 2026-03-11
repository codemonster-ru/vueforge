<template>
    <component :is="as" class="vf-app-bar" :class="rootClass" :style="barStyle" :aria-label="ariaLabel || undefined">
        <div v-if="$slots.start" class="vf-app-bar__start">
            <slot name="start" />
        </div>

        <div class="vf-app-bar__title">
            <slot name="title">{{ title }}</slot>
            <slot />
        </div>

        <div v-if="$slots.actions" class="vf-app-bar__actions" role="group" :aria-label="actionsAriaLabel || undefined">
            <slot name="actions" />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

interface Props {
    as?: string;
    title?: string;
    fixed?: boolean;
    sticky?: boolean;
    dense?: boolean;
    mobileBreakpoint?: number;
    collapseActionsOnMobile?: boolean;
    height?: string;
    denseHeight?: string;
    zIndex?: string | number;
    ariaLabel?: string;
    actionsAriaLabel?: string;
}

defineOptions({ name: 'VfAppBar' });

const props = withDefaults(defineProps<Props>(), {
    as: 'header',
    title: '',
    fixed: false,
    sticky: true,
    dense: false,
    mobileBreakpoint: 768,
    collapseActionsOnMobile: true,
    height: '',
    denseHeight: '',
    zIndex: '',
    ariaLabel: '',
    actionsAriaLabel: 'App bar actions',
});

const isMobile = ref(false);

const syncViewport = () => {
    if (typeof window === 'undefined') {
        return;
    }

    isMobile.value = window.innerWidth <= props.mobileBreakpoint;
};

const rootClass = computed(() => {
    const classes: Array<string> = [];

    if (props.fixed) {
        classes.push('vf-app-bar_fixed');
    } else if (props.sticky) {
        classes.push('vf-app-bar_sticky');
    }

    if (props.dense) {
        classes.push('vf-app-bar_dense');
    }

    if (isMobile.value) {
        classes.push('vf-app-bar_mobile');
    }

    if (isMobile.value && props.collapseActionsOnMobile) {
        classes.push('vf-app-bar_mobile-actions');
    }

    return classes;
});

const barStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.height) {
        styles['--vf-app-bar-height-prop'] = props.height;
    }

    if (props.denseHeight) {
        styles['--vf-app-bar-dense-height-prop'] = props.denseHeight;
    }

    if (props.zIndex !== '') {
        styles['--vf-app-bar-z-index-prop'] = String(props.zIndex);
    }

    return styles;
});

if (typeof window !== 'undefined') {
    syncViewport();
    window.addEventListener('resize', syncViewport, false);
}

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', syncViewport, false);
    }
});
</script>

<style lang="scss">
.vf-app-bar {
    min-height: var(--vf-app-bar-height-prop, var(--vf-app-bar-height));
    padding: var(--vf-app-bar-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-app-bar-border-color);
    background-color: var(--vf-app-bar-background-color);
    color: var(--vf-app-bar-text-color);
    display: flex;
    align-items: center;
    gap: var(--vf-app-bar-gap);
    width: 100%;
    z-index: var(--vf-app-bar-z-index-prop, var(--vf-app-bar-z-index));
}

.vf-app-bar_fixed {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
}

.vf-app-bar_sticky {
    position: sticky;
    inset-block-start: 0;
}

.vf-app-bar_dense {
    min-height: var(--vf-app-bar-dense-height-prop, var(--vf-app-bar-dense-height));
    padding: var(--vf-app-bar-dense-padding);
}

.vf-app-bar__start {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-app-bar-actions-gap);
    flex: 0 0 auto;
}

.vf-app-bar__title {
    min-width: 0;
    flex: 1 1 auto;
}

.vf-app-bar__actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--vf-app-bar-actions-gap);
    margin-inline-start: auto;
    flex: 0 0 auto;
}

.vf-app-bar_mobile {
    padding: var(--vf-app-bar-mobile-padding);
}

.vf-app-bar_mobile-actions .vf-app-bar__actions {
    margin-inline-start: 0;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
}
</style>
