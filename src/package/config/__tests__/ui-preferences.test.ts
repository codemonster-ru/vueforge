import {
    applyUiPreferences,
    getDensityPreset,
    getReducedMotion,
    getUiPreferences,
    setDensityPreset,
    setReducedMotion,
} from '../ui-preferences';

describe('ui preferences runtime config', () => {
    afterEach(() => {
        setDensityPreset('normal');
        setReducedMotion(false);
        document.documentElement.removeAttribute('data-vf-density');
        document.documentElement.removeAttribute('data-vf-reduced-motion');
    });

    it('applies density preset to document root', () => {
        setDensityPreset('compact');

        expect(getDensityPreset()).toBe('compact');
        expect(document.documentElement.getAttribute('data-vf-density')).toBe('compact');
    });

    it('applies reduced-motion preference to document root', () => {
        setReducedMotion(true);

        expect(getReducedMotion()).toBe(true);
        expect(document.documentElement.getAttribute('data-vf-reduced-motion')).toBe('true');
    });

    it('applies partial preferences and exposes combined state', () => {
        applyUiPreferences({ density: 'comfortable' });
        applyUiPreferences({ reducedMotion: true });

        expect(getUiPreferences()).toEqual({
            density: 'comfortable',
            reducedMotion: true,
        });
    });
});
