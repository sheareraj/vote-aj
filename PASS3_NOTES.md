# Peterborough By The Numbers — Data Pass 3

## What changed

### Service normalization
- Added **Public Works (post-reorganization)** as a qualified 2023–2026 series.
- Added **Recreation, Parks & Cultural Services** as a qualified 2023–2026 canonical family, excluding the separately published Library series.
- Updated the service explorer so each row uses its own defensible comparison window instead of forcing every service back to 2022.
- Added explicit scope notes for reorganized services.
- Remaining high-risk crosswalks are Infrastructure/Planning/Growth and Corporate/Legislative/Administration.

### Council vote ingestion
- Added 14 motions tied to official City of Peterborough recorded-vote minutes.
- Initial batch emphasizes:
  - 2026 Police budget motions
  - the additional $3M Legacy reserve levy offset
  - Library collections funding amendments
  - contingency-budget amendment
  - 2025 and 2026 homelessness-program funding decisions
- Added flattened warehouse facts: `fact_motion.csv` and `fact_vote.csv`.
- Vote explorer now supports topic, councillor, result, text, and financial-impact filtering.
- Each motion displays recorded For/Against members, decision stage, known financial amount/funding source, and official-minutes link.
- No councillor score or inferred dollar impact is calculated.

## Data QA
- 13 service series / 63 service-year observations.
- Public Works comparison window: 2023–2026, $9,339,586 → $13,661,707 (+$4,322,121 / +46.3%), explicitly qualified because internal allocations changed.
- Recreation/Parks/Culture comparison window: 2023–2026, $7,737,401 → $7,073,804 (-$663,597 / -8.6%), explicitly qualified and Library excluded.
- 14 verified motion records.
- 8 split recorded votes.
- 11 motions with explicit dollar impacts.

## Deploy
```bash
npm run data:build
npm run build
git add .
git commit -m "Add Public Works Recreation normalization and verified Council votes"
git push
```

The project source and data generation step pass locally in this working environment. A full Astro compile could not be completed here because dependency installation exceeded the container network timeout; run `npm run build` in your normal local/Vercel environment before production promotion.
