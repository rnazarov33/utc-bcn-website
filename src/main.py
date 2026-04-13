from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from format_report import format_report
from ga4_client import Ga4Client
from telegram_client import TelegramClient


DEFAULT_REPORT_TIMEZONE = "Europe/Madrid"
REQUIRED_ENV_VARS = (
    "GA4_PROPERTY_ID",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Pull yesterday's GA4 report and send a compact summary to Telegram."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the Telegram message instead of sending it.",
    )
    return parser.parse_args()


def load_environment() -> dict[str, str]:
    load_dotenv()

    config: dict[str, str] = {}
    missing = [key for key in REQUIRED_ENV_VARS if not os.getenv(key)]
    if missing:
        raise RuntimeError(
            "Missing required environment variables: " + ", ".join(missing)
        )

    for key in REQUIRED_ENV_VARS:
        config[key] = os.environ[key]

    config["REPORT_TIMEZONE"] = os.getenv("REPORT_TIMEZONE", DEFAULT_REPORT_TIMEZONE)

    credentials_path = Path(config["GOOGLE_APPLICATION_CREDENTIALS"]).expanduser()
    if not credentials_path.is_file():
        raise RuntimeError(
            "GOOGLE_APPLICATION_CREDENTIALS does not point to a readable file: "
            f"{credentials_path}"
        )

    config["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)
    return config


def main() -> int:
    args = parse_args()

    try:
        config = load_environment()
        report = Ga4Client(
            property_id=config["GA4_PROPERTY_ID"],
            report_timezone=config["REPORT_TIMEZONE"],
        ).fetch_yesterday_report()
        message = format_report(report)

        if args.dry_run:
            print(message)
            return 0

        TelegramClient(
            bot_token=config["TELEGRAM_BOT_TOKEN"],
            chat_id=config["TELEGRAM_CHAT_ID"],
        ).send_message(message)
        print("Telegram report sent successfully.")
        return 0
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
