import { App } from 'vue';
import { ThemeOptions, ThemePreset } from './theme-core';
import { getTheme, setTheme, updateTheme } from './theme-runtime';
import { DateTimeLocaleOptions, getDateTimeLocale, setDateTimeLocale, updateDateTimeLocale } from './date-time-locale';
import { getLocaleText, LocaleTextOptions, setLocaleText, updateLocaleText } from './locale-text';
import {
    applyUiPreferences,
    DensityPreset,
    getDensityPreset,
    getReducedMotion,
    getUiPreferences,
    setDensityPreset,
    setReducedMotion,
} from './ui-preferences';
import { resolvePassThrough, withPartClass } from './pass-through';

type VueForgeOptions = {
    theme?: ThemeOptions | ThemePreset;
    dateTimeLocale?: DateTimeLocaleOptions;
    localeText?: LocaleTextOptions;
    density?: DensityPreset;
    reducedMotion?: boolean;
};

export {
    setTheme,
    updateTheme,
    getTheme,
    setDateTimeLocale,
    updateDateTimeLocale,
    getDateTimeLocale,
    setLocaleText,
    updateLocaleText,
    getLocaleText,
};
export type { DateTimeLocaleOptions };
export type { LocaleTextOptions };
export { setDensityPreset, getDensityPreset, setReducedMotion, getReducedMotion, getUiPreferences, applyUiPreferences };
export type { DensityPreset };
export { resolvePassThrough, withPartClass };
export type {
    PassThroughAttrs,
    PassThroughEntry,
    PassThroughOptions,
    PassThroughResolverContext,
} from './pass-through';

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: VueForgeOptions = {}) {
        if (options.theme) {
            setTheme(options.theme);
        }

        if (options.dateTimeLocale) {
            setDateTimeLocale(options.dateTimeLocale);
        }
        if (options.localeText) {
            setLocaleText(options.localeText);
        }

        applyUiPreferences({
            density: options.density,
            reducedMotion: options.reducedMotion,
        });
    },
};
