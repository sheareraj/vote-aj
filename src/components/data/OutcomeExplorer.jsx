import React from "react";

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("en-CA", { maximumFractionDigits: 1 });

const trendTone = {
  improving: "border-emerald-200 bg-emerald-50 text-emerald-950",
  worsening: "border-rose-200 bg-rose-50 text-rose-950",
  mixed: "border-amber-200 bg-amber-50 text-amber-950",
  insufficient: "border-slate-200 bg-slate-50 text-slate-800",
};

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

function TrendBanner({ trend }) {
  if (!trend) return null;
  return (
    <div className={`mb-5 rounded-2xl border p-5 ${trendTone[trend.trend_status] || trendTone.insufficient}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Published trend: {trend.trend_label}</div>
        <div className="text-sm font-black">{trend.headline}</div>
      </div>
      <p className="mt-3 text-sm leading-6">{trend.summary}</p>
      <p className="mt-2 text-xs leading-5 opacity-75">Method: {trend.methodology_note}</p>
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

function MetricCard({ metric, freshness }) {
  return (
    <div className="rounded-2xl bg-[#f8f1f3] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-bold leading-5 text-[#7a6167]">{metric.metric_label}</div>
        {freshness && <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-[#8e747a]">{freshness}</span>}
      </div>
      <div className="mt-1 text-2xl font-black tracking-tight text-[#3a1a22]">{metric.value_display}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#9a7f86]">{metric.period} · {metric.scope}</div>
      {metric.context && <p className="mt-2 text-xs leading-5 text-[#7a6167]">{metric.context}</p>}
    </div>
  );
}

function LatestSignal({ eyebrow, title, value, context, tone = "neutral", href }) {
  const tones = {
    positive: "border-emerald-200 bg-emerald-50",
    negative: "border-rose-200 bg-rose-50",
    mixed: "border-amber-200 bg-amber-50",
    neutral: "border-[#e4d4d9] bg-white",
    stale: "border-slate-200 bg-slate-50",
  };
  const card = <div className={`h-full rounded-2xl border p-5 ${tones[tone] || tones.neutral}`}>
    <div className="text-[10px] font-black uppercase tracking-[0.17em] text-[#8e747a]">{eyebrow}</div>
    <div className="mt-2 text-sm font-black text-[#3a1a22]">{title}</div>
    <div className="mt-2 text-3xl font-black tracking-tight text-[#651024]">{value}</div>
    <p className="mt-2 text-xs leading-5 text-[#6f5a60]">{context}</p>
  </div>;
  return href ? <a href={href} className="block h-full">{card}</a> : card;
}

function CurrentSignals({ outcomeData }) {
  const m = outcomeData.metrics;
  const h2025 = m.find(x => x.metric_id === "housing_progress" && x.period === "2025");
  const ht2025 = m.find(x => x.metric_id === "housing_target" && x.period === "2025");
  const transit = m.find(x => x.metric_id === "transit_ridership" && x.period === "2025");
  const csi25 = m.find(x => x.metric_id === "cma_crime_severity_index" && x.period === "2025");
  const csi24 = m.find(x => x.metric_id === "cma_crime_severity_index" && x.period === "2024");
  const crime25 = m.find(x => x.metric_id === "cma_crime_rate" && x.period === "2025");
  const homeless25 = m.find(x => x.metric_id === "people_experienced_homelessness" && x.period === "2025");
  const homeless24 = m.find(x => x.metric_id === "people_experienced_homelessness" && x.period === "2024");
  const shelter = m.find(x => x.metric_id === "emergency_shelter_beds" && x.period === "2026");
  const housingRate = h2025 && ht2025 ? (h2025.value / ht2025.value) * 100 : null;
  const csiChange = csi25 && csi24 ? ((csi25.value - csi24.value) / csi24.value) * 100 : null;
  const homelessChange = homeless25 && homeless24 ? ((homeless25.value - homeless24.value) / homeless24.value) * 100 : null;
  return <section className="rounded-3xl border border-[#e4d4d9] bg-white p-6 shadow-sm md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#651024]">Freshest verified signals</div>
        <h2 className="mt-2 text-2xl font-black tracking-tight">Lead with what we know now</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7a6167]">2025 annual actuals are the newest complete-year measures available for most services in 2026. Older observations are kept below as historical context, not given equal weight.</p>
      </div>
      <div className="rounded-full bg-[#f8f1f3] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#651024]">Current as of Sept. 2026</div>
    </div>
    <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <LatestSignal href="#housing_growth" eyebrow="2025 actual · refreshed Jul 2026" title="Housing progress" value={h2025 ? `${h2025.value_display} homes` : "—"} context={housingRate !== null ? `${pct.format(housingRate)}% of the 2025 provincial target.` : "Latest annual result."} tone="positive" />
      <LatestSignal href="#transit_outcomes" eyebrow="2025 actual · confirmed Jan 2026" title="Transit ridership" value={transit?.value_display || "—"} context="Total rides. The City reports more than 3.7 million in 2025." tone="positive" />
      <LatestSignal href="#police_outcomes" eyebrow="2025 actual · released Jul 2026" title="Peterborough CMA CSI" value={csi25?.value_display || "—"} context={csiChange !== null ? `${pct.format(Math.abs(csiChange))}% lower than 2024; crime rate was ${crime25?.value_display || "—"} per 100,000.` : "Latest Statistics Canada result."} tone="positive" />
      <LatestSignal href="#homelessness_outcomes" eyebrow="2025 actual · reported May 2026" title="Experienced homelessness" value={homeless25?.value_display || "—"} context={homelessChange !== null ? `Minimum count, ${pct.format(homelessChange)}% higher than 2024. Current shelter/overnight capacity: ${shelter?.value_display || "—"}.` : "Latest City system count."} tone="negative" />
      <LatestSignal href="#infrastructure_outcomes" eyebrow="Data gap" title="Road condition" value="No fresh reading" context="The 2025 Asset Management Plan still relies on 2023 condition observations for key road measures. Shown below as structural context only." tone="stale" />
    </div>
  </section>;
}

function MiniSeries({ title, metrics, lowerIsBetter = false, note, showChange = true }) {
  const rows = [...metrics].sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  if (!rows.length) return null;
  const first=rows[0], last=rows[rows.length-1];
  const change=first.value ? ((last.value-first.value)/first.value)*100 : null;
  return (
    <div className="rounded-2xl bg-[#f8f1f3] p-5">
      <div className="text-xs font-bold text-[#7a6167]">{title}</div>
      <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-3">
        {rows.map(m=><div key={`${m.metric_id}-${m.period}`}><div className="text-[10px] font-bold text-[#9a7f86]">{m.period}</div><div className="text-xl font-black text-[#3a1a22]">{m.value_display}</div></div>)}
      </div>
      {showChange && change !== null && rows.length > 1 && <div className="mt-3 text-sm font-black text-[#651024]">{change >= 0 ? "+" : ""}{pct.format(change)}% from first to latest{lowerIsBetter ? " · lower is better" : ""}</div>}
      {note && <p className="mt-2 text-xs leading-5 text-[#7a6167]">{note}</p>}
    </div>
  );
}

function Historical({ title = "Older context", children }) {
  return <details className="mt-4 rounded-2xl border border-[#e4d4d9] bg-white">
    <summary className="cursor-pointer px-5 py-4 text-sm font-black text-[#651024]">{title}</summary>
    <div className="border-t border-[#eadde1] p-5">{children}</div>
  </details>;
}

function HousingProgress({ metrics }) {
  const periods = [...new Set(metrics.filter(m=>["housing_target","housing_progress"].includes(m.metric_id)).map((m) => m.period))].sort((a,b)=>String(a).localeCompare(String(b), undefined, {numeric:true}));
  const totalTarget=metrics.filter(m=>m.metric_id==="housing_target").reduce((a,m)=>a+m.value,0);
  const totalActual=metrics.filter(m=>m.metric_id==="housing_progress").reduce((a,m)=>a+m.value,0);
  return <div>
    <div className="grid gap-3 md:grid-cols-3">{periods.map((year) => {
      const target = metrics.find((m) => m.period === year && m.metric_id === "housing_target");
      const actual = metrics.find((m) => m.period === year && m.metric_id === "housing_progress");
      const rate = target && actual ? (actual.value / target.value) * 100 : 0;
      return <div key={year} className={`rounded-2xl p-5 ${year === "2025" ? "border border-[#cfa7b1] bg-[#fffafb]" : "bg-[#f8f1f3]"}`}>
        <div className="flex justify-between gap-3"><div className="text-xs font-black uppercase tracking-[0.16em] text-[#651024]">{year}</div>{year === "2025" && <span className="rounded-full bg-[#651024] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">Latest</span>}</div>
        <div className="mt-3 text-3xl font-black text-[#3a1a22]">{actual?.value_display}</div>
        <div className="text-sm font-bold text-[#7a6167]">homes vs. target {target?.value_display}</div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eadde1]"><div className="h-full rounded-full bg-[#651024]" style={{width: `${Math.min(rate, 100)}%`}} /></div>
        <div className="mt-2 text-sm font-black text-[#651024]">{pct.format(rate)}% of target</div>
      </div>;
    })}</div>
    <div className="mt-3 rounded-2xl border border-[#e4d4d9] bg-white p-4 text-sm font-bold text-[#6c5258]">Three-year total: {totalActual.toLocaleString('en-CA')} homes vs. {totalTarget.toLocaleString('en-CA')} target · {pct.format((totalActual/totalTarget)*100)}%</div>
  </div>;
}

function TransitMetrics({ metrics }) {
  const ridership = metrics.filter((m) => m.metric_id === "transit_ridership").sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  const recent=ridership.filter(m=>Number(m.period)>=2023);
  const historical=ridership.filter(m=>Number(m.period)<2023);
  const adult = metrics.find((m) => m.metric_id === "adult_ridership_yoy");
  return <div>
    <MiniSeries title="Recent reported total transit ridership" metrics={recent} showChange={true} note="The 2025 source reports more than 3.7M rides, so its value is a lower bound." />
    {adult && <div className="mt-3"><MetricCard metric={adult} freshness="2025 YTD" /></div>}
    {historical.length > 0 && <Historical title="Older historical reference"><MiniSeries title="Pre-pandemic reference" metrics={historical} showChange={false} note="Shown for context only; service design and counting practices may differ." /></Historical>}
  </div>;
}

function PoliceMetrics({ metrics }) {
  const cma=metrics.filter(m=>m.metric_id==='cma_crime_severity_index');
  const crimeRate=metrics.filter(m=>m.metric_id==='cma_crime_rate');
  const crimeRateYoy=metrics.find(m=>m.metric_id==='cma_crime_rate_yoy' && m.period==='2025');
  const local=metrics.filter(m=>!['cma_crime_severity_index','cma_crime_rate','cma_crime_rate_yoy'].includes(m.metric_id));
  return <div>
    <MiniSeries title="Statistics Canada Peterborough CMA Crime Severity Index" metrics={cma} lowerIsBetter={true} note="2025 is the latest annual Statistics Canada release. The CMA is broader than the Peterborough Police Service jurisdiction." />
    <div className="mt-3"><MiniSeries title="Police-reported crime rate" metrics={crimeRate} lowerIsBetter={true} note={`Severity and volume can move differently: Peterborough CMA CSI fell 6% in 2025 while Statistics Canada reports the crime rate changed ${crimeRateYoy?.value_display || '+1%'}. The published annual percentage uses the underlying series and will not necessarily equal a calculation from rounded display values.`} /></div>
    {local.length > 0 && <Historical title="Older PPS service-area outputs and context"><div className="grid gap-3 sm:grid-cols-2">{local.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m} freshness={Number(m.period)<=2024 ? "Older" : undefined}/>)}</div></Historical>}
  </div>;
}

function InfrastructureMetrics({ metrics }) {
  const condition=metrics.filter(m=>['road_poor_very_poor','road_good_very_good','road_replacement_value','high_risk_assets'].includes(m.metric_id));
  const funding=metrics.filter(m=>m.metric_id.startsWith('capital_shortfall'));
  const outputs=metrics.filter(m=>m.metric_id.startsWith('road_lane_'));
  return <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Freshness warning</div>
      <div className="mt-2 text-lg font-black text-slate-900">The current plan is 2025; the key road-condition observation is still 2023.</div>
      <p className="mt-2 text-sm leading-6 text-slate-700">These numbers stay on the site because they describe the scale of the asset challenge, but they are no longer treated as a current outcome signal.</p>
    </div>
    <div>
      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#8e747a]">2025 planning / funding context</div>
      <div className="grid gap-3 sm:grid-cols-2">{funding.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m} freshness="2025 plan"/>)}</div>
    </div>
    <div>
      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#8e747a]">2025 work delivered — output measures</div>
      <div className="grid gap-3 sm:grid-cols-2">{outputs.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m} freshness="2025 output"/>)}</div>
    </div>
    <Historical title="Older condition / risk observations (mostly 2023)"><div className="grid gap-3 sm:grid-cols-2">{condition.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m} freshness="Historical"/>)}</div></Historical>
  </div>;
}

function HousingSystemMetrics({ metrics }) {
  const people = metrics.filter(m=>m.metric_id==="people_experienced_homelessness").sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  const shelter=metrics.find(m=>m.metric_id==="emergency_shelter_beds");
  const waitlist = metrics.filter(m=>m.metric_id==="rgi_waitlist").sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  const wait = metrics.filter(m=>m.metric_id==="rgi_wait_time").sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  const housed = metrics.filter(m=>m.metric_id==="rgi_housed").sort((a,b)=>String(a.period).localeCompare(String(b.period), undefined, {numeric:true}));
  return <div>
    <MiniSeries title="People who experienced homelessness" metrics={people} lowerIsBetter={true} note="Freshest City-reported system count. Includes people connected to services who were unsheltered, in shelters or couch surfing; this is not a point-in-time count." />
    {shelter && <div className="mt-3"><MetricCard metric={shelter} freshness="2026 context" /></div>}
    <Historical title="Older RGI housing-system context (through 2023)">
      <div className="grid gap-3 md:grid-cols-2"><MiniSeries title="Centralized RGI waitlist" metrics={waitlist} /><MiniSeries title="Average RGI wait time" metrics={wait} /></div>
      <div className="mt-3"><MiniSeries title="Households moved into RGI housing" metrics={housed} /></div>
    </Historical>
  </div>;
}

function DomainMetrics({ domain, metrics }) {
  if (domain.domain_id === "housing_growth") return <HousingProgress metrics={metrics} />;
  if (domain.domain_id === "transit_outcomes") return <TransitMetrics metrics={metrics} />;
  if (domain.domain_id === "police_outcomes") return <PoliceMetrics metrics={metrics} />;
  if (domain.domain_id === "infrastructure_outcomes") return <InfrastructureMetrics metrics={metrics} />;
  if (domain.domain_id === "homelessness_outcomes") return <HousingSystemMetrics metrics={metrics} />;
  return <div className="grid gap-3 sm:grid-cols-2">{metrics.map(m=><MetricCard key={`${m.metric_id}-${m.period}`} metric={m}/>)}</div>;
}

export default function OutcomeExplorer({ outcomeData, serviceRequirements }) {
  const domains = [...outcomeData.domains].sort((a,b)=>a.order_key-b.order_key);
  const trends = outcomeData.trends || [];
  return <div className="space-y-8">
    <CurrentSignals outcomeData={outcomeData} />
    <section className="rounded-3xl border border-[#e4d4d9] bg-white p-6 shadow-sm md:p-8">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#651024]">Longer-run context</div>
      <h2 className="mt-2 text-2xl font-black tracking-tight">What direction do the comparable series suggest?</h2>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-[#7a6167]">These are secondary to the current signals above. They summarize comparable published series and explicitly flag when the underlying observations lag too far to support a current assessment.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {domains.map(domain => { const trend=trends.find(t=>t.domain_id===domain.domain_id); return <a key={domain.domain_id} href={`#${domain.domain_id}`} className={`rounded-2xl border p-4 ${trendTone[trend?.trend_status] || trendTone.insufficient}`}><div className="text-[10px] font-black uppercase tracking-[0.15em]">{trend?.trend_label || 'No trend'}</div><div className="mt-2 text-sm font-black">{domain.public_label}</div></a>; })}
      </div>
    </section>
    {domains.map(domain => {
      const metrics = outcomeData.metrics.filter(m=>m.domain_id===domain.domain_id);
      const trend = trends.find(t=>t.domain_id===domain.domain_id);
      return <section id={domain.domain_id} key={domain.domain_id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#eadde1]">
        <div className="border-b border-[#eadde1] px-6 py-6 md:px-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#651024]">Outcome evidence</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{domain.public_label}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#7a6167]">{domain.scope_note}</p>
        </div>
        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_280px]">
          <div><TrendBanner trend={trend}/><DomainMetrics domain={domain} metrics={metrics}/><SourceLinks metrics={metrics}/></div>
          <BudgetContext domain={domain} serviceRequirements={serviceRequirements}/>
        </div>
      </section>;
    })}
  </div>;
}
