-- Compare gross expenditure by normalized department between two versions/years.
SELECT
    department_id,
    SUM(CASE WHEN fiscal_year = 2022 THEN amount ELSE 0 END) AS amount_2022,
    SUM(CASE WHEN fiscal_year = 2026 THEN amount ELSE 0 END) AS amount_2026,
    amount_2026 - amount_2022 AS change_dollars,
    CASE WHEN amount_2022 <> 0 THEN (amount_2026 / amount_2022 - 1) * 100 END AS change_percent
FROM fact_budget
WHERE measure_type = 'gross_expenditure'
  AND budget_version_id IN ('approved','adopted')
GROUP BY department_id
ORDER BY change_dollars DESC;
