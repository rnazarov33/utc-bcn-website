from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.api_core.exceptions import GoogleAPICallError, PermissionDenied, Unauthenticated


@dataclass
class ReportTotals:
    sessions: int
    total_users: int
    active_users: int
    key_events: int
    purchase_revenue: Decimal


@dataclass
class ChannelRow:
    channel: str
    sessions: int


@dataclass
class DailyReport:
    report_date: str
    timezone: str
    totals: ReportTotals
    channels: list[ChannelRow]


class Ga4Client:
    def __init__(self, property_id: str, report_timezone: str) -> None:
        self.property_id = property_id
        self.report_timezone = report_timezone
        self.property_name = f"properties/{property_id}"
        self._client = self._build_client()

    def _build_client(self) -> BetaAnalyticsDataClient:
        try:
            return BetaAnalyticsDataClient()
        except Exception as exc:
            raise RuntimeError(
                "Failed to initialize the GA4 Data API client. "
                f"Check GOOGLE_APPLICATION_CREDENTIALS and service account JSON. Original error: {exc}"
            ) from exc

    def fetch_yesterday_report(self) -> DailyReport:
        report_date = self._yesterday_in_timezone(self.report_timezone)
        totals = self._fetch_totals(report_date)
        channels = self._fetch_top_channels(report_date)
        return DailyReport(
            report_date=report_date,
            timezone=self.report_timezone,
            totals=totals,
            channels=channels,
        )

    def _yesterday_in_timezone(self, timezone_name: str) -> str:
        try:
            tz = ZoneInfo(timezone_name)
        except ZoneInfoNotFoundError as exc:
            raise RuntimeError(f"Invalid REPORT_TIMEZONE '{timezone_name}'.") from exc

        yesterday = datetime.now(tz).date() - timedelta(days=1)
        return yesterday.isoformat()

    def _fetch_totals(self, report_date: str) -> ReportTotals:
        request = RunReportRequest(
            property=self.property_name,
            date_ranges=[DateRange(start_date=report_date, end_date=report_date)],
            metrics=[
                Metric(name="sessions"),
                Metric(name="totalUsers"),
                Metric(name="activeUsers"),
                Metric(name="keyEvents"),
                Metric(name="purchaseRevenue"),
            ],
        )
        response = self._run_report(request, "totals")
        row = response.rows[0] if response.rows else None

        return ReportTotals(
            sessions=self._as_int(row, 0),
            total_users=self._as_int(row, 1),
            active_users=self._as_int(row, 2),
            key_events=self._as_int(row, 3),
            purchase_revenue=self._as_decimal(row, 4),
        )

    def _fetch_top_channels(self, report_date: str) -> list[ChannelRow]:
        request = RunReportRequest(
            property=self.property_name,
            date_ranges=[DateRange(start_date=report_date, end_date=report_date)],
            dimensions=[Dimension(name="sessionDefaultChannelGroup")],
            metrics=[Metric(name="sessions")],
            order_bys=[
                OrderBy(
                    metric=OrderBy.MetricOrderBy(metric_name="sessions"),
                    desc=True,
                )
            ],
            limit=5,
        )
        response = self._run_report(request, "top channels")

        rows: list[ChannelRow] = []
        for item in response.rows:
            channel_name = item.dimension_values[0].value or "(not set)"
            rows.append(ChannelRow(channel=channel_name, sessions=self._as_int(item, 0)))

        return rows

    def _run_report(self, request: RunReportRequest, label: str):
        try:
            return self._client.run_report(request)
        except PermissionDenied as exc:
            raise RuntimeError(
                "GA4 access denied while fetching "
                f"{label} for property {self.property_id}. "
                f"Verify the service account has access to this GA4 property. Original error: {exc}"
            ) from exc
        except Unauthenticated as exc:
            raise RuntimeError(
                "GA4 authentication failed. Check GOOGLE_APPLICATION_CREDENTIALS and service account permissions. "
                f"Original error: {exc}"
            ) from exc
        except GoogleAPICallError as exc:
            raise RuntimeError(
                f"GA4 Data API request failed while fetching {label} for property {self.property_id}. "
                f"Original error: {exc}"
            ) from exc
        except Exception as exc:
            raise RuntimeError(
                f"Unexpected GA4 error while fetching {label} for property {self.property_id}: {exc}"
            ) from exc

    @staticmethod
    def _as_int(row, index: int) -> int:
        value = row.metric_values[index].value if row else "0"
        try:
            return int(float(value))
        except (TypeError, ValueError) as exc:
            raise RuntimeError(f"Failed to parse integer metric value '{value}'.") from exc

    @staticmethod
    def _as_decimal(row, index: int) -> Decimal:
        value = row.metric_values[index].value if row else "0"
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError) as exc:
            raise RuntimeError(f"Failed to parse revenue metric value '{value}'.") from exc
