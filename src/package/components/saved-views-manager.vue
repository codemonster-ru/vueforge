<template>
    <section class="vf-saved-views-manager" role="region" :aria-label="ariaLabel">
        <div class="vf-saved-views-manager__top">
            <label class="vf-saved-views-manager__label" :for="selectId">{{ viewsLabel }}</label>
            <select
                :id="selectId"
                class="vf-saved-views-manager__select"
                :value="modelValue ?? ''"
                :disabled="disabled"
                @change="onSelectView"
            >
                <option value="">{{ noViewLabel }}</option>
                <option v-for="item in localItems" :key="item.id" :value="item.id">
                    {{ item.name }}{{ item.isDefault ? ` (${defaultBadgeLabel})` : '' }}
                </option>
            </select>
        </div>

        <div class="vf-saved-views-manager__editor">
            <input
                class="vf-saved-views-manager__input"
                :disabled="disabled"
                :placeholder="namePlaceholder"
                :value="draftName"
                @input="onDraftInput"
            />
            <div class="vf-saved-views-manager__actions">
                <button type="button" class="vf-saved-views-manager__button" :disabled="disabled" @click="saveView">
                    {{ saveLabel }}
                </button>
                <button
                    type="button"
                    class="vf-saved-views-manager__button"
                    :disabled="disabled || !activeView"
                    @click="renameView"
                >
                    {{ renameLabel }}
                </button>
                <button
                    type="button"
                    class="vf-saved-views-manager__button"
                    :disabled="disabled || !activeView"
                    @click="setDefaultView"
                >
                    {{ setDefaultLabel }}
                </button>
                <button
                    v-if="allowShare"
                    type="button"
                    class="vf-saved-views-manager__button"
                    :disabled="disabled || !activeView"
                    @click="toggleShareView"
                >
                    {{ activeView?.shared ? unshareLabel : shareLabel }}
                </button>
                <button
                    type="button"
                    class="vf-saved-views-manager__button vf-saved-views-manager__button_danger"
                    :disabled="disabled || !activeView"
                    @click="removeView"
                >
                    {{ deleteLabel }}
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { SavedViewItem } from './saved-views-manager-types';

interface Props {
    modelValue?: string | null;
    items?: Array<SavedViewItem>;
    currentState?: unknown;
    allowShare?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    viewsLabel?: string;
    noViewLabel?: string;
    defaultBadgeLabel?: string;
    namePlaceholder?: string;
    saveLabel?: string;
    renameLabel?: string;
    setDefaultLabel?: string;
    shareLabel?: string;
    unshareLabel?: string;
    deleteLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    items: () => [],
    currentState: undefined,
    allowShare: true,
    disabled: false,
    ariaLabel: 'Saved views manager',
    viewsLabel: 'Saved views',
    noViewLabel: 'No view selected',
    defaultBadgeLabel: 'default',
    namePlaceholder: 'View name',
    saveLabel: 'Save current',
    renameLabel: 'Rename',
    setDefaultLabel: 'Set default',
    shareLabel: 'Share',
    unshareLabel: 'Unshare',
    deleteLabel: 'Delete',
});

const emit = defineEmits([
    'update:modelValue',
    'update:items',
    'select',
    'save',
    'rename',
    'setDefault',
    'share',
    'delete',
    'change',
]);

const idCounter = ref(0);
const selectId = `vf-saved-views-manager-${++idCounter.value}`;
const draftName = ref('');
const localItems = ref<Array<SavedViewItem>>([]);

const cloneItems = (items: Array<SavedViewItem>) => JSON.parse(JSON.stringify(items)) as Array<SavedViewItem>;
const cloneItem = (item: SavedViewItem) => JSON.parse(JSON.stringify(item)) as SavedViewItem;

watch(
    () => props.items,
    value => {
        localItems.value = cloneItems(value);
    },
    { deep: true, immediate: true },
);

watch(
    () => props.modelValue,
    value => {
        const item = localItems.value.find(entry => entry.id === value);
        draftName.value = item?.name || '';
    },
    { immediate: true },
);

const activeView = computed(() => localItems.value.find(item => item.id === props.modelValue) || null);

const commitItems = () => {
    const payload = cloneItems(localItems.value);

    emit('update:items', payload);
    emit('change', payload);
};

const createId = () => {
    idCounter.value += 1;
    return `vf-view-${Date.now().toString(36)}-${idCounter.value.toString(36)}`;
};

const onSelectView = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const id = target.value || null;
    const selected = localItems.value.find(item => item.id === id) || null;

    emit('update:modelValue', id);
    emit('select', selected ? cloneItem(selected) : null);
};

const onDraftInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    draftName.value = target.value;
};

const saveView = () => {
    const name = draftName.value.trim();

    if (!name) {
        return;
    }

    const item: SavedViewItem = {
        id: createId(),
        name,
        state: props.currentState,
        shared: false,
        isDefault: localItems.value.length === 0,
        updatedAt: new Date().toISOString(),
    };

    localItems.value.push(item);
    commitItems();
    emit('update:modelValue', item.id);
    emit('save', cloneItem(item));
};

const renameView = () => {
    const current = activeView.value;
    const name = draftName.value.trim();

    if (!current || !name) {
        return;
    }

    current.name = name;
    current.updatedAt = new Date().toISOString();
    commitItems();
    emit('rename', cloneItem(current));
};

const setDefaultView = () => {
    const current = activeView.value;

    if (!current) {
        return;
    }

    localItems.value = localItems.value.map(item => ({
        ...item,
        isDefault: item.id === current.id,
    }));
    commitItems();
    emit('setDefault', cloneItem(current));
};

const toggleShareView = () => {
    const current = activeView.value;

    if (!current) {
        return;
    }

    current.shared = !current.shared;
    current.updatedAt = new Date().toISOString();
    commitItems();
    emit('share', cloneItem(current), current.shared);
};

const removeView = () => {
    const current = activeView.value;

    if (!current) {
        return;
    }

    localItems.value = localItems.value.filter(item => item.id !== current.id);

    if (current.isDefault && localItems.value.length) {
        localItems.value[0].isDefault = true;
    }

    commitItems();
    emit('delete', cloneItem(current));
    emit('update:modelValue', null);
    draftName.value = '';
};
</script>

<style lang="scss">
.vf-saved-views-manager {
    display: grid;
    gap: var(--vf-saved-views-manager-gap);
    padding: var(--vf-saved-views-manager-padding);
    border: var(--vf-border-width) solid var(--vf-saved-views-manager-border-color);
    border-radius: var(--vf-saved-views-manager-border-radius);
    background-color: var(--vf-saved-views-manager-background-color);
    color: var(--vf-saved-views-manager-text-color);
}

.vf-saved-views-manager__top,
.vf-saved-views-manager__editor {
    display: grid;
    gap: var(--vf-saved-views-manager-row-gap);
}

.vf-saved-views-manager__label {
    font-size: var(--vf-saved-views-manager-label-font-size);
    color: var(--vf-saved-views-manager-secondary-text-color);
}

.vf-saved-views-manager__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
}

.vf-saved-views-manager__select,
.vf-saved-views-manager__input,
.vf-saved-views-manager__button {
    min-height: var(--vf-saved-views-manager-control-height);
    border: var(--vf-border-width) solid var(--vf-saved-views-manager-control-border-color);
    border-radius: var(--vf-saved-views-manager-control-border-radius);
    background-color: var(--vf-saved-views-manager-control-background-color);
    color: inherit;
    font: inherit;
}

.vf-saved-views-manager__select,
.vf-saved-views-manager__input {
    padding: 0.35rem 0.55rem;
}

.vf-saved-views-manager__button {
    padding: 0.35rem 0.7rem;
    cursor: pointer;
}

.vf-saved-views-manager__button_danger {
    color: var(--vf-saved-views-manager-danger-text-color);
    border-color: var(--vf-saved-views-manager-danger-border-color);
}

.vf-saved-views-manager__select:focus-visible,
.vf-saved-views-manager__input:focus-visible,
.vf-saved-views-manager__button:focus-visible,
.vf-saved-views-manager__button:hover:not(:disabled) {
    outline: none;
    border-color: var(--vf-saved-views-manager-focus-border-color);
    box-shadow: var(--vf-saved-views-manager-focus-ring);
}

.vf-saved-views-manager__select:disabled,
.vf-saved-views-manager__input:disabled,
.vf-saved-views-manager__button:disabled {
    opacity: var(--vf-saved-views-manager-disabled-opacity);
    cursor: not-allowed;
}
</style>
