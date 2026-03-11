<template>
    <component :is="as" class="vf-input-group__addon">
        <slot />
    </component>
</template>

<script setup lang="ts">
interface Props {
    as?: string;
}

withDefaults(defineProps<Props>(), {
    as: 'span',
});
</script>
