import { brotliCompressSync, gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

type FileBudget = {
    maxRawBytes: number;
    maxGzipBytes: number;
    maxBrotliBytes: number;
};

type BundleBudgets = {
    files: Record<string, FileBudget>;
};

function fail(message: string): never {
    console.error(`[verify:bundle-size] ${message}`);
    process.exit(1);
}

const budgetsFile = process.env.BUNDLE_SIZE_BUDGETS_FILE ?? 'scripts/bundle-size-budgets.json';
const budgetsPath = resolve(process.cwd(), budgetsFile);

let budgets: BundleBudgets;

try {
    budgets = JSON.parse(readFileSync(budgetsPath, 'utf8')) as BundleBudgets;
} catch (error) {
    fail(`Failed to read or parse ${budgetsFile}: ${String(error)}`);
}

if (!budgets.files || typeof budgets.files !== 'object') {
    fail(`Invalid budgets format in ${budgetsFile}: expected "files" object.`);
}

const errors: string[] = [];
const reports: string[] = [];

for (const [filePath, budget] of Object.entries(budgets.files)) {
    if (
        !budget ||
        typeof budget.maxRawBytes !== 'number' ||
        typeof budget.maxGzipBytes !== 'number' ||
        typeof budget.maxBrotliBytes !== 'number'
    ) {
        errors.push(`${filePath}: invalid budget entry`);
        continue;
    }

    const absolutePath = resolve(process.cwd(), filePath);
    let content: Buffer;

    try {
        content = readFileSync(absolutePath);
    } catch (error) {
        errors.push(`${filePath}: failed to read file (${String(error)})`);
        continue;
    }

    const rawBytes = content.length;
    const gzipBytes = gzipSync(content, { level: 9 }).length;
    const brotliBytes = brotliCompressSync(content).length;

    reports.push(
        `${filePath} raw=${rawBytes} gzip=${gzipBytes} brotli=${brotliBytes} budgets(raw<=${budget.maxRawBytes}, gzip<=${budget.maxGzipBytes}, brotli<=${budget.maxBrotliBytes})`,
    );

    if (rawBytes > budget.maxRawBytes) {
        errors.push(`${filePath}: raw ${rawBytes} > ${budget.maxRawBytes}`);
    }

    if (gzipBytes > budget.maxGzipBytes) {
        errors.push(`${filePath}: gzip ${gzipBytes} > ${budget.maxGzipBytes}`);
    }

    if (brotliBytes > budget.maxBrotliBytes) {
        errors.push(`${filePath}: brotli ${brotliBytes} > ${budget.maxBrotliBytes}`);
    }
}

for (const report of reports) {
    console.log(`[verify:bundle-size] ${report}`);
}

if (errors.length > 0) {
    for (const error of errors) {
        console.error(`[verify:bundle-size] ${error}`);
    }
    process.exit(1);
}

console.log('[verify:bundle-size] OK.');
