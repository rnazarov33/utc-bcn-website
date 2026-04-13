#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="/Users/roman.nazarov/Antigravity/UTC Website"
ENV_FILE="$REPO_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a
