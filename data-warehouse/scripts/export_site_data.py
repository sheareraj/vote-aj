from __future__ import annotations

from pathlib import Path
import csv
import json

WAREHOUSE = Path(__file__).resolve().parents[1]
SITE = WAREHOUSE.parent
TARGETS = [SITE / "public" / "data", SITE / "src" / "data"]


def read_csv(path: Path):
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_json(filename: str, data):
    payload = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    for out in TARGETS:
        out.mkdir(parents=True, exist_ok=True)
        (out / filename).write_text(payload, encoding="utf-8")
        print("wrote", out / filename)


councillors = read_csv(WAREHOUSE / "data" / "dim_councillor.csv")
for row in councillors:
    row["ward_number"] = int(row["ward_number"]) if row["ward_number"] else None
    row["current_member"] = row["current_member"].lower() == "true"
write_json("councillors.json", councillors)

write_json("topics.json", read_csv(WAREHOUSE / "config" / "topic_taxonomy.csv"))

# Five-year operating budget backbone (approved/final figures)
overview = read_csv(WAREHOUSE / "data" / "facts" / "fact_budget_overview.csv")
for row in overview:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["gross_operating_expenditure_cad"] = int(row["gross_operating_expenditure_cad"])
    row["taxation_revenue_cad"] = int(row["taxation_revenue_cad"])
write_json("budget-overview.json", overview)

departments = read_csv(WAREHOUSE / "data" / "facts" / "fact_department_reported.csv")
for row in departments:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["amount_cad"] = int(row["amount_cad"])
write_json("budget-departments-reported.json", departments)

reconciliation = read_csv(WAREHOUSE / "data" / "reconciliation.csv")
for row in reconciliation:
    row["fiscal_year"] = int(row["fiscal_year"])
    for key in ["published_total_cad", "extracted_department_sum_cad", "difference_cad"]:
        row[key] = int(row[key])
write_json("budget-reconciliation.json", reconciliation)

crosswalk = read_csv(WAREHOUSE / "data" / "dim_department_crosswalk.csv")
for row in crosswalk:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["confidence"] = float(row["confidence"])
write_json("department-crosswalk.json", crosswalk)


tax_drivers = read_csv(WAREHOUSE / "data" / "facts" / "fact_tax_levy_driver_2026.csv")
for row in tax_drivers:
    row["order_key"] = int(row["order_key"])
    row["amount_cad"] = int(row["amount_cad"])
    row["impact_pct_of_2025_levy"] = float(row["impact_pct_of_2025_levy"])
write_json("tax-drivers-2026.json", tax_drivers)

tax_driver_detail = read_csv(WAREHOUSE / "data" / "facts" / "fact_tax_levy_driver_detail_2026.csv")
for row in tax_driver_detail:
    row["amount_cad"] = int(row["amount_cad"])
    row["impact_pct_of_2025_levy"] = float(row["impact_pct_of_2025_levy"])
write_json("tax-driver-detail-2026.json", tax_driver_detail)

service_requirements = read_csv(WAREHOUSE / "data" / "facts" / "fact_service_net_requirement.csv")
for row in service_requirements:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["amount_cad"] = int(row["amount_cad"])
write_json("service-net-requirements.json", service_requirements)

legacy = read_csv(WAREHOUSE / "data" / "facts" / "fact_legacy_2026.csv")
for row in legacy:
    row["amount_cad"] = int(row["amount_cad"])
write_json("legacy-2026.json", legacy)

legacy_reserve = read_csv(WAREHOUSE / "data" / "facts" / "fact_legacy_reserve_history.csv")
for row in legacy_reserve:
    for key in ["reserve_balance_cad", "commitments_cad", "uncommitted_cad"]:
        row[key] = int(row[key])
write_json("legacy-reserve-history.json", legacy_reserve)

legacy_offsets = read_csv(WAREHOUSE / "data" / "facts" / "fact_legacy_levy_offsets.csv")
for row in legacy_offsets:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["amount_cad"] = int(row["amount_cad"])
    row["component_count"] = int(row["component_count"])
    row["known_tax_rate_effect_pct_points"] = float(row["known_tax_rate_effect_pct_points"]) if row["known_tax_rate_effect_pct_points"] else None
    row["follow_on_year"] = int(row["follow_on_year"]) if row["follow_on_year"] else None
write_json("legacy-levy-offset-history.json", legacy_offsets)

public_works = read_csv(WAREHOUSE / "data" / "facts" / "fact_public_works_components.csv")
for row in public_works:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["amount_cad"] = int(row["amount_cad"])
    row["total_net_requirement_cad"] = int(row["total_net_requirement_cad"])
write_json("public-works-components.json", public_works)

public_works_annotations = read_csv(WAREHOUSE / "data" / "facts" / "fact_public_works_annotations.csv")
for row in public_works_annotations:
    row["effective_year"] = int(row["effective_year"])
    row["amount_cad"] = int(row["amount_cad"])
write_json("public-works-annotations.json", public_works_annotations)

budget = read_csv(WAREHOUSE / "data" / "seed" / "stg_budget_seed.csv")
for row in budget:
    row["fiscal_year"] = int(row["fiscal_year"])
    row["amount_cad"] = int(row["amount_cad"])
    row["source_page"] = int(row["source_page"]) if row["source_page"] else None
write_json("budget-seed.json", budget)

actuals = read_csv(WAREHOUSE / "data" / "seed" / "stg_actuals_2024_seed.csv")
for row in actuals:
    row["fiscal_year"] = int(row["fiscal_year"])
    for key in ["budget_amount_cad", "actual_amount_cad", "prior_actual_amount_cad"]:
        row[key] = int(row[key])
    row["source_page"] = int(row["source_page"]) if row["source_page"] else None
write_json("actuals-2024-seed.json", actuals)

# Rebuild the public vote payload from the normalized motion + member-vote facts.
import subprocess, sys
subprocess.run([sys.executable, str(WAREHOUSE / "scripts" / "build_published_votes.py")], check=True)

votes_file = WAREHOUSE / "data" / "published_votes.json"
if votes_file.exists():
    votes = json.loads(votes_file.read_text(encoding="utf-8"))
else:
    votes = []
write_json("votes.json", votes)

write_json(
    "metadata.json",
    {
        "product": "Peterborough By The Numbers",
        "status": "normalization-and-votes-pass-4",
        "scope": "2022-2026",
        "budgetDataStatus": "Approved/final 2022-2026 backbone loaded; 13 normalized service net-requirement series now published; Public Works component-level structural-break analysis added; Legacy levy-offset history corrected to include 2024 and 2026",
        "voteDataStatus": "29 verified recorded motions loaded from official City minutes, spanning tax policy, reserves, infrastructure, planning, governance, transit, recreation, health, environment, policing, library and homelessness decisions; ingestion continues",
        "authoritativeSourcePolicy": "City of Peterborough official documents and minutes are authoritative.",
        "lastBuilt": "2026-09-11",
    },
)
