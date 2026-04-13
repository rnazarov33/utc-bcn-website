from __future__ import annotations

from decimal import Decimal

from ga4_client import DailyReport


def format_report(report: DailyReport) -> str:
    if not report.channels and not any(
        (
            report.totals.sessions,
            report.totals.total_users,
            report.totals.active_users,
            report.totals.key_events,
            report.totals.purchase_revenue,
        )
    ):
        return f"GA4 {report.report_date}\nYesterday returned no rows."

    totals = report.totals
    lines = [
        f"GA4 {report.report_date}",
        f"Sessions: {_format_int(totals.sessions)}",
        f"Unique users: {_format_int(totals.total_users)}",
        f"Active users: {_format_int(totals.active_users)}",
        f"Key events: {_format_int(totals.key_events)}",
        f"Revenue: {_format_currency(totals.purchase_revenue)}",
        "",
        "Top channels:",
    ]

    if report.channels:
        for index, channel in enumerate(report.channels, start=1):
            lines.append(f"{index}. {channel.channel} - {_format_int(channel.sessions)} sessions")
    else:
        lines.append("No channel data returned.")

    return "\n".join(lines)


def _format_int(value: int) -> str:
    return f"{value:,}"


def _format_currency(value: Decimal) -> str:
    return f"{value:,.2f}"
