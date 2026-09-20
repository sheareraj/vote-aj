from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import csv
import json
import sys

SITE = Path(__file__).resolve().parents[2]
WAREHOUSE = SITE / "data-warehouse"
REPORTS = WAREHOUSE / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)


def read_csv(relative: str):
    with (WAREHOUSE / relative).open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


errors: list[str] = []
warnings: list[str] = []
checks: list[str] = []


def ok(message: str):
    checks.append(message)


def require(condition: bool, message: str):
    if condition:
        ok(message)
    else:
        errors.append(message)


sources_rows = read_csv("data/source_manifest.csv")
sources = {row["source_id"]: row for row in sources_rows}
require(len(sources) == len(sources_rows), "Source manifest IDs are unique")

members_rows = read_csv("data/dim_councillor.csv")
members = {row["display_name"] for row in members_rows}
require(len(members) == 11, "Council dimension contains 11 current Council members")

motions = read_csv("data/facts/fact_motion.csv")
votes = read_csv("data/facts/fact_vote.csv")
motion_ids = [row["motion_id"] for row in motions]
require(len(motion_ids) == len(set(motion_ids)), "Motion IDs are unique")

votes_by_motion: dict[str, list[dict]] = defaultdict(list)
for row in votes:
    votes_by_motion[row["motion_id"]].append(row)

orphan_vote_ids = sorted(set(votes_by_motion) - set(motion_ids))
require(not orphan_vote_ids, "No member-vote rows point to a missing motion")

for motion in motions:
    mid = motion["motion_id"]
    sid = motion["source_id"]
    require(sid in sources, f"{mid}: source_id exists in source manifest")
    if sid in sources:
        require(motion["source_url"] == sources[sid]["canonical_url"], f"{mid}: source URL matches source manifest")
        require(sources[sid]["status"] == "active", f"{mid}: source manifest entry is active")

    rows = votes_by_motion.get(mid, [])
    require(len(rows) == 11, f"{mid}: exactly 11 Council member rows")
    names = [row["member"] for row in rows]
    require(len(names) == len(set(names)), f"{mid}: no duplicate Council member rows")
    require(not (set(names) - members), f"{mid}: all vote members exist in Council dimension")

    counts = Counter(row["vote"] for row in rows)
    expected = {
        "For": int(motion["yes_count"] or 0),
        "Against": int(motion["no_count"] or 0),
        "Conflict": int(motion["conflict_count"] or 0),
        "Absent": int(motion["absent_count"] or 0),
    }
    require(sum(expected.values()) == 11, f"{mid}: summary vote counts account for all 11 members")
    for label, expected_count in expected.items():
        require(counts[label] == expected_count, f"{mid}: {label} rows reconcile to summary count")

    require(motion["review_status"] == "verified_official_minutes", f"{mid}: review status is verified_official_minutes")
    if "strong_mayor" not in (motion.get("significance") or ""):
        yes, no = expected["For"], expected["Against"]
        if motion["result"] == "Carried":
            require(yes > no, f"{mid}: ordinary carried result is consistent with For > Against")
        elif motion["result"] == "Lost":
            require(yes <= no, f"{mid}: ordinary lost result is consistent with For <= Against")

# Known material correction from official Nov. 18-19, 2024 minutes.
removed_2024_ids = {
    "2024-11-trinity-overnight-264000",
    "2024-11-trinity-daytime-240000",
    "2024-11-hsf-360000",
    "2024-11-brock-worker-280000",
}
require(not (removed_2024_ids & set(motion_ids)), "Superseded 2024 item-level homelessness vote records are absent")
package = next((m for m in motions if m["motion_id"] == "2024-11-homelessness-budget-package"), None)
require(package is not None, "Corrected 2024 homelessness package motion exists")
if package:
    require((package["yes_count"], package["no_count"], package["absent_count"]) == ("9", "1", "1"), "Corrected 2024 homelessness package is recorded 9-1 with one absent")
    p_votes = {r["member"]: r["vote"] for r in votes_by_motion[package["motion_id"]]}
    require(p_votes.get("Andrew Beamer") == "Against", "Corrected 2024 package records Andrew Beamer Against")
    require(p_votes.get("Don Vassiliadis") == "Absent", "Corrected 2024 package records Don Vassiliadis Absent")

# Primary-source regression checks for additional high-visibility motions rechecked during Pass 11.
# These expected values come from the linked official City minutes and protect against
# accidental changes to the public archive after this review.
regression_votes = {
    "2025-11-police-seven-percent": {
        "result": "Lost", "counts": (4, 7, 0, 0),
        "For": {"Andrew Beamer", "Alex Bierk", "Joy Lachica", "Keith Riel"},
    },
    "2025-11-police-return-board": {
        "result": "Carried", "counts": (6, 5, 0, 0),
        "For": {"Alex Bierk", "Matt Crowley", "Dave Haacke", "Joy Lachica", "Keith Riel", "Don Vassiliadis"},
    },
    "2025-11-legacy-three-million": {
        "result": "Carried", "counts": (11, 0, 0, 0),
    },
    "2025-06-trinity-overnight-269280": {
        "result": "Lost", "counts": (5, 5, 1, 0),
        "For": {"Gary Baldwin", "Alex Bierk", "Matt Crowley", "Joy Lachica", "Keith Riel"},
        "Absent": {"Dave Haacke"},
    },
    "2025-06-housing-stability-250000": {
        "result": "Carried", "counts": (10, 0, 1, 0), "Absent": {"Dave Haacke"},
    },
    "2025-06-brock-285600": {
        "result": "Carried", "counts": (10, 0, 1, 0), "Absent": {"Dave Haacke"},
    },
    "2025-06-trinity-daytime-244800": {
        "result": "Lost", "counts": (5, 5, 1, 0),
        "For": {"Gary Baldwin", "Alex Bierk", "Matt Crowley", "Joy Lachica", "Keith Riel"},
        "Absent": {"Dave Haacke"},
    },
    "2025-02-free-transit-youth-33400": {
        "result": "Carried", "counts": (10, 1, 0, 0), "Against": {"Andrew Beamer"},
    },
    "2025-02-climate-coordinator-eliminate": {
        "result": "Carried", "counts": (9, 2, 0, 0), "Against": {"Alex Bierk", "Joy Lachica"},
    },
    "2024-05-heritage-deadline-extension": {
        "result": "Carried", "counts": (10, 1, 0, 0), "Against": {"Dave Haacke"},
    },
    "2024-04-bonnerworth-alternatives": {
        "result": "Lost", "counts": (3, 8, 0, 0), "For": {"Alex Bierk", "Joy Lachica", "Keith Riel"},
    },
    "2023-11-service-grants-43800": {
        "result": "Carried", "counts": (6, 5, 0, 0),
        "For": {"Gary Baldwin", "Alex Bierk", "Matt Crowley", "Joy Lachica", "Jeff Leal", "Keith Riel"},
    },
    "2023-11-bonnerworth-design-250k": {
        "result": "Carried", "counts": (11, 0, 0, 0),
    },
    "2025-02-24-brock-council-strong-mayor": {
        "result": "Carried", "counts": (4, 7, 0, 0),
        "For": {"Gary Baldwin", "Kevin Duguay", "Jeff Leal", "Lesley Parnell"},
    },
}
motion_by_id = {m["motion_id"]: m for m in motions}
for mid, expected_regression in regression_votes.items():
    motion = motion_by_id.get(mid)
    require(motion is not None, f"Primary-source regression motion exists: {mid}")
    if not motion:
        continue
    counts = tuple(int(motion[k] or 0) for k in ("yes_count", "no_count", "absent_count", "conflict_count"))
    require(motion["result"] == expected_regression["result"], f"{mid}: primary-source regression result matches")
    require(counts == expected_regression["counts"], f"{mid}: primary-source regression counts match")
    actual_members = defaultdict(set)
    for row in votes_by_motion[mid]:
        actual_members[row["vote"]].add(row["member"])
    for label in ("For", "Against", "Absent", "Conflict"):
        if label in expected_regression:
            require(actual_members[label] == expected_regression[label], f"{mid}: primary-source regression {label} members match")

# Strong-mayor action cross references.
strong_actions = read_csv("data/facts/fact_strong_mayor_action.csv")
for action in strong_actions:
    related = [x for x in (action.get("related_motion_ids") or "").split("|") if x]
    for mid in related:
        require(mid in set(motion_ids), f"{action['action_id']}: related motion {mid} exists")

# Outcome integrity.
outcomes = read_csv("data/facts/fact_outcome_metric.csv")
outcome_keys = [(r["domain_id"], r["metric_id"], r["period"]) for r in outcomes]
require(len(outcome_keys) == len(set(outcome_keys)), "Outcome domain/metric/period keys are unique")
for row in outcomes:
    require(row["source_id"] in sources, f"Outcome {row['metric_id']} {row['period']}: source exists")
    try:
        float(row["value"])
    except ValueError:
        errors.append(f"Outcome {row['metric_id']} {row['period']}: value is numeric")

def outcome(metric_id: str, period: str):
    return next((r for r in outcomes if r["metric_id"] == metric_id and r["period"] == period), None)

crime24 = outcome("cma_crime_rate", "2024")
crime25 = outcome("cma_crime_rate", "2025")
crime_yoy = outcome("cma_crime_rate_yoy", "2025")
require(crime24 and float(crime24["value"]) == 5368, "StatsCan 2024 Peterborough CMA crime-rate display value is 5,368")
require(crime25 and float(crime25["value"]) == 5385, "StatsCan 2025 Peterborough CMA crime-rate display value is 5,385")
require(crime_yoy and float(crime_yoy["value"]) == 1, "StatsCan published 2024-to-2025 Peterborough CMA crime-rate change is +1%")

# Service-series integrity and 2026 tax-levy bridge.
services = read_csv("data/facts/fact_service_net_requirement.csv")
service_keys = [(r["service_id"], r["fiscal_year"]) for r in services]
require(len(service_keys) == len(set(service_keys)), "Service/fiscal-year keys are unique")
for row in services:
    require(row["source_id"] in sources, f"Service {row['service_id']} {row['fiscal_year']}: source exists")

service_2026 = {(r["service_id"]): int(r["amount_cad"]) for r in services if r["fiscal_year"] == "2026"}
bridges = read_csv("data/facts/fact_service_tax_levy_2026.csv")
require(len(bridges) == 4, "2026 service-to-tax-levy bridge contains four major verified services")
for row in bridges:
    sid = row["service_id"]
    before = int(row["net_requirement_before_indirect_revenues_cad"])
    indirect = int(row["allocated_indirect_revenue_cad"])
    levy = int(row["net_tax_levy_cad"])
    require(service_2026.get(sid) == before, f"{sid}: service trend amount matches 2026 Net Requirement Before Indirect Revenues")
    require(before + indirect == levy, f"{sid}: Net Requirement + Allocated Indirect Revenue = Net Tax Levy")
    require(row["source_id"] == "budget-2026", f"{sid}: accounting bridge cites final 2026 Budget Book")

expected_bridge = {
    "social_services": (16_700_452, -1_106_984, 15_593_468),
    "fire": (21_097_276, -1_398_426, 19_698_850),
    "capital_financing": (41_295_653, -15_077_269, 26_218_384),
    "police": (41_286_366, -2_736_654, 38_549_712),
}
for row in bridges:
    actual = (
        int(row["net_requirement_before_indirect_revenues_cad"]),
        int(row["allocated_indirect_revenue_cad"]),
        int(row["net_tax_levy_cad"]),
    )
    require(actual == expected_bridge[row["service_id"]], f"{row['service_id']}: 2026 accounting bridge matches primary-source table values")

# Budget backbone and source-level discrepancy disclosure.
budget_rows = read_csv("data/facts/fact_budget_overview.csv")
require(len({r["fiscal_year"] for r in budget_rows}) == len(budget_rows), "Budget backbone has one row per fiscal year")
for row in budget_rows:
    require(int(row["gross_operating_expenditure_cad"]) > int(row["taxation_revenue_cad"]), f"Budget {row['fiscal_year']}: gross expenditures exceed taxation revenue")
    require(row["source_id"] in sources, f"Budget {row['fiscal_year']}: source exists")

b2026 = next((r for r in budget_rows if r["fiscal_year"] == "2026"), None)
require(b2026 and int(b2026["gross_operating_expenditure_cad"]) == 454_163_028, "2026 budget backbone uses final Budget Book gross-operating total $454,163,028")
require(b2026 and int(b2026["taxation_revenue_cad"]) == 198_379_745, "2026 budget backbone uses final Budget Book taxation revenue $198,379,745")

quality = read_csv("data/facts/fact_data_quality_note.csv")
quality_ids = {r["note_id"] for r in quality}
for required_id in {
    "vote-2024-homelessness-package",
    "crime-rate-2025-rounding",
    "budget-2026-operating-total",
    "budget-2026-net-levy-bridge",
}:
    require(required_id in quality_ids, f"Public correction/source-note log contains {required_id}")

# Generated metadata, if data:build has been run.
metadata_path = SITE / "src" / "data" / "metadata.json"
if metadata_path.exists():
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    require(metadata.get("verifiedMotionCount") == len(motions), "Generated metadata motion count matches fact_motion.csv")
    require(metadata.get("outcomeMetricCount") == len(outcomes), "Generated metadata outcome count matches fact_outcome_metric.csv")
    require(metadata.get("lastBuilt") == "2026-09-20", "Generated metadata lastBuilt is 2026-09-20")
else:
    warnings.append("Generated metadata.json not found; run npm run data:build before deployment.")

# Report.
status = "PASS" if not errors else "FAIL"
report = {
    "status": status,
    "checked_at": "2026-09-20",
    "motions": len(motions),
    "vote_rows": len(votes),
    "outcome_observations": len(outcomes),
    "service_rows": len(services),
    "checks_passed": len(checks),
    "errors": errors,
    "warnings": warnings,
}
(REPORTS / "pre_release_validation.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

md = [
    "# Pre-release validation report",
    "",
    f"**Status:** {status}",
    "",
    "**Review date:** 2026-09-20",
    "",
    f"- Motions: {len(motions)}",
    f"- Member-vote rows: {len(votes)}",
    f"- Outcome observations: {len(outcomes)}",
    f"- Service-series rows: {len(services)}",
    f"- Automated assertions passed: {len(checks)}",
    "",
    "## Automated scope",
    "",
    "The validator checks source-manifest integrity, vote-member reconciliation, vote-count arithmetic, ordinary carried/lost logic, Strong Mayor cross-references, outcome/source uniqueness, the Statistics Canada crime-rate correction, the 2026 service-to-tax-levy accounting bridge, the budget backbone, the public correction log, and fixed regression expectations for 14 high-visibility motions rechecked against official City records.",
    "",
    "## Primary-source rechecks completed in the pre-release review",
    "",
    "- City of Peterborough 2026 final Budget Book: gross operating total, taxation revenue, and the 2026 Net Requirement Before Indirect Revenues / Allocated Indirect Revenue / Net Tax Levy bridge for Police, Capital Financing, Social Services and Fire.",
    "- Statistics Canada 2025 CMA crime table: Peterborough CSI 57.3 (-6%), crime rate 5,385, published crime-rate change +1%.",
    "- City of Peterborough General Committee minutes for Nov. 18-19, 2024: the four homelessness funding items were one combined motion carried 9-1; the archive was corrected accordingly.",
    "- Additional official-minute spot checks were converted into regression assertions for 2025 budget votes, June 2025 homelessness votes, February 2025 transit/climate votes, 2024 heritage and Bonnerworth votes, 2023 budget votes, and the February 2025 Brock Mission Strong Mayor vote.",
    "",
    "## Important limitation",
    "",
    "This automated report proves internal consistency and records the primary-source rechecks above. It does not cryptographically prove that every external source URL will remain reachable or that every public document will remain unchanged after publication. The portal therefore keeps source links and a public correction log visible.",
]
if errors:
    md += ["", "## Errors", ""] + [f"- {e}" for e in errors]
if warnings:
    md += ["", "## Warnings", ""] + [f"- {w}" for w in warnings]
(REPORTS / "pre_release_validation.md").write_text("\n".join(md) + "\n", encoding="utf-8")

print(json.dumps(report, indent=2))
sys.exit(1 if errors else 0)
