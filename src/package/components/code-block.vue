<!-- eslint-disable vue/no-v-html -->
<template>
    <section class="vf-code-block" :class="{ 'vf-code-block_disabled': disabled }" :aria-label="ariaLabel">
        <header v-if="showHeader || $slots.actions" class="vf-code-block__header">
            <div v-if="showHeader" class="vf-code-block__meta">
                <span v-if="filename" class="vf-code-block__filename">{{ filename }}</span>
                <span class="vf-code-block__language">{{ languageLabel }}: {{ language }}</span>
            </div>
            <div class="vf-code-block__actions">
                <slot name="actions" />
                <button
                    v-if="copyable"
                    type="button"
                    class="vf-code-block__copy"
                    :disabled="disabled"
                    @click="copyCode"
                >
                    {{ copied ? copiedLabel : copyLabel }}
                </button>
            </div>
        </header>

        <pre class="vf-code-block__pre" :class="{ 'vf-code-block__pre_wrap': wrap }" :style="preStyle"><code><span
            v-for="(line, index) in lines"
            :key="index"
            class="vf-code-block__line"
        ><span v-if="showLineNumbers" class="vf-code-block__line-number">{{ index + 1 }}</span><span
                class="vf-code-block__line-content"
                v-html="renderLine(line)"
            /></span></code></pre>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

interface Props {
    code?: string;
    language?: string;
    filename?: string;
    showHeader?: boolean;
    showLineNumbers?: boolean;
    copyable?: boolean;
    copyLabel?: string;
    copiedLabel?: string;
    copiedDuration?: number;
    languageLabel?: string;
    disabled?: boolean;
    wrap?: boolean;
    highlight?: boolean;
    maxHeight?: string;
    ariaLabel?: string;
}

defineOptions({ name: 'VfCodeBlock' });

const props = withDefaults(defineProps<Props>(), {
    code: '',
    language: 'plaintext',
    filename: '',
    showHeader: true,
    showLineNumbers: false,
    copyable: true,
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    copiedDuration: 1200,
    languageLabel: 'Language',
    disabled: false,
    wrap: false,
    highlight: true,
    maxHeight: '',
    ariaLabel: 'Code block',
});

const emits = defineEmits<{
    (event: 'copy', payload: { text: string }): void;
}>();

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const normalizedCode = computed(() => props.code.replace(/\r\n/g, '\n'));
const lines = computed(() => {
    if (!normalizedCode.value) {
        return [''];
    }

    return normalizedCode.value.split('\n');
});

const preStyle = computed(() => {
    if (!props.maxHeight) {
        return undefined;
    }

    return {
        maxHeight: props.maxHeight,
    };
});

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const renderPlain = (line: string) => escapeHtml(line);

const highlightJson = (line: string) => {
    const escaped = escapeHtml(line);

    return escaped
        .replaceAll(
            /"(?:[^"\\]|\\.)*"(?=\s*:)?/g,
            '<span class="vf-code-block__token vf-code-block__token_string">$&</span>',
        )
        .replaceAll(
            /\b(true|false|null)\b/g,
            '<span class="vf-code-block__token vf-code-block__token_keyword">$1</span>',
        )
        .replaceAll(
            /\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g,
            '<span class="vf-code-block__token vf-code-block__token_number">$&</span>',
        );
};

const highlightJsLike = (line: string) => {
    let escaped = escapeHtml(line);

    escaped = escaped.replaceAll(
        /(\/\/.*)$/g,
        '<span class="vf-code-block__token vf-code-block__token_comment">$1</span>',
    );
    escaped = escaped.replaceAll(
        /(["'`])(?:\\.|(?!\1).)*\1/g,
        '<span class="vf-code-block__token vf-code-block__token_string">$&</span>',
    );
    escaped = escaped.replaceAll(
        /\b(const|let|var|function|return|if|else|for|while|class|new|import|export|from|await|async|try|catch|throw)\b/g,
        '<span class="vf-code-block__token vf-code-block__token_keyword">$1</span>',
    );
    escaped = escaped.replaceAll(
        /\b\d+(?:\.\d+)?\b/g,
        '<span class="vf-code-block__token vf-code-block__token_number">$&</span>',
    );

    return escaped;
};

const highlightBash = (line: string) => {
    let escaped = escapeHtml(line);

    escaped = escaped.replaceAll(
        /(#.*)$/g,
        '<span class="vf-code-block__token vf-code-block__token_comment">$1</span>',
    );
    escaped = escaped.replaceAll(
        /(["'])(?:\\.|(?!\1).)*\1/g,
        '<span class="vf-code-block__token vf-code-block__token_string">$&</span>',
    );
    escaped = escaped.replaceAll(
        /\$[A-Za-z_][A-Za-z0-9_]*/g,
        '<span class="vf-code-block__token vf-code-block__token_variable">$&</span>',
    );

    return escaped;
};

const renderLine = (line: string) => {
    if (!props.highlight) {
        return renderPlain(line);
    }

    const normalizedLanguage = props.language.toLowerCase();

    if (normalizedLanguage.includes('json')) {
        return highlightJson(line);
    }

    if (
        normalizedLanguage.includes('js') ||
        normalizedLanguage.includes('ts') ||
        normalizedLanguage.includes('vue') ||
        normalizedLanguage.includes('javascript') ||
        normalizedLanguage.includes('typescript')
    ) {
        return highlightJsLike(line);
    }

    if (normalizedLanguage.includes('bash') || normalizedLanguage.includes('shell') || normalizedLanguage === 'sh') {
        return highlightBash(line);
    }

    return renderPlain(line);
};

const copyCode = async () => {
    if (props.disabled) {
        return;
    }

    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(normalizedCode.value);
        }
    } finally {
        emits('copy', { text: normalizedCode.value });

        copied.value = true;
        if (copiedTimer) {
            clearTimeout(copiedTimer);
        }
        copiedTimer = setTimeout(() => {
            copied.value = false;
            copiedTimer = null;
        }, props.copiedDuration);
    }
};

onBeforeUnmount(() => {
    if (copiedTimer) {
        clearTimeout(copiedTimer);
        copiedTimer = null;
    }
});
</script>

<style lang="scss">
.vf-code-block {
    display: grid;
    gap: var(--vf-code-block-gap);
    border: var(--vf-border-width) solid var(--vf-code-block-border-color);
    border-radius: var(--vf-code-block-border-radius);
    background: var(--vf-code-block-background-color);
    color: var(--vf-code-block-text-color);
    font-family: var(--vf-code-block-font-family);
    font-size: var(--vf-code-block-font-size);
    line-height: var(--vf-code-block-line-height);
}

.vf-code-block__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-code-block-header-gap);
    padding: var(--vf-code-block-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-code-block-header-border-color);
}

.vf-code-block__meta {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-code-block-meta-gap);
    color: var(--vf-code-block-meta-color);
    font-size: var(--vf-code-block-meta-font-size);
}

.vf-code-block__filename {
    color: var(--vf-code-block-filename-color);
    font-weight: var(--vf-code-block-filename-font-weight);
}

.vf-code-block__actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-code-block-actions-gap);
}

.vf-code-block__copy {
    border: var(--vf-border-width) solid var(--vf-code-block-action-border-color);
    border-radius: var(--vf-code-block-action-border-radius);
    background: var(--vf-code-block-action-background-color);
    color: var(--vf-code-block-action-text-color);
    padding: var(--vf-code-block-action-padding);
    font-size: var(--vf-code-block-action-font-size);
}

.vf-code-block__pre {
    margin: 0;
    padding: var(--vf-code-block-padding);
    overflow: auto;
    white-space: pre;
}

.vf-code-block__pre_wrap {
    white-space: pre-wrap;
    word-break: break-word;
}

.vf-code-block__line {
    display: flex;
    align-items: baseline;
    gap: var(--vf-code-block-line-gap);
}

.vf-code-block__line-number {
    text-align: right;
    color: var(--vf-code-block-line-number-color);
    min-width: var(--vf-code-block-line-number-min-width);
    user-select: none;
}

.vf-code-block__line-content {
    white-space: inherit;
}

.vf-code-block__token_keyword {
    color: var(--vf-code-block-token-keyword-color);
}

.vf-code-block__token_string {
    color: var(--vf-code-block-token-string-color);
}

.vf-code-block__token_number {
    color: var(--vf-code-block-token-number-color);
}

.vf-code-block__token_comment {
    color: var(--vf-code-block-token-comment-color);
}

.vf-code-block__token_variable {
    color: var(--vf-code-block-token-variable-color);
}

.vf-code-block_disabled {
    opacity: var(--vf-code-block-disabled-opacity);
}
</style>
