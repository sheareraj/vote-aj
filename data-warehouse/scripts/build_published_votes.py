from __future__ import annotations

from pathlib import Path
import csv
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def read_csv(path: Path):
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def as_int(value, default=0):
    if value in (None, ""):
        return default
    return int(value)

motions = read_csv(DATA / "facts" / "fact_motion.csv")
votes = read_csv(DATA / "facts" / "fact_vote.csv")
sources = {r["source_id"]: r for r in read_csv(DATA / "source_manifest.csv")}

votes_by_motion: dict[str, list[dict[str, str]]] = {}
for row in votes:
    votes_by_motion.setdefault(row["motion_id"], []).append({"member": row["member"], "vote": row["vote"]})

payload = []
for m in motions:
    amount = None if m.get("financial_amount_cad", "") == "" else int(m["financial_amount_cad"])
    src = sources.get(m["source_id"], {})
    payload.append({
        "id": m["motion_id"],
        "meeting_date": m["meeting_date"],
        "meeting_date_display": m["meeting_date_display"],
        "meeting_type": m["meeting_type"],
        "decision_stage": m["decision_stage"],
        "title": m["title"],
        "summary": m["summary"],
        "motion_text": m.get("motion_text", ""),
        "mover": m["mover"],
        "result": m["result"],
        "yes_count": as_int(m["yes_count"]),
        "no_count": as_int(m["no_count"]),
        "conflict_count": as_int(m["conflict_count"]),
        "absent_count": as_int(m["absent_count"]),
        "topic_ids": [x for x in m["topic_ids"].split("|") if x],
        "primary_topic_id": m["primary_topic_id"],
        "financial_impact": {
            "status": m["financial_status"],
            "amount_cad": amount,
            "direction": m["financial_direction"] or None,
            "timing": m["financial_timing"] or None,
            "funding_source": m["funding_source"] or None,
        },
        "votes": votes_by_motion.get(m["motion_id"], []),
        "source_id": m["source_id"],
        "source_url": m["source_url"],
        "source_label": "Official City of Peterborough minutes" if src.get("source_type") == "council_minutes" else src.get("document_name", "Official City source"),
        "review_status": m["review_status"],
        "significance": [x for x in m["significance"].split("|") if x],
        "notes": m.get("notes", ""),
    })

payload.sort(key=lambda x: (x["meeting_date"], x["id"]), reverse=True)
(DATA / "published_votes.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"wrote {DATA / 'published_votes.json'} ({len(payload)} motions)")
