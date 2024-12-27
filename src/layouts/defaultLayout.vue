<template>
    <Header>
        <template #left>
            <slot name='headerLeft' />
        </template>
        <template #right>
            <slot name='headerRight' />
        </template>
    </Header>
    <Content>
        <Container>
            <router-view />
        </Container>
    </Content>
    <Footer>
        <Container>
            <slot name='footerDefault' />
        </Container>
    </Footer>
</template>

<script setup lang='ts'>
import { Header, Content, Footer, Container } from '..';
</script>