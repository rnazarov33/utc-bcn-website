---
name: ga4-daily-report
description: Run or update the repository's daily Google Analytics 4 to Telegram reporting workflow. Use when Codex needs to work on the local Python implementation that reads GA4 Data API metrics for yesterday, formats a concise Telegram summary, validates environment variables, tests with --dry-run, or diagnoses GA4 auth, permission, and Telegram delivery failures.
---

# ga4-daily-report

## Overview

Use the existing Python workflow in `src/` instead of replacing it with a new stack or extra services. Keep changes small, preserve the current report structure unless the user asks for a change, and keep Telegram output concise and scannable.

## Working Rules

1. Verify required environment variables before running:
   - `GA4_PROPERTY_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `REPORT_TIMEZONE` (default to `Europe/Madrid` if missing)
2. Prefer `python3 src/main.py --dry-run` first when testing changes.
3. Use the existing modules in `src/main.py`, `src/ga4_client.py`, `src/telegram_client.py`, and `src/format_report.py`.
4. Preserve the existing message shape unless explicitly asked to change it:

```text
GA4 yesterday
Sessions: X
Unique users: Y
Active users: Z
Key events: A
Revenue: B

Top channels:
1. Organic Search - ...
2. Direct - ...
3. Paid Search - ...
```

5. Show exact API, auth, permission, and delivery errors instead of hiding them behind generic messages.

## Commands

Dry run:

```bash
python3 src/main.py --dry-run
```

Real send:

```bash
python3 src/main.py
```
