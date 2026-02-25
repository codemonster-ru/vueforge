<template>
    <section ref="rootRef" class="vf-code-editor" :class="{ 'vf-code-editor_disabled': disabled }" :data-theme="theme">
        <header v-if="showHeader" class="vf-code-editor__header">
            <span class="vf-code-editor__meta">{{ languageLabel }}: {{ language || 'plain' }}</span>
            <span class="vf-code-editor__meta">{{ readonly ? readonlyLabel : editableLabel }}</span>
        </header>

        <div v-if="loading" class="vf-code-editor__state">
            <slot name="loading">{{ loadingText }}</slot>
        </div>
        <div v-else-if="!adapter" class="vf-code-editor__state">
            <slot name="empty">{{ noAdapterText }}</slot>
        </div>
        <div v-else class="vf-code-editor__surface">
            <div ref="editorRef" class="vf-code-editor__editor" :aria-label="ariaLabel" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { CodeEditorAdapter, CodeEditorAdapterInstance, CodeEditorConfig } from './code-editor-adapter';

interface Props {
    modelValue?: string;
    adapter?: CodeEditorAdapter;
    language?: string;
    theme?: string;
    readonly?: boolean;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    noAdapterText?: string;
    showHeader?: boolean;
    languageLabel?: string;
    readonlyLabel?: string;
    editableLabel?: string;
    ariaLabel?: string;
    lazy?: boolean;
    lazyRootMargin?: string;
    lazyThreshold?: number;
    options?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    adapter: undefined,
    language: 'plaintext',
    theme: 'light',
    readonly: false,
    disabled: false,
    loading: false,
    loadingText: 'Loading editor...',
    noAdapterText: 'Editor adapter is not configured.',
    showHeader: true,
    languageLabel: 'Language',
    readonlyLabel: 'Read-only',
    editableLabel: 'Editable',
    ariaLabel: 'Code editor',
    lazy: true,
    lazyRootMargin: '200px',
    lazyThreshold: 0,
    options: () => ({}),
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'change', payload: { value: string }): void;
    (event: 'ready', instance: CodeEditorAdapterInstance): void;
    (event: 'error', error: Error): void;
}>();

defineSlots<{
    loading?: () => unknown;
    empty?: () => unknown;
}>();

const rootRef = ref<HTMLElement | null>(null);
const editorRef = ref<HTMLElement | null>(null);
const editorInstance = ref<CodeEditorAdapterInstance | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);
const isVisible = ref(false);
const suppressModelWatch = ref(false);

const resolvedReadonly = computed(() => props.readonly || props.disabled);

const editorConfig = computed<CodeEditorConfig>(() => ({
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readonly: resolvedReadonly.value,
    options: props.options,
    onChange: value => {
        suppressModelWatch.value = true;
        emits('update:modelValue', value);
        emits('change', { value });
        nextTick(() => {
            suppressModelWatch.value = false;
        });
    },
}));

const destroyEditor = () => {
    if (!editorInstance.value || !props.adapter?.destroy) {
        editorInstance.value = null;
        return;
    }

    props.adapter.destroy(editorInstance.value);
    editorInstance.value = null;
};

const mountEditor = () => {
    if (!props.adapter || props.loading || !editorRef.value || (props.lazy && !isVisible.value)) {
        destroyEditor();
        return;
    }

    try {
        if (!editorInstance.value) {
            editorInstance.value = props.adapter.mount(editorRef.value, editorConfig.value);
            emits('ready', editorInstance.value);
            return;
        }

        if (props.adapter.update) {
            props.adapter.update(editorInstance.value, editorConfig.value);
        }
    } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        emits('error', normalizedError);
    }
};

const setupIntersectionObserver = () => {
    intersectionObserver.value?.disconnect();
    intersectionObserver.value = null;

    if (!props.lazy) {
        isVisible.value = true;
        return;
    }

    const target = rootRef.value ?? editorRef.value;
    if (!target || typeof IntersectionObserver === 'undefined') {
        isVisible.value = true;
        return;
    }

    isVisible.value = false;
    intersectionObserver.value = new IntersectionObserver(
        entries => {
            if (!entries.some(entry => entry.isIntersecting || entry.intersectionRatio > 0)) {
                return;
            }

            isVisible.value = true;
            intersectionObserver.value?.disconnect();
            intersectionObserver.value = null;
            mountEditor();
        },
        {
            root: null,
            rootMargin: props.lazyRootMargin,
            threshold: props.lazyThreshold,
        },
    );

    intersectionObserver.value.observe(target);
};

watch(
    () => [props.adapter, props.loading, props.lazy, isVisible.value] as const,
    () => {
        mountEditor();
    },
);

watch(
    () => props.modelValue,
    value => {
        if (!editorInstance.value || suppressModelWatch.value) {
            return;
        }

        if (props.adapter?.setValue) {
            props.adapter.setValue(editorInstance.value, value);
            return;
        }

        if (props.adapter?.update) {
            props.adapter.update(editorInstance.value, editorConfig.value);
        }
    },
);

watch(
    () => props.theme,
    value => {
        if (!editorInstance.value || !props.adapter?.setTheme) {
            return;
        }

        props.adapter.setTheme(editorInstance.value, value);
    },
);

watch(
    () => resolvedReadonly.value,
    value => {
        if (!editorInstance.value) {
            return;
        }

        if (props.adapter?.setReadonly) {
            props.adapter.setReadonly(editorInstance.value, value);
            return;
        }

        if (props.adapter?.update) {
            props.adapter.update(editorInstance.value, editorConfig.value);
        }
    },
);

watch(
    () => [props.language, props.options] as const,
    () => {
        if (!editorInstance.value || !props.adapter?.update) {
            return;
        }

        props.adapter.update(editorInstance.value, editorConfig.value);
    },
    { deep: true },
);

watch(
    () => [props.lazy, props.lazyRootMargin, props.lazyThreshold] as const,
    () => {
        setupIntersectionObserver();
        mountEditor();
    },
);

onMounted(() => {
    setupIntersectionObserver();
    mountEditor();
});

onBeforeUnmount(() => {
    intersectionObserver.value?.disconnect();
    destroyEditor();
});

defineExpose({
    focus: () => {
        if (editorInstance.value && props.adapter?.focus) {
            props.adapter.focus(editorInstance.value);
        }
    },
    refresh: mountEditor,
    getValue: () => {
        if (!editorInstance.value || !props.adapter?.getValue) {
            return props.modelValue;
        }

        return props.adapter.getValue(editorInstance.value);
    },
});
</script>

<style lang="scss">
.vf-code-editor {
    display: grid;
    gap: var(--vf-code-editor-gap);
    border: var(--vf-border-width) solid var(--vf-code-editor-border-color);
    border-radius: var(--vf-code-editor-border-radius);
    background: var(--vf-code-editor-background-color);
    color: var(--vf-code-editor-text-color);
    padding: var(--vf-code-editor-padding);
}

.vf-code-editor__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-code-editor-header-gap);
}

.vf-code-editor__meta {
    font-size: var(--vf-code-editor-meta-font-size);
    color: var(--vf-code-editor-meta-color);
}

.vf-code-editor__surface {
    border: var(--vf-border-width) solid var(--vf-code-editor-surface-border-color);
    border-radius: var(--vf-code-editor-surface-border-radius);
    background: var(--vf-code-editor-surface-background-color);
    min-height: var(--vf-code-editor-min-height);
    overflow: hidden;
}

.vf-code-editor__editor {
    min-height: var(--vf-code-editor-min-height);
}

.vf-code-editor__state {
    min-height: var(--vf-code-editor-state-min-height);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--vf-code-editor-state-color);
    font-size: var(--vf-code-editor-state-font-size);
}

.vf-code-editor[data-theme='dark'] {
    --vf-code-editor-background-color: var(--vf-code-editor-dark-background-color);
    --vf-code-editor-text-color: var(--vf-code-editor-dark-text-color);
    --vf-code-editor-border-color: var(--vf-code-editor-dark-border-color);
    --vf-code-editor-surface-background-color: var(--vf-code-editor-dark-surface-background-color);
    --vf-code-editor-surface-border-color: var(--vf-code-editor-dark-surface-border-color);
    --vf-code-editor-meta-color: var(--vf-code-editor-dark-meta-color);
    --vf-code-editor-state-color: var(--vf-code-editor-dark-state-color);
}

.vf-code-editor_disabled {
    opacity: var(--vf-code-editor-disabled-opacity);
}
</style>
