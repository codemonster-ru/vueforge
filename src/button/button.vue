<template>
    <button class='cm-button' :class='`cm-button_${variant}`'>
        <template v-if='$slots.default'>
            <slot />
        </template>
        <template v-else>
            {{ label }}
        </template>
    </button>
</template>

<script setup lang='ts'>
import('./button.scss');
import { defineProps } from 'vue';

interface Props {
    label?: string,
    variant: string,
}

withDefaults(defineProps<Props>(), {
    label: '',
    variant: 'primary',
});
</script>