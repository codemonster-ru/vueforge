<template>
    <div class="vf-theme-mode-switch" :class="{ 'vf-theme-mode-switch_disabled': disabled }">
        <SegmentedControl
            :model-value="modelValue"
            :options="options"
            :size="size"
            :disabled="disabled"
            :aria-label="ariaLabel"
            @update:model-value="onUpdate"
            @change="onChange"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SegmentedControl from './segmented-control.vue';

export type ThemeMode = 'system' | 'light' | 'dark';
type Size = 'small' | 'normal' | 'large';

interface ThemeModeOption {
    label: string;
    value: ThemeMode;
    disabled?: boolean;
}

interface Props {
    modelValue?: ThemeMode;
    disabled?: boolean;
    size?: Size;
    ariaLabel?: string;
    systemLabel?: string;
    lightLabel?: string;
    darkLabel?: string;
}

defineOptions({ name: 'VfThemeModeSwitch' });

const props = withDefaults(defineProps<Props>(), {
    modelValue: 'system',
    disabled: false,
    size: 'small',
    ariaLabel: 'Theme mode',
    systemLabel: 'System',
    lightLabel: 'Light',
    darkLabel: 'Dark',
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: ThemeMode): void;
    (event: 'change', value: ThemeMode, eventRef: Event): void;
}>();

const options = computed<Array<ThemeModeOption>>(() => [
    { label: props.systemLabel, value: 'system' },
    { label: props.lightLabel, value: 'light' },
    { label: props.darkLabel, value: 'dark' },
]);

const isThemeMode = (value: unknown): value is ThemeMode => value === 'system' || value === 'light' || value === 'dark';

const onUpdate = (value: unknown) => {
    if (!isThemeMode(value)) {
        return;
    }

    emits('update:modelValue', value);
};

const onChange = (value: unknown, eventRef: Event) => {
    if (!isThemeMode(value)) {
        return;
    }

    emits('change', value, eventRef);
};
</script>

<style lang="scss">
.vf-theme-mode-switch {
    display: inline-flex;
    align-items: center;
}

.vf-theme-mode-switch .vf-segmented-control {
    --vf-segmented-control-font-size: var(--vf-theme-mode-switch-font-size, var(--vf-segmented-control-font-size));
    --vf-segmented-control-gap: var(--vf-theme-mode-switch-gap, var(--vf-segmented-control-gap));
    --vf-segmented-control-padding: var(--vf-theme-mode-switch-padding, var(--vf-segmented-control-padding));
    --vf-segmented-control-border-radius: var(
        --vf-theme-mode-switch-border-radius,
        var(--vf-segmented-control-border-radius)
    );
    --vf-segmented-control-border-color: var(
        --vf-theme-mode-switch-border-color,
        var(--vf-segmented-control-border-color)
    );
    --vf-segmented-control-background-color: var(
        --vf-theme-mode-switch-background-color,
        var(--vf-segmented-control-background-color)
    );
    --vf-segmented-control-text-color: var(--vf-theme-mode-switch-text-color, var(--vf-segmented-control-text-color));
    --vf-segmented-control-hover-background-color: var(
        --vf-theme-mode-switch-hover-background-color,
        var(--vf-segmented-control-hover-background-color)
    );
    --vf-segmented-control-active-background-color: var(
        --vf-theme-mode-switch-active-background-color,
        var(--vf-segmented-control-active-background-color)
    );
    --vf-segmented-control-active-text-color: var(
        --vf-theme-mode-switch-active-text-color,
        var(--vf-segmented-control-active-text-color)
    );
    --vf-segmented-control-focus-ring-shadow: var(
        --vf-theme-mode-switch-focus-ring-shadow,
        var(--vf-segmented-control-focus-ring-shadow)
    );
    --vf-segmented-control-disabled-opacity: var(
        --vf-theme-mode-switch-disabled-opacity,
        var(--vf-segmented-control-disabled-opacity)
    );
    --vf-segmented-control-segment-radius: var(
        --vf-theme-mode-switch-segment-radius,
        var(--vf-segmented-control-segment-radius)
    );
    --vf-segmented-control-segment-padding: var(
        --vf-theme-mode-switch-segment-padding,
        var(--vf-segmented-control-segment-padding)
    );
    --vf-segmented-control-segment-font-weight: var(
        --vf-theme-mode-switch-segment-font-weight,
        var(--vf-segmented-control-segment-font-weight)
    );
    --vf-segmented-control-small-font-size: var(
        --vf-theme-mode-switch-small-font-size,
        var(--vf-segmented-control-small-font-size)
    );
    --vf-segmented-control-small-padding: var(
        --vf-theme-mode-switch-small-padding,
        var(--vf-segmented-control-small-padding)
    );
    --vf-segmented-control-small-segment-padding: var(
        --vf-theme-mode-switch-small-segment-padding,
        var(--vf-segmented-control-small-segment-padding)
    );
    --vf-segmented-control-large-font-size: var(
        --vf-theme-mode-switch-large-font-size,
        var(--vf-segmented-control-large-font-size)
    );
    --vf-segmented-control-large-padding: var(
        --vf-theme-mode-switch-large-padding,
        var(--vf-segmented-control-large-padding)
    );
    --vf-segmented-control-large-segment-padding: var(
        --vf-theme-mode-switch-large-segment-padding,
        var(--vf-segmented-control-large-segment-padding)
    );
}
</style>
