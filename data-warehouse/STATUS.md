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
