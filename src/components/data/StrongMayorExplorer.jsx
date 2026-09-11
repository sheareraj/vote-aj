import React, { useMemo, useState } from "react";

const typeTone = {
  "Budget direction": "bg-sky-100 text-sky-900",
  "Budget proposal": "bg-sky-100 text-sky-900",
  "Budget proposal / delegation": "bg-sky-100 text-sky-900",
  "Delegated authority": "bg-violet-100 text-violet-900",
  "Staff/legal direction": "bg-amber-100 text-amber-900",
  "Provincial-priority by-law proposal": "bg-rose-100 text-rose-900",
};

export default function StrongMayorExplorer({ actions, votes }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(() => [...actions].sort((a,b)=>b.action_date.localeCompare(a.action_date)), [actions]);
  const directVotes = useMemo(() => votes.filter(v => (v.topic_ids || []).includes("strong_mayor")), [votes]);
  const minorityThreshold = directVotes.filter(v => (v.significance || []).includes("minority_threshold"));
  const displayed = expanded ? sorted : sorted.slice(0, 6);

  return (
    <div className="rounded-3xl border border-[#d9c3ca] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#eadde1] bg-[#651024] px-6 py-7 text-white md:px-9">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#f2c7d2]">Strong Mayor Powers</div>
        <div className="mt-2 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">How the power has actually been used</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#f3e7ea]">This timeline separates written mayoral decisions from ordinary Council votes. Budget authority, delegated appointments, staff directions and provincial-priority by-laws do not all work the same way.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 px-4 py-3"><div className="text-2xl font-black">{actions.length}</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#f2c7d2]">Published actions</div></div>
            <div className="rounded-2xl bg-white/10 px-4 py-3"><div className="text-2xl font-black">{directVotes.length}</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#f2c7d2]">Tagged votes</div></div>
            <div className="rounded-2xl bg-white/10 px-4 py-3"><div className="text-2xl font-black">{minorityThreshold.length}</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#f2c7d2]">1/3-threshold votes</div></div>
          </div>
        </div>
      </div>

      {minorityThreshold.length > 0 && (
        <div className="border-b border-rose-200 bg-rose-50 px-6 py-5 md:px-9">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-rose-800">The unusual case</div>
          <div className="mt-1 text-lg font-black text-[#3a1a22]">The Brock Mission by-laws carried 4–7.</div>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#6c5258]">That is not a data error. For a by-law the Mayor proposes under the provincial-priority strong-mayor provision, passage requires more than one-third of Council—not a normal majority. The explorer includes both the committee-stage and final Council 4–7 votes.</p>
        </div>
      )}

      <div className="divide-y divide-[#eadde1]">
        {displayed.map(action => (
          <article key={action.action_id} className="grid gap-4 px-6 py-5 md:px-9 lg:grid-cols-[155px_1fr_auto] lg:items-start">
            <div>
              <div className="text-sm font-black text-[#651024]">{action.action_date_display}</div>
              <div className="mt-1 text-xs font-bold text-[#8e747a]">{action.action_id}</div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-[#3a1a22]">{action.subject}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${typeTone[action.action_type] || "bg-[#f8f1f3] text-[#651024]"}`}>{action.action_type}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#6c5258]">{action.summary}</p>
              <p className="mt-2 text-sm leading-6 text-[#7a6167]"><strong className="text-[#3a1a22]">What followed:</strong> {action.outcome_context}</p>
              <div className="mt-2 text-xs font-semibold text-[#9a7f86]">Authority: {action.authority}</div>
            </div>
            <a href={action.source_url} target="_blank" rel="noreferrer" className="text-sm font-black text-[#651024] hover:underline">Official decision ↗</a>
          </article>
        ))}
      </div>
      <div className="border-t border-[#eadde1] bg-[#fffafb] px-6 py-4 text-center md:px-9">
        <button onClick={()=>setExpanded(!expanded)} className="rounded-full border border-[#cdb1ba] bg-white px-5 py-2.5 text-sm font-black text-[#651024] hover:bg-[#f8f1f3]">{expanded ? "Show fewer" : `Show all ${actions.length} published actions`}</button>
      </div>
    </div>
  );
}
