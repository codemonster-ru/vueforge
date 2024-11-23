<template>
    <div class='cm-popover'>
        <div class='cm-popover__button' @click='onClick'>
            <slot name='button' />
        </div>
        <cm-card v-show='data.visible' class='cm-popover__wrapper'>
            <template v-if='$slots.default' #default>
                <slot name='default' />
            </template>
            <template v-if='$slots.popoverHeader' #header>
                <slot name='popoverHeader' />
            </template>
            <template v-if='$slots.popoverBody' #body>
                <slot name='popoverBody' />
            </template>
            <template v-if='$slots.popoverFooter' #footer>
                <slot name='popoverFooter' />
            </template>
            <div class='cm-popover__arrow'></div>
        </cm-card>
    </div>
</template>

<script setup lang='ts'>
import { CmCard } from '@/lib';
import { defineEmits, reactive } from 'vue';

const emits = defineEmits(['onClick']);

const data = reactive({ visible: false });
const show = () => data.visible = true;
const hide = () => data.visible = false;
const toggle = () => data.visible = !data.visible;
const onClick = () => emits('onClick');

defineExpose({ show, hide, toggle });
</script>

<style lang='scss'>
.cm-popover {
    position: relative;
}

.cm-popover__button {
    cursor: pointer;
    user-select: none;
}

.cm-popover__wrapper {
    position: absolute;
    background-color: var(--cm-popover-background-color);
}

//Theme
:root {
    --cm-popover-background-color: var(--cm-bg);
}
</style>