# Docs SSH Deployment Pipeline

This document defines the SSH deployment pipeline for docs artifacts.

## Components

- Deploy script: `scripts/deploy-docs-ssh.sh`
- CI workflow: `.github/workflows/docs-deploy.yml`
- Build artifact source: `dist/docs` (from `npm run build:docs`)

## Environment Variable Contract

Required:

- `DOCS_SSH_HOST`: SSH host (for example `docs.example.com`)
- `DOCS_SSH_USER`: SSH user for deployment
- `DOCS_SSH_TARGET_DIR`: remote root directory for docs site

Optional:

- `DOCS_SSH_PORT` (default `22`)
- `DOCS_LOCAL_DIR` (default `dist/docs`)
- `DOCS_DEPLOY_ID` (default UTC timestamp `YYYYMMDDHHMMSS`)
- `DOCS_RELEASES_TO_KEEP` (default `5`)
- `DOCS_DEPLOY_ROLLBACK_TO` (release id for rollback mode)

GitHub Secrets expected by workflow:

- `DOCS_SSH_PRIVATE_KEY` (private deploy key content)
- `DOCS_SSH_KNOWN_HOSTS` (optional strict known_hosts content)
- `DOCS_SSH_HOST`
- `DOCS_SSH_PORT` (optional)
- `DOCS_SSH_USER`
- `DOCS_SSH_TARGET_DIR`
- `DOCS_RELEASES_TO_KEEP` (optional)

## Remote Directory Strategy

Remote layout under `DOCS_SSH_TARGET_DIR`:

- `releases/<deploy-id>/` - immutable release payload
- `current` -> symlink to active release
- `previous` -> symlink to previous release

Deploy is atomic by switching `current` symlink after upload succeeds.

## Rollback Strategy

Fast rollback is implemented by relinking `current` to an existing release directory.

Workflow rollback:

- Run `docs deploy` workflow manually (`workflow_dispatch`)
- Set input `rollback_to` to a previous release id

Local/manual rollback:

```bash
DOCS_DEPLOY_ROLLBACK_TO=20260227143015 \
DOCS_SSH_HOST=... DOCS_SSH_USER=... DOCS_SSH_TARGET_DIR=... \
./scripts/deploy-docs-ssh.sh
```

No upload occurs in rollback mode; only symlink switch is performed.

## Safety Notes

- Keep at least one prior release to allow rollback (`DOCS_RELEASES_TO_KEEP >= 2` recommended).
- Prefer strict host verification via `DOCS_SSH_KNOWN_HOSTS` secret.
- Use a least-privileged SSH user with access limited to docs target directory.
