#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/utc-productbootcamps/repo}"
LIVE_DIR="${LIVE_DIR:-/var/www/utc-productbootcamps/current}"
BRANCH="${BRANCH:-main}"
TARGET_SHA="${1:-${TARGET_SHA:-}}"

cd "$REPO_DIR"

git fetch --prune origin
git checkout "$BRANCH"

if [[ -n "$TARGET_SHA" ]]; then
  git reset --hard "$TARGET_SHA"
else
  git reset --hard "origin/$BRANCH"
fi

npm ci --no-audit --no-fund
npm run build

mkdir -p "$LIVE_DIR"
rsync -a --delete dist/ "$LIVE_DIR/"

sudo systemctl reload nginx

