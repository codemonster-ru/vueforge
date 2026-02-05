export type ThemeColorScheme = {
    light?: Record<string, string>;
    dark?: Record<string, string>;
};
export type ThemeSizes = {
    sm?: Record<string, string>;
    lg?: Record<string, string>;
};
export type ButtonTokens = {
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    roundedBorderRadius?: string;
    iconGap?: string;
    small?: {
        fontSize?: string;
        padding?: string;
    };
    large?: {
        fontSize?: string;
        padding?: string;
    };
    colorScheme?: Record<string, Record<string, Record<string, string>>>;
};
export type CardTokens = {
    padding?: string;
    borderColor?: string;
    borderRadius?: string;
};
export type CheckboxTokens = {
    size?: string;
    gap?: string;
    borderRadius?: string;
    checkBorderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    checkedBorderColor?: string;
    checkColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type RadioTokens = {
    size?: string;
    dotSize?: string;
    gap?: string;
    groupGap?: string;
    borderRadius?: string;
    dotBorderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    checkedBorderColor?: string;
    dotColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type InputTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type FormFieldTokens = {
    gap?: string;
    textColor?: string;
    labelFontSize?: string;
    labelColor?: string;
    requiredColor?: string;
    hintFontSize?: string;
    hintColor?: string;
    errorColor?: string;
    disabledOpacity?: string;
    small?: {
        gap?: string;
        labelFontSize?: string;
        hintFontSize?: string;
    };
    large?: {
        gap?: string;
        labelFontSize?: string;
        hintFontSize?: string;
    };
};
export type TextareaTokens = {
    gap?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    minHeight?: string;
    resize?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type LinkTokens = {
    hoverColor?: string;
    activeColor?: string;
};
export type MenuTokens = {
    iconGap?: string;
    submenuOffset?: string;
    separatorThickness?: string;
    separatorHeight?: string;
    separatorColor?: string;
    link?: {
        hoverColor?: string;
        activeColor?: string;
    };
    parent?: {
        hoverColor?: string;
        activeColor?: string;
    };
    item?: {
        marginTop?: string;
        marginRight?: string;
        marginBottom?: string;
        marginLeft?: string;
    };
};
export type ModalTokens = {
    width?: string;
    maxWidth?: string;
    maxHeight?: string;
    widthSm?: string;
    maxWidthSm?: string;
    widthLg?: string;
    maxWidthLg?: string;
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    overlayBackgroundColor?: string;
    shadow?: string;
    zIndex?: string;
    headerGap?: string;
    bodyGap?: string;
    footerGap?: string;
    titleFontSize?: string;
    titleLineHeight?: string;
    titleFontWeight?: string;
    closeSize?: string;
    closeRadius?: string;
    closeOffset?: string;
    closeColor?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
};
export type PopoverTokens = {
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    shadow?: string;
};
export type SelectTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type AutocompleteTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type MultiSelectTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelMaxHeight?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    optionPadding?: string;
    optionBorderRadius?: string;
    optionHoverBackgroundColor?: string;
    optionActiveBackgroundColor?: string;
    optionActiveTextColor?: string;
    optionHighlightedBackgroundColor?: string;
    emptyPadding?: string;
    emptyColor?: string;
    loadingPadding?: string;
    loadingColor?: string;
    searchPadding?: string;
    searchBorderColor?: string;
    searchBorderRadius?: string;
    clearSize?: string;
    clearRadius?: string;
    clearHoverBackgroundColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type DatePickerTokens = {
    minWidth?: string;
    fontSize?: string;
    controlGap?: string;
    chevronSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    hoverBorderColor?: string;
    disabledOpacity?: string;
    panelWidth?: string;
    panelBackgroundColor?: string;
    panelBorderColor?: string;
    panelPadding?: string;
    panelRadiusOffset?: string;
    panelShadow?: string;
    focusRingShadow?: string;
    headerGap?: string;
    headerPadding?: string;
    monthLabelFontSize?: string;
    monthLabelFontWeight?: string;
    navButtonSize?: string;
    navButtonRadius?: string;
    navButtonFontSize?: string;
    weekdayColor?: string;
    weekdayFontSize?: string;
    weekdaysMarginBottom?: string;
    daysGap?: string;
    daySize?: string;
    dayFontSize?: string;
    dayBorderRadius?: string;
    dayHoverBackgroundColor?: string;
    daySelectedBackgroundColor?: string;
    daySelectedTextColor?: string;
    dayMutedColor?: string;
    dayTodayBorderColor?: string;
    small?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
        daySize?: string;
    };
};
export type PaginationTokens = {
    gap?: string;
    itemMinWidth?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    hoverBackgroundColor?: string;
    activeBorderColor?: string;
    activeBackgroundColor?: string;
    activeTextColor?: string;
    focusBorderColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    ellipsisPadding?: string;
    small?: {
        padding?: string;
        fontSize?: string;
    };
    large?: {
        padding?: string;
        fontSize?: string;
    };
};
export type SwitchTokens = {
    width?: string;
    height?: string;
    thumbSize?: string;
    gap?: string;
    thumbOffset?: string;
    thumbTranslateOffset?: string;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    thumbColor?: string;
    textColor?: string;
    disabledOpacity?: string;
};
export type TabsTokens = {
    gap?: string;
    listGap?: string;
    listBorderWidth?: string;
    listBorderColor?: string;
    listVerticalPadding?: string;
    tabPadding?: string;
    tabFontSize?: string;
    tabBorderRadius?: string;
    tabTextColor?: string;
    tabBackgroundColor?: string;
    tabHoverBackgroundColor?: string;
    tabActiveTextColor?: string;
    tabActiveBackgroundColor?: string;
    tabActiveBorderColor?: string;
    tabActiveBorderWidth?: string;
    panelPadding?: string;
    panelBorderRadius?: string;
    panelBackgroundColor?: string;
    panelTextColor?: string;
    disabledOpacity?: string;
};
export type AccordionTokens = {
    gap?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    headerGap?: string;
    headerPadding?: string;
    headerFontSize?: string;
    headerFontWeight?: string;
    headerTextColor?: string;
    headerBackgroundColor?: string;
    headerHoverBackgroundColor?: string;
    headerActiveBackgroundColor?: string;
    contentPadding?: string;
    contentTextColor?: string;
    contentBackgroundColor?: string;
    iconSize?: string;
    iconColor?: string;
    dividerColor?: string;
    focusRingShadow?: string;
    disabledOpacity?: string;
    small?: {
        headerPadding?: string;
        headerFontSize?: string;
        contentPadding?: string;
    };
    large?: {
        headerPadding?: string;
        headerFontSize?: string;
        contentPadding?: string;
    };
};
export type TooltipTokens = {
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    lineHeight?: string;
    shadow?: string;
    zIndex?: string;
    maxWidth?: string;
    arrowSize?: string;
};
export type SkeletonTokens = {
    width?: string;
    height?: string;
    lineHeight?: string;
    borderRadius?: string;
    backgroundColor?: string;
    shimmerColor?: string;
    animationDuration?: string;
};
export type ProgressTokens = {
    width?: string;
    height?: string;
    borderRadius?: string;
    backgroundColor?: string;
    barColor?: string;
    labelColor?: string;
    labelFontSize?: string;
    gap?: string;
    circularSize?: string;
    circularThickness?: string;
    animationDuration?: string;
    info?: {
        barColor?: string;
    };
    success?: {
        barColor?: string;
    };
    warn?: {
        barColor?: string;
    };
    danger?: {
        barColor?: string;
    };
    small?: {
        height?: string;
        labelFontSize?: string;
        circularSize?: string;
        circularThickness?: string;
    };
    large?: {
        height?: string;
        labelFontSize?: string;
        circularSize?: string;
        circularThickness?: string;
    };
};
export type DataTableTokens = {
    borderColor?: string;
    borderRadius?: string;
    backgroundColor?: string;
    fontSize?: string;
    textColor?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
    headerFontSize?: string;
    headerFontWeight?: string;
    headerBorderColor?: string;
    headerGap?: string;
    rowBackgroundColor?: string;
    rowTextColor?: string;
    rowBorderColor?: string;
    cellPadding?: string;
    stripedBackgroundColor?: string;
    hoverBackgroundColor?: string;
    sortIconColor?: string;
    sortIconActiveColor?: string;
    sortIconSize?: string;
    statePadding?: string;
    stateTextColor?: string;
    small?: {
        fontSize?: string;
        cellPadding?: string;
    };
    large?: {
        fontSize?: string;
        cellPadding?: string;
    };
};
export type ToastTokens = {
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    shadow?: string;
    minWidth?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    closeSize?: string;
    containerGap?: string;
    containerPadding?: string;
    containerMaxWidth?: string;
    zIndex?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
};
export type AlertTokens = {
    gap?: string;
    padding?: string;
    borderRadius?: string;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    fontSize?: string;
    lineHeight?: string;
    bodyGap?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    actionsGap?: string;
    closeSize?: string;
    closeRadius?: string;
    closeFontSize?: string;
    closeHoverBackgroundColor?: string;
    info?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    success?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    warn?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
    danger?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
};
export type BadgeSeverityTokens = {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
};
export type BadgeTokens = {
    fontSize?: string;
    lineHeight?: string;
    paddingX?: string;
    paddingY?: string;
    borderRadius?: string;
    gap?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    softBackgroundColor?: string;
    softTextColor?: string;
    softBorderColor?: string;
    outlineTextColor?: string;
    outlineBorderColor?: string;
    info?: BadgeSeverityTokens;
    success?: BadgeSeverityTokens;
    warn?: BadgeSeverityTokens;
    danger?: BadgeSeverityTokens;
    small?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
    large?: {
        fontSize?: string;
        paddingX?: string;
        paddingY?: string;
    };
};
export type AvatarTokens = {
    size?: string;
    fontSize?: string;
    fontWeight?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    statusSize?: string;
    statusBorderWidth?: string;
    statusBorderColor?: string;
    statusOnlineColor?: string;
    statusOfflineColor?: string;
    statusBusyColor?: string;
    statusAwayColor?: string;
    small?: {
        size?: string;
        fontSize?: string;
        statusSize?: string;
    };
    large?: {
        size?: string;
        fontSize?: string;
        statusSize?: string;
    };
};
export type ThemeComponentTokens = {
    button?: ButtonTokens;
    card?: CardTokens;
    checkbox?: CheckboxTokens;
    radio?: RadioTokens;
    tabs?: TabsTokens;
    accordion?: AccordionTokens;
    input?: InputTokens;
    formField?: FormFieldTokens;
    textarea?: TextareaTokens;
    link?: LinkTokens;
    menu?: MenuTokens;
    modal?: ModalTokens;
    popover?: PopoverTokens;
    select?: SelectTokens;
    autocomplete?: AutocompleteTokens;
    multiselect?: MultiSelectTokens;
    datepicker?: DatePickerTokens;
    pagination?: PaginationTokens;
    switch?: SwitchTokens;
    tooltip?: TooltipTokens;
    skeleton?: SkeletonTokens;
    progress?: ProgressTokens;
    datatable?: DataTableTokens;
    toast?: ToastTokens;
    alert?: AlertTokens;
    badge?: BadgeTokens;
    avatar?: AvatarTokens;
    [key: string]: unknown;
};
export type ThemeTokens = {
    colors?: Record<string, string>;
    colorScheme?: ThemeColorScheme;
    radii?: Record<string, string>;
    typography?: Record<string, string>;
    states?: Record<string, string>;
    controls?: Record<string, string>;
    sizes?: ThemeSizes;
    components?: ThemeComponentTokens;
    [key: string]: unknown;
};
export type ThemePreset = ThemeTokens;
export type ThemeOptions = {
    preset: ThemePreset;
    overrides?: ThemePreset;
    selector?: string;
    darkSelector?: string;
    strict?: boolean;
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
const breadToPath = (bread: Array<string>) => bread.join('.');
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

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && !Array.isArray(value);
};

export const mergeDeep = (base: ThemePreset, overrides?: ThemePreset): ThemePreset => {
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

export const normalizeThemeOptions = (theme?: ThemeOptions | ThemePreset): ThemeOptions | null => {
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
            strict: typed.strict,
        };
    }

    return { preset: theme as ThemePreset };
};

export const buildThemeVariables = (theme: ThemePreset) => {
    const baseVars: Array<string> = [];
    const darkVars: Array<string> = [];
    const warnings: Array<string> = [];
    const errors: Array<string> = [];
    const warn = (message: string) => warnings.push(message);
    const error = (message: string) => errors.push(message);
    const walk = (node: ThemePreset, trail: Array<string>) => {
        if (!node || typeof node !== 'object') {
            return;
        }

        for (const key in node) {
            const value = node[key];
            const bread = trail.concat([key]);

            if (isPlainObject(value)) {
                walk(value as ThemePreset, bread);

                continue;
            }

            if (value && typeof value === 'object') {
                error(`Theme value "${breadToPath(bread)}" is not a plain object or string and will be ignored.`);

                continue;
            }

            if (typeof value !== 'string') {
                error(`Theme value "${breadToPath(bread)}" is not a string and will be ignored.`);

                continue;
            }

            const isDark = bread.includes('colorScheme') && bread.includes('dark');
            const target = isDark ? darkVars : baseVars;
            const root = breadToRoot(bread);

            target.push(`--vf-${root}: ${value}`);

            if (bread.includes('colors')) {
                const normalized = normalizeHex(value);

                if (!normalized) {
                    warn(
                        `Theme color "${breadToPath(bread)}" is not hex. Shade variables will not be generated for it.`,
                    );

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

    return { baseVars, darkVars, warnings, errors };
};
