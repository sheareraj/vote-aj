# Pass 6 — Strong Mayor Powers

## Added

- `Strong Mayor Powers` as a standalone topic in the controlled topic taxonomy.
- A dedicated `fact_strong_mayor_action.csv` timeline covering all 13 published City of Peterborough mayoral decisions/directions currently listed under Part VI.1 of the Municipal Act.
- A dedicated Strong Mayor explorer on `/data/votes` that separates mayoral decisions/directions from Council roll-call votes.
- Six verified recorded-vote events directly tied to the Strong Mayor mechanism:
  1. Nov. 27, 2023 — CAO responsibilities by-law following MDEC23-1 delegation (10-0, 1 absent).
  2. Dec. 11, 2023 — shorten 2024 budget amendment period after MDEC23-3 (10-0, 1 absent).
  3. Sept. 16, 2024 — Municipal Operations Commissioner appointment following MDEC24-3 delegation (10-0, 1 absent).
  4. Feb. 24, 2025 — Brock Mission General Committee recommendation under MDEC25-1 (Carried 4-7 under the >1/3 Strong Mayor threshold).
  5. Feb. 24, 2025 — Brock Mission final Council by-law vote (Carried 4-7 under the >1/3 Strong Mayor threshold).
  6. Dec. 8, 2025 — shorten 2026 budget amendment period after MDEC25-4 (7-4).

## Modelling rules

- Not every budget amendment is tagged `strong_mayor`. Only decisions where the Strong Mayor statutory mechanism itself materially governed the procedure are tagged.
- All published mayoral decisions/directions appear in the Strong Mayor timeline even where no separately verifiable public roll-call vote exists.
- A mayoral decision/direction is distinct from a Council motion. The public UI makes this distinction explicit.
- The Brock Mission 4-7 carried votes are not transcription errors. The provincial-priority Strong Mayor by-law mechanism uses a more-than-one-third passage threshold.

## QA

- 13 strong-mayor actions.
- 39 verified motions total.
- 6 motions tagged `strong_mayor`.
- 429 individual member-vote records.
- Every motion's For/Against/Conflict/Absent counts reconcile to its individual vote rows.
- 2 recorded 4-7 carried events, representing committee and final Council stages for the Brock Mission decision.
