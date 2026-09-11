# Data Dictionary

## Budget fact grain

One row represents one numeric budget measure for one fiscal year, budget version, organizational/service/account combination and funding source.

Examples of `measure_type`:
- `gross_expenditure`
- `gross_revenue`
- `net_expenditure`
- `tax_levy`
- `other_revenue`
- `capital_project_cost`
- `capital_funding`

## Vote fact grain

One row represents one Council member's recorded position on one motion. This avoids storing a whole roll-call as a single text field and makes member/topic comparisons straightforward.

Allowed `vote_value` values initially:
- `yes`
- `no`
- `absent`
- `abstain`
- `conflict`
- `not_recorded`

## Motion financial impact

`financial_impact_status`:
- `known` — explicitly stated in official material
- `derived` — can be calculated directly from official numbers
- `none_stated` — official report states no financial impact
- `unknown` — impact may exist but is not defensibly quantifiable

`financial_impact_direction`:
- `increase`
- `decrease`
- `transfer`
- `reallocate`
- `revenue_increase`
- `revenue_decrease`
- `neutral`
- `unknown`

## Review workflow

`review_status`:
- `unreviewed`
- `machine_checked`
- `human_checked`
- `published`
- `needs_review`

No row should appear in a public "significant vote" feature unless the relevant motion and vote rows are at least `human_checked`.
