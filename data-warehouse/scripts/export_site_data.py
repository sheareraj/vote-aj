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
        "status": "foundation",
        "scope": "2022-2026",
        "budgetDataStatus": "2022 approved + 2023 recommended seed; 2024 audited statements seed; 2024-2026 normalization in progress",
        "voteDataStatus": "schema and councillor dimensions loaded; motion/vote ingestion pending",
        "authoritativeSourcePolicy": "City of Peterborough official documents and minutes are authoritative.",
        "lastBuilt": "2026-09-10",
    },
)
