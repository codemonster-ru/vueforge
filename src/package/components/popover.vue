<template>
    <div class="vf-popover">
        <div class="vf-popover__button" @click="onClick">
            <slot name="button" />
        </div>
        <Card v-show="data.visible" class="vf-popover__wrapper">
            <template v-if="$slots.default" #default>
                <slot name="default" />
            </template>
            <template v-if="$slots.popoverHeader" #header>
                <slot name="popoverHeader" />
            </template>
            <template v-if="$slots.popoverBody" #body>
                <slot name="popoverBody" />
            </template>
            <template v-if="$slots.popoverFooter" #footer>
                <slot name="popoverFooter" />
            </template>
            <div class="vf-popover__arrow"></div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card } from '@/index';
import { reactive } from 'vue';

const emits = defineEmits(['onClick']);

const data = reactive({ visible: false });
const show = () => (data.visible = true);
const hide = () => (data.visible = false);
const toggle = () => (data.visible = !data.visible);
const onClick = () => emits('onClick');

defineExpose({ show, hide, toggle });
</script>

<style lang="scss">
.vf-popover {
    position: relative;
}

.vf-popover__button {
    cursor: pointer;
    user-select: none;
}

.vf-popover__wrapper {
    position: absolute;
    background-color: var(--vf-popover-background-color);
}
</style>
