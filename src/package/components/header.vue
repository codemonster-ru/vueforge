<template>
    <header class="vf-header">
        <Container>
            <div v-if="$slots.left" class="vf-header__left">
                <slot name="left" />
            </div>
            <div v-if="$slots.right" class="vf-header__right">
                <slot name="right" />
            </div>
        </Container>
    </header>
</template>

<script setup lang="ts">
import { Container } from '@/index';
</script>

<style lang="scss">
.vf-header {
    height: var(--vf-header-height);
    min-height: var(--vf-header-min-height);
    display: flex;
    padding-top: var(--vf-header-padding);
    border-bottom: 1px solid var(--vf-header-border-color);
    margin-bottom: 24px;
    padding-bottom: var(--vf-header-padding);
    background-color: var(--vf-header-background-color);

    .vf-container {
        align-items: center;
        justify-content: space-between;
    }
}

.vf-header__left,
.vf-header__right {
    display: flex;
    align-items: center;
}
</style>
