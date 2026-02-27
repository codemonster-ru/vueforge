import { expect, test } from '@playwright/test';

test.describe('visual regression baseline', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/visual-regression');
        await expect(page.getByTestId('vf-visual-root')).toBeVisible();
        await page.addStyleTag({
            content: `
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                    caret-color: transparent !important;
                }
            `,
        });
    });

    test('captures visual baseline', async ({ page }) => {
        await expect(page).toHaveScreenshot('visual-page.png', {
            animations: 'disabled',
            // Full-page captures are sensitive to cross-platform font rasterization differences.
            maxDiffPixelRatio: 0.04,
        });
    });

    test('captures layout preset visual baseline on desktop', async ({ page }) => {
        const layout = page.getByTestId('vf-visual-layout-presets');
        await expect(layout).toBeVisible();
        await expect(layout).toHaveScreenshot('visual-layout-presets-desktop.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.015,
        });
    });

    test('captures chart variants visual baseline', async ({ page }) => {
        const charts = page.getByTestId('vf-visual-charts');
        await expect(charts).toBeVisible();
        await charts.evaluate(element => {
            // Keep snapshot bounds stable across OS/browser font metric rounding.
            element.setAttribute(
                'style',
                `${element.getAttribute('style') ?? ''};position:fixed;left:0;top:0;z-index:1;box-sizing:border-box;width:1280px;height:1373px;min-height:1373px;max-height:1373px;overflow:hidden;`,
            );
        });
        await expect(charts).toHaveScreenshot('visual-chart-variants-desktop.png', {
            animations: 'disabled',
            scale: 'css',
            maxDiffPixelRatio: 0.02,
        });
    });

    test('captures layout preset visual baseline on mobile breakpoint', async ({ page }) => {
        await page.setViewportSize({ width: 640, height: 960 });
        await page.goto('/visual-regression');
        await expect(page.getByTestId('vf-visual-root')).toBeVisible();
        await page.addStyleTag({
            content: `
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                    caret-color: transparent !important;
                }
            `,
        });
        const layout = page.getByTestId('vf-visual-layout-presets');
        await expect(layout).toBeVisible();
        await expect(layout).toHaveScreenshot('visual-layout-presets-mobile.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.02,
        });
    });
});
