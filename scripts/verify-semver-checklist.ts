import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const changelogPath = path.join(root, 'CHANGELOG.md');

function fail(message) {
    console.error(`[verify:semver] ${message}`);
    process.exit(1);
}

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;
if (!version) {
    fail('Missing `version` in package.json.');
}

const changelog = readFileSync(changelogPath, 'utf8');
const versionHeader = `## [${version}]`;
const sectionStart = changelog.indexOf(versionHeader);
if (sectionStart === -1) {
    fail(`Missing changelog section for ${versionHeader}.`);
}

const nextSectionStart = changelog.indexOf('\n## [', sectionStart + versionHeader.length);
const section =
    nextSectionStart === -1 ? changelog.slice(sectionStart) : changelog.slice(sectionStart, nextSectionStart);

const requiredPatterns = [
    /\[x\]\s+Semver impact classified\b/i,
    /\[x\]\s+Breaking-change assessment completed\b/i,
    /\[x\]\s+Deprecations documented\b/i,
    /\[x\]\s+Migration notes added when required\b/i,
    /\[x\]\s+Catalog mapping sync completed\b/i,
];

for (const pattern of requiredPatterns) {
    if (!pattern.test(section)) {
        fail(`Missing required checked item matching: ${pattern}`);
    }
}

console.log(`[verify:semver] OK for version ${version}.`);
