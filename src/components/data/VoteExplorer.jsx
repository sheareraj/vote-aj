import React, { useMemo, useState } from "react";

export default function VoteExplorer({ councillors, topics, votes }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const filtered = useMemo(() => {
    return votes.filter((v) => {
      const q = query.trim().toLowerCase();
      const matchesText = !q || `${v.summary || ""} ${v.councillor || ""}`.toLowerCase().includes(q);
      const matchesTopic = topic === "all" || v.topic_id === topic;
      return matchesText && matchesTopic;
    });
  }, [votes, query, topic]);

  const primaryTopics = topics.filter((t) => !t.parent_topic_id).slice(0, 12);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Search motions or councillors</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. budget, shelter, Riel..." className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2" />
        </label>
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#7a6167]">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-2xl border border-[#dcc7cd] bg-white px-4 py-3.5 text-[#3a1a22] outline-none ring-[#651024] focus:ring-2">
            <option value="all">All topics</option>
            {primaryTopics.map((t) => <option key={t.topic_id} value={t.topic_id}>{t.public_label}</option>)}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[#e7d6db] bg-[#f8f1f3] p-7 md:p-9">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#651024]">Vote ingestion is next</div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-[#3a1a22]">The explorer is wired; the official vote facts are not published yet.</h3>
          <p className="mt-4 max-w-3xl leading-7 text-[#7a6167]">
            The councillor and topic dimensions are loaded, but we are intentionally not displaying inferred or unofficial voting records. Motions and individual votes will appear only after they are tied back to City of Peterborough minutes and assigned a review status.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eadde1]"><div className="text-2xl font-black text-[#651024]">{councillors.length}</div><div className="mt-1 text-sm font-semibold text-[#7a6167]">current Council members loaded</div></div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eadde1]"><div className="text-2xl font-black text-[#651024]">{topics.length}</div><div className="mt-1 text-sm font-semibold text-[#7a6167]">controlled topic tags</div></div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eadde1]"><div className="text-2xl font-black text-[#651024]">0</div><div className="mt-1 text-sm font-semibold text-[#7a6167]">unverified votes shown</div></div>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filtered.map((v) => <article key={v.id} className="rounded-2xl bg-white p-5 ring-1 ring-[#eadde1]"><div className="font-bold">{v.summary}</div></article>)}
        </div>
      )}
    </div>
  );
}
