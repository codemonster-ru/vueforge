<template>
    <div ref="root" :class="getClass">
        <div class="vf-member-picker__control" @click="focusInput">
            <span v-if="multiple && selectedMembers.length" class="vf-member-picker__chips">
                <span v-for="member in selectedMembers" :key="String(member.id)" class="vf-member-picker__chip">
                    <slot name="selection" :member="member" :remove="() => removeMember(member)">
                        <Avatar
                            class="vf-member-picker__chip-avatar"
                            :src="member.avatar"
                            :name="member.name"
                            size="small"
                            shape="circle"
                        />
                        <span class="vf-member-picker__chip-label">{{ member.name }}</span>
                        <button
                            v-if="!disabled && !readonly"
                            type="button"
                            class="vf-member-picker__chip-remove"
                            :aria-label="removeLabel"
                            @mousedown.prevent.stop
                            @click.stop="removeMember(member)"
                        >
                            x
                        </button>
                    </slot>
                </span>
            </span>
            <input
                ref="inputRef"
                class="vf-member-picker__input"
                type="text"
                role="combobox"
                :placeholder="resolvedPlaceholder"
                :value="query"
                :disabled="disabled"
                :readonly="readonly"
                :aria-label="ariaLabel"
                :aria-expanded="open"
                :aria-controls="panelId"
                :aria-activedescendant="activeDescendantId"
                aria-autocomplete="list"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter.prevent="onEnter"
                @keydown.esc.prevent="close"
                @keydown.backspace="onBackspace"
            />
        </div>
        <Teleport to="body">
            <div v-show="open" :id="panelId" ref="panelRef" class="vf-member-picker__panel" role="listbox">
                <div v-if="loading" class="vf-member-picker__state">{{ loadingText }}</div>
                <template v-else-if="visibleOptions.length">
                    <button
                        v-for="(member, index) in visibleOptions"
                        :id="getOptionId(index)"
                        :key="String(member.id)"
                        class="vf-member-picker__option"
                        :class="{ 'is-highlighted': highlightedIndex === index, 'is-selected': isSelected(member) }"
                        type="button"
                        role="option"
                        :aria-selected="isSelected(member)"
                        :disabled="member.disabled"
                        @mousedown.prevent
                        @mouseenter="highlightedIndex = index"
                        @click="selectMember(member)"
                    >
                        <slot name="option" :member="member" :index="index" :selected="isSelected(member)">
                            <Avatar
                                class="vf-member-picker__option-avatar"
                                :src="member.avatar"
                                :name="member.name"
                                size="small"
                            />
                            <span class="vf-member-picker__option-content">
                                <span class="vf-member-picker__option-title">{{ member.name }}</span>
                                <span v-if="member.email" class="vf-member-picker__option-meta">{{
                                    member.email
                                }}</span>
                                <slot name="role-hint" :member="member">
                                    <span v-if="member.roleHint" class="vf-member-picker__role-hint">{{
                                        member.roleHint
                                    }}</span>
                                </slot>
                            </span>
                        </slot>
                    </button>
                </template>
                <div v-else class="vf-member-picker__state">{{ emptyText }}</div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';
import Avatar from '@/package/components/avatar.vue';

type MemberValue = string | number;

export interface MemberPickerItem {
    id: MemberValue;
    name: string;
    email?: string;
    avatar?: string;
    roleHint?: string;
    org?: string;
    disabled?: boolean;
}

interface Props {
    modelValue?: MemberValue | Array<MemberValue> | null;
    options?: Array<MemberPickerItem>;
    multiple?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    removeLabel?: string;
    filterLocal?: boolean;
}

let memberPickerIdCounter = 0;

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    options: () => [],
    multiple: true,
    disabled: false,
    readonly: false,
    placeholder: 'Search members...',
    ariaLabel: 'Member picker',
    loading: false,
    loadingText: 'Searching members...',
    emptyText: 'No members found.',
    removeLabel: 'Remove member',
    filterLocal: true,
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: MemberValue | Array<MemberValue> | null): void;
    (event: 'change', value: MemberValue | Array<MemberValue> | null): void;
    (event: 'search', query: string): void;
    (event: 'select', member: MemberPickerItem): void;
    (event: 'remove', member: MemberPickerItem): void;
    (event: 'focus', ev: FocusEvent): void;
    (event: 'blur', ev: FocusEvent): void;
}>();

const root = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const open = ref(false);
const query = ref('');
const highlightedIndex = ref(-1);
const panelId = `vf-member-picker-panel-${++memberPickerIdCounter}`;
let cleanupAutoUpdate: (() => void) | null = null;

const selectedIds = computed<Array<MemberValue>>(() => {
    if (props.multiple) {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
    }

    if (props.modelValue === null || props.modelValue === undefined || Array.isArray(props.modelValue)) {
        return [];
    }

    return [props.modelValue];
});

const selectedMembers = computed(() => props.options.filter(option => selectedIds.value.includes(option.id)));
const normalizedQuery = computed(() => query.value.trim().toLowerCase());
const visibleOptions = computed(() => {
    if (!props.filterLocal || !normalizedQuery.value) {
        return props.options;
    }

    return props.options.filter(option => {
        const candidate = `${option.name} ${option.email ?? ''} ${option.org ?? ''}`.toLowerCase();
        return candidate.includes(normalizedQuery.value);
    });
});
const activeDescendantId = computed(() => {
    if (!open.value || highlightedIndex.value < 0 || highlightedIndex.value >= visibleOptions.value.length) {
        return undefined;
    }

    return getOptionId(highlightedIndex.value);
});
const resolvedPlaceholder = computed(() =>
    props.multiple && selectedMembers.value.length > 0 ? '' : props.placeholder,
);
const getClass = computed(() => [
    'vf-member-picker',
    open.value ? 'vf-member-picker_open' : '',
    props.disabled ? 'vf-member-picker_disabled' : '',
]);

const getOptionId = (index: number) => `${panelId}-option-${index}`;

const isSelected = (member: MemberPickerItem) => selectedIds.value.includes(member.id);

const firstEnabledOptionIndex = () => visibleOptions.value.findIndex(option => !option.disabled);

const emitValue = (value: MemberValue | Array<MemberValue> | null) => {
    emits('update:modelValue', value);
    emits('change', value);
};

const openPanel = async () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = true;
    highlightedIndex.value = firstEnabledOptionIndex();

    await nextTick();

    const input = inputRef.value;
    const panel = panelRef.value;

    if (!input || !panel) {
        return;
    }

    cleanupAutoUpdate?.();
    cleanupAutoUpdate = autoUpdate(input, async () => {
        if (!panelRef.value) {
            return;
        }

        const { x, y } = await computePosition(input, panel, {
            placement: 'bottom-start',
            middleware: [offset(6), flip()],
        });

        panelRef.value.style.left = `${x}px`;
        panelRef.value.style.top = `${y}px`;
        panelRef.value.style.minWidth = `${input.getBoundingClientRect().width}px`;
    });
};

const close = () => {
    open.value = false;
    highlightedIndex.value = -1;
    cleanupAutoUpdate?.();
    cleanupAutoUpdate = null;
};

const focusInput = () => {
    inputRef.value?.focus();
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    query.value = target.value;
    emits('search', query.value);
    openPanel();
};

const onFocus = (event: FocusEvent) => {
    emits('focus', event);
    openPanel();
};

const onBlur = (event: FocusEvent) => {
    emits('blur', event);

    window.setTimeout(() => {
        if (root.value?.contains(document.activeElement)) {
            return;
        }

        close();
    }, 0);
};

const selectMember = (member: MemberPickerItem) => {
    if (member.disabled || props.readonly) {
        return;
    }

    if (props.multiple) {
        if (isSelected(member)) {
            return;
        }

        emitValue([...selectedIds.value, member.id]);
    } else {
        emitValue(member.id);
    }

    emits('select', member);
    query.value = '';

    if (!props.multiple) {
        close();
    }
};

const removeMember = (member: MemberPickerItem) => {
    if (props.readonly || props.disabled) {
        return;
    }

    if (props.multiple) {
        emitValue(selectedIds.value.filter(id => id !== member.id));
    } else {
        emitValue(null);
    }

    emits('remove', member);
};

const onArrowDown = () => {
    if (!open.value) {
        openPanel();
        return;
    }

    if (!visibleOptions.value.length) {
        return;
    }

    let next = highlightedIndex.value;
    for (let step = 0; step < visibleOptions.value.length; step += 1) {
        next = (next + 1) % visibleOptions.value.length;
        if (!visibleOptions.value[next].disabled) {
            highlightedIndex.value = next;
            return;
        }
    }
};

const onArrowUp = () => {
    if (!open.value) {
        openPanel();
        return;
    }

    if (!visibleOptions.value.length) {
        return;
    }

    let next = highlightedIndex.value < 0 ? visibleOptions.value.length : highlightedIndex.value;
    for (let step = 0; step < visibleOptions.value.length; step += 1) {
        next = (next - 1 + visibleOptions.value.length) % visibleOptions.value.length;
        if (!visibleOptions.value[next].disabled) {
            highlightedIndex.value = next;
            return;
        }
    }
};

const onEnter = () => {
    if (!open.value || highlightedIndex.value < 0) {
        return;
    }

    const option = visibleOptions.value[highlightedIndex.value];
    if (!option) {
        return;
    }

    selectMember(option);
};

const onBackspace = () => {
    if (!props.multiple || query.value || !selectedMembers.value.length || props.readonly || props.disabled) {
        return;
    }

    const last = selectedMembers.value[selectedMembers.value.length - 1];

    removeMember(last);
};

watch(
    () => props.options,
    () => {
        if (!open.value) {
            return;
        }

        highlightedIndex.value = firstEnabledOptionIndex();
    },
    { deep: true },
);

onBeforeUnmount(() => {
    cleanupAutoUpdate?.();
});
</script>

<style lang="scss">
.vf-member-picker {
    position: relative;
}

.vf-member-picker__control {
    min-height: var(--vf-member-picker-control-min-height);
    border: var(--vf-border-width) solid var(--vf-member-picker-border-color);
    border-radius: var(--vf-member-picker-border-radius);
    background-color: var(--vf-member-picker-background-color);
    color: var(--vf-member-picker-text-color);
    padding: var(--vf-member-picker-padding);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-member-picker-gap);
    cursor: text;
}

.vf-member-picker_open .vf-member-picker__control {
    border-color: var(--vf-member-picker-focus-border-color);
    box-shadow: var(--vf-member-picker-focus-ring-shadow);
}

.vf-member-picker_disabled .vf-member-picker__control {
    opacity: var(--vf-member-picker-disabled-opacity);
    cursor: not-allowed;
}

.vf-member-picker__chips {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--vf-member-picker-chip-gap);
}

.vf-member-picker__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background-color: var(--vf-member-picker-chip-background-color);
    border: var(--vf-border-width) solid var(--vf-member-picker-chip-border-color);
    border-radius: var(--vf-member-picker-chip-border-radius);
    padding: 0.15rem 0.35rem;
}

.vf-member-picker__chip-avatar {
    flex: 0 0 auto;
}

.vf-member-picker__chip-label {
    font-size: var(--vf-member-picker-chip-font-size);
}

.vf-member-picker__chip-remove {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-member-picker-chip-remove-font-size);
    line-height: 1;
}

.vf-member-picker__input {
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    min-width: 7rem;
    flex: 1;
}

.vf-member-picker__panel {
    position: fixed;
    z-index: var(--vf-member-picker-z-index);
    border: var(--vf-border-width) solid var(--vf-member-picker-panel-border-color);
    border-radius: var(--vf-member-picker-panel-border-radius);
    background-color: var(--vf-member-picker-panel-background-color);
    box-shadow: var(--vf-member-picker-panel-shadow);
    max-height: var(--vf-member-picker-panel-max-height);
    overflow: auto;
}

.vf-member-picker__option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: var(--vf-member-picker-option-padding);
    color: inherit;
    display: flex;
    gap: var(--vf-member-picker-option-gap);
    cursor: pointer;
}

.vf-member-picker__option.is-highlighted {
    background-color: var(--vf-member-picker-option-highlight-background-color);
}

.vf-member-picker__option.is-selected {
    background-color: var(--vf-member-picker-option-selected-background-color);
}

.vf-member-picker__option:disabled {
    opacity: var(--vf-member-picker-disabled-opacity);
    cursor: not-allowed;
}

.vf-member-picker__option-content {
    display: grid;
    gap: 0.15rem;
}

.vf-member-picker__option-title {
    font-size: var(--vf-member-picker-option-title-font-size);
    font-weight: var(--vf-member-picker-option-title-font-weight);
}

.vf-member-picker__option-meta,
.vf-member-picker__role-hint {
    font-size: var(--vf-member-picker-option-meta-font-size);
    color: var(--vf-member-picker-option-meta-color);
}

.vf-member-picker__state {
    padding: var(--vf-member-picker-state-padding);
    color: var(--vf-member-picker-option-meta-color);
}
</style>
