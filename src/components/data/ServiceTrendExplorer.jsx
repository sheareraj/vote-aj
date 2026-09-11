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

export default function ServiceTrendExplorer({ serviceData }) {
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
      grouped.get(row.service_id).rows.push(row);
    }

    return [...grouped.values()].map((item) => {
      item.rows.sort((a, b) => a.fiscal_year - b.fiscal_year);
      const start = item.rows.find((r) => r.fiscal_year === 2022) || item.rows[0];
      const end = item.rows.find((r) => r.fiscal_year === 2026) || item.rows.at(-1);
      return {
        ...item,
        start,
        end,
        delta: end.amount_cad - start.amount_cad,
        pct: pct(start.amount_cad, end.amount_cad),
      };
    }).sort((a, b) => b.delta - a.delta);
  }, [serviceData]);

  const [selectedId, setSelectedId] = useState(series[0]?.service_id || "");
  const selected = series.find((s) => s.service_id === selectedId) || series[0];
  const maxValue = Math.max(...(selected?.rows.map((r) => r.amount_cad) || [1]), 1);
  const transit = series.find((s) => s.service_id === "transit");
  const police = series.find((s) => s.service_id === "police");
  const capital = series.find((s) => s.service_id === "capital_financing");

  if (!selected) return null;

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[police, capital, transit].filter(Boolean).map((item) => (
          <button
            key={item.service_id}
            type="button"
            onClick={() => setSelectedId(item.service_id)}
            className={`rounded-3xl p-6 text-left transition ${selectedId === item.service_id ? "bg-[#651024] text-white" : "border border-[#eadde1] bg-[#fffafb] text-[#3a1a22] hover:border-[#c9aab3]"}`}
          >
            <div className={`text-xs font-black uppercase tracking-[0.18em] ${selectedId === item.service_id ? "text-white/65" : "text-[#651024]"}`}>{item.canonical_service}</div>
            <div className="mt-2 text-3xl font-black">{item.delta >= 0 ? "+" : ""}{compactMoney(item.delta)}</div>
            <div className={`mt-2 text-sm font-semibold ${selectedId === item.service_id ? "text-white/75" : "text-[#7a6167]"}`}>
              2022 → 2026 {item.pct >= 0 ? "+" : ""}{item.pct.toFixed(1)}%
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
              {selected.comparability} comparability
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#7a6167]">Budgeted net requirement: service expenditures less the direct revenues attributed to that service. It is not the same thing as the final city-wide property-tax levy.</p>

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
            <strong>2022 → 2026:</strong> {selected.delta >= 0 ? "+" : ""}{money.format(selected.delta)} ({selected.pct >= 0 ? "+" : ""}{selected.pct.toFixed(1)}%).
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#eadde1] bg-white">
          <div className="border-b border-[#eadde1] p-5 md:p-7">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#651024]">Stable service series</div>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-[#3a1a22]">Change in net requirement since 2022</h3>
            <p className="mt-2 text-sm leading-6 text-[#7a6167]">Sorted by dollar growth. Click a row to inspect the full five-year series.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-[#fffafb] text-left text-xs font-black uppercase tracking-[0.12em] text-[#7a6167]">
                <tr>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-4 py-3 text-right">2022</th>
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
                      {item.comparability !== "high" && <div className="mt-1 text-xs font-semibold text-amber-800">Scope note applies</div>}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#5f4149]">{compactMoney(item.start.amount_cad)}</td>
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
        <strong>Scope boundary:</strong> this is deliberately not yet a complete decomposition of the City budget. Public Works and Recreation/Parks/Culture have material scope transfers across the period, and reorganized corporate/planning divisions still need a defensible crosswalk. They are being held back rather than shown as false apples-to-apples trends.
      </div>
    </div>
  );
}
