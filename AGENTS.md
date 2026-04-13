# Project Rules

- Prefer the existing Python implementation in `src/` for the daily GA4 to Telegram workflow.
- Keep the workflow simple and modular; avoid adding unnecessary abstractions or services.
- Preserve the current report structure unless explicitly asked to change it.
- Verify required environment variables before running the workflow.
- Use `--dry-run` first when testing changes.
- Keep Telegram output concise and easy to scan.
- Surface exact GA4, auth, permission, and Telegram delivery errors.
