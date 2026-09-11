import React, { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function compactMoney(value) {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return money.format(value);
}

export default function BudgetExplorer({ rows }) {
  const versions = useMemo(() => {
    const map = new Map();
    rows
      .filter((r) => r.measure_type === "gross_expenditure" && r.source_org_label !== "TOTAL")
      .forEach((r) => {
        const key = `${r.fiscal_year}|${r.source_version_label}`;
        if (!map.has(key)) map.set(key, { key, year: r.fiscal_year, label: r.source_version_label });
      });
    return [...map.values()].sort((a, b) => a.year - b.year);
  }, [rows]);

  const [selected, setSelected] = useState(versions.at(-1)?.key || "");

  const selectedRows = rows
    .filter((r) => `${r.fiscal_year}|${r.source_version_label}` === selected)
    .filter((r) => r.measure_type === "gross_expenditure" && r.source_org_label !== "TOTAL")
    .sort((a, b) => b.amount_cad - a.amount_cad);

  const totalRow = rows.find(
    (r) => `${r.fiscal_year}|${r.source_version_label}` === selected && r.measure_type === "gross_expenditure" && r.source_org_label === "TOTAL"
  );
  const max = Math.max(...selectedRows.map((r) => r.amount_cad), 1);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {versions.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setSelected(v.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${selected === v.key ? "bg-[#651024] text-white" : "bg-[#f8f1f3] text-[#651024] hover:bg-[#efe4e7]"}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {totalRow && (
        <div className="mt-6 rounded-3xl bg-[#651024] p-6 text-white md:p-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Gross operating expenditures</div>
          <div className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{compactMoney(totalRow.amount_cad)}</div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            This is the source-defined total for {totalRow.source_version_label}. It is intentionally labelled by budget version so a recommended budget is never presented as though it were the final adopted budget.
          </p>
        </div>
      )}

      <div className="mt-7 space-y-5">
        {selectedRows.map((row) => (
          <div key={`${row.fiscal_year}-${row.source_org_label}`}>
            <div className="mb-2 flex items-end justify-between gap-4">
              <div className="text-sm font-bold leading-5 text-[#3a1a22] md:text-base">{row.source_org_label}</div>
              <div className="shrink-0 text-sm font-black text-[#651024] md:text-base">{compactMoney(row.amount_cad)}</div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#f0e4e7]">
              <div className="h-full rounded-full bg-[#7a2337]" style={{ width: `${Math.max((row.amount_cad / max) * 100, 2)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>Foundation dataset:</strong> this screen currently proves the model using 2022 Approved and 2023 Recommended source data. The 2024–2026 department crosswalk is the next ingestion step before this becomes the public comparison view.
      </div>
    </div>
  );
}
