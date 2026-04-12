#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="/Users/roman.nazarov/Antigravity/UTC Website"

cd "$REPO_DIR"

npm run ga:report:telegram
