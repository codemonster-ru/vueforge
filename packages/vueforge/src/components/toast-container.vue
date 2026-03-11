<template>
    <Teleport to="body">
        <div class="vf-toast-container" :class="positionClass" role="region" aria-live="polite" :aria-label="ariaLabel">
            <slot />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface Props {
    position?: ToastPosition;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    position: 'top-right',
    ariaLabel: 'Notifications',
});

const positionClass = computed(() => `vf-toast-container_${props.position}`);
const ariaLabel = computed(() => props.ariaLabel || undefined);
</script>

<style lang="scss">
.vf-toast-container {
    position: fixed;
    z-index: var(--vf-toast-z-index);
    display: flex;
    flex-direction: column;
    gap: var(--vf-toast-container-gap);
    padding: var(--vf-toast-container-padding);
    max-width: var(--vf-toast-container-max-width);
}

.vf-toast-container_top-right {
    top: 0;
    right: 0;
    align-items: flex-end;
}

.vf-toast-container_top-left {
    top: 0;
    left: 0;
    align-items: flex-start;
}

.vf-toast-container_bottom-right {
    bottom: 0;
    right: 0;
    align-items: flex-end;
}

.vf-toast-container_bottom-left {
    bottom: 0;
    left: 0;
    align-items: flex-start;
}
</style>
