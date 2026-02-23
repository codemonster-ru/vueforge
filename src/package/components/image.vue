<template>
    <div v-bind="rootAttrs">
        <button
            v-if="preview"
            type="button"
            v-bind="triggerAttrs"
            :disabled="disabled"
            :aria-label="previewAriaLabel"
            @click="openPreview()"
        >
            <img
                v-bind="imgAttrs"
                :src="resolvedSrc"
                :alt="alt"
                :loading="loading"
                :style="imgStyle"
                @load="onLoad"
                @error="onError"
            />
        </button>
        <img
            v-else
            v-bind="imgAttrs"
            :src="resolvedSrc"
            :alt="alt"
            :loading="loading"
            :style="imgStyle"
            @load="onLoad"
            @error="onError"
        />

        <teleport to="body" :disabled="!teleport">
            <div v-if="isPreviewOpen" v-bind="overlayAttrs" @click="onOverlayClick">
                <div
                    ref="dialogRef"
                    v-bind="dialogAttrs"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="dialogAriaLabel"
                    tabindex="-1"
                    @click.stop
                >
                    <button type="button" v-bind="closeAttrs" :aria-label="closeLabel" @click="closePreview('button')">
                        &times;
                    </button>
                    <img v-bind="previewAttrs" :src="resolvedSrc" :alt="alt" />
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
type CloseReason = 'overlay' | 'esc' | 'button';

interface Props {
    src?: string;
    alt?: string;
    fallbackSrc?: string;
    fit?: ObjectFit;
    width?: string | number;
    height?: string | number;
    loading?: 'eager' | 'lazy';
    preview?: boolean;
    modelValue?: boolean;
    disabled?: boolean;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    previewAriaLabel?: string;
    dialogAriaLabel?: string;
    closeLabel?: string;
    teleport?: boolean;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    src: '',
    alt: '',
    fallbackSrc: '',
    fit: 'cover',
    width: undefined,
    height: undefined,
    loading: 'lazy',
    preview: false,
    modelValue: false,
    disabled: false,
    closeOnOverlay: true,
    closeOnEscape: true,
    previewAriaLabel: 'Open image preview',
    dialogAriaLabel: 'Image preview',
    closeLabel: 'Close preview',
    teleport: true,
    pt: undefined,
    unstyled: false,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'open'): void;
    (event: 'close', reason: CloseReason): void;
    (event: 'load', payload: Event): void;
    (event: 'error', payload: Event): void;
}>();

const isPreviewOpen = ref(false);
const hasError = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const previousFocused = ref<HTMLElement | null>(null);

const resolvedSrc = computed(() => {
    if (hasError.value && props.fallbackSrc) {
        return props.fallbackSrc;
    }

    return props.src;
});

const ptContext = computed(() => ({
    preview: props.preview,
    open: isPreviewOpen.value,
    disabled: props.disabled,
    error: hasError.value,
}));
const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        ['vf-image', props.preview ? 'vf-image_previewable' : null, props.disabled ? 'vf-image_disabled' : null]
            .filter(Boolean)
            .join(' '),
        props.unstyled,
    ),
);
const triggerAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'trigger', ptContext.value), 'vf-image__trigger', props.unstyled),
);
const imgAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'img', ptContext.value),
        ['vf-image__img', hasError.value ? 'vf-image__img_error' : null].filter(Boolean).join(' '),
        props.unstyled,
    ),
);
const overlayAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'overlay', ptContext.value), 'vf-image__overlay', props.unstyled),
);
const dialogAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'dialog', ptContext.value), 'vf-image__dialog', props.unstyled),
);
const previewAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'preview', ptContext.value), 'vf-image__preview', props.unstyled),
);
const closeAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'close', ptContext.value), 'vf-image__close', props.unstyled),
);

const imgStyle = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    objectFit: props.fit,
}));

const onLoad = (event: Event) => {
    emits('load', event);
};

const onError = (event: Event) => {
    hasError.value = true;
    emits('error', event);
};

const closePreview = (reason: CloseReason) => {
    if (!isPreviewOpen.value) {
        return;
    }

    isPreviewOpen.value = false;
    emits('update:modelValue', false);
    emits('close', reason);
    document.removeEventListener('keydown', onDocumentKeydown);
    previousFocused.value?.focus();
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.closeOnEscape) {
        event.preventDefault();
        closePreview('esc');
    }
};

const openPreview = () => {
    if (!props.preview || props.disabled || isPreviewOpen.value) {
        return;
    }

    previousFocused.value = document.activeElement as HTMLElement | null;
    isPreviewOpen.value = true;
    emits('update:modelValue', true);
    emits('open');
    document.addEventListener('keydown', onDocumentKeydown);
    nextTick(() => {
        dialogRef.value?.focus();
    });
};

const onOverlayClick = () => {
    if (!props.closeOnOverlay) {
        return;
    }

    closePreview('overlay');
};

watch(
    () => props.modelValue,
    value => {
        if (value && !isPreviewOpen.value) {
            previousFocused.value = document.activeElement as HTMLElement | null;
            isPreviewOpen.value = true;
            nextTick(() => dialogRef.value?.focus());
            document.addEventListener('keydown', onDocumentKeydown);
        }

        if (!value && isPreviewOpen.value) {
            closePreview('button');
        }
    },
    { immediate: true },
);

watch(
    () => props.src,
    () => {
        hasError.value = false;
    },
);

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown);
});

defineExpose({
    openPreview,
    closePreview,
});
</script>

<style lang="scss">
.vf-image {
    display: inline-block;
}

.vf-image__trigger {
    display: inline-block;
    padding: 0;
    border: 0;
    background: transparent;
}

.vf-image__img {
    display: block;
    border: var(--vf-border-width) solid var(--vf-image-border-color);
    border-radius: var(--vf-image-border-radius);
    background: var(--vf-image-background-color);
}

.vf-image__img_error {
    border-style: dashed;
}

.vf-image__overlay {
    position: fixed;
    inset: 0;
    z-index: var(--vf-image-overlay-z-index);
    display: grid;
    place-items: center;
    padding: var(--vf-image-overlay-padding);
    background: var(--vf-image-overlay-background-color);
}

.vf-image__dialog {
    position: relative;
    max-width: min(96vw, var(--vf-image-preview-max-width));
    max-height: min(92vh, var(--vf-image-preview-max-height));
    border-radius: var(--vf-image-preview-border-radius);
    background: var(--vf-image-preview-background-color);
    box-shadow: var(--vf-image-preview-shadow);
    outline: none;
}

.vf-image__preview {
    display: block;
    max-width: 100%;
    max-height: min(92vh, var(--vf-image-preview-max-height));
    object-fit: contain;
    border-radius: var(--vf-image-preview-border-radius);
}

.vf-image__close {
    position: absolute;
    top: var(--vf-image-close-offset);
    right: var(--vf-image-close-offset);
    width: var(--vf-image-close-size);
    height: var(--vf-image-close-size);
    border: var(--vf-border-width) solid var(--vf-image-close-border-color);
    border-radius: 999px;
    background: var(--vf-image-close-background-color);
    color: var(--vf-image-close-text-color);
}

.vf-image__dialog:focus-visible {
    box-shadow: var(--vf-image-focus-ring-shadow);
}

.vf-image_disabled {
    opacity: var(--vf-image-disabled-opacity);
}
</style>
