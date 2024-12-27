<template>
    <header class='cm-header'>
        <Container>
            <div v-if='$slots.left' class='cm-header__left'>
                <slot name='left' />
            </div>
            <div v-if='$slots.right' class='cm-header__right'>
                <slot name='right' />
            </div>
        </Container>
    </header>
</template>

<script setup lang='ts'>
import { Container } from '..';
</script>

<style lang='scss'>
.cm-header {
    height: var(--cm-header-height);
    min-height: var(--cm-header-min-height);
    display: flex;
    padding-top: var(--cm-header-padding);
    border-bottom: 1px solid var(--cm-header-border-color);
    margin-bottom: 24px;
    padding-bottom: var(--cm-header-padding);
    background-color: var(--cm-header-background-color);

    .cm-container {
        align-items: center;
        justify-content: space-between;
    }
}

.cm-header__left,
.cm-header__right {
    display: flex;
    align-items: center;
}
</style>