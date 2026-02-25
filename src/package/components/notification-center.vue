<template>
    <Teleport to="body">
        <div v-show="modelValue" class="vf-notification-center" role="presentation">
            <div class="vf-notification-center__overlay" @click="onOverlayClick"></div>
            <section
                ref="panel"
                class="vf-notification-center__panel"
                role="dialog"
                aria-modal="true"
                :aria-label="resolvedTitle"
                tabindex="-1"
            >
                <header class="vf-notification-center__header">
                    <div class="vf-notification-center__title-wrap">
                        <h3 class="vf-notification-center__title">{{ resolvedTitle }}</h3>
                        <span v-if="filteredUnreadCount > 0" class="vf-notification-center__badge">
                            {{ filteredUnreadCount }}
                        </span>
                    </div>
                    <div class="vf-notification-center__header-actions">
                        <button
                            type="button"
                            class="vf-notification-center__action"
                            :disabled="!hasUnread"
                            @click="markAllAsRead"
                        >
                            {{ resolvedMarkAllLabel }}
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__action"
                            :disabled="!localItems.length"
                            @click="clearAll"
                        >
                            {{ resolvedClearLabel }}
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__close"
                            :aria-label="resolvedCloseLabel"
                            @click="close"
                        >
                            &times;
                        </button>
                    </div>
                </header>

                <div class="vf-notification-center__body">
                    <div v-if="showFilters && localItems.length" class="vf-notification-center__filters" role="tablist">
                        <button
                            type="button"
                            class="vf-notification-center__filter"
                            :class="{ 'is-active': activeFilter === 'all' }"
                            role="tab"
                            :aria-selected="activeFilter === 'all' ? 'true' : 'false'"
                            @click="setFilter('all')"
                        >
                            {{ resolvedFilterAllLabel }} ({{ localItems.length }})
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__filter"
                            :class="{ 'is-active': activeFilter === 'unread' }"
                            role="tab"
                            :aria-selected="activeFilter === 'unread' ? 'true' : 'false'"
                            @click="setFilter('unread')"
                        >
                            {{ resolvedFilterUnreadLabel }} ({{ unreadCount }})
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__filter"
                            :class="{ 'is-active': activeFilter === 'read' }"
                            role="tab"
                            :aria-selected="activeFilter === 'read' ? 'true' : 'false'"
                            @click="setFilter('read')"
                        >
                            {{ resolvedFilterReadLabel }} ({{ readCount }})
                        </button>
                    </div>

                    <ul v-if="filteredItems.length" class="vf-notification-center__list">
                        <template v-for="group in groupedItems" :key="group.key">
                            <li v-if="groupedItems.length > 1" class="vf-notification-center__group-label">
                                {{ group.label }}
                            </li>
                            <li
                                v-for="item in group.items"
                                :key="String(item.id)"
                                class="vf-notification-center__item"
                                :class="{ 'is-unread': !item.read }"
                                :data-severity="item.severity || 'neutral'"
                            >
                                <slot
                                    name="item"
                                    :item="item"
                                    :index="getFilteredIndex(item.id)"
                                    :toggle-read="() => toggleRead(item.id)"
                                >
                                    <button
                                        type="button"
                                        class="vf-notification-center__item-main"
                                        @click="onItemClick(item, getFilteredIndex(item.id))"
                                    >
                                        <span class="vf-notification-center__avatar" aria-hidden="true">
                                            {{ getAvatarLabel(item) }}
                                        </span>
                                        <span class="vf-notification-center__content">
                                            <span class="vf-notification-center__item-title">{{ item.title }}</span>
                                            <span v-if="item.message" class="vf-notification-center__item-message">
                                                {{ item.message }}
                                            </span>
                                            <span v-if="item.date" class="vf-notification-center__item-date">{{
                                                item.date
                                            }}</span>
                                        </span>
                                    </button>
                                    <a
                                        v-if="item.actionLabel && item.actionHref"
                                        class="vf-notification-center__action-link"
                                        :href="item.actionHref"
                                        :target="item.actionTarget || undefined"
                                        :rel="item.actionRel || undefined"
                                        @click.stop="onItemAction(item, getFilteredIndex(item.id), $event)"
                                    >
                                        {{ item.actionLabel }}
                                    </a>
                                    <button
                                        v-else-if="item.actionLabel"
                                        type="button"
                                        class="vf-notification-center__action-link"
                                        @click.stop="onItemAction(item, getFilteredIndex(item.id), $event)"
                                    >
                                        {{ item.actionLabel }}
                                    </button>
                                </slot>
                                <button
                                    type="button"
                                    class="vf-notification-center__toggle"
                                    @click="toggleRead(item.id)"
                                >
                                    {{ item.read ? resolvedUnreadLabel : resolvedReadLabel }}
                                </button>
                            </li>
                        </template>
                    </ul>
                    <p v-else class="vf-notification-center__empty">
                        <slot name="empty">{{ resolvedEmptyText }}</slot>
                    </p>
                </div>
            </section>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useLocaleText } from '@/package/config/locale-text';

type NotificationSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
export type NotificationFilter = 'all' | 'unread' | 'read';
export type NotificationGroupBy = 'none' | 'date' | 'severity' | 'group';
type NotificationPersistReason = 'hydrate' | 'filter' | 'toggleRead' | 'markAll' | 'clear';

export interface NotificationCenterItem {
    id: string | number;
    title: string;
    message?: string;
    date?: string;
    read?: boolean;
    severity?: NotificationSeverity;
    avatar?: string;
    group?: string;
    actionLabel?: string;
    actionHref?: string;
    actionTarget?: string;
    actionRel?: string;
}

export interface NotificationCenterPersistState {
    filter: NotificationFilter;
    readMap: Record<string, boolean>;
    updatedAt: string;
}

interface Props {
    modelValue?: boolean;
    items?: Array<NotificationCenterItem>;
    title?: string;
    emptyText?: string;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    markAllLabel?: string;
    clearLabel?: string;
    closeLabel?: string;
    readLabel?: string;
    unreadLabel?: string;
    showFilters?: boolean;
    filter?: NotificationFilter;
    groupBy?: NotificationGroupBy;
    persistKey?: string;
    persistReadState?: boolean;
    persistFilterState?: boolean;
}

const emits = defineEmits([
    'update:modelValue',
    'update:items',
    'update:filter',
    'open',
    'close',
    'click',
    'read',
    'readAll',
    'clear',
    'action',
    'filterChange',
    'persist',
]);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    items: () => [],
    title: undefined,
    emptyText: undefined,
    closeOnOverlay: true,
    closeOnEsc: true,
    markAllLabel: undefined,
    clearLabel: undefined,
    closeLabel: undefined,
    readLabel: undefined,
    unreadLabel: undefined,
    showFilters: false,
    filter: undefined,
    groupBy: 'none',
    persistKey: undefined,
    persistReadState: false,
    persistFilterState: false,
});

const panel = ref<HTMLElement | null>(null);
const localItems = ref<Array<NotificationCenterItem>>([]);
const previousActiveElement = ref<HTMLElement | null>(null);
const persistedState = ref<NotificationCenterPersistState | null>(null);
const activeFilter = ref<NotificationFilter>('all');
const localeText = useLocaleText();
const resolvedEmptyText = computed(() => props.emptyText ?? localeText.notificationCenter.emptyText);
const resolvedTitle = computed(() => props.title ?? localeText.notificationCenter.title);
const resolvedMarkAllLabel = computed(() => props.markAllLabel ?? localeText.notificationCenter.markAllLabel);
const resolvedClearLabel = computed(() => props.clearLabel ?? localeText.notificationCenter.clearLabel);
const resolvedCloseLabel = computed(() => props.closeLabel ?? localeText.notificationCenter.closeLabel);
const resolvedReadLabel = computed(() => props.readLabel ?? localeText.notificationCenter.readLabel);
const resolvedUnreadLabel = computed(() => props.unreadLabel ?? localeText.notificationCenter.unreadLabel);
const resolvedFilterAllLabel = computed(() => localeText.notificationCenter.filterAllLabel);
const resolvedFilterUnreadLabel = computed(() => localeText.notificationCenter.filterUnreadLabel);
const resolvedFilterReadLabel = computed(() => localeText.notificationCenter.filterReadLabel);

const unreadCount = computed(() => localItems.value.filter(item => !item.read).length);
const readCount = computed(() => localItems.value.length - unreadCount.value);
const hasUnread = computed(() => unreadCount.value > 0);
const filteredItems = computed(() => {
    if (activeFilter.value === 'unread') {
        return localItems.value.filter(item => !item.read);
    }
    if (activeFilter.value === 'read') {
        return localItems.value.filter(item => item.read);
    }
    return localItems.value;
});
const filteredUnreadCount = computed(() => filteredItems.value.filter(item => !item.read).length);

const groupedItems = computed(() => {
    const groups: Array<{ key: string; label: string; items: Array<NotificationCenterItem> }> = [];
    const groupMap = new Map<string, { key: string; label: string; items: Array<NotificationCenterItem> }>();

    const resolveGroup = (item: NotificationCenterItem) => {
        if (props.groupBy === 'date') {
            return item.date || 'Undated';
        }
        if (props.groupBy === 'severity') {
            return item.severity || 'neutral';
        }
        if (props.groupBy === 'group') {
            return item.group || 'Other';
        }
        return 'all';
    };

    for (const item of filteredItems.value) {
        const label = resolveGroup(item);
        const key = String(label).toLowerCase();
        const existing = groupMap.get(key);

        if (existing) {
            existing.items.push(item);
            continue;
        }

        const created = { key, label: String(label), items: [item] };
        groupMap.set(key, created);
        groups.push(created);
    }

    return groups;
});

const getFilteredIndex = (id: string | number) => filteredItems.value.findIndex(item => String(item.id) === String(id));

const canPersist = computed(
    () => typeof window !== 'undefined' && !!props.persistKey && (props.persistReadState || props.persistFilterState),
);

const normalizeItems = (items: Array<NotificationCenterItem>) =>
    items.map(item => ({
        ...item,
        read:
            props.persistReadState && persistedState.value?.readMap
                ? Boolean(persistedState.value.readMap[String(item.id)] ?? item.read)
                : Boolean(item.read),
    }));

const buildPersistState = (): NotificationCenterPersistState => ({
    filter: activeFilter.value,
    readMap: Object.fromEntries(localItems.value.map(item => [String(item.id), Boolean(item.read)])),
    updatedAt: new Date().toISOString(),
});

const persistState = (reason: NotificationPersistReason) => {
    const next = buildPersistState();
    persistedState.value = next;
    emits('persist', next, reason);

    if (!canPersist.value) {
        return;
    }

    window.localStorage.setItem(props.persistKey as string, JSON.stringify(next));
};

const hydratePersistState = () => {
    if (!canPersist.value) {
        persistedState.value = null;
        return;
    }

    const raw = window.localStorage.getItem(props.persistKey as string);
    if (!raw) {
        persistedState.value = null;
        return;
    }

    try {
        const parsed = JSON.parse(raw) as NotificationCenterPersistState;
        const safeFilter = ['all', 'unread', 'read'].includes(parsed.filter) ? parsed.filter : 'all';
        persistedState.value = {
            filter: safeFilter as NotificationFilter,
            readMap: parsed.readMap && typeof parsed.readMap === 'object' ? parsed.readMap : {},
            updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
        };
        if (props.persistFilterState && props.filter === undefined) {
            activeFilter.value = persistedState.value.filter;
        }
        emits('persist', persistedState.value, 'hydrate');
    } catch {
        persistedState.value = null;
    }
};

watch(
    () => props.items,
    value => {
        localItems.value = normalizeItems(value);
    },
    { deep: true, immediate: true },
);

watch(
    () => props.filter,
    value => {
        if (value) {
            activeFilter.value = value;
        }
    },
    { immediate: true },
);

watch(
    () => [props.persistKey, props.persistReadState, props.persistFilterState],
    () => {
        hydratePersistState();
        localItems.value = normalizeItems(props.items);
    },
    { immediate: true },
);

const emitItemsUpdate = () => {
    emits(
        'update:items',
        localItems.value.map(item => ({ ...item })),
    );
};

const close = () => {
    emits('update:modelValue', false);
    emits('close');
};

const setFilter = (nextFilter: NotificationFilter) => {
    if (activeFilter.value === nextFilter) {
        return;
    }

    activeFilter.value = nextFilter;
    emits('update:filter', nextFilter);
    emits('filterChange', nextFilter);

    if (props.persistFilterState) {
        persistState('filter');
    }
};

const onOverlayClick = () => {
    if (props.closeOnOverlay) {
        close();
    }
};

const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!props.modelValue || !props.closeOnEsc) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();
    }
};

watch(
    () => props.modelValue,
    async value => {
        if (value) {
            previousActiveElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            emits('open');
            await nextTick();
            panel.value?.focus();
            document.addEventListener('keydown', onDocumentKeydown, false);
        } else {
            document.removeEventListener('keydown', onDocumentKeydown, false);
            previousActiveElement.value?.focus();
            previousActiveElement.value = null;
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown, false);
});

const getAvatarLabel = (item: NotificationCenterItem) => {
    const source = (item.avatar || item.title || '').trim();

    return source ? source.charAt(0).toUpperCase() : 'N';
};

const onItemClick = (item: NotificationCenterItem, index: number) => {
    emits('click', item, index);
};

const onItemAction = (item: NotificationCenterItem, index: number, event: Event) => {
    emits('action', item, index, event);
};

const toggleRead = (id: string | number) => {
    const next = localItems.value.map(item => {
        if (item.id !== id) {
            return item;
        }

        return {
            ...item,
            read: !item.read,
        };
    });
    const changed = next.find(item => item.id === id);

    localItems.value = next;
    emitItemsUpdate();

    if (changed) {
        emits('read', changed, changed.read);
    }

    if (props.persistReadState) {
        persistState('toggleRead');
    }
};

const markAllAsRead = () => {
    if (!hasUnread.value) {
        return;
    }

    localItems.value = localItems.value.map(item => ({
        ...item,
        read: true,
    }));
    emitItemsUpdate();
    emits('readAll', localItems.value);

    if (props.persistReadState) {
        persistState('markAll');
    }
};

const clearAll = () => {
    if (!localItems.value.length) {
        return;
    }

    const cleared = localItems.value.map(item => ({ ...item }));

    localItems.value = [];
    emitItemsUpdate();
    emits('clear', cleared);

    if (props.persistReadState || props.persistFilterState) {
        persistState('clear');
    }
};
</script>

<style lang="scss">
.vf-notification-center {
    position: fixed;
    inset: 0;
    z-index: var(--vf-notification-center-z-index);
}

.vf-notification-center__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--vf-notification-center-overlay-background-color);
}

.vf-notification-center__panel {
    position: absolute;
    top: var(--vf-notification-center-top);
    inset-inline-end: var(--vf-notification-center-right);
    width: var(--vf-notification-center-width);
    max-width: var(--vf-notification-center-max-width);
    max-height: var(--vf-notification-center-max-height);
    display: grid;
    grid-template-rows: auto 1fr;
    border: var(--vf-border-width) solid var(--vf-notification-center-border-color);
    border-radius: var(--vf-notification-center-border-radius);
    background-color: var(--vf-notification-center-background-color);
    color: var(--vf-notification-center-text-color);
    box-shadow: var(--vf-notification-center-shadow);
    overflow: hidden;
    outline: none;
}

.vf-notification-center__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-notification-center-header-gap);
    padding: var(--vf-notification-center-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-notification-center-divider-color);
}

.vf-notification-center__title-wrap {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-notification-center-title-gap);
}

.vf-notification-center__title {
    margin: 0;
    font-size: var(--vf-notification-center-title-font-size);
    line-height: var(--vf-notification-center-title-line-height);
    font-weight: var(--vf-notification-center-title-font-weight);
}

.vf-notification-center__badge {
    min-width: var(--vf-notification-center-badge-size);
    height: var(--vf-notification-center-badge-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
    border-radius: 999px;
    background-color: var(--vf-notification-center-badge-background-color);
    color: var(--vf-notification-center-badge-text-color);
    font-size: var(--vf-notification-center-badge-font-size);
    line-height: 1;
}

.vf-notification-center__header-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-notification-center-actions-gap);
}

.vf-notification-center__action,
.vf-notification-center__close,
.vf-notification-center__toggle {
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.vf-notification-center__action:disabled,
.vf-notification-center__toggle:disabled {
    opacity: var(--vf-notification-center-disabled-opacity);
    cursor: not-allowed;
}

.vf-notification-center__close {
    width: var(--vf-notification-center-close-size);
    height: var(--vf-notification-center-close-size);
    border-radius: 999px;
    font-size: 1rem;
    line-height: 1;
}

.vf-notification-center__close:hover {
    background-color: var(--vf-notification-center-close-hover-background-color);
}

.vf-notification-center__body {
    min-height: 0;
    overflow: auto;
}

.vf-notification-center__filters {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.75rem;
    border-bottom: var(--vf-border-width) solid var(--vf-notification-center-divider-color);
}

.vf-notification-center__filter {
    border: var(--vf-border-width) solid var(--vf-notification-center-divider-color);
    border-radius: 999px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.75rem;
    line-height: 1.1;
    padding: 0.2rem 0.55rem;
    cursor: pointer;
}

.vf-notification-center__filter.is-active {
    border-color: var(--vf-notification-center-badge-background-color);
    color: var(--vf-notification-center-badge-background-color);
}

.vf-notification-center__list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.vf-notification-center__group-label {
    padding: 0.5rem 0.75rem 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--vf-notification-center-item-meta-color);
    border-bottom: var(--vf-border-width) solid var(--vf-notification-center-divider-color);
}

.vf-notification-center__item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--vf-notification-center-item-gap);
    align-items: center;
    padding: var(--vf-notification-center-item-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-notification-center-divider-color);
}

.vf-notification-center__item-main {
    display: flex;
    gap: var(--vf-notification-center-item-gap);
    align-items: flex-start;
    border: none;
    background: transparent;
    text-align: start;
    color: inherit;
    padding: 0;
    cursor: pointer;
}

.vf-notification-center__avatar {
    width: var(--vf-notification-center-avatar-size);
    height: var(--vf-notification-center-avatar-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background-color: var(--vf-notification-center-avatar-background-color);
    color: var(--vf-notification-center-avatar-text-color);
    font-size: var(--vf-notification-center-avatar-font-size);
    flex: 0 0 auto;
}

.vf-notification-center__content {
    min-width: 0;
    display: grid;
    gap: 0.15rem;
}

.vf-notification-center__item-title {
    font-size: var(--vf-notification-center-item-title-font-size);
    font-weight: var(--vf-notification-center-item-title-font-weight);
}

.vf-notification-center__item-message,
.vf-notification-center__item-date {
    font-size: var(--vf-notification-center-item-meta-font-size);
    color: var(--vf-notification-center-item-meta-color);
}

.vf-notification-center__action-link {
    display: inline-flex;
    width: fit-content;
    margin-top: 0.15rem;
    border: none;
    background: transparent;
    color: var(--vf-notification-center-badge-background-color);
    font: inherit;
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
}

.vf-notification-center__item.is-unread {
    background-color: var(--vf-notification-center-unread-background-color);
}

.vf-notification-center__empty {
    margin: 0;
    padding: var(--vf-notification-center-empty-padding);
    color: var(--vf-notification-center-empty-color);
    text-align: center;
}
</style>
