# Build Status — Starter Package

## Complete
- Dimensional schema drafted
- 2022–2026 fiscal-year dimension
- Current Mayor/Council roster seeded
- Topic taxonomy seeded
- Significance rules seeded
- Official-source registry started
- Budget staging template created
- Motion/vote staging templates created
- 2022 approved / 2023 recommended top-level operating summary seed rows added from the City's 2023 operating book
- 2024 audited financial-statement summary seed rows added
- Initial analytical SQL examples created

## Next ingestion work
1. Reconstruct final/adopted 2023, 2024 and 2025 operating values, carefully distinguishing draft vs final.
2. Extract 2026 final operating hierarchy.
3. Create department/service crosswalk for organizational restructures between years.
4. Calculate 2022–2026 tax/spending drivers.
5. Enumerate current-term Council meetings and extract recorded votes.
6. Human-review significant votes and financial-impact links before publication.


## 2026-09-11 — Population pass 1
- Five-year gross operating and taxation backbone: complete.
- Source-reported department structures: extracted for 2022–2026.
- Reconciliation: 2025 exact; 2022/2023/2026 trivial rounding/extraction differences; 2024 flagged ($203).
- 2026 tax levy driver categories: exact reconciliation to $14,546,695 levy increase.
- Service-level normalization: next phase.
- Council vote ingestion: not started.

## 2026-09-11 — Population pass 2
- Legacy Fund display classification: complete.
  - Regular 2026 Legacy investment income to capital: $1.5M (recurring policy use).
  - Additional 2026 Legacy Income Retention reserve offset: $3.0M (one-time levy offset).
  - Preliminary 2027 base-budget correction associated with the one-time draw: +$3.0M.
  - Legacy Income Retention reserve history loaded for Oct. 2023, Oct. 2024 and Oct. 2025.
- Stable service normalization: 11 five-year series complete.
  - Police Services
  - Capital Financing Costs
  - Fire Services
  - Social Services
  - Transit
  - Environmental Services
  - Peterborough Airport
  - Peterborough Public Library
  - Peterborough County/City Paramedics
  - Public Health (medium comparability; successor health-unit transition noted)
  - Fairhaven
- Service trend measure: budgeted net requirement (service expenditures less direct service revenues), not the final city-wide tax levy.
- Scope-break queue intentionally withheld from apples-to-apples display:
  - Public Works / Engineering / Parks & Forestry boundary changes
  - Recreation / Parks / Culture scope transfers
  - Reorganized corporate / finance / legislative divisions
  - Planning / growth / building / economic-development restructures
- Next ingestion work:
  1. Resolve scope-break service crosswalks above.
  2. Normalize corporate revenue/reserve/debt components so service growth can be reconciled to the tax levy.
  3. Add capital-budget series where comparability is defensible.
  4. Begin current-term Council motion and recorded-vote ingestion.
- Normalization review queue added at `data/normalization_review_queue.csv` with explicit publication rules for scope-break areas.
