<template>
    <div class='cm-logo'>
        <img :src='src' :width='width' :height='height' :alt='alt'>
    </div>
</template>

<script setup lang='ts'>
import('./logo.css');

defineProps<{
    src: string,
    alt?: string,
    width: number,
    height: number,
}>();
</script>