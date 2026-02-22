import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const readJson = relativePath => JSON.parse(readFileSync(resolve(process.cwd(), relativePath), 'utf8'));

const budgets = readJson('scripts/performance-budgets.json');
const report = readJson('benchmarks/latest.json');

const errors = [];

if (!report || typeof report !== 'object') {
    errors.push('Benchmark report is missing or invalid.');
}

for (const [componentName, componentConfig] of Object.entries(budgets.components ?? {})) {
    const expectedMetrics = componentConfig?.budgets ?? {};
    const reportMetrics = report?.components?.[componentName];

    if (!reportMetrics || typeof reportMetrics !== 'object') {
        errors.push(`Missing component section in report: ${componentName}`);
        continue;
    }

    for (const [metricName, budgetValue] of Object.entries(expectedMetrics)) {
        const measured = reportMetrics?.[metricName]?.p95;

        if (typeof measured !== 'number' || !Number.isFinite(measured)) {
            errors.push(`Missing or invalid p95 for ${componentName}.${metricName}`);
            continue;
        }

        if (measured > budgetValue) {
            errors.push(
                `Budget exceeded for ${componentName}.${metricName}: p95=${measured.toFixed(3)}ms > budget=${Number(
                    budgetValue,
                ).toFixed(3)}ms`,
            );
        }
    }
}

if (errors.length) {
    console.error('[verify:performance-report] FAILED');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('[verify:performance-report] OK.');
