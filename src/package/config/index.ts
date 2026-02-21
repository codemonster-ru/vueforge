import { App } from 'vue';
import { ThemeOptions, ThemePreset } from './theme-core';
import { getTheme, setTheme, updateTheme } from './theme-runtime';
import { DateTimeLocaleOptions, getDateTimeLocale, setDateTimeLocale, updateDateTimeLocale } from './date-time-locale';
import {
    applyUiPreferences,
    DensityPreset,
    getDensityPreset,
    getReducedMotion,
    getUiPreferences,
    setDensityPreset,
    setReducedMotion,
} from './ui-preferences';

type VueForgeOptions = {
    theme?: ThemeOptions | ThemePreset;
    dateTimeLocale?: DateTimeLocaleOptions;
    density?: DensityPreset;
    reducedMotion?: boolean;
};

export { setTheme, updateTheme, getTheme, setDateTimeLocale, updateDateTimeLocale, getDateTimeLocale };
export type { DateTimeLocaleOptions };
export { setDensityPreset, getDensityPreset, setReducedMotion, getReducedMotion, getUiPreferences, applyUiPreferences };
export type { DensityPreset };

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: VueForgeOptions = {}) {
        if (options.theme) {
            setTheme(options.theme);
        }

        if (options.dateTimeLocale) {
            setDateTimeLocale(options.dateTimeLocale);
        }

        applyUiPreferences({
            density: options.density,
            reducedMotion: options.reducedMotion,
        });
    },
};
