<template>
    <div class='welcome'>
        <h1 class='welcome__heading'>UI component suite for Vue.js</h1>
        <p class='welcome__description'>Enhance your web applications with comprehensive suite of customizable,
            feature-rich UI components.</p>
        <cm-button :to='{ name: "docs" }' type='router-link'>Get started</cm-button>
    </div>
</template>

<script setup lang='ts'>
import { CmButton } from '@/lib';
</script>

<style lang='scss'>
.welcome {
    width: 100%;
    padding: 70px 0;
    text-align: center;
}

.welcome__heading {
    font-size: 36px;
    line-height: 44px;
    margin-bottom: 12px;
}

.welcome__description {
    color: var(--cm-secondary-text-color);
    font-size: 18px;
    margin-bottom: 28px;
}
</style>