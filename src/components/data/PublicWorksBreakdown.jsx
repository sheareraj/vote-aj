import React, { useMemo } from "react";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function compactMoney(value) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return money.format(value);
}

export default function PublicWorksBreakdown({ components, annotations }) {
  const years = useMemo(() => [...new Set(components.map((r) => r.fiscal_year))].sort(), [components]);
  const componentNames = useMemo(() => [...new Set(components.map((r) => r.component))], [components]);
  const byYear = useMemo(() => {
    const result = {};
    for (const year of years) {
      const rows = components.filter((r) => r.fiscal_year === year);
      result[year] = {
        total: rows[0]?.total_net_requirement_cad || 0,
        rows: Object.fromEntries(rows.map((r) => [r.component, r.amount_cad])),
      };
    }
    return result;
  }, [components, years]);

  const change = (a, b) => byYear[b].total - byYear[a].total;
  const pct = (a, b) => (change(a, b) / byYear[a].total) * 100;
  const snowTransfer = annotations.find((x) => x.annotation_type === "budget_transfer");
  const snowIncrement = annotations.find((x) => x.annotation_type === "incremental_operating" && x.effective_year === 2025);
  const snowAnnualized = (snowIncrement?.amount_cad || 0) + (annotations.find((x) => x.annotation_type === "incremental_operating" && x.effective_year === 2024)?.amount_cad || 0);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">2023 → 2024</div>
          <div className="mt-2 text-3xl font-black text-[#3a1a22]">+{compactMoney(change(2023, 2024))}</div>
          <div className="mt-2 text-sm font-semibold text-[#7a6167]">+{pct(2023, 2024).toFixed(1)}% · reasonably comparable</div>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <div className="text-xs font-black uppercase tracking-[0.18em]">2024 → 2025 structural break</div>
          <div className="mt-2 text-3xl font-black">+{compactMoney(change(2024, 2025))}</div>
          <div className="mt-2 text-sm font-semibold">+{pct(2024, 2025).toFixed(1)}% reported · do not read this as pure service-cost growth</div>
        </div>
        <div className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-5">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">2025 → 2026</div>
          <div className="mt-2 text-3xl font-black text-[#3a1a22]">+{compactMoney(change(2025, 2026))}</div>
          <div className="mt-2 text-sm font-semibold text-[#7a6167]">+{pct(2025, 2026).toFixed(1)}% · same reporting structure</div>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto rounded-3xl border border-[#eadde1] bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-[#fffafb] text-left text-xs font-black uppercase tracking-[0.12em] text-[#7a6167]">
            <tr>
              <th className="px-5 py-3">Net requirement component</th>
              {years.map((year) => <th key={year} className="px-4 py-3 text-right">{year}</th>)}
            </tr>
          </thead>
          <tbody>
            {componentNames.map((name) => (
              <tr key={name} className="border-t border-[#f0e4e7]">
                <td className="px-5 py-4 font-bold text-[#3a1a22]">{name}</td>
                {years.map((year) => (
                  <td key={year} className={`px-4 py-4 text-right font-semibold ${year === 2025 && name === "Yard" ? "bg-amber-50 text-amber-950" : "text-[#5f4149]"}`}>
                    {compactMoney(byYear[year].rows[name] || 0)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-[#dcc7cd] bg-[#f8f1f3]">
              <td className="px-5 py-4 font-black text-[#3a1a22]">Total Public Works net requirement</td>
              {years.map((year) => <td key={year} className="px-4 py-4 text-right font-black text-[#651024]">{compactMoney(byYear[year].total)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#8e747a]">Source-line component sums differ from the published Public Works total by $1 in 2023 and $1 in 2024. The dashboard preserves the published total and treats those immaterial differences as source-level rounding/extraction variance rather than silently changing a line item.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <div className="text-xs font-black uppercase tracking-[0.18em]">Why 2025 is flagged</div>
          <h3 className="mt-2 text-xl font-black">The accounting presentation changes materially.</h3>
          <p className="mt-3 text-sm leading-6">The Yard line moves from essentially a fully recovered activity in 2024 to a <strong>{compactMoney(byYear[2025].rows["Yard"] || 0)}</strong> net requirement in the 2025 approved figures. Winter Control falls while Surface Services rises sharply at the same time. That pattern is consistent with changed allocation/recovery treatment, so the full +{compactMoney(change(2024, 2025))} is not labelled as organic service growth.</p>
        </div>
        <div className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-6">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">One known 2025 operating change</div>
          <h3 className="mt-2 text-xl font-black text-[#3a1a22]">Municipal-lot snow plowing moved in-house.</h3>
          <p className="mt-3 text-sm leading-6 text-[#6c5258]">The City's service-delivery report identifies <strong>{compactMoney(snowTransfer?.amount_cad || 0)}</strong> of existing municipal-lot budget transferred into Public Works, plus <strong>{compactMoney(snowIncrement?.amount_cad || 0)}</strong> of additional 2025 staff/material/operating cost. Including the initial 2024 amount, the report describes an annualized incremental operating increase of about <strong>{compactMoney(snowAnnualized)}</strong>.</p>
          <p className="mt-3 text-xs leading-5 text-[#8e747a]">The transferred budget is a classification move, not new City-wide spending. This known change explains only part of the 2025 Public Works structural break.</p>
        </div>
      </div>
    </div>
  );
}
