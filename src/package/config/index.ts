import { App } from 'vue';

const adjust = (color: string, amount: number): string => {
    return (
        '#' +
        color.replace(/^#/, '').replace(/../g, color => {
            return ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2);
        })
    );
};
const lighter = (color: string, tone: number) => adjust(color, 16 * tone);
const darker = (color: string, tone: number) => adjust(color, -16 * tone);
const hexToRgb = (color: string): string => {
    const numericValue: number = parseInt(color.replace('#', ''), 16);
    const r: number = (numericValue >> 16) & 0xff;
    const g: number = (numericValue >> 8) & 0xff;
    const b: number = numericValue & 0xff;
    return `${r}, ${g}, ${b}`;
};
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
const systemKeys: Array<string> = ['dark', 'light', 'theme', 'preset', 'colors', 'components', 'colorScheme'];
const parseConfig = (options: object, breadcrumbs: Array<string> = []) => {
    const toRootStyles: Array<string> = [];
    const toDarkRootStyles: Array<string> = [];
    const walk = (node: object, trail: Array<string>) => {
        if (!node || typeof node !== 'object') {
            return;
        }

        for (const key in node) {
            const option = (node as Record<string, unknown>)[key];
            const bread = trail.concat([key]);

            if (option && typeof option === 'object') {
                walk(option as object, bread);
                continue;
            }

            if (typeof option !== 'string') {
                continue;
            }

            if (bread.some(x => x === 'theme') && bread.some(x => x === 'preset')) {
                if (bread.some(x => x === 'colorScheme') && bread.some(x => x === 'dark')) {
                    toDarkRootStyles.push(`--vf-${breadToRoot(bread)}: ${option}`);
                } else {
                    toRootStyles.push(`--vf-${breadToRoot(bread)}: ${option}`);

                    if (bread.some(x => x === 'colors')) {
                        toRootStyles.push(`--vf-${breadToRoot(bread)}-rgb: ${hexToRgb(option)}`);

                        if (key !== 'white') {
                            for (let i = 1; i < 10; ++i) {
                                let processedColor: string;

                                if (i < 5) {
                                    processedColor = lighter(option, 5 - i);
                                } else {
                                    processedColor = darker(option, i - 5);
                                }

                                toRootStyles.push(`--vf-${breadToRoot(bread)}-${i}00: ${processedColor}`);
                                toRootStyles.push(`--vf-${breadToRoot(bread)}-${i}00-rgb: ${hexToRgb(processedColor)}`);
                            }
                        }
                    }
                }
            }
        }
    };

    walk(options, breadcrumbs);

    return { toRootStyles, toDarkRootStyles };
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

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: object) {
        const { toRootStyles, toDarkRootStyles } = parseConfig(options);
        const style = ensureStyleElement('vueforge-theme');

        if (!style) {
            return;
        }

        const rules: Array<string> = [];

        if (toRootStyles.length) {
            rules.push(`:root { ${toRootStyles.join(';')} }`);
        }
        if (toDarkRootStyles.length) {
            rules.push(`:root[data-theme=dark] { ${toDarkRootStyles.join(';')} }`);
        }

        style.textContent = rules.join('\n');
    },
};
