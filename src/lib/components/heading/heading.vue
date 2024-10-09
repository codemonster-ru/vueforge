<template>
    <render :class='`cm-heading-${type.substring(1)}`' />
</template>

<script setup lang='ts'>
import { h, useSlots, defineProps } from 'vue';

interface Props {
    type?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'h1',
});
const slots = useSlots();
const render = () => h(props.type, slots.default());
</script>

<style lang='scss'>
.cm-heading-1 {
    font-size: 24px;
    line-height: 32px;
}

.cm-heading-2 {
    font-size: 20px;
    line-height: 28px;
}

.cm-heading-3 {
    font-size: 18px;
    line-height: 26px;
}

.cm-heading-4 {
    font-size: 16px;
    line-height: 24px;
}

.cm-heading-5 {
    font-size: 14px;
    line-height: 22px;
}

.cm-heading-6 {
    font-size: 12px;
    line-height: 20px;
}

.cm-heading-1,
.cm-heading-2,
.cm-heading-3,
.cm-heading-4,
.cm-heading-5,
.cm-heading-6 {
    margin: 0;
    font-weight: 600;
}
</style>