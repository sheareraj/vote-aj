# Peterborough By The Numbers — Pass 7

## Display change requested

- The Strong Mayor Powers timeline remains fully available and filterable as its own vote topic.
- The dedicated Strong Mayor section now appears **after** Vote Insights and the main searchable Vote Explorer at the bottom of `/data/votes`.
- A short explanation separates the strong-mayor decision framework from ordinary majority-rule Council decisions.

## New outcomes/KPI layer

Added `/data/outcomes` and linked it from the data landing page and desktop data navigation.

The first outcome domains are:

1. Housing creation — provincial annual housing targets vs City-reported housing progress (2023-2025).
2. Transit — 2023 overall ridership, 2025 3.7M+ ridership, and Jan-Sep 2025 adult-ridership growth.
3. Police/public safety — 2024 Crime Severity Index plus first-year Community F.I.R.S.T. activity/output measures.
4. Infrastructure — roads condition, replacement value/high-risk assets, and 2025 Asset Management Plan annual capital shortfalls.
5. Housing/homelessness — RGI waitlist and wait time, 2023 RGI placements, and average By-Name List system pressure.

## Interpretation safeguards

- Budget context is shown beside outcomes but is explicitly labelled **not attribution**.
- The page states that correlation does not establish that additional spending caused a particular outcome.
- Scope notes identify City-only, police-service-area, City asset, and Peterborough City-and-County service-manager measures.
- Social Services is explicitly described as broader than homelessness spending.
- Crime Severity Index is presented as a community crime measure rather than a police-productivity score.
- Community F.I.R.S.T. arrests/calls/diversions are labelled outputs, not proof of crimes prevented.
- Asset condition is described as a mix of observed and age-based information where applicable.

## Data model

New warehouse inputs:

- `data-warehouse/data/dim_outcome_domain.csv`
- `data-warehouse/data/facts/fact_outcome_metric.csv`

`npm run data:build` now generates `outcomes.json` into both `src/data/` and `public/data/`.

## Current counts

- 5 outcome domains
- 26 sourced outcome observations
- 39 verified recorded motions retained from Pass 6
- 13 published Strong Mayor actions retained from Pass 6
