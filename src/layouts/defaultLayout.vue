<template>
    <div class="vf-layout">
        <Header>
            <template #left>
                <slot name="headerLeft" />
            </template>
            <template #right>
                <slot name="headerRight" />
            </template>
        </Header>
        <Content>
            <Container>
                <router-view />
            </Container>
        </Content>
        <Footer>
            <Container>
                <slot name="footerDefault" />
            </Container>
        </Footer>
    </div>
</template>

<script setup lang="ts">
import { Header, Content, Footer, Container } from '@/index';
</script>

<style>
.vf-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
