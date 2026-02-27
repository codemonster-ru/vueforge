<template>
    <component :is="as" class="vf-locale-provider">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { provideLocaleTextScope, type LocaleTextOptions } from '@/package/config/locale-text';

interface Props {
    localeText?: LocaleTextOptions;
    as?: string;
}

const props = withDefaults(defineProps<Props>(), {
    localeText: () => ({}),
    as: 'div',
});

provideLocaleTextScope(computed(() => props.localeText));
</script>
