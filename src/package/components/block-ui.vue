<template>
    <div class="vf-blockui" :class="rootClass" :aria-busy="modelValue ? 'true' : 'false'">
        <div class="vf-blockui__content">
            <slot />
        </div>

        <Teleport v-if="fullScreen && modelValue" to="body">
            <div class="vf-blockui__overlay vf-blockui__overlay_fullscreen" :style="overlayStyle">
                <slot name="overlay">
                    <Spinner v-if="showSpinner" size="large" variant="inline" :aria-label="ariaLabel" />
                    <span v-if="label" class="vf-blockui__label">{{ label }}</span>
                </slot>
            </div>
        </Teleport>

        <div v-else-if="modelValue" class="vf-blockui__overlay" :style="overlayStyle">
            <slot name="overlay">
                <Spinner v-if="showSpinner" variant="inline" :aria-label="ariaLabel" />
                <span v-if="label" class="vf-blockui__label">{{ label }}</span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import Spinner from './spinner.vue';

type OverlayVariant = 'soft' | 'dim';

interface Props {
    modelValue?: boolean;
    fullScreen?: boolean;
    showSpinner?: boolean;
    label?: string;
    ariaLabel?: string;
    zIndex?: number | string | null;
    variant?: OverlayVariant;
    blur?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    fullScreen: false,
    showSpinner: true,
    label: '',
    ariaLabel: 'Loading',
    zIndex: null,
    variant: 'soft',
    blur: false,
});

const emits = defineEmits(['block', 'unblock']);

watch(
    () => props.modelValue,
    value => {
        emits(value ? 'block' : 'unblock');
    },
);

const rootClass = computed(() => {
    const classes = [`vf-blockui_${props.variant}`];

    if (props.blur) {
        classes.push('vf-blockui_blur');
    }

    return classes;
});

const overlayStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.zIndex != null && props.zIndex !== '') {
        styles.zIndex = String(props.zIndex);
    }

    return styles;
});
</script>

<style lang="scss">
.vf-blockui {
    position: relative;
}

.vf-blockui__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--vf-blockui-gap);
    border-radius: inherit;
    background-color: var(--vf-blockui-overlay-background-color);
    color: var(--vf-blockui-text-color);
    pointer-events: all;
    z-index: var(--vf-blockui-z-index);
}

.vf-blockui__overlay_fullscreen {
    position: fixed;
    border-radius: 0;
}

.vf-blockui__label {
    font-size: var(--vf-blockui-label-font-size);
    font-weight: var(--vf-blockui-label-font-weight);
}

.vf-blockui_dim .vf-blockui__overlay {
    background-color: var(--vf-blockui-overlay-dim-background-color);
}

.vf-blockui_blur .vf-blockui__overlay {
    backdrop-filter: blur(var(--vf-blockui-blur-size));
}

.vf-blockui :deep(.vf-spinner) {
    color: var(--vf-blockui-text-color);
}
</style>
