<template>
    <component
        :is="as"
        class="vf-sticky-region"
        :class="rootClass"
        :style="regionStyle"
        :role="landmarkRole"
        :aria-label="ariaLabel || undefined"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type StickyEdge = 'top' | 'bottom';

interface Props {
    as?: string;
    edge?: StickyEdge;
    offset?: string;
    zIndex?: string | number;
    bordered?: boolean;
    shadow?: boolean;
    ariaLabel?: string;
}

defineOptions({ name: 'VfStickyRegion' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    edge: 'top',
    offset: '0px',
    zIndex: '',
    bordered: false,
    shadow: false,
    ariaLabel: '',
});

const landmarkRole = computed(() => {
    const semanticTag = props.as.toLowerCase();
    if (semanticTag === 'header' || semanticTag === 'footer') {
        return undefined;
    }

    return 'region';
});

const rootClass = computed(() => {
    const classes = [`vf-sticky-region_${props.edge}`];

    if (props.bordered) {
        classes.push('vf-sticky-region_bordered');
    }

    if (props.shadow) {
        classes.push('vf-sticky-region_shadow');
    }

    return classes;
});

const regionStyle = computed(() => {
    const styles: Record<string, string> = {
        '--vf-sticky-region-offset-prop': props.offset,
    };

    if (props.zIndex !== '') {
        styles['--vf-sticky-region-z-index-prop'] = String(props.zIndex);
    }

    return styles;
});
</script>

<style lang="scss">
.vf-sticky-region {
    position: sticky;
    z-index: var(--vf-sticky-region-z-index-prop, var(--vf-sticky-region-z-index));
    padding: var(--vf-sticky-region-padding);
    background-color: var(--vf-sticky-region-background-color);
    color: var(--vf-sticky-region-text-color);
}

.vf-sticky-region_top {
    top: var(--vf-sticky-region-offset-prop);
}

.vf-sticky-region_bottom {
    bottom: var(--vf-sticky-region-offset-prop);
}

.vf-sticky-region_bordered {
    border: var(--vf-border-width) solid var(--vf-sticky-region-border-color);
}

.vf-sticky-region_shadow {
    box-shadow: var(--vf-sticky-region-shadow);
}
</style>
