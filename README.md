# vote-aj

AJ Shearer campaign site, built with Astro and deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Astro outputs the static site to `dist/`.

## Peterborough By The Numbers

The public dashboard lives under:

- `/data`
- `/data/budget`
- `/data/votes`
- `/data/kiosk`

The dimensional data project lives in `data-warehouse/`. Public, precomputed JSON consumed by Astro lives in `public/data/`.

The current public JSON is committed deliberately so Vercel does not need Python or DuckDB at runtime. The warehouse can be rebuilt locally as the ETL is expanded.

### Current foundation status

- 2022 Approved operating summary seed
- 2023 Recommended operating summary seed
- 2024 audited financial statement seed
- current councillor dimension
- controlled topic taxonomy
- vote fact table/schema ready; official motion/vote ingestion is the next phase

## Vercel

This repo should use Astro's normal file-based routes. The old SPA catch-all rewrite has been removed because it would route `/data/*`, `/priorities`, `/resume`, etc. back to `/`.

### Refreshing generated dashboard data

After changing the seed/config files in `data-warehouse/`, regenerate both the Astro import copies and public JSON copies with:

```bash
npm run data:build
```

Then test and deploy normally:

```bash
npm run build
git add .
git commit -m "Update Peterborough By The Numbers"
git push
```


## Data population pass 1 — 2026-09-11

Populated the 2022–2026 operating-budget backbone, source-reported department totals, reconciliation checks, a preliminary department crosswalk, and the final 2026 tax-levy driver dataset.

New public data exports:
- budget-overview.json
- budget-departments-reported.json
- budget-reconciliation.json
- department-crosswalk.json
- tax-drivers-2026.json
- tax-driver-detail-2026.json

New route:
- /data/tax-drivers

Normalization status: five-year totals are usable; top-level department comparisons remain source-reported until service-level crosswalks are completed. 2024 has a $203 extraction discrepancy and remains flagged for page-level verification.


## Data population pass 2 — 2026-09-11

The public data section now includes:

- A five-year approved/final operating-budget backbone for 2022–2026.
- 11 normalized stable-service net-requirement series.
- A dedicated 2026 Legacy Fund explainer that separates regular investment-income use for capital from the additional one-time $3M Legacy Income Retention reserve levy offset.
- Legacy Income Retention reserve-history snapshots for Oct. 2023, Oct. 2024 and Oct. 2025.
- A preliminary 2027 base-budget correction flag tied to the one-time 2026 reserve use.

Service trends that cross material organizational boundaries are intentionally withheld until their crosswalks can be defended.

## Data population pass 3 — 2026-09-11

- Published qualified 2023–2026 Public Works and Recreation/Parks/Culture series instead of forcing a false 2022 bridge.
- Added the first verified Council Vote Explorer dataset with individual member votes, topic tags, funding context and official-minute links.
- Preserved committee-stage vs final-Council decision labels.

## Data population pass 4 — 2026-09-11

- Corrected the Legacy Fund levy-offset history: the final 2024 budget used $1.31M of accumulated Legacy Fund income for tax-rate relief ($800K during Finance Committee plus $510K at final Council), the 2025 budget did not carry that support forward, and the 2026 budget used a larger $3M one-time offset.
- Added `legacy-levy-offset-history.json` and a multi-year Legacy timeline to `/data/tax-drivers`.
- Decomposed Public Works into Yard, Winter Control, Surface Services, Forestry/Parks and Urban Forest components for 2023–2026.
- Flagged the 2024→2025 Public Works jump as a structural/accounting break rather than presenting the full increase as organic service-cost growth.
- Added sourced Public Works annotations for the municipal-lot snow-plowing transition: $473,309 of existing budget transferred into Public Works, $431,501 of additional 2025 operating cost, plus $68,000 initiated in 2024.
- Expanded the verified vote archive to 29 motions / 319 individual member-vote records, including 2024 heritage/asset-management and 2025 governance decisions in addition to the existing budget, tax, transit, policing, homelessness and reserve records.
- Improved the vote UI so multi-component financial decisions are not mislabeled as “not quantified,” and surfaced contextual notes directly on vote cards.
