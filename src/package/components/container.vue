<template>
    <component :is="as" :class="getClass" :style="containerStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
    as?: string;
    size?: Size;
    maxWidth?: string;
    paddingX?: string;
}

defineOptions({ name: 'VfContainer' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    size: 'lg',
    maxWidth: '',
    paddingX: '',
});

const getClass = computed(() => {
    return ['vf-container', `vf-container_${props.size}`];
});

const containerStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.maxWidth) {
        styles['--vf-container-max-width-override'] = props.maxWidth;
    }

    if (props.paddingX) {
        styles['--vf-container-padding-x-override'] = props.paddingX;
    }

    return styles;
});
</script>

<style lang="scss">
.vf-container {
    --vf-container-max-width-current: var(--vf-container-max-width);
    --vf-container-padding-x-current: var(--vf-container-padding-x);
    box-sizing: border-box;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-width: var(--vf-container-max-width-override, var(--vf-container-max-width-current));
    padding-right: var(--vf-container-padding-x-override, var(--vf-container-padding-x-current));
    padding-left: var(--vf-container-padding-x-override, var(--vf-container-padding-x-current));
}

.vf-container_sm {
    --vf-container-max-width-current: var(--vf-container-max-width-sm, var(--vf-container-max-width));
}

.vf-container_md {
    --vf-container-max-width-current: var(--vf-container-max-width-md, var(--vf-container-max-width));
}

.vf-container_lg {
    --vf-container-max-width-current: var(--vf-container-max-width-lg, var(--vf-container-max-width));
}

.vf-container_xl {
    --vf-container-max-width-current: var(--vf-container-max-width-xl, var(--vf-container-max-width));
}

.vf-container_full {
    --vf-container-max-width-current: none;
}

@media (min-width: 640px) {
    .vf-container {
        --vf-container-padding-x-current: var(--vf-container-padding-x-sm, var(--vf-container-padding-x));
    }
}

@media (min-width: 1024px) {
    .vf-container {
        --vf-container-padding-x-current: var(
            --vf-container-padding-x-lg,
            var(--vf-container-padding-x-sm, var(--vf-container-padding-x))
        );
    }
}
</style>
