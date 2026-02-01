import { App } from 'vue';

type ThemePreset = Record<string, unknown>;
type ThemeOptions = {
    preset: ThemePreset;
    overrides?: ThemePreset;
    selector?: string;
    darkSelector?: string;
};
type VueForgeOptions = {
    theme?: ThemeOptions | ThemePreset;
};

const systemKeys: Array<string> = ['dark', 'light', 'theme', 'preset', 'colors', 'components', 'colorScheme'];

const camelCaseToWords = (string: string) => {
    const result: string = string.replace(/([A-Z])/g, '-$1');

    return result.charAt(0).toUpperCase() + result.slice(1);
};
const breadToRoot = (bread: Array<string>) =>
    bread
        .filter((x: string) => {
            return !systemKeys.includes(x);
        })
        .map((x: string) => {
            return camelCaseToWords(x);
        })
        .join('-')
        .toLowerCase();

const isHexColor = (value: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
const normalizeHex = (value: string) => {
    if (!isHexColor(value)) {
        return null;
    }
    if (value.length === 4) {
        const r = value[1];
        const g = value[2];
        const b = value[3];
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    return value.toLowerCase();
};
const hexToRgb = (hex: string): [number, number, number] => {
    const normalized = normalizeHex(hex);
    if (!normalized) {
        return [0, 0, 0];
    }
    const numericValue = parseInt(normalized.slice(1), 16);
    const r = (numericValue >> 16) & 0xff;
    const g = (numericValue >> 8) & 0xff;
    const b = numericValue & 0xff;
    return [r, g, b];
};
const hexToRgbString = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
};
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
        case rNorm:
            h = ((gNorm - bNorm) / delta) % 6;
            break;
        case gNorm:
            h = (bNorm - rNorm) / delta + 2;
            break;
        case bNorm:
            h = (rNorm - gNorm) / delta + 4;
            break;
        }

        h *= 60;
        if (h < 0) {
            h += 360;
        }
    }

    return [h, s * 100, l * 100];
};
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let rPrime = 0;
    let gPrime = 0;
    let bPrime = 0;

    if (h >= 0 && h < 60) {
        rPrime = c;
        gPrime = x;
        bPrime = 0;
    } else if (h >= 60 && h < 120) {
        rPrime = x;
        gPrime = c;
        bPrime = 0;
    } else if (h >= 120 && h < 180) {
        rPrime = 0;
        gPrime = c;
        bPrime = x;
    } else if (h >= 180 && h < 240) {
        rPrime = 0;
        gPrime = x;
        bPrime = c;
    } else if (h >= 240 && h < 300) {
        rPrime = x;
        gPrime = 0;
        bPrime = c;
    } else {
        rPrime = c;
        gPrime = 0;
        bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return [r, g, b];
};
const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const shadeColor = (hex: string, tone: number) => {
    const normalized = normalizeHex(hex);
    if (!normalized) {
        return hex;
    }
    const [r, g, b] = hexToRgb(normalized);
    const [h, s, l] = rgbToHsl(r, g, b);
    const step = 7;
    const delta = (tone - 5) * step;
    const nextL = clamp(l + delta, 0, 100);
    const [nr, ng, nb] = hslToRgb(h, s, nextL);
    return rgbToHex(nr, ng, nb);
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

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && !Array.isArray(value);
};
const mergeDeep = (base: ThemePreset, overrides?: ThemePreset): ThemePreset => {
    if (!overrides) {
        return { ...base };
    }

    const result: ThemePreset = { ...base };
    for (const key in overrides) {
        const overrideValue = overrides[key];
        const baseValue = base[key];

        if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
            result[key] = mergeDeep(baseValue, overrideValue);
        } else {
            result[key] = overrideValue;
        }
    }

    return result;
};

const normalizeThemeOptions = (theme?: ThemeOptions | ThemePreset): ThemeOptions | null => {
    if (!theme) {
        return null;
    }
    if (isPlainObject(theme) && 'preset' in theme) {
        const typed = theme as ThemeOptions;
        return {
            preset: typed.preset ?? {},
            overrides: typed.overrides,
            selector: typed.selector,
            darkSelector: typed.darkSelector,
        };
    }
    return { preset: theme as ThemePreset };
};

const buildThemeVariables = (theme: ThemePreset) => {
    const baseVars: Array<string> = [];
    const darkVars: Array<string> = [];
    const walk = (node: ThemePreset, trail: Array<string>) => {
        if (!node || typeof node !== 'object') {
            return;
        }

        for (const key in node) {
            const value = node[key];
            const bread = trail.concat([key]);

            if (value && typeof value === 'object') {
                walk(value as ThemePreset, bread);
                continue;
            }

            if (typeof value !== 'string') {
                continue;
            }

            const isDark = bread.includes('colorScheme') && bread.includes('dark');
            const target = isDark ? darkVars : baseVars;
            const root = breadToRoot(bread);

            target.push(`--vf-${root}: ${value}`);

            if (bread.includes('colors')) {
                const normalized = normalizeHex(value);
                if (!normalized) {
                    continue;
                }

                target.push(`--vf-${root}-rgb: ${hexToRgbString(normalized)}`);

                if (key !== 'white') {
                    for (let i = 1; i < 10; ++i) {
                        const processed = shadeColor(normalized, i);
                        target.push(`--vf-${root}-${i}00: ${processed}`);
                        target.push(`--vf-${root}-${i}00-rgb: ${hexToRgbString(processed)}`);
                    }
                }
            }
        }
    };

    walk(theme, []);

    return { baseVars, darkVars };
};

const applyTheme = (theme: ThemePreset, selector: string, darkSelector: string) => {
    const { baseVars, darkVars } = buildThemeVariables(theme);
    const style = ensureStyleElement('vueforge-theme');

    if (!style) {
        return;
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
const getSelectors = (options: ThemeOptions) => {
    return {
        selector: options.selector ?? ':root',
        darkSelector: options.darkSelector ?? ':root[data-theme=dark]',
    };
};

export const setTheme = (theme: ThemeOptions | ThemePreset) => {
    const normalized = normalizeThemeOptions(theme);
    if (!normalized) {
        return;
    }

    const merged = mergeDeep(normalized.preset, normalized.overrides);
    const { selector, darkSelector } = getSelectors(normalized);

    currentThemeOptions = { ...normalized };
    applyTheme(merged, selector, darkSelector);
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

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: VueForgeOptions = {}) {
        const normalized = normalizeThemeOptions(options.theme);
        if (normalized) {
            setTheme(normalized);
        }
    },
};
