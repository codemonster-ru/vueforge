import { getDateTimeLocale, setDateTimeLocale, updateDateTimeLocale } from '../date-time-locale';

describe('date-time locale runtime config', () => {
    afterEach(() => {
        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: 0 });
    });

    it('sets and returns locale config', () => {
        setDateTimeLocale({ locale: 'fr-FR', firstDayOfWeek: 1 });

        expect(getDateTimeLocale()).toEqual({
            locale: 'fr-FR',
            firstDayOfWeek: 1,
        });
    });

    it('normalizes firstDayOfWeek to 0-6', () => {
        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: 8 });
        expect(getDateTimeLocale().firstDayOfWeek).toBe(1);

        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: -1 });
        expect(getDateTimeLocale().firstDayOfWeek).toBe(6);
    });

    it('updates partial values without losing existing config', () => {
        setDateTimeLocale({ locale: 'de-DE', firstDayOfWeek: 1 });
        updateDateTimeLocale({ locale: 'it-IT' });

        expect(getDateTimeLocale()).toEqual({
            locale: 'it-IT',
            firstDayOfWeek: 1,
        });
    });
});
