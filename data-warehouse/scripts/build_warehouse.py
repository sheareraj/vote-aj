from pathlib import Path
import csv

ROOT = Path(__file__).resolve().parents[1]

try:
    import duckdb
except ImportError as exc:
    raise SystemExit("Install dependencies first: pip install -r requirements.txt") from exc

DB = ROOT / "warehouse" / "peterborough.duckdb"
con = duckdb.connect(str(DB))
con.execute((ROOT / "warehouse" / "schema.sql").read_text(encoding="utf-8"))

# Dimension seed loads. DuckDB read_csv_auto is used deliberately so the files stay human-readable and versionable.
loads = {
    "dim_year": ROOT / "data" / "dim_year.csv",
    "dim_budget_version": ROOT / "data" / "dim_budget_version.csv",
    "dim_councillor": ROOT / "data" / "dim_councillor.csv",
    "source_registry": ROOT / "data" / "source_manifest.csv",
}

for table, path in loads.items():
    con.execute(f"DELETE FROM {table}")
    con.execute(f"INSERT INTO {table} SELECT * FROM read_csv_auto(?)", [str(path)])

# Topic CSV has the same columns as dim_topic.
con.execute("DELETE FROM dim_topic")
con.execute("INSERT INTO dim_topic SELECT * FROM read_csv_auto(?)", [str(ROOT / 'config' / 'topic_taxonomy.csv')])

print(f"Warehouse initialized: {DB}")
print("Next ETL step: normalize data/seed/stg_budget_seed.csv into dim_department + fact_budget.")
