import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const REQUIRED_COMPONENTS = ['DataTable', 'Tree', 'VirtualScroller', 'Overlays'];
const REQUIRED_ENV_KEYS = ['browser', 'cpuThrottling', 'network', 'device'];

const fail = message => {
    console.error(`[verify:performance-budgets] ${message}`);
    process.exit(1);
};

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);
const isPositiveNumber = value => typeof value === 'number' && Number.isFinite(value) && value > 0;

const budgetsFile = process.env.PERF_BUDGETS_FILE ?? 'scripts/performance-budgets.json';
const file = resolve(process.cwd(), budgetsFile);
let parsed;

try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
    fail(`Failed to read or parse ${budgetsFile}: ${String(error)}`);
}

if (!isPlainObject(parsed)) {
    fail('Top-level content must be an object.');
}

if (!Number.isInteger(parsed.version) || parsed.version < 1) {
    fail('`version` must be an integer >= 1.');
}

if (!isPlainObject(parsed.environment)) {
    fail('`environment` must be an object.');
}

for (const key of REQUIRED_ENV_KEYS) {
    if (typeof parsed.environment[key] !== 'string' || !parsed.environment[key].trim()) {
        fail(`environment.${key} must be a non-empty string.`);
    }
}

if (!isPlainObject(parsed.components)) {
    fail('`components` must be an object.');
}

for (const componentName of REQUIRED_COMPONENTS) {
    const component = parsed.components[componentName];

    if (!isPlainObject(component)) {
        fail(`components.${componentName} must be an object.`);
    }
    if (typeof component.scenario !== 'string' || !component.scenario.trim()) {
        fail(`components.${componentName}.scenario must be a non-empty string.`);
    }
    if (!isPlainObject(component.budgets)) {
        fail(`components.${componentName}.budgets must be an object.`);
    }

    const budgetEntries = Object.entries(component.budgets);

    if (!budgetEntries.length) {
        fail(`components.${componentName}.budgets must include at least one metric.`);
    }

    for (const [metric, value] of budgetEntries) {
        if (!isPositiveNumber(value)) {
            fail(`components.${componentName}.budgets.${metric} must be a positive number.`);
        }
    }
}

console.log('[verify:performance-budgets] OK.');
