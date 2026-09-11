from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
try:
    import duckdb
except ImportError as exc:
    raise SystemExit("Install dependencies first: pip install -r requirements.txt") from exc

con = duckdb.connect(str(ROOT / "warehouse" / "peterborough.duckdb"), read_only=True)
out = ROOT / "public" / "data"
out.mkdir(parents=True, exist_ok=True)

queries = {
    "councillors.json": """
        SELECT councillor_id, display_name, role, ward_number, ward_name
        FROM dim_councillor WHERE current_member = TRUE
        ORDER BY COALESCE(ward_number, 0), role, display_name
    """,
    "topics.json": """
        SELECT topic_id, public_label, parent_topic_id, description
        FROM dim_topic ORDER BY topic_id
    """,
}

for filename, query in queries.items():
    rows = con.execute(query).fetchdf().to_dict(orient="records")
    (out / filename).write_text(json.dumps(rows, indent=2, default=str), encoding="utf-8")
    print("wrote", out / filename)
