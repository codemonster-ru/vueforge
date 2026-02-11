<template>
    <Teleport to="body">
        <div v-show="open" class="vf-command-palette" role="presentation">
            <div class="vf-command-palette__overlay" @click="onOverlayClick"></div>
            <div
                ref="panel"
                class="vf-command-palette__panel"
                role="dialog"
                aria-modal="true"
                :aria-label="ariaLabel"
                @keydown="onPanelKeydown"
            >
                <div class="vf-command-palette__header">
                    <input
                        ref="inputRef"
                        class="vf-command-palette__input"
                        type="text"
                        :value="query"
                        :placeholder="placeholder"
                        @input="onInput"
                    />
                </div>
                <div class="vf-command-palette__list" role="listbox">
                    <template v-if="groupedItems.length">
                        <div
                            v-for="group in groupedItems"
                            :key="group.name"
                            class="vf-command-palette__group"
                            :data-group="group.name"
                        >
                            <div v-if="group.name" class="vf-command-palette__group-label">{{ group.name }}</div>
                            <button
                                v-for="item in group.items"
                                :key="item._key"
                                class="vf-command-palette__item"
                                :class="{
                                    'is-active': item._index === activeIndex,
                                    'is-disabled': item.disabled,
                                }"
                                type="button"
                                role="option"
                                :aria-selected="item._index === activeIndex"
                                :disabled="item.disabled"
                                @click="selectItem(item, $event)"
                            >
                                <div class="vf-command-palette__item-main">
                                    <span class="vf-command-palette__item-label">{{ item.label }}</span>
                                    <span v-if="item.shortcut" class="vf-command-palette__item-shortcut">{{
                                        item.shortcut
                                    }}</span>
                                </div>
                                <span v-if="item.description" class="vf-command-palette__item-description">{{
                                    item.description
                                }}</span>
                            </button>
                        </div>
                    </template>
                    <div v-else class="vf-command-palette__empty">{{ emptyText }}</div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface CommandPaletteItem {
    label: string;
    value?: string | number;
    description?: string;
    shortcut?: string;
    group?: string;
    disabled?: boolean;
    keywords?: Array<string>;
    command?: () => void;
}

interface NormalizedCommandPaletteItem extends CommandPaletteItem {
    _index: number;
    _key: string;
}

interface CommandPaletteGroup {
    name: string;
    items: Array<NormalizedCommandPaletteItem>;
}

interface Props {
    modelValue?: boolean;
    items?: Array<CommandPaletteItem>;
    placeholder?: string;
    emptyText?: string;
    ariaLabel?: string;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    closeOnSelect?: boolean;
    filter?: boolean;
    enableShortcut?: boolean;
    shortcutKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    items: () => [],
    placeholder: 'Type a command or search...',
    emptyText: 'No commands found',
    ariaLabel: 'Command palette',
    closeOnOverlay: true,
    closeOnEsc: true,
    closeOnSelect: true,
    filter: true,
    enableShortcut: true,
    shortcutKey: 'k',
});

const emits = defineEmits(['update:modelValue', 'open', 'close', 'select', 'search']);
defineOptions({ name: 'VfCommandPalette' });

const panel = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref('');
const activeIndex = ref(-1);

const isControlled = computed(() => props.modelValue !== undefined);

const normalizedItems = computed<Array<NormalizedCommandPaletteItem>>(() => {
    return props.items.map((item, index) => {
        const group = item.group ?? '';

        return {
            ...item,
            group,
            _index: index,
            _key: `${group}:${item.value ?? item.label}:${index.toString()}`,
        };
    });
});

const filteredItems = computed<Array<NormalizedCommandPaletteItem>>(() => {
    if (!props.filter) {
        return normalizedItems.value;
    }

    const term = query.value.trim().toLowerCase();

    if (!term) {
        return normalizedItems.value;
    }

    return normalizedItems.value.filter(item => {
        const text = [item.label, item.description ?? '', ...(item.keywords ?? [])].join(' ').toLowerCase();

        return text.includes(term);
    });
});

const groupedItems = computed<Array<CommandPaletteGroup>>(() => {
    const groups = new Map<string, Array<NormalizedCommandPaletteItem>>();

    for (const item of filteredItems.value) {
        const group = item.group ?? '';

        if (!groups.has(group)) {
            groups.set(group, []);
        }

        groups.get(group)?.push(item);
    }

    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
});

const enabledItems = computed<Array<NormalizedCommandPaletteItem>>(() => {
    return filteredItems.value.filter(item => !item.disabled);
});

const focusInput = async () => {
    await nextTick();

    inputRef.value?.focus();
};

const resetActiveIndex = () => {
    const first = enabledItems.value[0];

    activeIndex.value = first ? first._index : -1;
};

const setOpen = (value: boolean) => {
    emits('update:modelValue', value);

    if (!isControlled.value) {
        open.value = value;
    }
};

const openPalette = async () => {
    setOpen(true);

    query.value = '';

    resetActiveIndex();

    await focusInput();
};

const closePalette = () => {
    setOpen(false);
};

const togglePalette = async () => {
    if (open.value) {
        closePalette();

        return;
    }

    await openPalette();
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    query.value = target.value;

    emits('search', query.value);

    resetActiveIndex();
};

const selectItem = (item: NormalizedCommandPaletteItem, event: Event) => {
    if (item.disabled) {
        event.preventDefault();

        return;
    }

    if (typeof item.command === 'function') {
        item.command();
    }

    emits('select', item, event);

    if (props.closeOnSelect) {
        closePalette();
    }
};

const moveActive = (direction: 1 | -1) => {
    if (!enabledItems.value.length) {
        activeIndex.value = -1;

        return;
    }

    const currentIndex = enabledItems.value.findIndex(item => item._index === activeIndex.value);
    const startIndex = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0;
    const nextIndex = (startIndex + direction + enabledItems.value.length) % enabledItems.value.length;

    activeIndex.value = enabledItems.value[nextIndex]._index;
};

const selectActive = (event: KeyboardEvent) => {
    if (activeIndex.value < 0) {
        return;
    }

    const item = filteredItems.value.find(loopItem => loopItem._index === activeIndex.value);

    if (!item) {
        return;
    }

    selectItem(item, event);
};

const onPanelKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
        event.preventDefault();

        moveActive(1);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();

        moveActive(-1);

        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();

        selectActive(event);

        return;
    }

    if (event.key === 'Escape' && props.closeOnEsc) {
        event.preventDefault();

        closePalette();
    }
};

const onOverlayClick = () => {
    if (props.closeOnOverlay) {
        closePalette();
    }
};

const isEditableTarget = (eventTarget: EventTarget | null) => {
    if (!(eventTarget instanceof Element)) {
        return false;
    }

    const target = eventTarget as HTMLElement;
    const tagName = target.tagName;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return true;
    }

    return !!target.closest('[contenteditable="true"]');
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!props.enableShortcut) {
        return;
    }

    if (isEditableTarget(event.target)) {
        return;
    }

    if (event.key.toLowerCase() !== props.shortcutKey.toLowerCase()) {
        return;
    }

    if (!event.metaKey && !event.ctrlKey) {
        return;
    }

    event.preventDefault();

    void togglePalette();
};

watch(
    () => props.modelValue,
    value => {
        if (!isControlled.value) {
            return;
        }

        open.value = !!value;
    },
    { immediate: true },
);

watch(open, async value => {
    if (value) {
        emits('open');

        query.value = '';

        resetActiveIndex();

        await focusInput();

        return;
    }

    emits('close');
});

watch(
    () => filteredItems.value,
    () => {
        const activeExists = filteredItems.value.some(item => item._index === activeIndex.value && !item.disabled);

        if (!activeExists) {
            resetActiveIndex();
        }
    },
    { deep: true },
);

onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown);
});

defineExpose({ open: openPalette, close: closePalette, toggle: togglePalette });
</script>

<style lang="scss">
.vf-command-palette {
    position: fixed;
    inset: 0;
    z-index: var(--vf-command-palette-z-index);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 10vh;
}

.vf-command-palette__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--vf-command-palette-overlay-background-color);
}

.vf-command-palette__panel {
    position: relative;
    z-index: 1;
    width: var(--vf-command-palette-width);
    max-width: var(--vf-command-palette-max-width);
    max-height: var(--vf-command-palette-max-height);
    padding: var(--vf-command-palette-padding);
    border-radius: var(--vf-command-palette-border-radius);
    border: var(--vf-border-width) solid var(--vf-command-palette-border-color);
    background-color: var(--vf-command-palette-background-color);
    color: var(--vf-command-palette-text-color);
    box-shadow: var(--vf-command-palette-shadow);
    overflow: auto;
    outline: none;
}

.vf-command-palette__header {
    margin-bottom: var(--vf-command-palette-header-gap);
}

.vf-command-palette__input {
    width: 100%;
    padding: var(--vf-command-palette-input-padding);
    border: var(--vf-border-width) solid var(--vf-command-palette-input-border-color);
    border-radius: var(--vf-command-palette-input-border-radius);
    background-color: var(--vf-command-palette-input-background-color);
    color: var(--vf-command-palette-input-text-color);
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-command-palette__input::placeholder {
    color: var(--vf-command-palette-input-placeholder-color);
}

.vf-command-palette__input:focus {
    border-color: var(--vf-command-palette-input-focus-border-color);
    box-shadow: var(--vf-command-palette-input-focus-ring-shadow);
}

.vf-command-palette__list {
    display: grid;
    gap: var(--vf-command-palette-list-gap);
}

.vf-command-palette__group {
    display: grid;
    gap: var(--vf-command-palette-group-gap);
}

.vf-command-palette__group-label {
    padding: var(--vf-command-palette-group-label-padding);
    color: var(--vf-command-palette-group-label-color);
    font-size: var(--vf-command-palette-group-label-font-size);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.vf-command-palette__item {
    width: 100%;
    border: none;
    border-radius: var(--vf-command-palette-item-border-radius);
    padding: var(--vf-command-palette-item-padding);
    text-align: left;
    background-color: transparent;
    color: var(--vf-command-palette-item-text-color);
    font: inherit;
    cursor: pointer;
    display: grid;
    gap: var(--vf-command-palette-item-gap);
}

.vf-command-palette__item-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.vf-command-palette__item-label {
    font-weight: 500;
}

.vf-command-palette__item-shortcut {
    border: var(--vf-border-width) solid var(--vf-command-palette-shortcut-border-color);
    border-radius: var(--vf-command-palette-shortcut-border-radius);
    background-color: var(--vf-command-palette-shortcut-background-color);
    color: var(--vf-command-palette-shortcut-text-color);
    padding: var(--vf-command-palette-shortcut-padding);
    font-size: var(--vf-command-palette-shortcut-font-size);
    line-height: 1;
}

.vf-command-palette__item-description {
    color: var(--vf-command-palette-item-description-color);
    font-size: var(--vf-command-palette-item-description-font-size);
}

.vf-command-palette__item:hover:not(.is-disabled),
.vf-command-palette__item:focus-visible:not(.is-disabled),
.vf-command-palette__item.is-active {
    background-color: var(--vf-command-palette-item-active-background-color);
    color: var(--vf-command-palette-item-active-text-color);
    outline: none;
}

.vf-command-palette__item:hover:not(.is-disabled) .vf-command-palette__item-description,
.vf-command-palette__item:focus-visible:not(.is-disabled) .vf-command-palette__item-description,
.vf-command-palette__item.is-active .vf-command-palette__item-description {
    color: inherit;
}

.vf-command-palette__item.is-disabled {
    opacity: var(--vf-command-palette-item-disabled-opacity);
    cursor: not-allowed;
}

.vf-command-palette__empty {
    padding: var(--vf-command-palette-empty-padding);
    color: var(--vf-command-palette-empty-color);
    text-align: center;
}
</style>
