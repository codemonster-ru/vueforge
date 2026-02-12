<template>
    <div :class="getClass">
        <template v-if="isEditing">
            <input
                ref="inputRef"
                class="vf-inline-edit__input"
                :type="inputType"
                :value="draftValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                @input="onInput"
                @keydown.enter.prevent="saveEdit"
                @keydown.esc.prevent="cancelEdit"
                @focus="onFocus"
                @blur="onBlur"
            />
            <div class="vf-inline-edit__actions">
                <button
                    class="vf-inline-edit__action vf-inline-edit__action_save"
                    type="button"
                    :disabled="disabled"
                    @click="saveEdit"
                >
                    {{ saveLabel }}
                </button>
                <button
                    class="vf-inline-edit__action vf-inline-edit__action_cancel"
                    type="button"
                    :disabled="disabled"
                    @click="cancelEdit"
                >
                    {{ cancelLabel }}
                </button>
            </div>
        </template>
        <template v-else>
            <span class="vf-inline-edit__value" :class="{ 'vf-inline-edit__value_placeholder': isPlaceholder }">
                {{ displayText }}
            </span>
            <button v-if="canEdit" class="vf-inline-edit__action" type="button" :disabled="disabled" @click="startEdit">
                {{ editLabel }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type InlineEditType = 'text' | 'number';
type InlineEditValue = string | number | null;

interface Props {
    modelValue?: InlineEditValue;
    type?: InlineEditType;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    editLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'save', 'cancel', 'start', 'end', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    type: 'text',
    placeholder: '',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    editLabel: 'Edit',
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
});

const isEditing = ref(false);
const draftValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const canEdit = computed(() => !props.disabled && !props.readonly);
const inputType = computed(() => (props.type === 'number' ? 'number' : 'text'));
const displayText = computed(() => {
    if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
        return props.placeholder;
    }

    return String(props.modelValue);
});
const isPlaceholder = computed(
    () => props.modelValue === null || props.modelValue === undefined || props.modelValue === '',
);
const getClass = computed(() => {
    const classes = ['vf-inline-edit', `vf-inline-edit_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-inline-edit_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-inline-edit_disabled');
    }

    if (isEditing.value) {
        classes.push('vf-inline-edit_editing');
    }

    return classes;
});

const syncDraft = () => {
    if (props.modelValue === null || props.modelValue === undefined) {
        draftValue.value = '';

        return;
    }

    draftValue.value = String(props.modelValue);
};

const startEdit = async () => {
    if (!canEdit.value || isEditing.value) {
        return;
    }

    syncDraft();

    isEditing.value = true;

    emits('start');

    await nextTick();

    inputRef.value?.focus();
    inputRef.value?.select();
};

const normalizeDraftValue = (): InlineEditValue => {
    if (props.type === 'number') {
        if (!draftValue.value.trim()) {
            return null;
        }

        const numeric = Number(draftValue.value);

        if (!Number.isFinite(numeric)) {
            return props.modelValue ?? null;
        }

        return numeric;
    }

    return draftValue.value;
};

const saveEdit = () => {
    if (!isEditing.value || props.disabled) {
        return;
    }

    const nextValue = normalizeDraftValue();

    emits('update:modelValue', nextValue);
    emits('save', nextValue);

    isEditing.value = false;

    emits('end');
};

const cancelEdit = () => {
    if (!isEditing.value) {
        return;
    }

    syncDraft();

    isEditing.value = false;

    emits('cancel');
    emits('end');
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    draftValue.value = target.value;
};
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);
</script>

<style lang="scss">
.vf-inline-edit {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-inline-edit-gap);
    min-height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-inline-edit-padding);
    border-radius: var(--vf-inline-edit-border-radius);
    border: var(--vf-border-width) solid var(--vf-inline-edit-border-color);
    background-color: var(--vf-inline-edit-background-color);
    color: var(--vf-inline-edit-text-color);
    font-size: var(--vf-inline-edit-font-size);
    line-height: var(--vf-typography-line-height);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-inline-edit_outlined {
    background-color: transparent;
}

.vf-inline-edit:hover:not(.vf-inline-edit_disabled) {
    border-color: var(--vf-inline-edit-hover-border-color);
}

.vf-inline-edit_editing:not(.vf-inline-edit_disabled) {
    border-color: var(--vf-inline-edit-focus-border-color);
    box-shadow: var(--vf-inline-edit-focus-ring-shadow);
}

.vf-inline-edit__value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.vf-inline-edit__value_placeholder {
    color: var(--vf-inline-edit-placeholder-color);
}

.vf-inline-edit__input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    outline: none;
}

.vf-inline-edit__input::placeholder {
    color: var(--vf-inline-edit-placeholder-color);
}

.vf-inline-edit__actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-inline-edit-actions-gap);
}

.vf-inline-edit__action {
    border: var(--vf-border-width) solid var(--vf-inline-edit-button-border-color);
    border-radius: var(--vf-inline-edit-button-radius);
    background-color: var(--vf-inline-edit-button-background-color);
    color: var(--vf-inline-edit-button-text-color);
    padding: var(--vf-inline-edit-button-padding);
    font: inherit;
    line-height: 1;
    cursor: pointer;
}

.vf-inline-edit__action:hover:not(:disabled),
.vf-inline-edit__action:focus-visible:not(:disabled) {
    background-color: var(--vf-inline-edit-button-hover-background-color);
    outline: none;
}

.vf-inline-edit__action_cancel {
    background-color: var(--vf-inline-edit-cancel-button-background-color);
    color: var(--vf-inline-edit-cancel-button-text-color);
    border-color: var(--vf-inline-edit-cancel-button-border-color);
}

.vf-inline-edit__action:disabled {
    cursor: not-allowed;
}

.vf-inline-edit_small {
    padding: var(--vf-inline-edit-small-padding);
    font-size: var(--vf-inline-edit-small-font-size);

    .vf-inline-edit__action {
        padding: var(--vf-inline-edit-small-button-padding);
    }
}

.vf-inline-edit_large {
    padding: var(--vf-inline-edit-large-padding);
    font-size: var(--vf-inline-edit-large-font-size);

    .vf-inline-edit__action {
        padding: var(--vf-inline-edit-large-button-padding);
    }
}

.vf-inline-edit_disabled {
    opacity: var(--vf-inline-edit-disabled-opacity);
    cursor: not-allowed;
}
</style>
