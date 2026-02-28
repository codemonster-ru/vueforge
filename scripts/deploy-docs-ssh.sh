#!/usr/bin/env bash

set -euo pipefail

log() {
    printf '[deploy:docs:ssh] %s\n' "$1"
}

fail() {
    printf '[deploy:docs:ssh] ERROR: %s\n' "$1" >&2
    exit 1
}

require_env() {
    local name="$1"
    local value="${!name:-}"
    if [[ -z "$value" ]]; then
        fail "Missing required environment variable: ${name}"
    fi
}

SSH_HOST="${DOCS_SSH_HOST:-}"
SSH_PORT="${DOCS_SSH_PORT:-22}"
SSH_USER="${DOCS_SSH_USER:-}"
SSH_TARGET_DIR="${DOCS_SSH_TARGET_DIR:-}"
LOCAL_DIR="${DOCS_LOCAL_DIR:-dist/docs}"
DEPLOY_ID="${DOCS_DEPLOY_ID:-$(date -u +%Y%m%d%H%M%S)}"
ROLLBACK_TO="${DOCS_DEPLOY_ROLLBACK_TO:-}"
RELEASES_TO_KEEP="${DOCS_RELEASES_TO_KEEP:-5}"

require_env DOCS_SSH_HOST
require_env DOCS_SSH_USER
require_env DOCS_SSH_TARGET_DIR

if ! [[ "$RELEASES_TO_KEEP" =~ ^[0-9]+$ ]]; then
    fail "DOCS_RELEASES_TO_KEEP must be a positive integer."
fi

SSH_DEST="${SSH_USER}@${SSH_HOST}"
REMOTE_ROOT="${SSH_TARGET_DIR%/}"
REMOTE_RELEASES_DIR="${REMOTE_ROOT}/releases"
REMOTE_CURRENT_LINK="${REMOTE_ROOT}/current"
REMOTE_PREVIOUS_LINK="${REMOTE_ROOT}/previous"

if [[ -n "$ROLLBACK_TO" ]]; then
    log "Rollback mode enabled: ${ROLLBACK_TO}"

    ssh -p "$SSH_PORT" "$SSH_DEST" "bash -s" <<EOF
set -euo pipefail
TARGET_RELEASE="${REMOTE_RELEASES_DIR}/${ROLLBACK_TO}"

if [[ ! -d "\${TARGET_RELEASE}" ]]; then
    echo "Target release does not exist: \${TARGET_RELEASE}" >&2
    exit 1
fi

mkdir -p "${REMOTE_ROOT}"

if [[ -L "${REMOTE_CURRENT_LINK}" ]]; then
    CURRENT_TARGET="\$(readlink "${REMOTE_CURRENT_LINK}")"
    if [[ -n "\${CURRENT_TARGET}" ]]; then
        ln -sfn "\${CURRENT_TARGET}" "${REMOTE_PREVIOUS_LINK}"
    fi
fi

ln -sfn "releases/${ROLLBACK_TO}" "${REMOTE_CURRENT_LINK}"
EOF

    log "Rollback complete: current -> releases/${ROLLBACK_TO}"
    exit 0
fi

if [[ ! -d "$LOCAL_DIR" ]]; then
    fail "Local docs artifact directory not found: ${LOCAL_DIR}. Run npm run build:docs first."
fi

REMOTE_RELEASE_DIR="${REMOTE_RELEASES_DIR}/${DEPLOY_ID}"

log "Ensuring remote release directories exist"
ssh -p "$SSH_PORT" "$SSH_DEST" "mkdir -p '${REMOTE_RELEASES_DIR}'"

log "Uploading docs artifact ${LOCAL_DIR} -> ${REMOTE_RELEASE_DIR}"
rsync -az --delete --chmod=D755,F644 -e "ssh -p ${SSH_PORT}" "${LOCAL_DIR%/}/" "${SSH_DEST}:${REMOTE_RELEASE_DIR}/"

log "Switching active symlink to release ${DEPLOY_ID}"
ssh -p "$SSH_PORT" "$SSH_DEST" "bash -s" <<EOF
set -euo pipefail

mkdir -p "${REMOTE_ROOT}"

if [[ -L "${REMOTE_CURRENT_LINK}" ]]; then
    CURRENT_TARGET="\$(readlink "${REMOTE_CURRENT_LINK}")"
    if [[ -n "\${CURRENT_TARGET}" ]]; then
        ln -sfn "\${CURRENT_TARGET}" "${REMOTE_PREVIOUS_LINK}"
    fi
fi

ln -sfn "releases/${DEPLOY_ID}" "${REMOTE_CURRENT_LINK}"

cd "${REMOTE_RELEASES_DIR}"
ls -1dt */ 2>/dev/null | sed 's#/\$##' | awk 'NR>${RELEASES_TO_KEEP}' | while read -r old_release; do
    if [[ -n "\${old_release}" ]]; then
        rm -rf "\${old_release}"
    fi
done
EOF

log "Deploy complete: current -> releases/${DEPLOY_ID}"
