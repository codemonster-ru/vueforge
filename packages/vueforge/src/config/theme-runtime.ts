import { buildThemeVariables, mergeDeep, normalizeThemeOptions, ThemeOptions, ThemePreset } from './theme-core';

type ThemeRuntimeOptions = ThemeOptions & {
    selector?: string;
    darkSelector?: string;
};

const ensureStyleElement = (id: string) => {
    if (typeof document === 'undefined') {
        return null;
    }

    const existing = document.getElementById(id);

    if (existing && existing.tagName.toLowerCase() === 'style') {
        return existing as HTMLStyleElement;
    }

    const style = document.createElement('style');
    style.id = id;

    document.head.appendChild(style);

    return style;
};

const getSelectors = (options: ThemeRuntimeOptions) => {
    return {
        selector: options.selector ?? ':root',
        darkSelector: options.darkSelector ?? ':root[data-theme=dark]',
    };
};

const applyTheme = (theme: ThemePreset, selector: string, darkSelector: string, strict?: boolean) => {
    const { baseVars, darkVars, warnings, errors } = buildThemeVariables(theme);
    const style = ensureStyleElement('vueforge-theme');

    if (!style) {
        return;
    }

    if (errors.length) {
        if (strict) {
            throw new Error(`[VueForge] ${errors.join(' ')}`);
        }

        for (const error of errors) {
            console.warn(`[VueForge] ${error}`);
        }
    }
    if (warnings.length) {
        for (const warning of warnings) {
            console.warn(`[VueForge] ${warning}`);
        }
    }

    const rules: Array<string> = [];

    if (baseVars.length) {
        rules.push(`${selector} { ${baseVars.join(';')} }`);
    }

    if (darkVars.length) {
        rules.push(`${darkSelector} { ${darkVars.join(';')} }`);
    }

    style.textContent = rules.join('\n');
};

let currentThemeOptions: ThemeOptions | null = null;

export const setTheme = (theme: ThemeOptions | ThemePreset) => {
    const normalized = normalizeThemeOptions(theme);

    if (!normalized) {
        return;
    }

    const merged = mergeDeep(normalized.preset, normalized.overrides);
    const { selector, darkSelector } = getSelectors(normalized);

    currentThemeOptions = { ...normalized };

    applyTheme(merged, selector, darkSelector, normalized.strict);
};

export const updateTheme = (partial: Partial<ThemeOptions>) => {
    if (!currentThemeOptions) {
        return;
    }

    const nextOverrides =
        partial.overrides === undefined
            ? currentThemeOptions.overrides
            : mergeDeep(currentThemeOptions.overrides ?? {}, partial.overrides ?? {});

    const nextOptions: ThemeOptions = {
        preset: partial.preset ?? currentThemeOptions.preset,
        overrides: nextOverrides,
        selector: partial.selector ?? currentThemeOptions.selector,
        darkSelector: partial.darkSelector ?? currentThemeOptions.darkSelector,
    };

    setTheme(nextOptions);
};

export const getTheme = () => {
    return currentThemeOptions ? { ...currentThemeOptions } : null;
};
