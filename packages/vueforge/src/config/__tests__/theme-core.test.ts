import { buildThemeVariables, mergeDeep, normalizeThemeOptions } from '../theme-core';

describe('theme-core', () => {
    it('builds variables and shades for hex colors', () => {
        const { baseVars, warnings, errors } = buildThemeVariables({
            colors: {
                blue: '#336699',
            },
        });

        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(baseVars).toContain('--vf-blue: #336699');
        expect(baseVars.some(x => x.startsWith('--vf-blue-100:'))).toBe(true);
        expect(baseVars).toContain('--vf-blue-rgb: 51, 102, 153');
    });

    it('allows non-hex colors but skips shade generation', () => {
        const { baseVars, warnings, errors } = buildThemeVariables({
            colors: {
                brand: 'var(--brand)',
            },
        });

        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(1);
        expect(baseVars).toContain('--vf-brand: var(--brand)');
        expect(baseVars.some(x => x.startsWith('--vf-brand-100:'))).toBe(false);
        expect(baseVars.some(x => x.startsWith('--vf-brand-rgb:'))).toBe(false);
    });

    it('reports errors for non-string token values', () => {
        const { warnings, errors } = buildThemeVariables({
            controls: {
                height: 32 as unknown as string,
            },
        });

        expect(warnings).toHaveLength(0);
        expect(errors).toHaveLength(1);
    });

    it('normalizes options and preserves strict flag', () => {
        const result = normalizeThemeOptions({
            preset: { colors: { blue: '#0000ff' } },
            strict: true,
        });

        expect(result?.strict).toBe(true);
    });

    it('merges overrides deeply', () => {
        const merged = mergeDeep(
            { controls: { height: '2rem', paddingX: '0.5rem' } },
            { controls: { height: '2.25rem' } },
        );

        expect(merged).toEqual({ controls: { height: '2.25rem', paddingX: '0.5rem' } });
    });

    it('matches snapshot for a small theme', () => {
        const { baseVars, darkVars } = buildThemeVariables({
            colors: { blue: '#123456' },
            colorScheme: { dark: { bgColor: '#111111' } },
            radii: { md: '6px' },
        });

        const baseVarsNoShades = baseVars.filter(item => !/--vf-.*-\d00/.test(item));

        expect(baseVarsNoShades).toMatchInlineSnapshot(`
          [
            "--vf-blue: #123456",
            "--vf-blue-rgb: 18, 52, 86",
            "--vf-radii-md: 6px",
          ]
        `);
        expect(darkVars).toMatchInlineSnapshot(`
          [
            "--vf-bg-color: #111111",
          ]
        `);
    });

    it('builds expected vars for default theme', () => {
        const { baseVars, darkVars } = buildThemeVariables({
            colors: { blue: '#007bff' },
            typography: { fontSize: '1rem' },
            controls: { height: '2rem' },
            components: { button: { padding: '0.25rem 0.6rem' } },
            colorScheme: {
                light: { bgColor: '#ffffff' },
                dark: { bgColor: '#1a1a1a' },
            },
        });

        expect(baseVars).toContain('--vf-blue: #007bff');
        expect(baseVars).toContain('--vf-typography-font-size: 1rem');
        expect(baseVars).toContain('--vf-controls-height: 2rem');
        expect(baseVars).toContain('--vf-button-padding: 0.25rem 0.6rem');
        expect(baseVars).toContain('--vf-bg-color: #ffffff');
        expect(darkVars).toContain('--vf-bg-color: #1a1a1a');
    });
});
