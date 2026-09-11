import React, { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function compactMoney(value) {
  if (value == null) return null;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return money.format(value);
}

function displayMember(member) {
  return member === "Jeff Leal" ? "Mayor Leal" : member;
}

export default function VoteExplorer({ councillors, topics, votes }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [councillor, setCouncillor] = useState("all");
  const [result, setResult] = useState("all");
  const [financial, setFinancial] = useState("all");

  const topicById = useMemo(() => Object.fromEntries(topics.map((t) => [t.topic_id, t])), [topics]);
  const topicMatches = (vote, selected) => {
    if (selected === "all") return true;
    return (vote.topic_ids || []).some((id) => id === selected || topicById[id]?.parent_topic_id === selected);
  };

  const filtered = useMemo(() => {
    return votes.filter((v) => {
      const q = query.trim().toLowerCase();
      const memberText = (v.votes || []).map((x) => x.member).join(" ");
      const matchesText = !q || `${v.title || ""} ${v.summary || ""} ${v.motion_text || ""} ${v.mover || ""} ${memberText}`.toLowerCase().includes(q);
      const matchesTopic = topicMatches(v, topic);
      const memberVote = (v.votes || []).find((x) => x.member === councillor);
      const matchesCouncillor = councillor === "all" || (memberVote && !["Absent", "Not recorded"].includes(memberVote.vote));
      const matchesResult = result === "all" || v.result === result;
      const matchesFinancial = financial === "all" || (financial === "known" ? v.financial_impact?.status === "known" : v.financial_impact?.status !== "known");
      return matchesText && matchesTopic && matchesCouncillor && matchesResult && matchesFinancial;
    });
  }, [votes, query, topic, councillor, result, financial, topicById]);

  const primaryTopics = topics.filter((t) => !t.parent_topic_id);
  const knownFinancial = votes.filter((v) => v.financial_impact?.status === "known").length;
  const splitVotes = votes.filter((v) => v.yes_count > 0 && v.no_count > 0).length;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="xl:col-span-2">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Search motions or councillors</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. police, shelter, Legacy, Riel..." className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2" />
        </label>
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2">
            <option value="all">All topics</option>
            {primaryTopics.map((t) => <option key={t.topic_id} value={t.topic_id}>{t.public_label}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Councillor</span>
          <select value={councillor} onChange={(e) => setCouncillor(e.target.value)} className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2">
            <option value="all">All members</option>
            {councillors.map((c) => <option key={c.councillor_id} value={c.display_name}>{c.display_name}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Result</span>
          <select value={result} onChange={(e) => setResult(e.target.value)} className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2">
            <option value="all">Carried & lost</option>
            <option value="Carried">Carried</option>
            <option value="Lost">Lost</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em]">
          <span className="rounded-full bg-[#f8f1f3] px-3 py-2 text-[#651024]">{votes.length} verified motions</span>
          <span className="rounded-full bg-[#f8f1f3] px-3 py-2 text-[#651024]">{splitVotes} split votes</span>
          <span className="rounded-full bg-[#f8f1f3] px-3 py-2 text-[#651024]">{knownFinancial} known $ impacts</span>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-[#5f4149]">
          <span>Financial impact</span>
          <select value={financial} onChange={(e) => setFinancial(e.target.value)} className="rounded-full border border-[#dcc7cd] bg-white px-3 py-2 text-[#3a1a22]">
            <option value="all">All</option>
            <option value="known">Known amount</option>
            <option value="unknown">Not quantified</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[#e7d6db] bg-[#f8f1f3] p-7 md:p-9">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#651024]">No matches</div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-[#3a1a22]">Try widening the filters.</h3>
          <p className="mt-4 max-w-3xl leading-7 text-[#7a6167]">The current ingestion is intentionally selective: verified budget amendments and other high-information decisions are being added before routine procedural votes.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {filtered.map((v) => {
            const forVotes = (v.votes || []).filter((x) => x.vote === "For");
            const againstVotes = (v.votes || []).filter((x) => x.vote === "Against");
            const otherVotes = (v.votes || []).filter((x) => !["For", "Against", "Not recorded"].includes(x.vote));
            const selectedMemberVote = councillor === "all" ? null : (v.votes || []).find((x) => x.member === councillor);
            const amount = v.financial_impact?.status === "known" ? compactMoney(v.financial_impact.amount_cad) : null;
            return (
              <article key={v.id} className="overflow-hidden rounded-3xl border border-[#eadde1] bg-white">
                <div className="grid gap-5 p-5 md:p-7 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                      <span className="text-[#651024]">{v.meeting_date_display}</span>
                      <span className="text-[#b49aa1]">•</span>
                      <span className="text-[#7a6167]">{v.meeting_type}</span>
                      <span className="text-[#b49aa1]">•</span>
                      <span className="text-[#7a6167]">{v.decision_stage}</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-[#3a1a22]">{v.title}</h3>
                    <p className="mt-3 max-w-3xl leading-7 text-[#6c5258]">{v.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(v.topic_ids || []).map((id) => <span key={id} className="rounded-full bg-[#f8f1f3] px-3 py-1.5 text-xs font-bold text-[#651024]">{topicById[id]?.public_label || id}</span>)}
                    </div>
                  </div>
                  <div className="flex min-w-[170px] flex-col gap-2 lg:text-right">
                    <span className={`inline-flex self-start rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] lg:self-end ${v.result === "Carried" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{v.result} {v.yes_count}–{v.no_count}</span>
                    {amount ? <div className="text-2xl font-black text-[#651024]">{amount}</div> : <div className="text-sm font-bold text-[#8e747a]">$ impact not quantified</div>}
                    {v.financial_impact?.timing && <div className="text-xs font-semibold uppercase tracking-wide text-[#9a7f86]">{String(v.financial_impact.timing).replaceAll("_", " ")}</div>}
                  </div>
                </div>

                {selectedMemberVote && (
                  <div className="mx-5 mb-5 rounded-2xl bg-[#f8f1f3] px-4 py-3 text-sm font-bold text-[#5f4149] md:mx-7">
                    {displayMember(councillor)}: <span className="text-[#651024]">{selectedMemberVote.vote}</span>
                  </div>
                )}

                <div className="grid gap-4 border-t border-[#f0e4e7] bg-[#fffafb] p-5 md:grid-cols-2 md:p-7">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-emerald-800">For ({forVotes.length})</div>
                    <div className="mt-2 flex flex-wrap gap-2">{forVotes.map((x) => <span key={x.member} className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-[#3a1a22]">{displayMember(x.member)}</span>)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-rose-800">Against ({againstVotes.length})</div>
                    <div className="mt-2 flex flex-wrap gap-2">{againstVotes.length ? againstVotes.map((x) => <span key={x.member} className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-[#3a1a22]">{displayMember(x.member)}</span>) : <span className="text-sm font-semibold text-[#8e747a]">None</span>}</div>
                  </div>
                  {otherVotes.length > 0 && <div className="md:col-span-2"><div className="text-xs font-black uppercase tracking-[0.15em] text-[#7a6167]">Other</div><div className="mt-2 flex flex-wrap gap-2">{otherVotes.map((x) => <span key={x.member} className="rounded-full border border-[#dcc7cd] bg-white px-3 py-1.5 text-xs font-bold text-[#5f4149]">{displayMember(x.member)} · {x.vote}</span>)}</div></div>}
                </div>

                <div className="flex flex-col gap-3 border-t border-[#eadde1] p-5 text-sm md:flex-row md:items-center md:justify-between md:px-7">
                  <div className="text-[#7a6167]">Moved by <strong className="text-[#3a1a22]">{displayMember(v.mover)}</strong>{v.financial_impact?.funding_source ? <> · Funding: <strong className="text-[#3a1a22]">{v.financial_impact.funding_source}</strong></> : null}</div>
                  <a href={v.source_url} target="_blank" rel="noreferrer" className="font-black text-[#651024] hover:underline">Official minutes ↗</a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-7 rounded-2xl border border-[#dcc7cd] bg-[#fffafb] p-5 text-sm leading-6 text-[#6c5258]">
        <strong className="text-[#3a1a22]">Method:</strong> this is not a councillor “score.” Each motion is tied to an official recorded vote, and dollar impacts are shown only when the motion/report states a defensible amount. Committee-stage votes are labelled as such because a later Council decision can change the final disposition.
      </div>
    </div>
  );
}
