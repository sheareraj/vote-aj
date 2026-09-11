# Peterborough By The Numbers — Data Warehouse Starter

Purpose: create an auditable, version-controlled municipal data warehouse for a public budget and Council-vote explorer.

## Design principles

1. Official City of Peterborough sources are authoritative.
2. Raw facts are stored separately from interpretation.
3. Every published number/vote should be traceable to a source URL and, where possible, page/item identifiers.
4. Budget versions are explicit (approved, adopted, recommended, draft, actual) so proposed figures are never silently presented as final.
5. Motion financial impacts carry a confidence/status field; unknown is preferred over invented precision.
6. The public Astro site should consume precomputed JSON/Parquet marts, so the kiosk can run quickly and can be made offline-capable.

## Initial scope

- Fiscal years: 2022–2026
- Current Council term voting records
- Operating budget first; capital and audited actuals next
- Initial significance rule: split vote OR identified financial impact >= $250,000 OR recurring financial impact OR major policy/capital/tax decision

## Folder layout

- `config/` controlled taxonomies and rules
- `data/raw/` source documents or source snapshots (not included in this starter package)
- `data/seed/` validated starter rows used to prove the schema
- `data/templates/` staging import templates
- `warehouse/` dimensional model DDL and data dictionary
- `sql/` analytical marts/queries
- `scripts/` ETL/build scripts
- `public/` generated JSON intended for Astro/Vercel

## First pipeline

1. Ingest source metadata from `data/source_manifest.csv`.
2. Extract budget tables into `stg_budget.csv` without changing source wording.
3. Normalize departments/services into dimensions.
4. Load `fact_budget` with a `budget_version_id` on every row.
5. Extract meetings/motions and then one row per member per recorded vote.
6. Tag motions with controlled topics and financial-impact confidence.
7. Export public marts to `public/data/*.json`.

## Important warning on budget versions

Several files linked by the City's historical budget page are named "draft" even though the page labels them as that year's budget book. The warehouse therefore treats source version as a first-class field. Final/adopted figures must be confirmed from adoption material, later-year approved comparatives, or other official final records before being labelled adopted.
