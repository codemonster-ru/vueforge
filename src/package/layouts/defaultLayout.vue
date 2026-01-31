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
import Header from '@/package/components/header.vue';
import Content from '@/package/components/content.vue';
import Footer from '@/package/components/footer.vue';
</script>

<style>
.vf-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
