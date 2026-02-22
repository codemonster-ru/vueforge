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
            fullPage: true,
            // Full-page captures are sensitive to cross-platform font rasterization differences.
            maxDiffPixelRatio: 0.015,
        });
        await expect(page.getByTestId('vf-visual-header')).toHaveScreenshot('visual-header.png', {
            animations: 'disabled',
            // Header block can differ by 1px height on Linux font rasterization in CI.
            maxDiffPixelRatio: 0.1,
        });
        await expect(page.getByTestId('vf-visual-layout')).toHaveScreenshot('visual-layout.png', {
            animations: 'disabled',
        });
    });
});
