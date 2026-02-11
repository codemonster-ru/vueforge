<template>
    <div class="vf-splitbutton" :class="getClass">
        <Button
            v-if="$slots.default"
            class="vf-splitbutton__main"
            :label="label"
            :icon="icon"
            :type="type"
            :size="size"
            :variant="variant"
            :severity="severity"
            :loading="loading"
            :disabled="disabled"
            @click="onPrimaryClick"
        >
            <slot />
        </Button>
        <Button
            v-else
            class="vf-splitbutton__main"
            :label="label"
            :icon="icon"
            :type="type"
            :size="size"
            :variant="variant"
            :severity="severity"
            :loading="loading"
            :disabled="disabled"
            @click="onPrimaryClick"
        />
        <Dropdown
            ref="dropdown"
            class="vf-splitbutton__dropdown"
            :model-value="modelValue"
            :items="items"
            :placement="placement"
            :offset="offset"
            :disabled="disabled || loading"
            :close-on-select="closeOnSelect"
            :close-on-esc="closeOnEsc"
            :match-trigger-width="matchTriggerWidth"
            @update:model-value="onUpdateModelValue"
            @open="event => emits('open', event)"
            @close="event => emits('close', event)"
            @select="event => emits('select', event)"
        >
            <template #trigger>
                <Button
                    class="vf-splitbutton__toggle"
                    icon="chevronDown"
                    :size="size"
                    :variant="variant"
                    :severity="severity"
                    :disabled="disabled || loading"
                    :aria-label="toggleAriaLabel"
                />
            </template>
            <template v-if="$slots.menu" #default>
                <slot name="menu" />
            </template>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/package/components/button.vue';
import Dropdown from '@/package/components/dropdown.vue';

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top';
type ButtonType = 'button' | 'submit' | 'reset';
type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined' | 'text';

interface Item {
    to?: string;
    href?: string;
    url?: string;
    icon?: string;
    label?: string;
    active?: boolean;
    disabled?: boolean;
    separator?: boolean;
    command?: () => void;
}

interface Props {
    modelValue?: boolean;
    items?: Array<Item>;
    label?: string;
    icon?: string;
    type?: ButtonType;
    size?: Size;
    variant?: Variant;
    severity?: string;
    disabled?: boolean;
    loading?: boolean;
    placement?: Placement;
    offset?: number;
    closeOnSelect?: boolean;
    closeOnEsc?: boolean;
    matchTriggerWidth?: boolean;
    toggleAriaLabel?: string;
}

type DropdownExposed = {
    open: () => void;
    close: () => void;
    toggle: () => void;
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    items: () => [],
    label: '',
    icon: undefined,
    type: 'button',
    size: 'normal',
    variant: undefined,
    severity: 'primary',
    disabled: false,
    loading: false,
    placement: 'bottom-start',
    offset: 6,
    closeOnSelect: true,
    closeOnEsc: true,
    matchTriggerWidth: true,
    toggleAriaLabel: 'Toggle actions',
});

const emits = defineEmits(['click', 'update:modelValue', 'open', 'close', 'select']);
defineOptions({ name: 'VfSplitButton' });

const dropdown = ref<DropdownExposed | null>(null);

const getClass = computed(() => {
    const classes = ['vf-splitbutton'];

    if (props.disabled || props.loading) {
        classes.push('vf-splitbutton_disabled');
    }

    if (props.size === 'small' || props.size === 'large') {
        classes.push(`vf-splitbutton_${props.size}`);
    }

    return classes;
});

const onPrimaryClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) {
        event.preventDefault();

        return;
    }

    dropdown.value?.close();

    emits('click', event);
};

const onUpdateModelValue = (value: boolean) => {
    emits('update:modelValue', value);
};

defineExpose({
    open: () => dropdown.value?.open(),
    close: () => dropdown.value?.close(),
    toggle: () => dropdown.value?.toggle(),
});
</script>

<style lang="scss">
.vf-splitbutton {
    display: inline-flex;
    align-items: stretch;
    border-radius: var(--vf-splitbutton-border-radius);
}

.vf-splitbutton__main {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.vf-splitbutton__dropdown {
    display: inline-flex;
}

.vf-splitbutton__dropdown > .vf-dropdown__trigger {
    display: inline-flex;
}

.vf-splitbutton__toggle {
    min-width: var(--vf-splitbutton-toggle-min-width);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: calc(var(--vf-border-width) * -1);
    padding-right: var(--vf-splitbutton-toggle-padding-x);
    padding-left: var(--vf-splitbutton-toggle-padding-x);
}

.vf-splitbutton__toggle .vf-button__icon {
    margin: 0;
    font-size: var(--vf-splitbutton-toggle-icon-size);
}

.vf-splitbutton_disabled {
    opacity: var(--vf-splitbutton-disabled-opacity);
}

.vf-splitbutton_small .vf-splitbutton__toggle {
    min-width: var(--vf-splitbutton-small-toggle-min-width);
}

.vf-splitbutton_large .vf-splitbutton__toggle {
    min-width: var(--vf-splitbutton-large-toggle-min-width);
}
</style>
