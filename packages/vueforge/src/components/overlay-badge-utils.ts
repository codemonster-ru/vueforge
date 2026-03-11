export type OverlayBadgeSeverity = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
export type OverlayBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type OverlayBadgeValue = string | number | null | undefined;

export type OverlayBadgeOptions = {
    value?: OverlayBadgeValue;
    hidden?: boolean;
    dot?: boolean;
    max?: number;
    showZero?: boolean;
    severity?: OverlayBadgeSeverity;
    position?: OverlayBadgePosition;
    ariaLabel?: string;
};

export type OverlayBadgeBinding = OverlayBadgeValue | OverlayBadgeOptions;

export type OverlayBadgeResolved = {
    text: string;
    visible: boolean;
    dot: boolean;
    severity: OverlayBadgeSeverity;
    position: OverlayBadgePosition;
    ariaLabel: string;
};

const DEFAULT_SEVERITY: OverlayBadgeSeverity = 'danger';
const DEFAULT_POSITION: OverlayBadgePosition = 'top-right';
const DEFAULT_MAX = 99;

const normalizeNumericMax = (value: number | undefined) => {
    if (!Number.isFinite(value)) {
        return DEFAULT_MAX;
    }

    return Math.max(0, Math.floor(value as number));
};

const toOptions = (binding: OverlayBadgeBinding): OverlayBadgeOptions => {
    if (binding && typeof binding === 'object' && !Array.isArray(binding)) {
        return binding as OverlayBadgeOptions;
    }

    return {
        value: binding as OverlayBadgeValue,
    };
};

const resolveText = (value: OverlayBadgeValue, max: number, showZero: boolean, dot: boolean) => {
    if (dot) {
        return '';
    }

    if (value === null || value === undefined || value === '') {
        return '';
    }

    if (typeof value === 'number') {
        if (!showZero && value === 0) {
            return '';
        }

        if (value > max) {
            return `${max}+`;
        }
    }

    return String(value);
};

export const resolveOverlayBadge = (binding: OverlayBadgeBinding): OverlayBadgeResolved => {
    const options = toOptions(binding);
    const dot = !!options.dot;
    const max = normalizeNumericMax(options.max);
    const showZero = !!options.showZero;
    const text = resolveText(options.value, max, showZero, dot);
    const visible = !options.hidden && (dot || text.length > 0);

    return {
        text,
        visible,
        dot,
        severity: options.severity ?? DEFAULT_SEVERITY,
        position: options.position ?? DEFAULT_POSITION,
        ariaLabel: options.ariaLabel ?? '',
    };
};
