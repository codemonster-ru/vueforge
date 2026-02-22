import { getLocaleText, setLocaleText, updateLocaleText } from '../locale-text';

describe('locale text runtime config', () => {
    afterEach(() => {
        setLocaleText();
    });

    it('sets and returns locale text config', () => {
        setLocaleText({
            common: {
                loadingText: 'Chargement...',
            },
            dataTable: {
                emptyText: 'Aucune donnee',
            },
            commandPalette: {
                placeholder: 'Tapez une commande...',
            },
        });

        const localeText = getLocaleText();

        expect(localeText.common.loadingText).toBe('Chargement...');
        expect(localeText.dataTable.emptyText).toBe('Aucune donnee');
        expect(localeText.common.emptyText).toBe('No results');
        expect(localeText.commandPalette.placeholder).toBe('Tapez une commande...');
    });

    it('updates partial values without losing existing keys', () => {
        setLocaleText({
            notificationCenter: {
                emptyText: 'Keine Benachrichtigungen',
            },
        });

        updateLocaleText({
            common: {
                emptyText: 'Keine Ergebnisse',
            },
        });

        const localeText = getLocaleText();

        expect(localeText.common.emptyText).toBe('Keine Ergebnisse');
        expect(localeText.notificationCenter.emptyText).toBe('Keine Benachrichtigungen');
        expect(localeText.dataTable.loadingText).toBe('Loading...');
    });
});
