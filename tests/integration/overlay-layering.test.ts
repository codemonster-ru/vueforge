import commandPaletteTokens from '../../packages/vueforge/src/themes/default/components/command-palette';
import drawerTokens from '../../packages/vueforge/src/themes/default/components/drawer';
import dropdownTokens from '../../packages/vueforge/src/themes/default/components/dropdown';
import modalTokens from '../../packages/vueforge/src/themes/default/components/modal';
import notificationCenterTokens from '../../packages/vueforge/src/themes/default/components/notification-center';
import popoverTokens from '../../packages/vueforge/src/themes/default/components/popover';
import toastTokens from '../../packages/vueforge/src/themes/default/components/toast';
import tourTokens from '../../packages/vueforge/src/themes/default/components/tour';

const toNumber = (value: string | number) => Number(value);

describe('Overlay layering policy', () => {
    it('keeps default token z-index ordering consistent', () => {
        const dropdown = toNumber(dropdownTokens.zIndex);
        const popover = toNumber(popoverTokens.zIndex);
        const modal = toNumber(modalTokens.zIndex);
        const drawer = toNumber(drawerTokens.zIndex);
        const commandPalette = toNumber(commandPaletteTokens.zIndex);
        const toast = toNumber(toastTokens.zIndex);
        const tour = toNumber(tourTokens.zIndex);
        const notificationCenter = toNumber(notificationCenterTokens.zIndex);

        expect(dropdown).toBeLessThan(popover);
        expect(popover).toBeLessThan(modal);
        expect(drawer).toBe(modal);
        expect(modal).toBeLessThan(commandPalette);
        expect(commandPalette).toBeLessThan(toast);
        expect(commandPalette).toBeLessThan(tour);
        expect(notificationCenter).toBeGreaterThan(toast);
        expect(notificationCenter).toBeGreaterThan(tour);
    });
});
