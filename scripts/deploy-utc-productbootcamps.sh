#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/utc-productbootcamps/repo}"
LIVE_DIR="${LIVE_DIR:-/var/www/utc-productbootcamps/current}"
BRANCH="${BRANCH:-main}"
TARGET_SHA="${1:-${TARGET_SHA:-}}"
ENV_FILE="${ENV_FILE:-.env.production}"

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

mkdir -p "$LIVE_DIR"
rsync -a --delete dist/ "$LIVE_DIR/"

sudo systemctl reload nginx
