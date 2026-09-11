import React, { useMemo } from "react";

function compactMoney(value) {
  if (value == null) return "";
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toLocaleString("en-CA")}`;
}

export default function VoteInsights({ votes, topics }) {
  const topicById = useMemo(() => Object.fromEntries(topics.map((t) => [t.topic_id, t])), [topics]);
  const largestSplit = useMemo(() => votes
    .filter((v) => v.yes_count > 0 && v.no_count > 0 && v.financial_impact?.status === "known" && Number(v.financial_impact.amount_cad) > 0)
    .sort((a, b) => Number(b.financial_impact.amount_cad) - Number(a.financial_impact.amount_cad))
    .slice(0, 5), [votes]);

  const topicCounts = useMemo(() => {
    const counts = new Map();
    for (const v of votes) {
      const root = topicById[v.primary_topic_id]?.parent_topic_id || v.primary_topic_id;
      const label = topicById[root]?.public_label || topicById[v.primary_topic_id]?.public_label || root;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
  }, [votes, topicById]);

  const closeVotes = useMemo(() => votes
    .filter((v) => v.yes_count > 0 && v.no_count > 0)
    .map((v) => ({...v, margin: Math.abs(v.yes_count - v.no_count)}))
    .sort((a,b)=>a.margin-b.margin || b.meeting_date.localeCompare(a.meeting_date))
    .slice(0,5), [votes]);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-5 md:p-6">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">Largest stated-dollar split votes</div>
        <p className="mt-2 text-sm leading-6 text-[#7a6167]">Ranks only motions with a stated dollar amount and votes on both sides. A stated amount can be a proposed reallocation, reserve draw or budget change — not necessarily new spending.</p>
        <div className="mt-5 space-y-4">
          {largestSplit.map((v) => <div key={v.id} className="border-t border-[#eadde1] pt-4 first:border-0 first:pt-0">
            <div className="flex items-start justify-between gap-4"><div className="font-bold leading-5 text-[#3a1a22]">{v.title}</div><div className="shrink-0 font-black text-[#651024]">{compactMoney(v.financial_impact.amount_cad)}</div></div>
            <div className="mt-1 text-xs font-semibold text-[#7a6167]">{v.meeting_date_display} · {v.result} {v.yes_count}–{v.no_count}</div>
          </div>)}
        </div>
      </section>

      <section className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-5 md:p-6">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">Archive by primary topic</div>
        <p className="mt-2 text-sm leading-6 text-[#7a6167]">This is a coverage map, not a score. It helps show where the verified archive is deep and where ingestion is still thin.</p>
        <div className="mt-5 space-y-3">{topicCounts.map(([label,count]) => <div key={label} className="flex items-center justify-between gap-4"><span className="font-semibold text-[#5f4149]">{label}</span><span className="rounded-full bg-[#f8f1f3] px-3 py-1 text-xs font-black text-[#651024]">{count}</span></div>)}</div>
      </section>

      <section className="rounded-3xl border border-[#eadde1] bg-[#fffafb] p-5 md:p-6">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#651024]">Closest decisions</div>
        <p className="mt-2 text-sm leading-6 text-[#7a6167]">The narrowest recorded splits in the current verified archive.</p>
        <div className="mt-5 space-y-4">{closeVotes.map((v) => <div key={v.id} className="border-t border-[#eadde1] pt-4 first:border-0 first:pt-0"><div className="font-bold leading-5 text-[#3a1a22]">{v.title}</div><div className="mt-1 text-xs font-semibold text-[#7a6167]">{v.meeting_date_display} · {v.result} {v.yes_count}–{v.no_count}</div></div>)}</div>
      </section>
    </div>
  );
}
