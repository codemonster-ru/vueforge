<template>
    <section class="vf-bulk-action-bar" role="region" :aria-label="ariaLabel">
        <div class="vf-bulk-action-bar__summary">
            <strong>{{ selectedCount }}</strong>
            <span>{{ selectedCountLabel }}</span>
        </div>

        <div class="vf-bulk-action-bar__actions">
            <button
                v-for="action in actions"
                :key="action.id"
                type="button"
                class="vf-bulk-action-bar__button"
                :disabled="isActionDisabled(action)"
                @click="onActionClick(action)"
            >
                {{ action.label }}
            </button>
        </div>

        <button
            v-if="showUndoButton"
            type="button"
            class="vf-bulk-action-bar__button vf-bulk-action-bar__button_secondary"
            :disabled="disabled || undoDisabled"
            @click="onUndo"
        >
            {{ undoLabel }}
        </button>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BulkActionBarAction } from './bulk-action-bar-types';

interface Props {
    selection?: Array<string | number>;
    actions?: Array<BulkActionBarAction>;
    disabled?: boolean;
    confirmMessage?: string;
    selectedCountLabel?: string;
    ariaLabel?: string;
    undoLabel?: string;
    showUndoButton?: boolean;
    undoDisabled?: boolean;
    lastActionId?: string | null;
    undoToken?: string;
}

const props = withDefaults(defineProps<Props>(), {
    selection: () => [],
    actions: () => [],
    disabled: false,
    confirmMessage: 'Are you sure?',
    selectedCountLabel: 'selected',
    ariaLabel: 'Bulk action bar',
    undoLabel: 'Undo',
    showUndoButton: true,
    undoDisabled: false,
    lastActionId: null,
    undoToken: '',
});

const emit = defineEmits(['action', 'confirm', 'undo']);

const selectedCount = computed(() => props.selection.length);

const isActionDisabled = (action: BulkActionBarAction) =>
    props.disabled || action.disabled || selectedCount.value === 0;

const onActionClick = (action: BulkActionBarAction) => {
    if (isActionDisabled(action)) {
        return;
    }

    if (action.requiresConfirm) {
        emit('confirm', {
            actionId: action.id,
            selection: [...props.selection],
            message: props.confirmMessage,
        });
        return;
    }

    emit('action', {
        actionId: action.id,
        selection: [...props.selection],
    });
};

const onUndo = () => {
    if (props.disabled || props.undoDisabled || !props.lastActionId || selectedCount.value === 0) {
        return;
    }

    emit('undo', {
        actionId: props.lastActionId,
        selection: [...props.selection],
        token: props.undoToken || undefined,
    });
};
</script>

<style lang="scss">
.vf-bulk-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--vf-bulk-action-bar-gap);
    padding: var(--vf-bulk-action-bar-padding);
    border: var(--vf-border-width) solid var(--vf-bulk-action-bar-border-color);
    border-radius: var(--vf-bulk-action-bar-border-radius);
    background-color: var(--vf-bulk-action-bar-background-color);
    color: var(--vf-bulk-action-bar-text-color);
}

.vf-bulk-action-bar__summary {
    display: inline-flex;
    align-items: baseline;
    gap: 0.3rem;
    color: var(--vf-bulk-action-bar-secondary-text-color);
}

.vf-bulk-action-bar__actions {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-bulk-action-bar-row-gap);
}

.vf-bulk-action-bar__button {
    min-height: var(--vf-bulk-action-bar-control-height);
    border: var(--vf-border-width) solid var(--vf-bulk-action-bar-control-border-color);
    border-radius: var(--vf-bulk-action-bar-control-border-radius);
    background-color: var(--vf-bulk-action-bar-control-background-color);
    color: inherit;
    font: inherit;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
}

.vf-bulk-action-bar__button_secondary {
    border-color: var(--vf-bulk-action-bar-secondary-border-color);
}

.vf-bulk-action-bar__button:focus-visible,
.vf-bulk-action-bar__button:hover:not(:disabled) {
    outline: none;
    border-color: var(--vf-bulk-action-bar-focus-border-color);
    box-shadow: var(--vf-bulk-action-bar-focus-ring);
}

.vf-bulk-action-bar__button:disabled {
    opacity: var(--vf-bulk-action-bar-disabled-opacity);
    cursor: not-allowed;
}
</style>
