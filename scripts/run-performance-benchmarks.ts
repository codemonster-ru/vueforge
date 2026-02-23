import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { request } from 'node:http';
import { chromium } from '@playwright/test';

const budgetsFile =
    process.env.PERF_BUDGETS_FILE ??
    (process.env.CI ? 'scripts/performance-budgets.ci.json' : 'scripts/performance-budgets.json');

const loadJson = relativePath => JSON.parse(readFileSync(resolve(process.cwd(), relativePath), 'utf8'));

const scenarios = loadJson('scripts/benchmark-scenarios.json');
const budgets = loadJson(budgetsFile);

const p95 = values => {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil(sorted.length * 0.95) - 1);
    return sorted[index];
};

const time = async action => {
    const start = performance.now();
    await action();
    return performance.now() - start;
};

const waitForServer = async baseUrl => {
    const ping = () =>
        new Promise((resolvePing, rejectPing) => {
            const req = request(baseUrl, response => {
                resolvePing(response.statusCode && response.statusCode >= 200 && response.statusCode < 500);
            });

            req.on('error', rejectPing);
            req.end();
        });

    for (let i = 0; i < 120; i += 1) {
        try {
            if (await ping()) {
                return;
            }
        } catch {
            // keep polling
        }
        await wait(500);
    }
    throw new Error(`Timed out waiting for dev server at ${baseUrl}`);
};

const createServer = ({ host, port }) => {
    const command =
        process.platform === 'win32'
            ? ['cmd', ['/c', 'npm', 'run', 'dev', '--', '--host', host, '--port', `${port}`]]
            : ['npm', ['run', 'dev', '--', '--host', host, '--port', `${port}`]];
    const child = spawn(command[0], command[1], { cwd: process.cwd(), shell: false, stdio: 'ignore' });

    return child;
};

const runMetric = async (page, component, metric) => {
    const route = '/performance-benchmark';
    const selectors = {
        datatable: '[data-testid="perf-datatable"]',
        tree: '[data-testid="perf-tree"]',
        virtualscroller: '[data-testid="perf-virtual-scroller"]',
        overlays: '[data-testid="perf-overlays"]',
    };
    const componentSelector = selectors[component] ?? selectors.overlays;

    if (metric === 'initialRenderP95Ms') {
        const start = performance.now();
        await page.goto(route);
        await page.locator(componentSelector).first().waitFor({ state: 'visible' });
        return performance.now() - start;
    }

    await page.goto(route);
    await page.locator(componentSelector).first().waitFor({ state: 'visible' });

    if (component === 'datatable') {
        await page.locator('.vf-datatable').first().waitFor({ state: 'visible' });
        if (metric === 'sortInteractionP95Ms') {
            await page.locator('.vf-datatable__sort-button').first().waitFor({ state: 'visible' });
            return time(async () => {
                await page.locator('.vf-datatable__sort-button').first().click();
                await page.waitForTimeout(16);
            });
        }
        if (metric === 'selectionToggleP95Ms') {
            await page.locator('.vf-datatable__selection-control').nth(1).waitFor({ state: 'visible' });
            return time(async () => {
                await page.locator('.vf-datatable__selection-control').nth(1).click();
                await page.waitForTimeout(16);
            });
        }
        if (metric === 'columnResizeP95Ms') {
            const handle = page.locator('.vf-datatable__resize-handle').first();
            await handle.waitFor({ state: 'visible' });
            return time(async () => {
                const box = await handle.boundingBox();
                if (!box) {
                    throw new Error('Resize handle bounding box is unavailable.');
                }
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await page.mouse.down();
                await page.mouse.move(box.x + box.width / 2 + 24, box.y + box.height / 2);
                await page.mouse.up();
                await page.waitForTimeout(16);
            });
        }
    }

    if (component === 'tree') {
        if (metric === 'expandCollapseP95Ms') {
            return time(async () => {
                await page.locator('.vf-tree__toggle').first().click();
                await page.locator('.vf-tree__toggle').first().click();
                await page.waitForTimeout(16);
            });
        }
        if (metric === 'keyboardNavP95Ms') {
            return time(async () => {
                const first = page.locator('[role="treeitem"]').first();
                await first.focus();
                await first.press('ArrowDown');
            });
        }
        if (metric === 'selectionToggleP95Ms') {
            return time(async () => {
                await page.locator('[role="treeitem"]').nth(1).click();
                await page.waitForTimeout(16);
            });
        }
    }

    if (component === 'virtualscroller') {
        if (metric === 'scrollUpdateP95Ms') {
            return time(async () => {
                await page.locator('[data-testid="perf-virtual-root"]').evaluate(element => {
                    element.scrollTop = 1200;
                    element.dispatchEvent(new Event('scroll'));
                });
                await page.waitForTimeout(16);
            });
        }
        if (metric === 'rangeChangeEmitP95Ms') {
            return time(async () => {
                await page.locator('[data-testid="perf-virtual-root"]').evaluate(element => {
                    element.scrollTop = 1800;
                    element.dispatchEvent(new Event('scroll'));
                });
                await page.waitForTimeout(32);
            });
        }
        if (metric === 'reachEndEmitP95Ms') {
            return time(async () => {
                await page.locator('[data-testid="perf-virtual-root"]').evaluate(element => {
                    element.scrollTop = 100000;
                    element.dispatchEvent(new Event('scroll'));
                });
                await page.waitForTimeout(32);
            });
        }
    }

    if (component === 'overlays') {
        if (metric === 'openP95Ms') {
            return time(async () => {
                await page.getByTestId('perf-open-notification').click();
                await page.locator('.vf-notification-center__panel').waitFor({ state: 'visible' });
            });
        }
        if (metric === 'closeP95Ms') {
            await page.getByTestId('perf-open-notification').click();
            await page.locator('.vf-notification-center__panel').waitFor({ state: 'visible' });
            return time(async () => {
                await page.locator('.vf-notification-center__close').click();
                await page.locator('.vf-notification-center__panel').waitFor({ state: 'hidden' });
            });
        }
        if (metric === 'positionUpdateP95Ms') {
            await page.getByTestId('perf-open-command').click();
            await page.locator('.vf-command-palette__panel').waitFor({ state: 'visible' });
            return time(async () => {
                await page.evaluate(() => {
                    window.dispatchEvent(new Event('resize'));
                });
                await page.waitForTimeout(16);
            });
        }
        if (metric === 'focusTransferP95Ms') {
            return time(async () => {
                await page.getByTestId('perf-open-notification').click();
                await page.waitForTimeout(32);
            });
        }
    }

    throw new Error(`Unsupported metric "${metric}" for component "${component}"`);
};

const run = async () => {
    const { host, port } = scenarios.server;
    const baseUrl = `http://${host}:${port}`;
    const server = createServer({ host, port });

    try {
        await waitForServer(baseUrl);

        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ baseURL: baseUrl, viewport: { width: 1280, height: 720 } });
        const page = await context.newPage();
        page.setDefaultTimeout(120000);

        const report = {
            generatedAt: new Date().toISOString(),
            iterations: scenarios.iterations,
            environment: budgets.environment,
            components: {},
        };

        for (const [componentName, config] of Object.entries(scenarios.components)) {
            const componentKey = config.routeComponent;
            const metrics = {};

            for (const metric of config.metrics) {
                const values = [];

                // Warm up route/component metric path once to avoid cold-start outliers in p95.
                await runMetric(page, componentKey, metric);

                for (let iteration = 0; iteration < scenarios.iterations; iteration += 1) {
                    const value = await runMetric(page, componentKey, metric);
                    values.push(Number(value.toFixed(3)));
                }

                metrics[metric] = {
                    p95: Number(p95(values).toFixed(3)),
                    samples: values,
                };
            }

            report.components[componentName] = metrics;
        }

        await browser.close();

        const outputDir = resolve(process.cwd(), 'benchmarks');
        mkdirSync(outputDir, { recursive: true });
        writeFileSync(resolve(outputDir, 'latest.json'), `${JSON.stringify(report, null, 4)}\n`, 'utf8');
        console.log('[benchmark] Report written to benchmarks/latest.json');
    } finally {
        server.kill('SIGTERM');
    }
};

run().catch(error => {
    console.error(`[benchmark] Failed: ${String(error)}`);
    process.exit(1);
});
