<template>
    <Alert
        class="vf-message"
        :model-value="modelValue"
        :title="title"
        :message="message"
        :severity="severity"
        :closable="closable"
        :icon="icon"
        @update:model-value="onUpdateModelValue"
        @close="$emit('close')"
    >
        <template v-if="$slots.icon" #icon>
            <slot name="icon" />
        </template>
        <template v-if="$slots.title" #title>
            <slot name="title" />
        </template>
        <template v-if="$slots.default" #default>
            <slot />
        </template>
        <template v-if="$slots.actions" #actions>
            <slot name="actions" />
        </template>
        <template v-if="$slots.close" #close>
            <slot name="close" />
        </template>
    </Alert>
</template>

<script setup lang="ts">
import Alert from '@/package/components/alert.vue';

type MessageSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface Props {
    modelValue?: boolean;
    title?: string;
    message?: string;
    severity?: MessageSeverity;
    closable?: boolean;
    icon?: string;
}

withDefaults(defineProps<Props>(), {
    title: '',
    message: '',
    severity: 'neutral',
    closable: false,
    icon: '',
});

const emits = defineEmits(['update:modelValue', 'close']);

const onUpdateModelValue = (value: boolean) => emits('update:modelValue', value);
</script>

<style lang="scss">
.vf-message {
    display: flex;
}
</style>
