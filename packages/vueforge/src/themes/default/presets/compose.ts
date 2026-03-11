import type { ThemePreset } from '../../../config/theme-core';

export const composeThemePreset = (...presets: Array<Record<string, unknown>>): ThemePreset => {
    const [first, ...rest] = presets;

    return rest.reduce<ThemePreset>(
        (acc, preset) => ({
            ...acc,
            ...preset,
            components: {
                ...((acc.components ?? {}) as Record<string, unknown>),
                ...((preset.components ?? {}) as Record<string, unknown>),
            },
        }),
        first ?? {},
    );
};
