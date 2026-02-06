<template>
    <div
        ref="root"
        :class="getClass"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
    >
        <input
            ref="input"
            class="vf-file-upload__input"
            type="file"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled || readonly"
            @change="onInputChange"
        />
        <div
            class="vf-file-upload__control"
            role="button"
            :tabindex="disabled || readonly ? -1 : 0"
            :aria-disabled="disabled || readonly"
            @click="triggerSelect"
            @keydown.enter.prevent="triggerSelect"
            @keydown.space.prevent="triggerSelect"
            @focus="onFocus"
            @blur="onBlur"
        >
            <div class="vf-file-upload__content">
                <span v-if="files.length === 0" class="vf-file-upload__placeholder">{{ placeholder }}</span>
                <div v-else class="vf-file-upload__list">
                    <div v-for="(file, index) in files" :key="getFileKey(file, index)" class="vf-file-upload__item">
                        <span class="vf-file-upload__name">{{ file.name }}</span>
                        <span class="vf-file-upload__size">{{ formatSize(file.size) }}</span>
                        <button
                            v-if="!disabled && !readonly"
                            class="vf-file-upload__remove"
                            type="button"
                            :aria-label="`Remove ${file.name}`"
                            @click.stop="removeFile(index)"
                        >
                            &#10005;
                        </button>
                    </div>
                </div>
            </div>
            <button
                class="vf-file-upload__button"
                type="button"
                :disabled="disabled || readonly"
                @click.stop="triggerSelect"
            >
                {{ buttonLabel }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type RejectReason = 'maxSize' | 'maxFiles';

interface RejectedFile {
    file: File;
    reason: RejectReason;
    maxSize?: number;
    maxFiles?: number;
}

interface Props {
    modelValue?: File | Array<File> | null;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    readonly?: boolean;
    maxSize?: number;
    maxFiles?: number;
    placeholder?: string;
    buttonLabel?: string;
    size?: Size;
    variant?: Variant;
}

const emits = defineEmits(['update:modelValue', 'change', 'reject', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    multiple: false,
    accept: undefined,
    disabled: false,
    readonly: false,
    maxSize: undefined,
    maxFiles: undefined,
    placeholder: 'Drop files here or click to browse',
    buttonLabel: 'Browse',
    size: 'normal',
    variant: 'filled',
});

const root = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const files = computed<Array<File>>(() => {
    if (Array.isArray(props.modelValue)) {
        return props.modelValue;
    }

    if (props.modelValue instanceof File) {
        return [props.modelValue];
    }

    return [];
});

const getClass = computed(() => {
    const classes = [
        'vf-file-upload',
        `vf-file-upload_${props.variant}`,
        isDragging.value ? 'vf-file-upload_dragging' : '',
    ];

    if (props.size !== 'normal') {
        classes.push(`vf-file-upload_${props.size}`);
    }

    if (props.disabled || props.readonly) {
        classes.push('vf-file-upload_disabled');
    }

    return classes.filter(Boolean);
});

const getFileKey = (file: File, index: number) => `${file.name}-${file.size}-${file.lastModified}-${index}`;

const formatSize = (bytes: number) => {
    if (!Number.isFinite(bytes)) {
        return '';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const display = value < 10 && unitIndex > 0 ? value.toFixed(1) : Math.round(value).toString();

    return `${display} ${units[unitIndex]}`;
};

const emitFiles = (nextFiles: Array<File>) => {
    if (props.multiple) {
        emits('update:modelValue', nextFiles);
        emits('change', nextFiles);

        return;
    }

    const next = nextFiles[0] ?? null;

    emits('update:modelValue', next);
    emits('change', next);
};

const applyLimits = (incoming: Array<File>) => {
    const rejected: Array<RejectedFile> = [];
    let accepted = incoming;

    if (typeof props.maxSize === 'number' && Number.isFinite(props.maxSize) && props.maxSize > 0) {
        const maxSize = props.maxSize;
        const keep: Array<File> = [];

        accepted.forEach(file => {
            if (file.size <= maxSize) {
                keep.push(file);

                return;
            }

            rejected.push({ file, reason: 'maxSize', maxSize });
        });

        accepted = keep;
    }

    let maxFiles = props.maxFiles;

    if (!props.multiple) {
        maxFiles = 1;
    }

    if (typeof maxFiles === 'number' && Number.isFinite(maxFiles) && maxFiles > 0) {
        if (accepted.length > maxFiles) {
            const overflow = accepted.slice(maxFiles);

            overflow.forEach(file => rejected.push({ file, reason: 'maxFiles', maxFiles }));

            accepted = accepted.slice(0, maxFiles);
        }
    }

    return { accepted, rejected };
};

const handleFiles = (incoming: Array<File>) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const base = props.multiple ? files.value : [];
    const merged = props.multiple ? base.concat(incoming) : incoming;
    const { accepted, rejected } = applyLimits(merged);

    emitFiles(accepted);

    if (rejected.length > 0) {
        emits('reject', rejected);
    }
};

const triggerSelect = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    input.value?.click();
};

const onInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const incoming = target.files ? Array.from(target.files) : [];

    handleFiles(incoming);

    target.value = '';
};

const onDragOver = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    isDragging.value = true;
};

const onDragLeave = () => {
    isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    isDragging.value = false;

    const incoming = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];

    if (incoming.length) {
        handleFiles(incoming);
    }
};

const removeFile = (index: number) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const next = files.value.filter((_, i) => i !== index);

    emitFiles(next);
};

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-file-upload {
    display: block;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-height: var(--vf-file-upload-min-height);
    border-radius: var(--vf-file-upload-border-radius);
    border: var(--vf-border-width) solid var(--vf-file-upload-border-color);
    background-color: var(--vf-file-upload-background-color);
    color: var(--vf-file-upload-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
}

.vf-file-upload_outlined {
    background-color: transparent;
}

.vf-file-upload__input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.vf-file-upload__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-file-upload-gap);
    padding: var(--vf-file-upload-padding);
    font-size: var(--vf-file-upload-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    min-width: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
}

.vf-file-upload__content {
    flex: 1 1 0%;
    min-width: 0;
    max-width: 100%;
}

.vf-file-upload__placeholder {
    color: var(--vf-file-upload-placeholder-color);
}

.vf-file-upload__list {
    display: flex;
    flex-direction: column;
    gap: var(--vf-file-upload-list-gap);
    min-width: 0;
    max-width: 100%;
}

.vf-file-upload__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--vf-file-upload-item-padding);
    border-radius: var(--vf-file-upload-item-radius);
    border: var(--vf-border-width) solid var(--vf-file-upload-item-border-color);
    background-color: var(--vf-file-upload-item-background-color);
    color: var(--vf-file-upload-item-text-color);
    font-size: var(--vf-typography-font-size);
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
}

.vf-file-upload__name {
    flex: 1 1 0%;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vf-file-upload__size {
    color: var(--vf-file-upload-size-text-color);
    font-size: 0.875em;
    flex: 0 0 auto;
}

.vf-file-upload__remove {
    flex: 0 0 auto;
    width: var(--vf-file-upload-remove-size);
    height: var(--vf-file-upload-remove-size);
    border: none;
    border-radius: var(--vf-file-upload-remove-radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 0.75rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.vf-file-upload__remove:hover {
    background-color: var(--vf-file-upload-remove-hover-background-color);
}

.vf-file-upload__button {
    flex: 0 0 auto;
    padding: var(--vf-file-upload-button-padding);
    border-radius: var(--vf-file-upload-button-radius);
    border: var(--vf-border-width) solid var(--vf-file-upload-button-border-color);
    background-color: var(--vf-file-upload-button-background-color);
    color: var(--vf-file-upload-button-text-color);
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
}

.vf-file-upload__button:hover:not(:disabled) {
    background-color: var(--vf-file-upload-button-hover-background-color);
}

.vf-file-upload__button:disabled {
    cursor: not-allowed;
}

.vf-file-upload:hover:not(.vf-file-upload_disabled) {
    border-color: var(--vf-file-upload-hover-border-color);
}

.vf-file-upload:focus-within:not(.vf-file-upload_disabled) {
    border-color: var(--vf-file-upload-focus-border-color);
    box-shadow: var(--vf-file-upload-focus-ring-shadow);
}

.vf-file-upload_dragging {
    border-color: var(--vf-file-upload-focus-border-color);
    background-color: var(--vf-file-upload-drag-background-color);
    box-shadow: var(--vf-file-upload-focus-ring-shadow);
}

.vf-file-upload_small {
    .vf-file-upload__control {
        padding: var(--vf-file-upload-small-padding);
        font-size: var(--vf-file-upload-small-font-size);
    }

    .vf-file-upload__button {
        padding: var(--vf-file-upload-small-button-padding);
    }
}

.vf-file-upload_large {
    .vf-file-upload__control {
        padding: var(--vf-file-upload-large-padding);
        font-size: var(--vf-file-upload-large-font-size);
    }

    .vf-file-upload__button {
        padding: var(--vf-file-upload-large-button-padding);
    }
}

.vf-file-upload_disabled {
    opacity: var(--vf-file-upload-disabled-opacity);
    cursor: not-allowed;

    .vf-file-upload__control,
    .vf-file-upload__button {
        cursor: not-allowed;
    }
}
</style>
