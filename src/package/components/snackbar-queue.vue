<template>
    <div class="vf-snackbar-queue">
        <ToastContainer :position="position" :aria-label="ariaLabel">
            <Toast
                v-for="item in visibleItems"
                :key="String(item.id)"
                :model-value="true"
                :title="item.title"
                :message="item.message"
                :severity="item.severity"
                :closable="item.closable ?? true"
                :duration="item.duration ?? defaultDuration"
                @close="dequeueById(item.id)"
            >
                <span v-if="item.message">{{ item.message }}</span>
                <button v-if="item.actionLabel" type="button" class="vf-snackbar-queue__action" @click="onAction(item)">
                    {{ item.actionLabel }}
                </button>
            </Toast>
        </ToastContainer>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Toast from './toast.vue';
import ToastContainer from './toast-container.vue';

type SnackbarSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface SnackbarQueueItem {
    id?: string | number;
    title?: string;
    message?: string;
    severity?: SnackbarSeverity;
    closable?: boolean;
    duration?: number;
    actionLabel?: string;
    dismissOnAction?: boolean;
}

interface NormalizedSnackbarQueueItem extends SnackbarQueueItem {
    id: string | number;
}

interface Props {
    items?: Array<SnackbarQueueItem>;
    maxVisible?: number;
    defaultDuration?: number;
    dedupe?: boolean;
    position?: ToastPosition;
    ariaLabel?: string;
}

defineOptions({ name: 'VfSnackbarQueue' });

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    maxVisible: 1,
    defaultDuration: 3500,
    dedupe: true,
    position: 'bottom-right',
    ariaLabel: 'Snackbar notifications',
});

const emits = defineEmits<{
    (event: 'enqueue', item: NormalizedSnackbarQueueItem): void;
    (event: 'dequeue', item: NormalizedSnackbarQueueItem): void;
    (event: 'action', item: NormalizedSnackbarQueueItem): void;
    (event: 'change', queue: Array<NormalizedSnackbarQueueItem>): void;
}>();

let queueId = 0;
const queue = ref<Array<NormalizedSnackbarQueueItem>>([]);
const knownIds = ref<Set<string | number>>(new Set());

const normalizeItem = (item: SnackbarQueueItem): NormalizedSnackbarQueueItem => {
    const id = item.id ?? `snackbar-${(++queueId).toString(36)}`;
    return {
        ...item,
        id,
    };
};

const publishQueue = () => {
    emits('change', [...queue.value]);
};

const enqueue = (item: SnackbarQueueItem) => {
    const normalized = normalizeItem(item);

    if (props.dedupe && knownIds.value.has(normalized.id)) {
        return;
    }

    knownIds.value.add(normalized.id);
    queue.value.push(normalized);
    emits('enqueue', normalized);
    publishQueue();
};

const dequeueById = (id: string | number) => {
    const index = queue.value.findIndex(item => item.id === id);

    if (index < 0) {
        return;
    }

    const [removed] = queue.value.splice(index, 1);
    knownIds.value.delete(id);

    if (removed) {
        emits('dequeue', removed);
        publishQueue();
    }
};

const clear = () => {
    if (!queue.value.length) {
        return;
    }

    queue.value = [];
    knownIds.value = new Set();
    publishQueue();
};

const onAction = (item: NormalizedSnackbarQueueItem) => {
    emits('action', item);

    if (item.dismissOnAction !== false) {
        dequeueById(item.id);
    }
};

const visibleItems = computed(() => queue.value.slice(0, Math.max(1, props.maxVisible)));

watch(
    () => props.items,
    items => {
        for (const item of items) {
            enqueue(item);
        }
    },
    { immediate: true, deep: true },
);

defineExpose({
    enqueue,
    dequeueById,
    clear,
});
</script>

<style lang="scss">
.vf-snackbar-queue__action {
    margin-inline-start: var(--vf-snackbar-queue-action-gap);
    border: var(--vf-border-width) solid var(--vf-snackbar-queue-action-border-color);
    border-radius: var(--vf-snackbar-queue-action-radius);
    padding: var(--vf-snackbar-queue-action-padding);
    background-color: var(--vf-snackbar-queue-action-background-color);
    color: var(--vf-snackbar-queue-action-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-snackbar-queue__action:hover {
    background-color: var(--vf-snackbar-queue-action-hover-background-color);
}
</style>
