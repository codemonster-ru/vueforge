import { App } from 'vue';
import { ThemeOptions, ThemePreset } from './theme-core';
import { getTheme, setTheme, updateTheme } from './theme-runtime';

type VueForgeOptions = {
    theme?: ThemeOptions | ThemePreset;
};

export { setTheme, updateTheme, getTheme };

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: VueForgeOptions = {}) {
        if (options.theme) {
            setTheme(options.theme);
        }
    },
};
