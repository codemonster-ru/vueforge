<template>
    <component :is="as" class="vf-stack" :style="stackStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

interface Props {
    as?: string;
    gap?: string;
    align?: Align;
    justify?: Justify;
    wrap?: Wrap;
}

defineOptions({ name: 'VfStack' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    gap: '',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
});

const stackStyle = computed(() => {
    const styles: Record<string, string> = {
        '--vf-stack-align-items-override': props.align,
        '--vf-stack-justify-content-override': props.justify,
        '--vf-stack-wrap-override': props.wrap,
    };

    if (props.gap) {
        styles['--vf-stack-gap-override'] = props.gap;
    }

    return styles;
});
</script>

<style lang="scss">
.vf-stack {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: var(--vf-stack-gap-override, var(--vf-stack-gap));
    align-items: var(--vf-stack-align-items-override, var(--vf-stack-align-items));
    justify-content: var(--vf-stack-justify-content-override, var(--vf-stack-justify-content));
    flex-wrap: var(--vf-stack-wrap-override, var(--vf-stack-wrap));
}

.vf-stack > * {
    min-width: 0;
}
</style>
