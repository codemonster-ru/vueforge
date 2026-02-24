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
                    <div class="vf-image__toolbar">
                        <button
                            type="button"
                            v-bind="toolbarButtonAttrs"
                            :aria-label="zoomOutLabel"
                            :disabled="!canZoomOut"
                            @click="zoomOut"
                        >
                            -
                        </button>
                        <button
                            type="button"
                            v-bind="toolbarButtonAttrs"
                            :aria-label="zoomResetLabel"
                            @click="resetZoom"
                        >
                            100%
                        </button>
                        <button
                            type="button"
                            v-bind="toolbarButtonAttrs"
                            :aria-label="zoomInLabel"
                            :disabled="!canZoomIn"
                            @click="zoomIn"
                        >
                            +
                        </button>
                        <a
                            v-if="showDownload"
                            v-bind="downloadAttrs"
                            :href="activePreviewSrc"
                            :download="activeDownloadName"
                            :aria-label="downloadLabel"
                        >
                            Download
                        </a>
                        <span v-if="hasPreviewGroup" class="vf-image__counter">
                            {{ currentPreviewIndex + 1 }} / {{ previewItems.length }}
                        </span>
                    </div>
                    <button
                        v-if="hasPreviewGroup"
                        type="button"
                        v-bind="navButtonAttrs"
                        class="vf-image__nav vf-image__nav_prev"
                        :aria-label="prevLabel"
                        @click="goPrev"
                    >
                        &#8249;
                    </button>
                    <button
                        v-if="hasPreviewGroup"
                        type="button"
                        v-bind="navButtonAttrs"
                        class="vf-image__nav vf-image__nav_next"
                        :aria-label="nextLabel"
                        @click="goNext"
                    >
                        &#8250;
                    </button>
                    <button type="button" v-bind="closeAttrs" :aria-label="closeLabel" @click="closePreview('button')">
                        &times;
                    </button>
                    <img
                        v-bind="previewAttrs"
                        :src="activePreviewSrc"
                        :alt="activePreviewAlt"
                        :style="previewStyle"
                        @load="onPreviewLoad"
                    />
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
interface PreviewItem {
    src: string;
    alt?: string;
    downloadName?: string;
}

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
    previewGroup?: PreviewItem[];
    previewStartIndex?: number;
    loopPreview?: boolean;
    zoomStep?: number;
    minZoom?: number;
    maxZoom?: number;
    showDownload?: boolean;
    downloadLabel?: string;
    downloadFileName?: string;
    prevLabel?: string;
    nextLabel?: string;
    zoomInLabel?: string;
    zoomOutLabel?: string;
    zoomResetLabel?: string;
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
    previewGroup: () => [],
    previewStartIndex: 0,
    loopPreview: true,
    zoomStep: 0.25,
    minZoom: 1,
    maxZoom: 3,
    showDownload: false,
    downloadLabel: 'Download image',
    downloadFileName: '',
    prevLabel: 'Previous image',
    nextLabel: 'Next image',
    zoomInLabel: 'Zoom in',
    zoomOutLabel: 'Zoom out',
    zoomResetLabel: 'Reset zoom',
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
    (event: 'previewChange', payload: { index: number; src: string }): void;
    (event: 'zoomChange', payload: { zoom: number }): void;
}>();

const isPreviewOpen = ref(false);
const hasError = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const previousFocused = ref<HTMLElement | null>(null);
const currentPreviewIndex = ref(0);
const zoom = ref(1);

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
const toolbarButtonAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'toolbarButton', ptContext.value),
        'vf-image__toolbar-button',
        props.unstyled,
    ),
);
const navButtonAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'navButton', ptContext.value), 'vf-image__nav-button', props.unstyled),
);
const downloadAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'download', ptContext.value), 'vf-image__download', props.unstyled),
);
const closeAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'close', ptContext.value), 'vf-image__close', props.unstyled),
);

const imgStyle = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    objectFit: props.fit,
}));
const previewItems = computed(() => {
    if (props.previewGroup.length > 0) {
        return props.previewGroup;
    }

    return [{ src: resolvedSrc.value, alt: props.alt, downloadName: props.downloadFileName }];
});
const hasPreviewGroup = computed(() => previewItems.value.length > 1);
const activePreviewItem = computed(() => previewItems.value[currentPreviewIndex.value] ?? previewItems.value[0]);
const activePreviewSrc = computed(() => activePreviewItem.value?.src ?? resolvedSrc.value);
const activePreviewAlt = computed(() => activePreviewItem.value?.alt ?? props.alt);
const activeDownloadName = computed(() => activePreviewItem.value?.downloadName ?? props.downloadFileName);
const safeMinZoom = computed(() => Math.max(0.25, props.minZoom));
const safeMaxZoom = computed(() => Math.max(safeMinZoom.value, props.maxZoom));
const safeZoomStep = computed(() => Math.max(0.05, props.zoomStep));
const canZoomIn = computed(() => zoom.value < safeMaxZoom.value);
const canZoomOut = computed(() => zoom.value > safeMinZoom.value);
const previewStyle = computed(() => ({
    transform: `scale(${zoom.value})`,
}));

const normalizePreviewIndex = (index: number) => {
    const total = previewItems.value.length;
    if (total === 0) {
        return 0;
    }

    if (!props.loopPreview) {
        return Math.min(Math.max(0, index), total - 1);
    }

    const wrapped = ((index % total) + total) % total;
    return wrapped;
};

const setPreviewIndex = (index: number) => {
    const normalized = normalizePreviewIndex(index);

    if (normalized === currentPreviewIndex.value) {
        return;
    }

    currentPreviewIndex.value = normalized;
    zoom.value = 1;
    emits('previewChange', { index: normalized, src: activePreviewSrc.value });
};

const setZoom = (nextZoom: number) => {
    const clamped = Math.min(safeMaxZoom.value, Math.max(safeMinZoom.value, Number(nextZoom.toFixed(3))));
    if (clamped === zoom.value) {
        return;
    }

    zoom.value = clamped;
    emits('zoomChange', { zoom: clamped });
};

const zoomIn = () => setZoom(zoom.value + safeZoomStep.value);
const zoomOut = () => setZoom(zoom.value - safeZoomStep.value);
const resetZoom = () => setZoom(1);
const goNext = () => setPreviewIndex(currentPreviewIndex.value + 1);
const goPrev = () => setPreviewIndex(currentPreviewIndex.value - 1);

const onLoad = (event: Event) => {
    emits('load', event);
};
const onPreviewLoad = (event: Event) => {
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
        return;
    }

    if (!isPreviewOpen.value) {
        return;
    }

    if (event.key === 'ArrowRight' && hasPreviewGroup.value) {
        event.preventDefault();
        goNext();
        return;
    }

    if (event.key === 'ArrowLeft' && hasPreviewGroup.value) {
        event.preventDefault();
        goPrev();
        return;
    }

    if (event.key === 'Home' && hasPreviewGroup.value) {
        event.preventDefault();
        setPreviewIndex(0);
        return;
    }

    if (event.key === 'End' && hasPreviewGroup.value) {
        event.preventDefault();
        setPreviewIndex(previewItems.value.length - 1);
        return;
    }

    if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();
        return;
    }

    if (event.key === '-') {
        event.preventDefault();
        zoomOut();
        return;
    }

    if (event.key === '0') {
        event.preventDefault();
        resetZoom();
    }
};

const openPreview = () => {
    if (!props.preview || props.disabled || isPreviewOpen.value) {
        return;
    }

    previousFocused.value = document.activeElement as HTMLElement | null;
    currentPreviewIndex.value = normalizePreviewIndex(props.previewStartIndex);
    zoom.value = 1;
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
            currentPreviewIndex.value = normalizePreviewIndex(props.previewStartIndex);
            zoom.value = 1;
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
watch(
    () => props.previewStartIndex,
    value => {
        if (!isPreviewOpen.value) {
            return;
        }

        currentPreviewIndex.value = normalizePreviewIndex(value);
        zoom.value = 1;
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
    overflow: hidden;
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
    transform-origin: center center;
    transition: transform 120ms ease-out;
}

.vf-image__toolbar {
    position: absolute;
    top: var(--vf-image-toolbar-offset);
    left: var(--vf-image-toolbar-offset);
    z-index: 1;
    display: inline-flex;
    gap: var(--vf-image-toolbar-gap);
    align-items: center;
}

.vf-image__toolbar-button,
.vf-image__download,
.vf-image__nav,
.vf-image__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: var(--vf-border-width) solid var(--vf-image-control-border-color);
    border-radius: 999px;
    background: var(--vf-image-control-background-color);
    color: var(--vf-image-control-text-color);
    font-size: var(--vf-image-control-font-size);
    text-decoration: none;
    cursor: pointer;
}

.vf-image__toolbar-button {
    min-width: var(--vf-image-control-size);
    height: var(--vf-image-control-size);
    padding: 0 0.5rem;
}

.vf-image__download {
    height: var(--vf-image-control-size);
    padding: 0 0.75rem;
}

.vf-image__counter {
    color: var(--vf-image-counter-text-color);
    font-size: var(--vf-image-counter-font-size);
}

.vf-image__nav {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: var(--vf-image-control-size);
    height: var(--vf-image-control-size);
    transform: translateY(-50%);
}

.vf-image__nav_prev {
    left: var(--vf-image-nav-offset);
}

.vf-image__nav_next {
    right: var(--vf-image-nav-offset);
}

.vf-image__close {
    position: absolute;
    top: var(--vf-image-close-offset);
    right: var(--vf-image-close-offset);
    width: var(--vf-image-close-size);
    height: var(--vf-image-close-size);
    z-index: 1;
    border-color: var(--vf-image-close-border-color);
    background: var(--vf-image-close-background-color);
    color: var(--vf-image-close-text-color);
}

.vf-image__dialog:focus-visible {
    box-shadow: var(--vf-image-focus-ring-shadow);
}

.vf-image__toolbar-button:disabled,
.vf-image__nav:disabled {
    opacity: 0.5;
    cursor: default;
}

.vf-image_disabled {
    opacity: var(--vf-image-disabled-opacity);
}
</style>
