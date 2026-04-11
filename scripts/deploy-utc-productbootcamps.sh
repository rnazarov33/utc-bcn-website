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

# Previous deploys or manual server work can leave root-owned build artifacts in
# the repo, which makes `git reset --hard` fail. Clear generated directories
# first so the checkout step stays reproducible.
sudo rm -rf node_modules dist

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
