<template>
    <Teleport to="body">
        <div v-show="open" class="vf-command-palette" role="presentation">
            <div class="vf-command-palette__overlay" @click="onOverlayClick"></div>
            <div
                ref="panel"
                class="vf-command-palette__panel"
                role="dialog"
                aria-modal="true"
                :aria-label="resolvedAriaLabel"
                @keydown="onPanelKeydown"
            >
                <div class="vf-command-palette__header">
                    <input
                        ref="inputRef"
                        class="vf-command-palette__input"
                        type="text"
                        :value="query"
                        :placeholder="resolvedPlaceholder"
                        @input="onInput"
                    />
                    <div v-if="showScopeTabs" class="vf-command-palette__scopes" role="tablist">
                        <button
                            v-for="scopeOption in resolvedScopeOptions"
                            :key="scopeOption.id"
                            type="button"
                            class="vf-command-palette__scope"
                            :class="{ 'is-active': scopeOption.id === activeScope }"
                            role="tab"
                            :aria-selected="scopeOption.id === activeScope ? 'true' : 'false'"
                            @click="setScope(scopeOption.id)"
                        >
                            {{ scopeOption.label }}
                        </button>
                    </div>
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
                                    'is-active': item._key === activeKey,
                                    'is-disabled': item.disabled,
                                }"
                                type="button"
                                role="option"
                                :aria-selected="item._key === activeKey"
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
                                <span v-if="item.entityType" class="vf-command-palette__item-entity">
                                    {{ item.entityType }}
                                </span>
                            </button>
                        </div>
                    </template>
                    <div v-else class="vf-command-palette__empty">{{ resolvedEmptyText }}</div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLocaleText } from '@/package/config/locale-text';

export interface CommandPaletteItem {
    label: string;
    value?: string | number;
    description?: string;
    shortcut?: string;
    group?: string;
    scope?: string;
    disabled?: boolean;
    keywords?: Array<string>;
    entityType?: string;
    entityId?: string | number;
    entityKeywords?: Array<string>;
    command?: () => void;
}

interface NormalizedCommandPaletteItem extends CommandPaletteItem {
    _index: number; // stable original order index for deterministic fallback sorting
    _key: string;
}

interface CommandPaletteGroup {
    name: string;
    items: Array<NormalizedCommandPaletteItem>;
}

export interface CommandPaletteScope {
    id: string;
    label: string;
    aliases?: Array<string>;
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
    scopes?: Array<CommandPaletteScope>;
    scope?: string;
    showScopeTabs?: boolean;
    showRecent?: boolean;
    recentLimit?: number;
    recentStorageKey?: string;
    entitySearch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    items: () => [],
    placeholder: undefined,
    emptyText: undefined,
    ariaLabel: undefined,
    closeOnOverlay: true,
    closeOnEsc: true,
    closeOnSelect: true,
    filter: true,
    enableShortcut: true,
    shortcutKey: 'k',
    scopes: () => [],
    scope: 'all',
    showScopeTabs: true,
    showRecent: true,
    recentLimit: 6,
    recentStorageKey: undefined,
    entitySearch: true,
});

const emits = defineEmits([
    'update:modelValue',
    'update:scope',
    'update:recent',
    'open',
    'close',
    'select',
    'search',
    'scopeChange',
    'entitySearch',
]);
defineOptions({ name: 'VfCommandPalette' });

const panel = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref('');
const activeKey = ref<string | null>(null);
const activeScope = ref<string>('all');
const recentKeys = ref<Array<string>>([]);
const previousActiveElement = ref<HTMLElement | null>(null);
const localeText = useLocaleText();
const resolvedEmptyText = computed(() => props.emptyText ?? localeText.commandPalette.emptyText);
const resolvedPlaceholder = computed(() => props.placeholder ?? localeText.commandPalette.placeholder);
const resolvedAriaLabel = computed(() => props.ariaLabel ?? localeText.commandPalette.ariaLabel);
const resolvedScopeAllLabel = computed(() => localeText.commandPalette.scopeAllLabel);
const resolvedRecentLabel = computed(() => localeText.commandPalette.recentLabel);
const showScopeTabs = computed(() => props.showScopeTabs && resolvedScopeOptions.value.length > 1);

const isControlled = computed(() => props.modelValue !== undefined);
const canPersistRecent = computed(() => typeof window !== 'undefined' && !!props.recentStorageKey);

const resolvedScopeOptions = computed<Array<CommandPaletteScope>>(() => [
    { id: 'all', label: resolvedScopeAllLabel.value },
    ...(props.scopes ?? []),
]);

const parseScopedQuery = () => {
    const raw = query.value.trim();

    if (!raw) {
        return { scopeFromQuery: null as string | null, term: '' };
    }

    const match = raw.match(/^([^:\s]+):(.*)$/);

    if (!match) {
        return { scopeFromQuery: null as string | null, term: raw };
    }

    const prefix = match[1].toLowerCase();
    const term = match[2].trim();
    const hit = props.scopes.find(scopeOption => {
        const aliases = [scopeOption.id, ...(scopeOption.aliases ?? [])].map(entry => entry.toLowerCase());
        return aliases.includes(prefix);
    });

    if (!hit) {
        return { scopeFromQuery: null as string | null, term: raw };
    }

    return { scopeFromQuery: hit.id, term };
};

const effectiveScope = computed(() => {
    const parsed = parseScopedQuery();

    if (parsed.scopeFromQuery) {
        return parsed.scopeFromQuery;
    }

    return activeScope.value;
});

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
    const scoped = normalizedItems.value.filter(item => {
        if (effectiveScope.value === 'all') {
            return true;
        }

        return (item.scope ?? 'all') === effectiveScope.value;
    });

    if (!props.filter) {
        return scoped;
    }

    const parsed = parseScopedQuery();
    const term = parsed.term.toLowerCase();

    if (!term) {
        return scoped;
    }

    return scoped.filter(item => {
        const text = [
            item.label,
            item.description ?? '',
            item.entityType ?? '',
            item.entityId !== undefined ? String(item.entityId) : '',
            ...(item.keywords ?? []),
            ...(item.entityKeywords ?? []),
        ]
            .join(' ')
            .toLowerCase();

        return text.includes(term);
    });
});

const recentItems = computed<Array<NormalizedCommandPaletteItem>>(() => {
    if (!props.showRecent || query.value.trim() || !recentKeys.value.length) {
        return [];
    }

    const ordered: Array<NormalizedCommandPaletteItem> = [];

    for (const key of recentKeys.value) {
        const item = filteredItems.value.find(loopItem => loopItem._key === key && !loopItem.disabled);

        if (item) {
            ordered.push(item);
        }
    }

    return ordered;
});

const groupedItems = computed<Array<CommandPaletteGroup>>(() => {
    const groups = new Map<string, Array<NormalizedCommandPaletteItem>>();
    const recentKeySet = new Set(recentItems.value.map(item => item._key));
    const out: Array<CommandPaletteGroup> = [];

    if (recentItems.value.length) {
        out.push({
            name: resolvedRecentLabel.value,
            items: recentItems.value,
        });
    }

    for (const item of filteredItems.value) {
        if (recentKeySet.has(item._key)) {
            continue;
        }

        const group = item.group ?? '';

        if (!groups.has(group)) {
            groups.set(group, []);
        }

        groups.get(group)?.push(item);
    }

    out.push(...Array.from(groups.entries()).map(([name, items]) => ({ name, items })));

    return out;
});

const visibleItems = computed<Array<NormalizedCommandPaletteItem>>(() =>
    groupedItems.value.flatMap(group => group.items),
);
const enabledItems = computed<Array<NormalizedCommandPaletteItem>>(() =>
    visibleItems.value.filter(item => !item.disabled),
);

const focusInput = async () => {
    await nextTick();

    inputRef.value?.focus();
};

const resetActiveIndex = () => {
    const first = enabledItems.value[0];

    activeKey.value = first ? first._key : null;
};

const setOpen = (value: boolean) => {
    emits('update:modelValue', value);

    if (!isControlled.value) {
        open.value = value;
    }
};

const openPalette = async () => {
    previousActiveElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);

    query.value = '';

    resetActiveIndex();

    await focusInput();
};

const closePalette = () => {
    setOpen(false);
    previousActiveElement.value?.focus();
    previousActiveElement.value = null;
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
    const nextQuery = target.value;

    query.value = nextQuery;

    emits('search', nextQuery);
    if (props.entitySearch) {
        const parsed = parseScopedQuery();
        emits('entitySearch', parsed.term.toLowerCase(), effectiveScope.value);
    }

    resetActiveIndex();
};

const saveRecent = () => {
    const next = recentKeys.value.slice(0, props.recentLimit);
    emits('update:recent', next);

    if (canPersistRecent.value) {
        window.localStorage.setItem(props.recentStorageKey as string, JSON.stringify(next));
    }
};

const pushRecent = (item: NormalizedCommandPaletteItem) => {
    if (!props.showRecent) {
        return;
    }

    recentKeys.value = [item._key, ...recentKeys.value.filter(entry => entry !== item._key)].slice(
        0,
        props.recentLimit,
    );
    saveRecent();
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
    pushRecent(item);

    if (props.closeOnSelect) {
        closePalette();
    }
};

const moveActive = (direction: 1 | -1) => {
    if (!enabledItems.value.length) {
        activeKey.value = null;

        return;
    }

    const currentIndex = enabledItems.value.findIndex(item => item._key === activeKey.value);
    const startIndex = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0;
    const nextIndex = (startIndex + direction + enabledItems.value.length) % enabledItems.value.length;

    activeKey.value = enabledItems.value[nextIndex]._key;
};

const selectActive = (event: KeyboardEvent) => {
    if (!activeKey.value) {
        return;
    }

    const item = visibleItems.value.find(loopItem => loopItem._key === activeKey.value);

    if (!item) {
        return;
    }

    selectItem(item, event);
};

const setScope = (nextScope: string) => {
    if (activeScope.value === nextScope) {
        return;
    }

    activeScope.value = nextScope;
    emits('update:scope', nextScope);
    emits('scopeChange', nextScope);
    resetActiveIndex();
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

        if (value && !open.value) {
            previousActiveElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }

        open.value = !!value;
    },
    { immediate: true },
);

watch(
    () => props.scope,
    value => {
        if (value && value !== activeScope.value) {
            activeScope.value = value;
        }
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
    previousActiveElement.value?.focus();
    previousActiveElement.value = null;
});

watch(
    () => visibleItems.value,
    () => {
        const activeExists = visibleItems.value.some(item => item._key === activeKey.value && !item.disabled);

        if (!activeExists) {
            resetActiveIndex();
        }
    },
    { deep: true },
);

watch(
    () => normalizedItems.value.map(item => item._key),
    keys => {
        const keySet = new Set(keys);
        recentKeys.value = recentKeys.value.filter(key => keySet.has(key));
    },
    { deep: true },
);

watch(
    () => [props.recentStorageKey, props.showRecent],
    () => {
        if (!canPersistRecent.value || !props.showRecent) {
            recentKeys.value = [];
            return;
        }

        const raw = window.localStorage.getItem(props.recentStorageKey as string);

        if (!raw) {
            recentKeys.value = [];
            return;
        }

        try {
            const parsed = JSON.parse(raw) as Array<string>;
            recentKeys.value = Array.isArray(parsed) ? parsed.filter(entry => typeof entry === 'string') : [];
        } catch {
            recentKeys.value = [];
        }
    },
    { immediate: true },
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

.vf-command-palette__scopes {
    margin-top: 0.5rem;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.vf-command-palette__scope {
    border: var(--vf-border-width) solid var(--vf-command-palette-group-label-color);
    border-radius: 999px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.75rem;
    line-height: 1.2;
    padding: 0.2rem 0.55rem;
    cursor: pointer;
}

.vf-command-palette__scope.is-active {
    border-color: var(--vf-command-palette-item-active-background-color);
    background-color: var(--vf-command-palette-item-active-background-color);
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
    text-align: start;
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

.vf-command-palette__item-entity {
    color: var(--vf-command-palette-group-label-color);
    font-size: 0.75rem;
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
