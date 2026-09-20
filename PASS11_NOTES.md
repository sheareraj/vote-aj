# Pass 11 — Pre-release data-quality audit

## Goal
Reduce factual and presentation risk before public release by reconciling the highest-risk accounting definitions, correcting a material vote-archive issue, using Statistics Canada’s published annual crime-rate change, and adding a visible methodology/correction layer.

## Material corrections

### 1. 2024 homelessness budget vote
The archive previously represented four funding items as four separate recorded votes. The official Nov. 18–19, 2024 General Committee minutes show that the four items were components of **one combined motion**, carried **9–1**.

The four item-level motion records were removed and replaced with one package record:
- Trinity overnight: $264,000
- Housing Stability Fund: $360,000
- Brock Mission worker/capacity: $280,000
- Trinity daytime: $240,000
- Package total: $1,144,000 from the Social Services Reserve

The recorded vote is represented as 9 For, 1 Against and 1 member absent/not listed in the recorded vote.

### 2. 2025 Peterborough CMA crime-rate change
Statistics Canada publishes Peterborough CMA’s 2025 crime rate as 5,385 per 100,000 and the 2024-to-2025 annual change as **+1%**. The portal previously derived approximately +0.3% from the rounded displayed rates (5,368 and 5,385). It now uses Statistics Canada’s published +1% change and explains why the rounded values do not reproduce the agency’s underlying-series calculation.

### 3. Service trend vs. property-tax levy
The normalized service series is now labelled with the City’s exact measure: **Net Requirement Before Indirect Revenues**. This is not the same as the final **Net Tax Levy** attributed to the service.

A 2026 accounting bridge was added for Police, Capital Financing, Social Services and Fire showing:
- Net Requirement Before Indirect Revenues
- Allocated Indirect Revenue
- Net Tax Levy

### 4. 2026 operating-total source discrepancy
The detailed final 2026 Budget Book reports gross operating expenditures of **$454,163,028**. The City’s budget-adoption release summarizes **$453.9 million** in spending on municipal services. The portal keeps the exact final-budget-book chart value and publicly flags the difference rather than silently treating the two presentations as identical.

## New public transparency features
- New `/data/methodology` page.
- Visible methodology/corrections link in the data header.
- Public correction/source-note log.
- Clear budget definitions.
- Explicit vote-integrity rules.
- “Report a data issue” contact link.

## Data-pipeline changes
- Added `fact_service_tax_levy_2026.csv`.
- Added `fact_data_quality_note.csv`.
- Updated the canonical Node exporter to publish both datasets and refreshed metadata.
- Replaced the stale duplicate Python exporter with a compatibility wrapper that invokes the canonical Node exporter.
- Added `data-warehouse/scripts/validate_release.py`.
- Added `npm run data:validate` and `npm run data:preflight`.

## Validation result
`npm run data:build` and `npm run data:validate` both pass.

Current validation summary:
- 36 motion records
- 396 member-vote rows
- 41 outcome observations
- 88 service-series rows
- 704 automated assertions passed
- 0 errors
- 0 warnings

The validator checks source-manifest integrity, motion/member-vote reconciliation, vote-count arithmetic, ordinary carried/lost logic, Strong Mayor cross-references, outcome/source uniqueness, the Statistics Canada correction, the 2026 service-to-tax-levy bridge, the budget backbone and the public correction log. It also contains fixed regression checks for 14 high-visibility motions rechecked against official City records during this pass.

## Important validation boundary
The automated PASS establishes **internal consistency** and the specific primary-source rechecks documented above. It is not a cryptographic or legal certification of every external document. The portal therefore keeps primary-source links, methodology notes and the correction log visible.

## Production-build check
A full Astro production build was not completed in this sandbox because the archive did not contain installed npm dependencies and the networked `npm ci` attempt could not complete. This is the same environment limitation noted in Pass 10.

Before deployment, run on the normal development/Vercel environment:

```bash
npm ci
npm run data:preflight
```

`data:preflight` rebuilds the public data, runs the validation suite and then runs `astro build`.
