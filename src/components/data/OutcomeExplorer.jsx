import React from "react";

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("en-CA", { maximumFractionDigits: 1 });

function BudgetContext({ domain, serviceRequirements }) {
  if (!domain.linked_service_id) return null;
  const rows = serviceRequirements
    .filter((r) => r.service_id === domain.linked_service_id)
    .sort((a, b) => a.fiscal_year - b.fiscal_year);
  if (!rows.length) return null;
  const first = rows[0];
  const last = rows[rows.length - 1];
  const change = last.amount_cad - first.amount_cad;
  const changePct = first.amount_cad ? (change / first.amount_cad) * 100 : null;
  return (
    <div className="rounded-2xl border border-[#e4d4d9] bg-[#fffafb] p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8e747a]">Budget context — not attribution</div>
      <div className="mt-2 text-lg font-black text-[#3a1a22]">{domain.spending_label}</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><div className="text-xs font-bold text-[#8e747a]">{first.fiscal_year}</div><div className="text-xl font-black text-[#651024]">{money.format(first.amount_cad)}</div></div>
        <div><div className="text-xs font-bold text-[#8e747a]">{last.fiscal_year}</div><div className="text-xl font-black text-[#651024]">{money.format(last.amount_cad)}</div></div>
      </div>
      {changePct !== null && <div className="mt-3 text-sm font-bold text-[#6c5258]">{change >= 0 ? "+" : ""}{money.format(change)} · {changePct >= 0 ? "+" : ""}{pct.format(changePct)}%</div>}
      <p className="mt-3 text-xs leading-5 text-[#8a7077]">{domain.interpretation_note}</p>
    </div>
  );
}

function SourceLinks({ metrics }) {
  const byUrl = new Map();
  for (const m of metrics) if (m.source_url) byUrl.set(m.source_url, m.source_name || "Official source");
  if (!byUrl.size) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#eadde1] pt-4">
      {[...byUrl.entries()].map(([url, name]) => <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs font-black text-[#651024] hover:underline">{name} ↗</a>)}
    </div>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="rounded-2xl bg-[#f8f1f3] p-4">
      <div className="text-xs font-bold leading-5 text-[#7a6167]">{metric.metric_label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight text-[#3a1a22]">{metric.value_display}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#9a7f86]">{metric.period} · {metric.scope}</div>
      {metric.context && <p className="mt-2 text-xs leading-5 text-[#7a6167]">{metric.context}</p>}
    </div>
  );
}

function HousingProgress({ metrics }) {
  const periods = [...new Set(metrics.map((m) => m.period))].sort();
  return <div className="grid gap-3 md:grid-cols-3">{periods.map((year) => {
    const target = metrics.find((m) => m.period === year && m.metric_id === "housing_target");
    const actual = metrics.find((m) => m.period === year && m.metric_id === "housing_progress");
    const rate = target && actual ? (actual.value / target.value) * 100 : 0;
    return <div key={year} className="rounded-2xl bg-[#f8f1f3] p-5">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[#651024]">{year}</div>
      <div className="mt-3 text-3xl font-black text-[#3a1a22]">{actual?.value_display}</div>
      <div className="text-sm font-bold text-[#7a6167]">homes vs. target {target?.value_display}</div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eadde1]"><div className="h-full rounded-full bg-[#651024]" style={{width: `${Math.min(rate, 100)}%`}} /></div>
      <div className="mt-2 text-sm font-black text-[#651024]">{pct.format(rate)}% of target</div>
    </div>;
  })}</div>;
}

function TransitMetrics({ metrics }) {
  const ridership = metrics.filter((m) => m.metric_id === "transit_ridership").sort((a,b)=>a.period.localeCompare(b.period));
  const adult = metrics.find((m) => m.metric_id === "adult_ridership_yoy");
  const first = ridership[0], last = ridership[ridership.length-1];
  const growth = first && last ? ((last.value-first.value)/first.value)*100 : null;
  return <div>
    <div className="grid gap-3 md:grid-cols-2">
      {ridership.map(m => <MetricCard key={`${m.metric_id}-${m.period}`} metric={m} />)}
    </div>
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      {growth !== null && <div className="rounded-2xl border border-[#e4d4d9] bg-white p-4"><div className="text-xs font-bold text-[#7a6167]">Approx. change in reported total ridership</div><div className="mt-1 text-2xl font-black text-[#651024]">+{pct.format(growth)}%+</div><p className="mt-2 text-xs leading-5 text-[#8a7077]">2025 is reported as “more than 3.7M,” so this is a minimum implied increase from the 2023 total.</p></div>}
      {adult && <MetricCard metric={adult} />}
    </div>
  </div>;
}

function HousingSystemMetrics({ metrics }) {
  const waitlist = metrics.filter(m=>m.metric_id==="rgi_waitlist").sort((a,b)=>a.period.localeCompare(b.period));
  const wait = metrics.filter(m=>m.metric_id==="rgi_wait_time").sort((a,b)=>a.period.localeCompare(b.period));
  const other = metrics.filter(m=>!["rgi_waitlist","rgi_wait_time"].includes(m.metric_id));
  return <div>
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl bg-[#f8f1f3] p-5"><div className="text-xs font-bold text-[#7a6167]">Centralized RGI waitlist</div><div className="mt-3 flex items-end gap-4">{waitlist.map(m=><div key={m.period}><div className="text-xs font-bold text-[#9a7f86]">{m.period}</div><div className="text-2xl font-black text-[#3a1a22]">{m.value_display}</div></div>)}</div><div className="mt-3 text-sm font-black text-[#651024]">+{pct.format(((waitlist[1]?.value-waitlist[0]?.value)/waitlist[0]?.value)*100)}%</div></div>
      <div className="rounded-2xl bg-[#f8f1f3] p-5"><div className="text-xs font-bold text-[#7a6167]">Average RGI wait time</div><div className="mt-3 flex items-end gap-4">{wait.map(m=><div key={m.period}><div className="text-xs font-bold text-[#9a7f86]">{m.period}</div><div className="text-2xl font-black text-[#3a1a22]">{m.value_display}</div></div>)}</div></div>
    </div>
    <div className="mt-3 grid gap-3 md:grid-cols-2">{other.map(m=><MetricCard key={m.metric_id} metric={m}/>)}</div>
  </div>;
}

function DomainMetrics({ domain, metrics }) {
  if (domain.domain_id === "housing_growth") return <HousingProgress metrics={metrics} />;
  if (domain.domain_id === "transit_outcomes") return <TransitMetrics metrics={metrics} />;
  if (domain.domain_id === "homelessness_outcomes") return <HousingSystemMetrics metrics={metrics} />;
  return <div className="grid gap-3 sm:grid-cols-2">{metrics.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m}/>)}</div>;
}

export default function OutcomeExplorer({ outcomeData, serviceRequirements }) {
  const domains = [...outcomeData.domains].sort((a,b)=>a.order_key-b.order_key);
  return <div className="space-y-8">
    {domains.map(domain => {
      const metrics = outcomeData.metrics.filter(m=>m.domain_id===domain.domain_id);
      return <section id={domain.domain_id} key={domain.domain_id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#eadde1]">
        <div className="border-b border-[#eadde1] px-6 py-6 md:px-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#651024]">Outcome evidence</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{domain.public_label}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#7a6167]">{domain.scope_note}</p>
        </div>
        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_280px]">
          <div><DomainMetrics domain={domain} metrics={metrics}/><SourceLinks metrics={metrics}/></div>
          <BudgetContext domain={domain} serviceRequirements={serviceRequirements}/>
        </div>
      </section>;
    })}
  </div>;
}
