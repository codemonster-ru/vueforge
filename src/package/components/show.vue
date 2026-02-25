<template>
    <component :is="as" v-if="isVisible">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
    as?: string;
    from?: Breakpoint;
    to?: Breakpoint;
    when?: boolean;
}

defineOptions({ name: 'VfShow' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    from: undefined,
    to: undefined,
    when: true,
});

const bpMin: Record<Breakpoint, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const width = ref(typeof window === 'undefined' ? Number.POSITIVE_INFINITY : window.innerWidth);

const syncWidth = () => {
    if (typeof window === 'undefined') {
        return;
    }

    width.value = window.innerWidth;
};

const isVisible = computed(() => {
    if (!props.when) {
        return false;
    }

    if (props.from && width.value < bpMin[props.from]) {
        return false;
    }

    if (props.to && width.value >= bpMin[props.to]) {
        return false;
    }

    return true;
});

if (typeof window !== 'undefined') {
    window.addEventListener('resize', syncWidth, false);
}

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', syncWidth, false);
    }
});
</script>
