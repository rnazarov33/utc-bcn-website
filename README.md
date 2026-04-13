# GA4 Daily Telegram Report

This repository includes a small Python workflow that pulls yesterday's Google Analytics 4 data with the GA4 Data API and sends a compact summary to Telegram.

## Files

- `src/main.py` - CLI entrypoint with env validation and `--dry-run`
- `src/ga4_client.py` - GA4 Data API queries
- `src/telegram_client.py` - Telegram Bot API delivery
- `src/format_report.py` - compact message formatting
- `skills/ga4-daily-report/SKILL.md` - repo-local Codex skill
- `AGENTS.md` - repo-level Codex rules

## Setup

1. Create or activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` values into `.env` and fill in:
   - `GA4_PROPERTY_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `REPORT_TIMEZONE` (optional, defaults to `Europe/Madrid`)

4. Make sure the service account in `GOOGLE_APPLICATION_CREDENTIALS` has access to the GA4 property.

## Dry Run

```bash
python3 src/main.py --dry-run
```

This prints the Telegram message to stdout instead of sending it.

## Real Send

```bash
python3 src/main.py
```

This sends the formatted report to `TELEGRAM_CHAT_ID` using the Telegram Bot API.

The report labels GA4 `totalUsers` as `Unique users` to make it explicit that this field is the distinct-user count.
