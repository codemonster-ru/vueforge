<template>
    <div class="vf-popover">
        <div
            class="vf-popover__button"
            role="button"
            tabindex="0"
            aria-haspopup="dialog"
            :aria-expanded="data.visible"
            :aria-controls="panelId"
            @click="onClick"
            @keydown.enter.prevent="onClick"
            @keydown.space.prevent="onClick"
        >
            <slot name="button" />
        </div>
        <Card v-show="data.visible" :id="panelId" class="vf-popover__wrapper">
            <template v-if="$slots.default" #default>
                <slot name="default" />
            </template>
            <template v-if="$slots.header || $slots.popoverHeader" #header>
                <slot name="header" />
                <slot v-if="!$slots.header" name="popoverHeader" />
            </template>
            <template v-if="$slots.body || $slots.popoverBody" #body>
                <slot name="body" />
                <slot v-if="!$slots.body" name="popoverBody" />
            </template>
            <template v-if="$slots.footer || $slots.popoverFooter" #footer>
                <slot name="footer" />
                <slot v-if="!$slots.footer" name="popoverFooter" />
            </template>
            <div class="vf-popover__arrow"></div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import Card from '@/package/components/card.vue';
import { reactive } from 'vue';

const emits = defineEmits(['click', 'onClick']);

const data = reactive({ visible: false });
let popoverIdCounter = 0;
const panelId = `vf-popover-panel-${++popoverIdCounter}`;
const show = () => (data.visible = true);
const hide = () => (data.visible = false);
const toggle = () => (data.visible = !data.visible);
const onClick = () => {
    toggle();
    emits('click');
    emits('onClick');
};

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
