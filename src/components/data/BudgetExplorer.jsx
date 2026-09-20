import React, { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function compactMoney(value) {
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return money.format(value);
}

function pctChange(start, end) {
  return ((end / start - 1) * 100).toFixed(1);
}

export default function BudgetExplorer({ overview, departments, reconciliation }) {
  const sortedOverview = useMemo(
    () => [...overview].sort((a, b) => a.fiscal_year - b.fiscal_year),
    [overview]
  );

  const [year, setYear] = useState(sortedOverview.at(-1)?.fiscal_year || 2026);
  const selectedOverview = sortedOverview.find((r) => r.fiscal_year === year);
  const selectedDepartments = departments
    .filter((r) => r.fiscal_year === year)
    .sort((a, b) => b.amount_cad - a.amount_cad);
  const selectedRecon = reconciliation.find((r) => r.fiscal_year === year);
  const maxDepartment = Math.max(...selectedDepartments.map((r) => r.amount_cad), 1);
  const maxGross = Math.max(...sortedOverview.map((r) => r.gross_operating_expenditure_cad), 1);
  const first = sortedOverview[0];
  const last = sortedOverview.at(-1);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-[#651024] p-6 text-white md:p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/65">Gross operating budget</div>
          <div className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{compactMoney(last.gross_operating_expenditure_cad)}</div>
          <div className="mt-3 text-sm font-semibold text-white/80">
            {first.fiscal_year} → {last.fiscal_year}: +{pctChange(first.gross_operating_expenditure_cad, last.gross_operating_expenditure_cad)}%
          </div>
        </div>
        <div className="rounded-3xl border border-[#decbd1] bg-[#fffafb] p-6 md:p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#651024]">Taxation revenue</div>
          <div className="mt-2 text-4xl font-black tracking-tight text-[#3a1a22] md:text-5xl">{compactMoney(last.taxation_revenue_cad)}</div>
          <div className="mt-3 text-sm font-semibold text-[#7a6167]">
            {first.fiscal_year} → {last.fiscal_year}: +{pctChange(first.taxation_revenue_cad, last.taxation_revenue_cad)}%
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-[#eadde1] bg-white p-5 md:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#651024]">Five-year backbone</div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#3a1a22]">Approved / final operating totals</h2>
          </div>
          <div className="text-xs font-semibold text-[#7a6167]">Bars show gross operating expenditures</div>
        </div>
        <div className="mt-6 space-y-4">
          {sortedOverview.map((row) => (
            <div key={row.fiscal_year}>
              <div className="mb-2 grid grid-cols-[55px_1fr_auto] items-end gap-3">
                <div className="font-black text-[#651024]">{row.fiscal_year}</div>
                <div className="h-3 overflow-hidden rounded-full bg-[#f0e4e7]">
                  <div
                    className="h-full rounded-full bg-[#7a2337]"
                    style={{ width: `${(row.gross_operating_expenditure_cad / maxGross) * 100}%` }}
                  />
                </div>
                <div className="min-w-[78px] text-right text-sm font-black text-[#3a1a22]">{compactMoney(row.gross_operating_expenditure_cad)}</div>
              </div>
              <div className="ml-[68px] text-xs text-[#7a6167]">Taxation: {compactMoney(row.taxation_revenue_cad)} · {row.version_label}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-[#7a6167]">
          These totals use approved prior-year figures recovered from the next budget book where possible. For 2026, the City’s final budget book is the source; its summary table still labels the 2026 column “Requested Budget,” so that source label is retained in the warehouse.
        </p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>2026 source note:</strong> the final Budget Book’s detailed Chart 1 reports <strong>$454,163,028</strong> in gross operating expenditures. The City’s budget-adoption release separately summarizes <strong>$453.9 million</strong> in spending on municipal services. The release does not explain the difference, so this portal uses the detailed final Budget Book figure for the chart and flags the two City-published presentations rather than blending them.
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <a href="https://www.peterborough.ca/media/21lhmi5p/budget-book-2026-final.pdf" target="_blank" rel="noreferrer" className="font-bold underline underline-offset-2">Final Budget Book ↗</a>
            <a href="https://www.peterborough.ca/news/posts/city-of-peterborough-2026-budget-adopted/" target="_blank" rel="noreferrer" className="font-bold underline underline-offset-2">Budget adoption release ↗</a>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {sortedOverview.map((row) => (
            <button
              key={row.fiscal_year}
              type="button"
              onClick={() => setYear(row.fiscal_year)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${year === row.fiscal_year ? "bg-[#651024] text-white" : "bg-[#f8f1f3] text-[#651024] hover:bg-[#efe4e7]"}`}
            >
              {row.fiscal_year}
            </button>
          ))}
        </div>

        {selectedOverview && (
          <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-[#651024] p-6 text-white md:flex-row md:items-end md:justify-between md:p-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">{selectedOverview.version_label}</div>
              <div className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{compactMoney(selectedOverview.gross_operating_expenditure_cad)}</div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Reported gross operating expenditures. The department view below preserves the City’s organizational structure for that year and is not yet a normalized service comparison.
              </p>
            </div>
            <a
              href={selectedOverview.source_url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full border border-white/35 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
            >
              Open official source ↗
            </a>
          </div>
        )}

        <div className="mt-7 space-y-5">
          {selectedDepartments.map((row) => (
            <div key={`${row.fiscal_year}-${row.source_org_label}`}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div className="text-sm font-bold leading-5 text-[#3a1a22] md:text-base">{row.source_org_label}</div>
                <div className="shrink-0 text-sm font-black text-[#651024] md:text-base">{compactMoney(row.amount_cad)}</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f0e4e7]">
                <div className="h-full rounded-full bg-[#7a2337]" style={{ width: `${Math.max((row.amount_cad / maxDepartment) * 100, 2)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {selectedRecon && (
          <div className={`mt-8 rounded-2xl border p-5 text-sm leading-6 ${selectedRecon.status === "passed" ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
            <strong>Reconciliation: {selectedRecon.status === "passed" ? "passed" : "review flag"}.</strong>{" "}
            Extracted department rows total {money.format(selectedRecon.extracted_department_sum_cad)} versus the published total of {money.format(selectedRecon.published_total_cad)}.
            {selectedRecon.difference_cad !== 0 && <> Difference: {money.format(selectedRecon.difference_cad)}. The published total remains authoritative while the source row is re-verified.</>}
          </div>
        )}
      </section>

      <div className="mt-8 rounded-2xl border border-[#decbd1] bg-[#fffafb] p-5 text-sm leading-6 text-[#5f4149]">
        <strong>Normalization boundary:</strong> Peterborough reorganized its department structure between the 2022 and 2023 reporting views. The five-year total series above is comparable; individual department bars are intentionally shown only as the structure reported in each year. Service-level normalization is the next pass.
      </div>
    </div>
  );
}
