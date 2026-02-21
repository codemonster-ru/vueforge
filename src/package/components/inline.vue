<template>
    <component :is="as" class="vf-inline" :style="inlineStyle">
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

defineOptions({ name: 'VfInline' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    gap: '',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
});

const inlineStyle = computed(() => {
    const styles: Record<string, string> = {
        '--vf-inline-align-items-override': props.align,
        '--vf-inline-justify-content-override': props.justify,
        '--vf-inline-wrap-override': props.wrap,
    };

    if (props.gap) {
        styles['--vf-inline-gap-override'] = props.gap;
    }

    return styles;
});
</script>

<style lang="scss">
.vf-inline {
    display: flex;
    flex-direction: row;
    min-width: 0;
    gap: var(--vf-inline-gap-override, var(--vf-inline-gap));
    align-items: var(--vf-inline-align-items-override, var(--vf-inline-align-items));
    justify-content: var(--vf-inline-justify-content-override, var(--vf-inline-justify-content));
    flex-wrap: var(--vf-inline-wrap-override, var(--vf-inline-wrap));
}

.vf-inline > * {
    min-width: 0;
}
</style>
