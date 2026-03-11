<template>
    <template v-if="isClient">
        <slot />
    </template>
    <template v-else>
        <slot name="fallback">
            <component :is="fallbackTag" v-if="placeholder" class="vf-no-ssr__placeholder" aria-hidden="true" />
        </slot>
    </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Props {
    placeholder?: boolean;
    fallbackTag?: string;
}

const { placeholder = true, fallbackTag = 'span' } = defineProps<Props>();

const isClient = ref(false);

onMounted(() => {
    isClient.value = true;
});
</script>
