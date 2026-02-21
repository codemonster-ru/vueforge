<template>
    <Teleport to="body">
        <div v-show="modelValue" class="vf-notification-center" role="presentation">
            <div class="vf-notification-center__overlay" @click="onOverlayClick"></div>
            <section
                ref="panel"
                class="vf-notification-center__panel"
                role="dialog"
                aria-modal="true"
                :aria-label="title"
                tabindex="-1"
            >
                <header class="vf-notification-center__header">
                    <div class="vf-notification-center__title-wrap">
                        <h3 class="vf-notification-center__title">{{ title }}</h3>
                        <span v-if="unreadCount > 0" class="vf-notification-center__badge">{{ unreadCount }}</span>
                    </div>
                    <div class="vf-notification-center__header-actions">
                        <button
                            type="button"
                            class="vf-notification-center__action"
                            :disabled="!hasUnread"
                            @click="markAllAsRead"
                        >
                            {{ markAllLabel }}
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__action"
                            :disabled="!localItems.length"
                            @click="clearAll"
                        >
                            {{ clearLabel }}
                        </button>
                        <button
                            type="button"
                            class="vf-notification-center__close"
                            :aria-label="closeLabel"
                            @click="close"
                        >
                            &times;
                        </button>
                    </div>
                </header>

                <div class="vf-notification-center__body">
                    <ul v-if="localItems.length" class="vf-notification-center__list">
                        <li
                            v-for="(item, index) in localItems"
                            :key="String(item.id)"
                            class="vf-notification-center__item"
                            :class="{ 'is-unread': !item.read }"
                            :data-severity="item.severity || 'neutral'"
                        >
                            <slot name="item" :item="item" :index="index" :toggle-read="() => toggleRead(item.id)">
                                <button
                                    type="button"
                                    class="vf-notification-center__item-main"
                                    @click="onItemClick(item, index)"
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
                            </slot>
                            <button type="button" class="vf-notification-center__toggle" @click="toggleRead(item.id)">
                                {{ item.read ? unreadLabel : readLabel }}
                            </button>
                        </li>
                    </ul>
                    <p v-else class="vf-notification-center__empty">
                        <slot name="empty">{{ emptyText }}</slot>
                    </p>
                </div>
            </section>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

type NotificationSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

export interface NotificationCenterItem {
    id: string | number;
    title: string;
    message?: string;
    date?: string;
    read?: boolean;
    severity?: NotificationSeverity;
    avatar?: string;
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
}

const emits = defineEmits(['update:modelValue', 'update:items', 'open', 'close', 'click', 'read', 'readAll', 'clear']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    items: () => [],
    title: 'Notifications',
    emptyText: 'No notifications',
    closeOnOverlay: true,
    closeOnEsc: true,
    markAllLabel: 'Mark all as read',
    clearLabel: 'Clear',
    closeLabel: 'Close notifications',
    readLabel: 'Mark as read',
    unreadLabel: 'Mark as unread',
});

const panel = ref<HTMLElement | null>(null);
const localItems = ref<Array<NotificationCenterItem>>([]);
const previousActiveElement = ref<HTMLElement | null>(null);

const unreadCount = computed(() => localItems.value.filter(item => !item.read).length);
const hasUnread = computed(() => unreadCount.value > 0);

const normalizeItems = (items: Array<NotificationCenterItem>) =>
    items.map(item => ({
        ...item,
        read: Boolean(item.read),
    }));

watch(
    () => props.items,
    value => {
        localItems.value = normalizeItems(value);
    },
    { deep: true, immediate: true },
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
};

const clearAll = () => {
    if (!localItems.value.length) {
        return;
    }

    const cleared = localItems.value.map(item => ({ ...item }));

    localItems.value = [];
    emitItemsUpdate();
    emits('clear', cleared);
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
    right: var(--vf-notification-center-right);
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

.vf-notification-center__list {
    margin: 0;
    padding: 0;
    list-style: none;
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
    text-align: left;
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
