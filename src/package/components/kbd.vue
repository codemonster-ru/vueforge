<template>
    <span
        class="vf-kbd"
        :class="{
            [`vf-kbd_size-${size}`]: true,
            'vf-kbd_disabled': disabled,
        }"
        role="group"
        :aria-label="ariaLabel || undefined"
        :aria-disabled="disabled ? 'true' : undefined"
    >
        <template v-if="resolvedKeys.length > 0">
            <template v-for="(keyLabel, index) in resolvedKeys" :key="`${keyLabel}-${index}`">
                <kbd class="vf-kbd__key">
                    <slot name="key" :label="keyLabel" :index="index">{{ keyLabel }}</slot>
                </kbd>
                <span v-if="index < resolvedKeys.length - 1" class="vf-kbd__separator" aria-hidden="true">
                    {{ separator }}
                </span>
            </template>
        </template>
        <kbd v-else class="vf-kbd__key">
            <slot />
        </kbd>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type KbdSize = 'small' | 'normal' | 'large';

interface Props {
    keys?: string | Array<string>;
    separator?: string;
    size?: KbdSize;
    disabled?: boolean;
    ariaLabel?: string;
}

defineOptions({ name: 'VfKbd' });

const props = withDefaults(defineProps<Props>(), {
    keys: '',
    separator: '+',
    size: 'normal',
    disabled: false,
    ariaLabel: '',
});

const resolvedKeys = computed(() => {
    if (Array.isArray(props.keys)) {
        return props.keys.map(key => key.trim()).filter(Boolean);
    }

    if (typeof props.keys !== 'string' || props.keys.trim().length === 0) {
        return [];
    }

    return props.keys
        .split(props.separator)
        .map(key => key.trim())
        .filter(Boolean);
});
</script>

<style lang="scss">
.vf-kbd {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-kbd-gap);
    font-family: var(--vf-kbd-font-family);
    font-size: var(--vf-kbd-font-size);
    font-weight: var(--vf-kbd-font-weight);
    line-height: var(--vf-kbd-line-height);
}

.vf-kbd__key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--vf-kbd-key-min-width);
    padding: var(--vf-kbd-key-padding);
    border: var(--vf-border-width) solid var(--vf-kbd-key-border-color);
    border-radius: var(--vf-kbd-key-border-radius);
    background-color: var(--vf-kbd-key-background-color);
    color: var(--vf-kbd-key-text-color);
    box-shadow: var(--vf-kbd-key-shadow);
}

.vf-kbd__separator {
    color: var(--vf-kbd-separator-color);
    font-weight: 500;
}

.vf-kbd_size-small {
    font-size: var(--vf-kbd-small-font-size);
}

.vf-kbd_size-small .vf-kbd__key {
    min-width: var(--vf-kbd-small-key-min-width);
    padding: var(--vf-kbd-small-key-padding);
}

.vf-kbd_size-large {
    font-size: var(--vf-kbd-large-font-size);
}

.vf-kbd_size-large .vf-kbd__key {
    min-width: var(--vf-kbd-large-key-min-width);
    padding: var(--vf-kbd-large-key-padding);
}

.vf-kbd_disabled {
    opacity: var(--vf-kbd-disabled-opacity);
}
</style>
