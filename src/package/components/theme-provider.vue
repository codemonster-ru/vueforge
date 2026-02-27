<template>
    <component :is="as" v-bind="rootAttrs">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildThemeVariables, mergeDeep, type ThemePreset } from '@/package/config/theme-core';
import { getTheme } from '@/package/config/theme-runtime';
import DefaultTheme from '@/package/themes/default';

interface Props {
    preset?: ThemePreset;
    overrides?: ThemePreset;
    as?: string;
    dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    preset: undefined,
    overrides: undefined,
    as: 'div',
    dark: false,
});

const parseCssVars = (vars: string[]) => {
    const style: Record<string, string> = {};

    for (const declaration of vars) {
        const separatorIndex = declaration.indexOf(':');
        if (separatorIndex <= 0) {
            continue;
        }

        const key = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (!key || !value) {
            continue;
        }

        style[key] = value;
    }

    return style;
};

const resolvedPreset = computed(() => {
    const globalPreset = (getTheme()?.preset ?? (DefaultTheme as unknown as ThemePreset)) as ThemePreset;
    const basePreset = props.preset ?? globalPreset;

    return mergeDeep(basePreset, props.overrides);
});

const scopeStyle = computed(() => {
    const variables = buildThemeVariables(resolvedPreset.value);
    const declarations = props.dark && variables.darkVars.length > 0 ? variables.darkVars : variables.baseVars;

    return parseCssVars(declarations);
});

const rootAttrs = computed(() => ({
    class: 'vf-theme-provider',
    style: scopeStyle.value,
    'data-theme': props.dark ? 'dark' : undefined,
}));
</script>
