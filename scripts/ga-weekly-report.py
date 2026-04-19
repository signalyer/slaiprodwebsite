"""Weekly GA4 report generator for signallayer.ai.

Pulls last 7 days of data from GA4 (both www and blogs subdomains),
formats a markdown report with WoW comparisons, and writes it to
reports/weekly-YYYY-MM-DD.md. The GitHub Actions workflow then
creates an issue with that markdown body (which emails watchers).

Required env vars:
  GA4_PROPERTY_ID            — numeric property ID (e.g. "123456789")
  GA4_SERVICE_ACCOUNT_JSON   — full service account key JSON as a string
  GITHUB_OUTPUT              — set automatically by GitHub Actions

Runs locally too — set the env vars and run: python scripts/ga-weekly-report.py
"""
import json
import os
from datetime import date, timedelta
from pathlib import Path

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.oauth2 import service_account

PROPERTY_ID = os.environ["GA4_PROPERTY_ID"]
SA_INFO = json.loads(os.environ["GA4_SERVICE_ACCOUNT_JSON"])

credentials = service_account.Credentials.from_service_account_info(SA_INFO)
client = BetaAnalyticsDataClient(credentials=credentials)


def run(dimensions, metrics, start, end, limit=10, order_by_metric=None):
    order = []
    if order_by_metric:
        order = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_by_metric), desc=True)]
    return client.run_report(
        RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            dimensions=[Dimension(name=d) for d in dimensions],
            metrics=[Metric(name=m) for m in metrics],
            date_ranges=[DateRange(start_date=start.isoformat(), end_date=end.isoformat())],
            limit=limit,
            order_bys=order,
        )
    )


def sum_metric(response, metric_index=0):
    return sum(float(row.metric_values[metric_index].value) for row in response.rows)


def pct_change(cur, prev):
    if prev == 0:
        return "new" if cur > 0 else "—"
    diff = (cur - prev) / prev * 100
    arrow = "▲" if diff > 0 else "▼" if diff < 0 else "—"
    return f"{arrow} {abs(diff):.1f}%"


def fmt_duration(seconds):
    seconds = int(seconds)
    m, s = divmod(seconds, 60)
    return f"{m}m {s}s" if m else f"{s}s"


def md_table(headers, rows):
    if not rows:
        return "_No data in this period._\n"
    out = ["| " + " | ".join(headers) + " |"]
    out.append("| " + " | ".join(["---"] * len(headers)) + " |")
    for r in rows:
        out.append("| " + " | ".join(str(v) for v in r) + " |")
    return "\n".join(out) + "\n"


def build_report():
    # Date windows
    today = date.today()
    end = today - timedelta(days=1)
    start = end - timedelta(days=6)
    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=6)

    # --- Overall totals with WoW comparison ---
    totals_metrics = ["activeUsers", "sessions", "screenPageViews", "averageSessionDuration", "eventCount"]
    cur = run([], totals_metrics, start, end)
    prev = run([], totals_metrics, prev_start, prev_end)

    def v(resp, i):
        return float(resp.rows[0].metric_values[i].value) if resp.rows else 0

    totals_rows = [
        ("Active users", int(v(cur, 0)), int(v(prev, 0)), pct_change(v(cur, 0), v(prev, 0))),
        ("Sessions", int(v(cur, 1)), int(v(prev, 1)), pct_change(v(cur, 1), v(prev, 1))),
        ("Page views", int(v(cur, 2)), int(v(prev, 2)), pct_change(v(cur, 2), v(prev, 2))),
        ("Avg session duration", fmt_duration(v(cur, 3)), fmt_duration(v(prev, 3)), pct_change(v(cur, 3), v(prev, 3))),
        ("Events", int(v(cur, 4)), int(v(prev, 4)), pct_change(v(cur, 4), v(prev, 4))),
    ]

    # --- Per-subdomain split ---
    hosts = run(["hostName"], ["sessions", "activeUsers"], start, end, limit=10, order_by_metric="sessions")
    host_rows = [
        (r.dimension_values[0].value, int(float(r.metric_values[0].value)), int(float(r.metric_values[1].value)))
        for r in hosts.rows
    ]

    # --- Top pages ---
    pages = run(["pagePath"], ["screenPageViews", "activeUsers", "averageSessionDuration"], start, end, limit=10, order_by_metric="screenPageViews")
    page_rows = [
        (
            r.dimension_values[0].value[:60],
            int(float(r.metric_values[0].value)),
            int(float(r.metric_values[1].value)),
            fmt_duration(float(r.metric_values[2].value)),
        )
        for r in pages.rows
    ]

    # --- Traffic sources ---
    sources = run(["sessionSourceMedium"], ["sessions", "activeUsers"], start, end, limit=10, order_by_metric="sessions")
    source_rows = [
        (r.dimension_values[0].value, int(float(r.metric_values[0].value)), int(float(r.metric_values[1].value)))
        for r in sources.rows
    ]

    # --- Country ---
    countries = run(["country"], ["activeUsers", "sessions"], start, end, limit=10, order_by_metric="activeUsers")
    country_rows = [
        (r.dimension_values[0].value, int(float(r.metric_values[0].value)), int(float(r.metric_values[1].value)))
        for r in countries.rows
    ]

    # --- Top events ---
    events = run(["eventName"], ["eventCount", "totalUsers"], start, end, limit=10, order_by_metric="eventCount")
    event_rows = [
        (r.dimension_values[0].value, int(float(r.metric_values[0].value)), int(float(r.metric_values[1].value)))
        for r in events.rows
    ]

    # --- Device category ---
    devices = run(["deviceCategory"], ["sessions", "activeUsers"], start, end, limit=5, order_by_metric="sessions")
    device_rows = [
        (r.dimension_values[0].value, int(float(r.metric_values[0].value)), int(float(r.metric_values[1].value)))
        for r in devices.rows
    ]

    # ---- Assemble markdown ----
    md = []
    md.append(f"# Weekly Analytics Report — signallayer.ai\n")
    md.append(f"**Period:** {start.isoformat()} → {end.isoformat()}  ")
    md.append(f"**vs previous 7 days:** {prev_start.isoformat()} → {prev_end.isoformat()}\n")

    md.append("## Headline metrics (with week-over-week)\n")
    md.append(md_table(["Metric", "This week", "Last week", "Change"], totals_rows))

    md.append("## Traffic by subdomain\n")
    md.append(md_table(["Hostname", "Sessions", "Users"], host_rows))

    md.append("## Top pages\n")
    md.append(md_table(["Page", "Views", "Users", "Avg duration"], page_rows))

    md.append("## Traffic sources\n")
    md.append(md_table(["Source / medium", "Sessions", "Users"], source_rows))

    md.append("## Geography\n")
    md.append(md_table(["Country", "Users", "Sessions"], country_rows))

    md.append("## Events\n")
    md.append(md_table(["Event", "Count", "Users"], event_rows))

    md.append("## Device split\n")
    md.append(md_table(["Device", "Sessions", "Users"], device_rows))

    md.append("\n---\n")
    md.append(f"_Generated automatically by `scripts/ga-weekly-report.py` via GitHub Actions._  ")
    md.append(f"_Property ID: `{PROPERTY_ID}` &middot; Report date: {today.isoformat()}_")

    return "\n".join(md), end


def main():
    report_md, end = build_report()

    reports_dir = Path("reports")
    reports_dir.mkdir(exist_ok=True)
    filename = reports_dir / f"weekly-{end.isoformat()}.md"
    filename.write_text(report_md, encoding="utf-8")

    # Expose path to the GitHub Actions workflow via step output
    output_file = os.environ.get("GITHUB_OUTPUT")
    if output_file:
        with open(output_file, "a") as f:
            f.write(f"report_file={filename}\n")
            f.write(f"report_date={end.isoformat()}\n")
    else:
        print(f"Report written to {filename}")
        print(f"---")
        print(report_md)


if __name__ == "__main__":
    main()
