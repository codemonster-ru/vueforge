<template>
    <component :is="as" :class="sectionClass" :style="sectionStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Background = 'transparent' | 'surface' | 'muted' | 'elevated';

interface Props {
    as?: string;
    paddingY?: string;
    background?: Background;
    bordered?: boolean;
}

defineOptions({ name: 'VfSection' });

const props = withDefaults(defineProps<Props>(), {
    as: 'section',
    paddingY: '',
    background: 'transparent',
    bordered: false,
});

const sectionClass = computed(() => {
    return ['vf-section', `vf-section_background-${props.background}`, { 'vf-section_bordered': props.bordered }];
});

const sectionStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.paddingY) {
        styles['--vf-section-padding-y-override'] = props.paddingY;
    }

    return styles;
});
</script>

<style lang="scss">
.vf-section {
    --vf-section-padding-y-current: var(--vf-section-padding-y);
    box-sizing: border-box;
    padding-top: var(--vf-section-padding-y-override, var(--vf-section-padding-y-current));
    padding-bottom: var(--vf-section-padding-y-override, var(--vf-section-padding-y-current));
}

.vf-section_background-transparent {
    --vf-section-background-color-current: transparent;
}

.vf-section_background-surface {
    --vf-section-background-color-current: var(--vf-section-background-color-surface);
}

.vf-section_background-muted {
    --vf-section-background-color-current: var(--vf-section-background-color-muted);
}

.vf-section_background-elevated {
    --vf-section-background-color-current: var(--vf-section-background-color-elevated);
}

.vf-section {
    background-color: var(--vf-section-background-color-current);
}

.vf-section_bordered {
    border-top: var(--vf-border-width) solid var(--vf-section-border-color);
    border-bottom: var(--vf-border-width) solid var(--vf-section-border-color);
}

@media (min-width: 640px) {
    .vf-section {
        --vf-section-padding-y-current: var(--vf-section-padding-y-sm, var(--vf-section-padding-y));
    }
}

@media (min-width: 1024px) {
    .vf-section {
        --vf-section-padding-y-current: var(
            --vf-section-padding-y-lg,
            var(--vf-section-padding-y-sm, var(--vf-section-padding-y))
        );
    }
}
</style>
