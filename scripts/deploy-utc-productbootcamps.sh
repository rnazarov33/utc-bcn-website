#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/utc-productbootcamps/repo}"
LIVE_DIR="${LIVE_DIR:-/var/www/utc-productbootcamps/current}"
BRANCH="${BRANCH:-main}"
TARGET_SHA="${1:-${TARGET_SHA:-}}"
ENV_FILE="${ENV_FILE:-.env.production}"
DEPLOY_ROOT="${DEPLOY_ROOT:-$(dirname "$LIVE_DIR")}"
RELEASES_DIR="${RELEASES_DIR:-$DEPLOY_ROOT/releases}"
DEPLOY_ID="${TARGET_SHA:-$(date +%s)}"
STAGING_DIR="${STAGING_DIR:-$RELEASES_DIR/.stage-$DEPLOY_ID}"
BACKUP_DIR="${BACKUP_DIR:-$RELEASES_DIR/backup-$(date +%s)}"
POST_DEPLOY_RELOAD_CMD="${POST_DEPLOY_RELOAD_CMD:-}"

cd "$REPO_DIR"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # Load build-time environment variables such as VITE_GA_MEASUREMENT_ID.
  source "$ENV_FILE"
  set +a
fi

# Clear generated directories if they exist. In the production workflow we build
# from a temporary worktree, so these files should be user-owned and removable
# without sudo.
rm -rf node_modules dist 2>/dev/null || true
if [[ -e node_modules || -e dist ]]; then
  sudo -n rm -rf node_modules dist 2>/dev/null || true
fi

git fetch --prune origin

if [[ -n "$TARGET_SHA" ]]; then
  git reset --hard "$TARGET_SHA"
else
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

npm ci --no-audit --no-fund
npm run build

mkdir -p "$RELEASES_DIR"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
rsync -a --delete dist/ "$STAGING_DIR/"

if [[ -e "$LIVE_DIR" ]]; then
  mv "$LIVE_DIR" "$BACKUP_DIR"
fi

mv "$STAGING_DIR" "$LIVE_DIR"

if [[ -n "$POST_DEPLOY_RELOAD_CMD" ]]; then
  bash -lc "$POST_DEPLOY_RELOAD_CMD"
fi
