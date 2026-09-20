import React, { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function compactMoney(value) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return money.format(value);
}

function pct(start, end) {
  if (!start) return null;
  return ((end / start - 1) * 100);
}

function comparabilityLabel(value) {
  if (value === "medium-high") return "Medium-high";
  if (value === "qualified") return "Qualified";
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unrated";
}

function scopeNote(item) {
  if (item.service_id === "public_works") {
    return "Published only from 2023 onward. The 2022 City structure combined Engineering/Construction/Public Works and Parks/Forestry, so a 2022 comparison would be misleading. Internal Public Works allocations also changed in 2025; treat the 2023–2026 family trend as qualified, not a pure service-cost increase.";
  }
  if (item.service_id === "recreation_parks_culture") {
    return "Published only from 2023 onward. The canonical family combines Recreation & Parks with Arts & Culture while keeping the Library separate. A clean 2022 bridge is not available because Parks/Forestry sat inside Public Works and Library was embedded in the older Arts/Culture presentation.";
  }
  if (item.service_id === "public_health") {
    return "The public-health organization changed during the period. The dollar series is retained with a scope note rather than presented as a perfectly unchanged entity.";
  }

  if (item.service_id === "asset_management" || item.service_id === "engineering_capital" || item.service_id === "planning_development") {
    return "Published from the first post-reorganization year that maps cleanly to the modern IPGM service. These are component trends, not a full 2022–2026 department trend.";
  }
  if (item.service_id === "economic_development") {
    return "Published only from the in-house economic-development transition period. Earlier years were delivered through a different organizational model, so they are not bridged into this series.";
  }
  if (["financial_services", "facilities", "legal_services", "strategic_comms", "people_culture"].includes(item.service_id)) {
    return "Published only across the period where the service maps cleanly after the Corporate/Legislative reorganization. Salary allocations and service transfers can still affect year-to-year comparability.";
  }
  return "This series is built from approved prior-year columns in later City budget books where possible, plus the final 2026 source.";
}

export default function ServiceTrendExplorer({ serviceData, levyBridge = [] }) {
  const series = useMemo(() => {
    const grouped = new Map();
    for (const row of serviceData) {
      if (!grouped.has(row.service_id)) {
        grouped.set(row.service_id, {
          service_id: row.service_id,
          canonical_service: row.canonical_service,
          service_family: row.service_family,
          comparability: row.comparability,
          rows: [],
        });
      }
      const item = grouped.get(row.service_id);
      item.rows.push(row);
      // Use the most cautious comparability classification in the group.
      if (["qualified", "medium", "medium-high"].includes(row.comparability)) item.comparability = row.comparability;
    }

    return [...grouped.values()].map((item) => {
      item.rows.sort((a, b) => a.fiscal_year - b.fiscal_year);
      const start = item.rows[0];
      const end = item.rows.at(-1);
      return {
        ...item,
        start,
        end,
        delta: end.amount_cad - start.amount_cad,
        pct: pct(start.amount_cad, end.amount_cad),
        rangeLabel: `${start.fiscal_year} → ${end.fiscal_year}`,
      };
    }).sort((a, b) => b.delta - a.delta);
  }, [serviceData]);

  const [selectedId, setSelectedId] = useState(series[0]?.service_id || "");
  const selected = series.find((s) => s.service_id === selectedId) || series[0];
  const maxValue = Math.max(...(selected?.rows.map((r) => r.amount_cad) || [1]), 1);
  const police = series.find((s) => s.service_id === "police");
  const capital = series.find((s) => s.service_id === "capital_financing");
  const publicWorks = series.find((s) => s.service_id === "public_works");
  const selectedLevyBridge = levyBridge.find((row) => row.service_id === selected?.service_id && row.fiscal_year === 2026);

  if (!selected) return null;

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[police, capital, publicWorks].filter(Boolean).map((item) => (
          <button
            key={item.service_id}
            type="button"
            onClick={() => setSelectedId(item.service_id)}
            className={`rounded-3xl p-6 text-left transition ${selectedId === item.service_id ? "bg-[#651024] text-white" : "border border-[#eadde1] bg-[#fffafb] text-[#3a1a22] hover:border-[#c9aab3]"}`}
          >
            <div className={`text-xs font-black uppercase tracking-[0.18em] ${selectedId === item.service_id ? "text-white/65" : "text-[#651024]"}`}>{item.canonical_service}</div>
            <div className="mt-2 text-3xl font-black">{item.delta >= 0 ? "+" : ""}{compactMoney(item.delta)}</div>
            <div className={`mt-2 text-sm font-semibold ${selectedId === item.service_id ? "text-white/75" : "text-[#7a6167]"}`}>
              {item.rangeLabel} {item.pct >= 0 ? "+" : ""}{item.pct.toFixed(1)}%
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[.9fr_1.1fr]">
        <section className="rounded-3xl border border-[#eadde1] bg-white p-5 md:p-7">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#651024]">Selected service</div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight text-[#3a1a22]">{selected.canonical_service}</h3>
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${selected.comparability === "high" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
              {comparabilityLabel(selected.comparability)} comparability
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#7a6167]"><strong>Trend measure:</strong> the City’s “Net Requirement Before Indirect Revenues” — the amount left after direct service revenues, before allocated indirect revenue is applied. It is not the same thing as the final Net Tax Levy attributed to the service.</p>

          <div className="mt-7 space-y-4">
            {selected.rows.map((row) => (
              <div key={`${selected.service_id}-${row.fiscal_year}`}>
                <div className="mb-2 grid grid-cols-[48px_1fr_auto] items-center gap-3">
                  <div className="font-black text-[#651024]">{row.fiscal_year}</div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#f0e4e7]">
                    <div className="h-full rounded-full bg-[#7a2337]" style={{ width: `${Math.max((row.amount_cad / maxValue) * 100, 3)}%` }} />
                  </div>
                  <div className="min-w-[76px] text-right text-sm font-black text-[#3a1a22]">{compactMoney(row.amount_cad)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-[#f8f1f3] p-4 text-sm leading-6 text-[#5f4149]">
            <strong>{selected.rangeLabel}:</strong> {selected.delta >= 0 ? "+" : ""}{money.format(selected.delta)} ({selected.pct >= 0 ? "+" : ""}{selected.pct.toFixed(1)}%).
          </div>

          {selectedLevyBridge && (
            <div className="mt-4 rounded-2xl border border-[#d9c3ca] bg-[#fffafb] p-4 text-sm text-[#5f4149]">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#651024]">2026 accounting bridge</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div><div className="text-[10px] font-black uppercase tracking-wide text-[#8e747a]">Net requirement before indirect revenue</div><div className="mt-1 text-lg font-black text-[#3a1a22]">{compactMoney(selectedLevyBridge.net_requirement_before_indirect_revenues_cad)}</div></div>
                <div><div className="text-[10px] font-black uppercase tracking-wide text-[#8e747a]">Allocated indirect revenue</div><div className="mt-1 text-lg font-black text-[#3a1a22]">{compactMoney(selectedLevyBridge.allocated_indirect_revenue_cad)}</div></div>
                <div><div className="text-[10px] font-black uppercase tracking-wide text-[#8e747a]">Net tax levy</div><div className="mt-1 text-lg font-black text-[#651024]">{compactMoney(selectedLevyBridge.net_tax_levy_cad)}</div></div>
              </div>
              <p className="mt-3 leading-6">This bridge comes from the City’s 2026 taxpayer-allocation table. It shows why a service-trend figure should not be described as the amount ultimately funded by property taxes.</p>
              <a href={selectedLevyBridge.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-bold text-[#651024] underline decoration-[#c9aab3] underline-offset-2">Open official 2026 table ↗</a>
            </div>
          )}

          {selected.comparability !== "high" && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>Scope note:</strong> {scopeNote(selected)}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#eadde1] bg-white">
          <div className="border-b border-[#eadde1] p-5 md:p-7">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#651024]">Normalized service series</div>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-[#3a1a22]">Change over each defensible comparison window</h3>
            <p className="mt-2 text-sm leading-6 text-[#7a6167]">Most series begin in 2022. Where City reorganizations prevent an honest five-year comparison, the starting year moves forward rather than manufacturing a bridge.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-[#fffafb] text-left text-xs font-black uppercase tracking-[0.12em] text-[#7a6167]">
                <tr>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-4 py-3 text-right">Start</th>
                  <th className="px-4 py-3 text-right">2026</th>
                  <th className="px-4 py-3 text-right">Change</th>
                  <th className="px-5 py-3 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {series.map((item) => (
                  <tr
                    key={item.service_id}
                    onClick={() => setSelectedId(item.service_id)}
                    className={`cursor-pointer border-t border-[#f0e4e7] transition hover:bg-[#fffafb] ${selectedId === item.service_id ? "bg-[#f8f1f3]" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#3a1a22]">{item.canonical_service}</div>
                      <div className="mt-1 text-xs font-semibold text-[#7a6167]">{item.rangeLabel}</div>
                      {item.comparability !== "high" && <div className="mt-1 text-xs font-semibold text-amber-800">Scope note applies</div>}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#5f4149]"><span className="block text-[10px] font-black uppercase tracking-wide text-[#9a7f86]">{item.start.fiscal_year}</span>{compactMoney(item.start.amount_cad)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-[#5f4149]">{compactMoney(item.end.amount_cad)}</td>
                    <td className={`px-4 py-4 text-right font-black ${item.delta < 0 ? "text-emerald-700" : "text-[#651024]"}`}>{item.delta >= 0 ? "+" : ""}{compactMoney(item.delta)}</td>
                    <td className={`px-5 py-4 text-right font-black ${item.pct < 0 ? "text-emerald-700" : "text-[#651024]"}`}>{item.pct >= 0 ? "+" : ""}{item.pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>Normalization rule:</strong> Public Works and Recreation/Parks/Culture are now published from 2023 onward with explicit scope caveats. Infrastructure/Planning/Growth and Corporate Administration are now published as component-level series from defensible start years. No single full-term department-growth claim is displayed where reorganizations prevent an honest bridge.
      </div>
    </div>
  );
}
