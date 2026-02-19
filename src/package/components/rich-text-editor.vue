<template>
    <div :class="getClass">
        <div v-if="showToolbar" class="vf-rich-text-editor__toolbar" role="toolbar" :aria-label="toolbarLabel">
            <button
                v-for="action in toolbarActions"
                :key="action"
                type="button"
                class="vf-rich-text-editor__toolbar-button"
                :data-action="action"
                :disabled="disabled || readonly"
                @click="onActionClick(action)"
            >
                {{ getActionLabel(action) }}
            </button>
        </div>
        <textarea
            ref="control"
            class="vf-rich-text-editor__control"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :rows="rows"
            :aria-label="ariaLabel"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <div v-if="showCounter" class="vf-rich-text-editor__counter" :class="{ 'is-limit': isCounterLimitReached }">
            {{ currentLength }} / {{ maxLength }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Format = 'markdown' | 'html';
export type RichTextEditorAction = 'bold' | 'italic' | 'underline' | 'link' | 'bulletList' | 'orderedList' | 'code';

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    format?: Format;
    rows?: number;
    maxLength?: number;
    showToolbar?: boolean;
    toolbar?: Array<RichTextEditorAction>;
    toolbarLabel?: string;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    format: 'markdown',
    rows: 6,
    maxLength: 0,
    showToolbar: true,
    toolbar: () => ['bold', 'italic', 'underline', 'link', 'bulletList', 'orderedList', 'code'],
    toolbarLabel: 'Text formatting toolbar',
    ariaLabel: 'Rich text editor',
});

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'action']);
const control = ref<HTMLTextAreaElement | null>(null);

const getClass = computed(() => {
    const classes = ['vf-rich-text-editor', `vf-rich-text-editor_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-rich-text-editor_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-rich-text-editor_disabled');
    }

    return classes;
});

const toolbarActions = computed(() => props.toolbar.filter(Boolean));
const currentLength = computed(() => (props.modelValue ?? '').length);
const showCounter = computed(() => props.maxLength > 0);
const isCounterLimitReached = computed(() => props.maxLength > 0 && currentLength.value >= props.maxLength);

const getActionLabel = (action: RichTextEditorAction) => {
    switch (action) {
        case 'bold':
            return 'Bold';
        case 'italic':
            return 'Italic';
        case 'underline':
            return 'Underline';
        case 'link':
            return 'Link';
        case 'bulletList':
            return 'Bullets';
        case 'orderedList':
            return 'Numbered';
        case 'code':
            return 'Code';
        default:
            return action;
    }
};

const clampValue = (value: string) => {
    if (props.maxLength <= 0) {
        return value;
    }

    return value.slice(0, props.maxLength);
};

const buildMarkdownValue = (action: RichTextEditorAction, value: string) => {
    switch (action) {
        case 'bold':
            return `**${value || 'bold text'}**`;
        case 'italic':
            return `*${value || 'italic text'}*`;
        case 'underline':
            return `<u>${value || 'underlined text'}</u>`;
        case 'link':
            return `[${value || 'link text'}](https://)`;
        case 'bulletList': {
            const lines = (value || 'List item').split('\n');

            return lines.map(line => `- ${line || 'List item'}`).join('\n');
        }
        case 'orderedList': {
            const lines = (value || 'List item').split('\n');

            return lines.map((line, index) => `${index + 1}. ${line || 'List item'}`).join('\n');
        }
        case 'code':
            return value.includes('\n') ? `\n\`\`\`\n${value}\n\`\`\`\n` : `\`${value || 'code'}\``;
        default:
            return value;
    }
};

const buildHtmlValue = (action: RichTextEditorAction, value: string) => {
    switch (action) {
        case 'bold':
            return `<strong>${value || 'bold text'}</strong>`;
        case 'italic':
            return `<em>${value || 'italic text'}</em>`;
        case 'underline':
            return `<u>${value || 'underlined text'}</u>`;
        case 'link':
            return `<a href="https://">${value || 'link text'}</a>`;
        case 'bulletList': {
            const lines = (value || 'List item').split('\n');
            const items = lines.map(line => `<li>${line || 'List item'}</li>`).join('');

            return `<ul>${items}</ul>`;
        }
        case 'orderedList': {
            const lines = (value || 'List item').split('\n');
            const items = lines.map(line => `<li>${line || 'List item'}</li>`).join('');

            return `<ol>${items}</ol>`;
        }
        case 'code':
            return value.includes('\n')
                ? `<pre><code>${value || 'code'}</code></pre>`
                : `<code>${value || 'code'}</code>`;
        default:
            return value;
    }
};

const buildFormattedValue = (action: RichTextEditorAction, value: string) => {
    if (props.format === 'html') {
        return buildHtmlValue(action, value);
    }

    return buildMarkdownValue(action, value);
};

const onActionClick = (action: RichTextEditorAction) => {
    if (props.disabled || props.readonly || !control.value) {
        return;
    }

    const target = control.value;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    const currentValue = target.value;
    const selectedValue = currentValue.slice(start, end);
    const formattedValue = buildFormattedValue(action, selectedValue);
    const nextValue = clampValue(`${currentValue.slice(0, start)}${formattedValue}${currentValue.slice(end)}`);
    const nextCaret = Math.min(start + formattedValue.length, nextValue.length);

    target.value = nextValue;
    target.focus();
    target.setSelectionRange(nextCaret, nextCaret);

    emits('update:modelValue', nextValue);
    emits('action', action, nextValue);
};

const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    const value = clampValue(target.value);

    if (value !== target.value) {
        target.value = value;
    }

    emits('update:modelValue', value);
    emits('input', event);
};
const onChange = (event: Event) => emits('change', event);
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-rich-text-editor {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: var(--vf-rich-text-editor-gap);
    box-sizing: border-box;
    padding: var(--vf-rich-text-editor-padding);
    border-radius: var(--vf-rich-text-editor-border-radius);
    border: var(--vf-border-width) solid var(--vf-rich-text-editor-border-color);
    background-color: var(--vf-rich-text-editor-background-color);
    color: var(--vf-rich-text-editor-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-rich-text-editor__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-rich-text-editor-toolbar-gap);
    padding: var(--vf-rich-text-editor-toolbar-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-rich-text-editor-toolbar-border-color);
    background-color: var(--vf-rich-text-editor-toolbar-background-color);
}

.vf-rich-text-editor__toolbar-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--vf-rich-text-editor-toolbar-button-min-width);
    padding: var(--vf-rich-text-editor-toolbar-button-padding);
    border: var(--vf-border-width) solid var(--vf-rich-text-editor-toolbar-button-border-color);
    border-radius: var(--vf-rich-text-editor-toolbar-button-radius);
    background-color: var(--vf-rich-text-editor-toolbar-button-background-color);
    color: var(--vf-rich-text-editor-toolbar-button-text-color);
    font-size: var(--vf-rich-text-editor-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.vf-rich-text-editor__toolbar-button:hover:not(:disabled),
.vf-rich-text-editor__toolbar-button:focus-visible:not(:disabled) {
    background-color: var(--vf-rich-text-editor-toolbar-button-hover-background-color);
    border-color: var(--vf-rich-text-editor-focus-border-color);
    outline: none;
}

.vf-rich-text-editor__toolbar-button:active:not(:disabled) {
    background-color: var(--vf-rich-text-editor-toolbar-button-active-background-color);
}

.vf-rich-text-editor__toolbar-button:disabled {
    cursor: not-allowed;
}

.vf-rich-text-editor__control {
    width: 100%;
    min-height: var(--vf-rich-text-editor-min-height);
    border: none;
    background: transparent;
    color: inherit;
    font-size: var(--vf-rich-text-editor-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    resize: var(--vf-rich-text-editor-resize);
    padding: 0;
    box-sizing: border-box;
}

.vf-rich-text-editor__control::placeholder {
    color: var(--vf-rich-text-editor-placeholder-color);
}

.vf-rich-text-editor__counter {
    align-self: flex-end;
    font-size: var(--vf-rich-text-editor-counter-font-size);
    color: var(--vf-rich-text-editor-counter-color);
}

.vf-rich-text-editor__counter.is-limit {
    color: var(--vf-rich-text-editor-counter-danger-color);
}

.vf-rich-text-editor:hover:not(.vf-rich-text-editor_disabled) {
    border-color: var(--vf-rich-text-editor-hover-border-color);
}

.vf-rich-text-editor:focus-within:not(.vf-rich-text-editor_disabled) {
    border-color: var(--vf-rich-text-editor-focus-border-color);
    box-shadow: var(--vf-rich-text-editor-focus-ring-shadow);
}

.vf-rich-text-editor_outlined {
    background-color: transparent;
}

.vf-rich-text-editor_small {
    padding: var(--vf-rich-text-editor-small-padding);

    .vf-rich-text-editor__control,
    .vf-rich-text-editor__toolbar-button {
        font-size: var(--vf-rich-text-editor-small-font-size);
    }

    .vf-rich-text-editor__toolbar-button {
        padding: var(--vf-rich-text-editor-small-toolbar-button-padding);
    }
}

.vf-rich-text-editor_large {
    padding: var(--vf-rich-text-editor-large-padding);

    .vf-rich-text-editor__control,
    .vf-rich-text-editor__toolbar-button {
        font-size: var(--vf-rich-text-editor-large-font-size);
    }

    .vf-rich-text-editor__toolbar-button {
        padding: var(--vf-rich-text-editor-large-toolbar-button-padding);
    }
}

.vf-rich-text-editor_disabled {
    opacity: var(--vf-rich-text-editor-disabled-opacity);
    cursor: not-allowed;
}
</style>
