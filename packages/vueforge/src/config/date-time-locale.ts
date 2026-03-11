import { readonly, reactive } from 'vue';

export type DateTimeLocaleOptions = {
    locale?: string;
    firstDayOfWeek?: number;
};

type DateTimeLocaleState = {
    locale: string;
    firstDayOfWeek: number;
};

const DEFAULT_DATE_TIME_LOCALE: DateTimeLocaleState = {
    locale: 'en-US',
    firstDayOfWeek: 0,
};

const state = reactive<DateTimeLocaleState>({ ...DEFAULT_DATE_TIME_LOCALE });

const normalizeFirstDayOfWeek = (value: number) => {
    if (!Number.isFinite(value)) {
        return DEFAULT_DATE_TIME_LOCALE.firstDayOfWeek;
    }

    const normalized = Math.floor(value);
    const modulo = ((normalized % 7) + 7) % 7;

    return modulo;
};

export const setDateTimeLocale = (options: DateTimeLocaleOptions = {}) => {
    state.locale = options.locale || DEFAULT_DATE_TIME_LOCALE.locale;
    state.firstDayOfWeek = normalizeFirstDayOfWeek(options.firstDayOfWeek ?? DEFAULT_DATE_TIME_LOCALE.firstDayOfWeek);
};

export const updateDateTimeLocale = (partial: DateTimeLocaleOptions = {}) => {
    setDateTimeLocale({
        locale: partial.locale ?? state.locale,
        firstDayOfWeek: partial.firstDayOfWeek ?? state.firstDayOfWeek,
    });
};

export const getDateTimeLocale = () => ({
    locale: state.locale,
    firstDayOfWeek: state.firstDayOfWeek,
});

export const useDateTimeLocale = () => readonly(state);
