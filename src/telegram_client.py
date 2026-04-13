from __future__ import annotations

import requests


class TelegramClient:
    def __init__(self, bot_token: str, chat_id: str) -> None:
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.api_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    def send_message(self, text: str) -> None:
        payload = {
            "chat_id": self.chat_id,
            "text": text,
            "disable_web_page_preview": True,
        }

        try:
            response = requests.post(self.api_url, json=payload, timeout=30)
        except requests.RequestException as exc:
            raise RuntimeError(f"Telegram delivery failed before receiving a response: {exc}") from exc

        if not response.ok:
            error_detail = self._extract_error(response)
            raise RuntimeError(
                f"Telegram delivery failed with status {response.status_code}: {error_detail}"
            )

        try:
            body = response.json()
        except ValueError as exc:
            raise RuntimeError(
                "Telegram delivery succeeded with a non-JSON response, which is unexpected."
            ) from exc

        if not body.get("ok"):
            raise RuntimeError(
                f"Telegram delivery failed: {body.get('description', 'unknown Telegram error')}"
            )

    @staticmethod
    def _extract_error(response: requests.Response) -> str:
        try:
            body = response.json()
        except ValueError:
            return response.text.strip() or "empty response body"

        return body.get("description") or body.get("error_code") or str(body)
