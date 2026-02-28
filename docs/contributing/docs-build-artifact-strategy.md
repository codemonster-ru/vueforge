# Docs Build Artifact Strategy

This document defines how VueForge docs static artifacts are produced and consumed.

## Build Target

- Command: `npm run build:docs`
- Config: `vite.docs.config.mts`
- HTML entry: `apps/docs/index.html`
- App entry: `src/docs/main.ts`

## Output Contract

- Output directory: `dist/docs`
- Produced artifact type: static SPA bundle (HTML + hashed JS/CSS/assets)
- Expected deployment unit: contents of `dist/docs` only

## Artifact Contents

After `npm run build:docs`, expect:

- `dist/docs/index.html` (entry html)
- `dist/docs/assets/*` (hashed JS/CSS chunks and static assets)

`dist/` package library artifacts (`index.ts.mjs`, `index.ts.umd.js`, `index.css`) are not required for docs-only deploys.

## Release/CI Usage

- Docs artifact build is validated in CI using `npm run build:docs`.
- Deployment pipeline should publish `dist/docs` as the docs site payload.
- Keep docs build separate from package publish artifact to avoid mixing npm package files with docs hosting files.
- FTP/FTPS deployment details (secrets contract + hosting flow): [`docs-ftp-deployment.md`](./docs-ftp-deployment.md)

## Verification Checklist

- `npm run build:docs` completes successfully.
- Generated docs routes (`/docs/...`) open without 404 in static preview.
- Sidebar navigation and markdown rendering are present in built output.
