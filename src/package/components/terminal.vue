<template>
    <section class="vf-terminal" :class="{ 'vf-terminal_disabled': disabled }">
        <header v-if="clearable || copyable || $slots.actions" class="vf-terminal__toolbar">
            <slot name="actions">
                <button v-if="copyable" type="button" class="vf-terminal__action" :disabled="disabled" @click="copyLog">
                    {{ copyLabel }}
                </button>
                <button
                    v-if="clearable"
                    type="button"
                    class="vf-terminal__action"
                    :disabled="disabled"
                    @click="clearLog"
                >
                    {{ clearLabel }}
                </button>
            </slot>
        </header>

        <div
            ref="bodyRef"
            class="vf-terminal__body"
            role="log"
            aria-live="polite"
            :aria-label="ariaLabel"
            :style="{ maxHeight }"
        >
            <ul v-if="normalizedEntries.length" class="vf-terminal__list">
                <li
                    v-for="(entry, index) in normalizedEntries"
                    :key="getEntryKey(entry, index)"
                    class="vf-terminal__entry"
                    :data-severity="entry.severity"
                    @click="onEntryClick(entry, index, $event)"
                >
                    <slot name="entry" :entry="entry" :index="index">
                        <span v-if="showTimestamps && entry.timestamp" class="vf-terminal__time">{{
                            entry.timestamp
                        }}</span>
                        <div v-if="entry.command" class="vf-terminal__command">
                            <span class="vf-terminal__prompt">{{ prompt }}</span>
                            <span class="vf-terminal__command-text">{{ entry.command }}</span>
                        </div>
                        <pre v-if="entry.output" class="vf-terminal__output">{{ entry.output }}</pre>
                    </slot>
                </li>
            </ul>
            <p v-else class="vf-terminal__empty">
                <slot name="empty">{{ emptyText }}</slot>
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

type TerminalSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'error';

export interface TerminalEntry {
    id?: string | number;
    command?: string;
    output?: string;
    timestamp?: string;
    severity?: TerminalSeverity;
}

interface Props {
    entries?: Array<TerminalEntry>;
    prompt?: string;
    showTimestamps?: boolean;
    maxHeight?: string;
    clearable?: boolean;
    copyable?: boolean;
    autoScroll?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    emptyText?: string;
    clearLabel?: string;
    copyLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    entries: () => [],
    prompt: '$',
    showTimestamps: true,
    maxHeight: '20rem',
    clearable: false,
    copyable: false,
    autoScroll: true,
    disabled: false,
    ariaLabel: 'Terminal log',
    emptyText: 'No command output yet',
    clearLabel: 'Clear',
    copyLabel: 'Copy log',
});

const emits = defineEmits<{
    (event: 'clear'): void;
    (event: 'copy', payload: { text: string }): void;
    (event: 'entryClick', payload: { entry: TerminalEntry; index: number; event: MouseEvent }): void;
}>();

defineSlots<{
    actions?: () => unknown;
    entry?: (props: { entry: TerminalEntry; index: number }) => unknown;
    empty?: () => unknown;
}>();

const bodyRef = ref<HTMLElement | null>(null);

const normalizedEntries = computed(() =>
    props.entries.map(entry => ({
        ...entry,
        severity: entry.severity ?? 'neutral',
    })),
);

const getEntryKey = (entry: TerminalEntry, index: number) =>
    `${String(entry.id ?? entry.timestamp ?? entry.command ?? 'entry')}_${index}`;

const serializeEntries = () =>
    normalizedEntries.value
        .map(entry => {
            const parts = [
                entry.timestamp,
                entry.command ? `${props.prompt} ${entry.command}` : '',
                entry.output,
            ].filter(Boolean);
            return parts.join('\n');
        })
        .join('\n\n');

const clearLog = () => {
    if (props.disabled) {
        return;
    }

    emits('clear');
};

const copyLog = async () => {
    if (props.disabled) {
        return;
    }

    const text = serializeEntries();
    if (!text) {
        emits('copy', { text });
        return;
    }

    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        }
    } finally {
        emits('copy', { text });
    }
};

const onEntryClick = (entry: TerminalEntry, index: number, event: MouseEvent) => {
    emits('entryClick', { entry, index, event });
};

const scrollToBottom = () => {
    if (!bodyRef.value || !props.autoScroll) {
        return;
    }

    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
};

watch(
    () => props.entries,
    async () => {
        await nextTick();
        scrollToBottom();
    },
    { deep: true, immediate: true },
);
</script>

<style lang="scss">
.vf-terminal {
    border: var(--vf-border-width) solid var(--vf-terminal-border-color);
    border-radius: var(--vf-terminal-border-radius);
    background: var(--vf-terminal-background-color);
    color: var(--vf-terminal-text-color);
    font-family: var(--vf-terminal-font-family);
}

.vf-terminal__toolbar {
    display: flex;
    justify-content: flex-end;
    gap: var(--vf-terminal-actions-gap);
    padding: var(--vf-terminal-toolbar-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-terminal-divider-color);
}

.vf-terminal__action {
    border: var(--vf-border-width) solid var(--vf-terminal-action-border-color);
    border-radius: var(--vf-terminal-action-radius);
    background: var(--vf-terminal-action-background-color);
    color: var(--vf-terminal-action-text-color);
    padding: var(--vf-terminal-action-padding);
    cursor: pointer;
}

.vf-terminal__body {
    overflow: auto;
    padding: var(--vf-terminal-body-padding);
}

.vf-terminal__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--vf-terminal-entry-gap);
}

.vf-terminal__entry {
    display: grid;
    gap: 0.2rem;
    font-size: var(--vf-terminal-font-size);
    line-height: 1.35;
    color: var(--vf-terminal-entry-neutral-color);
}

.vf-terminal__time {
    font-size: var(--vf-terminal-time-font-size);
    color: var(--vf-terminal-time-color);
}

.vf-terminal__command {
    display: inline-flex;
    gap: 0.35rem;
}

.vf-terminal__prompt {
    color: var(--vf-terminal-prompt-color);
}

.vf-terminal__output {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
}

.vf-terminal__entry[data-severity='info'] {
    color: var(--vf-terminal-entry-info-color);
}

.vf-terminal__entry[data-severity='success'] {
    color: var(--vf-terminal-entry-success-color);
}

.vf-terminal__entry[data-severity='warn'] {
    color: var(--vf-terminal-entry-warn-color);
}

.vf-terminal__entry[data-severity='error'] {
    color: var(--vf-terminal-entry-error-color);
}

.vf-terminal__empty {
    margin: 0;
    color: var(--vf-terminal-empty-color);
}

.vf-terminal_disabled {
    opacity: var(--vf-terminal-disabled-opacity);
}
</style>
