<template>
    <component :is="as" ref="rootRef" class="vf-hotkey">
        <slot :trigger="trigger" />
    </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useHotkey } from './use-hotkey';

interface Props {
    combo?: string | Array<string>;
    enabled?: boolean;
    disabled?: boolean;
    scoped?: boolean;
    event?: 'keydown' | 'keyup';
    preventDefault?: boolean;
    stopPropagation?: boolean;
    ignoreInputs?: boolean;
    allowInInputs?: boolean;
    exact?: boolean;
    as?: string;
}

defineOptions({ name: 'VfHotkey' });

const props = withDefaults(defineProps<Props>(), {
    combo: 'mod+k',
    enabled: true,
    disabled: false,
    scoped: true,
    event: 'keydown',
    preventDefault: true,
    stopPropagation: false,
    ignoreInputs: true,
    allowInInputs: false,
    exact: true,
    as: 'div',
});

const emits = defineEmits<{
    (event: 'trigger', payload: { event: KeyboardEvent; combo: string }): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const isEnabled = computed(() => props.enabled && !props.disabled);

const trigger = (event: KeyboardEvent, combo: string) => {
    emits('trigger', { event, combo });
};

useHotkey({
    combo: props.combo,
    handler: trigger,
    enabled: isEnabled,
    event: props.event,
    preventDefault: props.preventDefault,
    stopPropagation: props.stopPropagation,
    ignoreInputs: props.ignoreInputs,
    allowInInputs: props.allowInInputs,
    exact: props.exact,
    scopeRef: props.scoped ? rootRef : undefined,
});
</script>

<style lang="scss">
.vf-hotkey {
    display: contents;
}
</style>
