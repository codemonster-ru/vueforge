<template>
    <component :is="as" class="vf-defaults-provider">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { provideComponentDefaults, type ComponentDefaultsMap } from '@/package/config/defaults-provider';

interface Props {
    defaults?: ComponentDefaultsMap;
    as?: string;
}

const props = withDefaults(defineProps<Props>(), {
    defaults: () => ({}),
    as: 'div',
});

provideComponentDefaults(computed(() => props.defaults));
</script>
