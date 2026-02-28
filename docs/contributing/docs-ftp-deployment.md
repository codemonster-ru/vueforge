# Docs FTP Deployment Pipeline

This document defines the FTP/FTPS deployment pipeline for docs artifacts.

## Components

- CI workflow: `.github/workflows/docs-deploy.yml`
- Build artifact source: `dist/docs` (from `npm run build:docs`)
- Automatic trigger: successful completion of `publish to NPM`
- Manual trigger: `workflow_dispatch`

## GitHub Secrets Contract

Required:

- `DOCS_FTP_HOST`: FTP or FTPS host (for example `ftp.example.com`)
- `DOCS_FTP_USERNAME`: deploy account username
- `DOCS_FTP_PASSWORD`: deploy account password
- `DOCS_FTP_SERVER_DIR`: remote directory that serves the docs site

Optional:

- `DOCS_FTP_PORT` (default `21`)
- `DOCS_FTP_PROTOCOL` (recommended `ftps`; fallback `ftp`)

## Artifact Contract

- Build docs with `npm run build:docs`
- Upload the contents of `dist/docs/`
- The remote web root for the docs site must point at `DOCS_FTP_SERVER_DIR`

Expected deployed files:

- `index.html`
- `assets/*`

## Deploy Flow

Automatic deploy flow:

- Push a release tag through the normal publish pipeline
- `publish to NPM` completes successfully
- `docs deploy` runs from `workflow_run`
- Workflow checks out the published workflow `head_sha` and deploys docs for that exact release commit

Manual deploy flow:

- Run the `docs deploy` workflow manually (`workflow_dispatch`)
- Optionally set `ref` to a branch, tag, or commit SHA
- Workflow builds docs from that ref and uploads `dist/docs`

## Hosting Notes

- Prefer `FTPS` if the hosting provider supports it.
- Configure the subdomain/web root to serve `DOCS_FTP_SERVER_DIR`.
- Static SPA fallback should route unknown paths to `index.html`.

Nginx example:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Limitations vs SSH Deploy

- FTP/FTPS deploy writes directly to the live target directory.
- Atomic symlink-based release switching is not available.
- Fast server-side rollback is not built into this pipeline.

If rollback becomes important later, move docs hosting to a platform with SSH or artifact-based release storage.
