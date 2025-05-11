<template>
    <div class="vf-layout">
        <Header>
            <slot name="header" />
        </Header>
        <Content>
            <slot name="content" />
        </Content>
        <Footer>
            <slot name="footer" />
        </Footer>
    </div>
</template>

<script setup lang="ts">
import { Header, Content, Footer } from '@/index';
</script>

<style>
.vf-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
