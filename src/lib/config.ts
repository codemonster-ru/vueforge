import { App } from 'vue';

const adjust = (color: string, amount: number) => '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2));
const lighter = (color: string, tone: number) => adjust(color, 16 * tone);
const darker = (color: string, tone: number) => adjust(color, -16 * tone);
const hexToRgb = (color: string) => {
    const numericValue: number = parseInt(color.replace('#', ''), 16);
    const r: number = numericValue >> 16 & 0xFF;
    const g: number = numericValue >> 8 & 0xFF;
    const b: number = numericValue & 0xFF;
    return `${r}, ${g}, ${b}`;
};
const camelCaseToWords = (string: string) => {
    const result = string.replace(/([A-Z])/g, '-$1');

    return result.charAt(0).toUpperCase() + result.slice(1);
};
const breadToRoot = (bread: Array<string>) => bread.filter(x => !systemKeys.includes(x)).map(x => camelCaseToWords(x)).join('-').toLowerCase();
const systemKeys: Array<string> = [
    'dark',
    'light',
    'theme',
    'preset',
    'colors',
    'components',
    'colorScheme',
];
const toRootStyles: Array<string> = [];
const toDarkRootStyles: Array<string> = [];
const parseConfig = (options: object, breadcrumbs: Array<string> = []) => {
    for (const key in options) {
        const option: string = options[key as keyof object];
        const bread = breadcrumbs.concat([key]);

        if (typeof option === 'object') {
            parseConfig(option, bread);
        } else {
            if (bread.some(x => x === 'theme') && bread.some(x => x === 'preset')) {
                if (bread.some(x => x === 'colorScheme') && bread.some(x => x === 'dark')) {
                    toDarkRootStyles.push(`--cm-${breadToRoot(bread)}: ${option}`);
                } else {
                    toRootStyles.push(`--cm-${breadToRoot(bread)}: ${option}`);

                    if (bread.some(x => x === 'colors')) {
                        toRootStyles.push(`--cm-${breadToRoot(bread)}-rgb: ${hexToRgb(option)}`);

                        if (key !== 'white') {
                            for (let i = 1; i < 10; ++i) {
                                let processedColor: string;

                                if (i < 5) {
                                    processedColor = lighter(option, 5 - i);
                                } else {
                                    processedColor = darker(option, i - 5);
                                }

                                toRootStyles.push(`--cm-${breadToRoot(bread)}-${i}00: ${processedColor}`);
                                toRootStyles.push(`--cm-${breadToRoot(bread)}-${i}00-rgb: ${hexToRgb(processedColor)}`);
                            }
                        }
                    }
                }
            }
        }
    }
};

// noinspection JSUnusedGlobalSymbols
export default {
    install(_app: App, options: object) {
        parseConfig(options);

        if (toRootStyles.length) document.styleSheets[0].insertRule(`:root { ${toRootStyles.join(';')} }`);
        if (toDarkRootStyles.length) document.styleSheets[0].insertRule(`:root[data-theme=dark] { ${toDarkRootStyles.join(';')} }`);
    },
};