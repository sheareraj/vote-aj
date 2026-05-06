export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-2xl font-black tracking-tight text-blue-900">
              AJ Shearer
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Monaghan Ward • Peterborough
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#about" className="hover:text-blue-900">
              About
            </a>
            <a href="#priorities" className="hover:text-blue-900">
              Priorities
            </a>
            <a href="#video" className="hover:text-blue-900">
              Video
            </a>
            <a href="#involved" className="hover:text-blue-900">
              Get Involved
            </a>
          </nav>
          <a
            href="#involved"
            className="rounded-full bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
          >
            Support AJ
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              Running for City Council
            </div>
            <h1 className="max-w-xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              A practical voice for Monaghan Ward.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Focused on growth, livability, accountability, and common-sense
              city building in Peterborough.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#involved"
                className="rounded-full bg-white px-6 py-3 font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5"
              >
                Join the Campaign
              </a>
              <a
                href="#video"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Watch Video
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#15315b,#0b1730)]">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">
                      ▶
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
                      Campaign Video
                    </div>
                    <div className="mt-2 text-3xl font-black">
                      Meet AJ Shearer
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [
                  'Practical leadership',
                  'Data-driven decisions that make sense on the ground.',
                ],
                [
                  'Stronger neighbourhoods',
                  'Safe streets, better infrastructure, and smart growth.',
                ],
                [
                  'Accessible council',
                  'Clear communication and responsive representation.',
                ],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                >
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
                    {title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-blue-50/90">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-900">
              About AJ
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Rooted locally. Focused on results.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              AJ Shearer is running to bring thoughtful, practical leadership to
              Monaghan Ward. With experience in business, data, and
              community-focused problem solving, AJ is committed to making city
              decisions that are transparent, affordable, and grounded in what
              residents actually need.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              This campaign is built around clear communication,
              neighbourhood-level priorities, and a belief that residents
              deserve a councillor who listens, explains decisions plainly, and
              follows through.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-900">
              At a glance
            </div>
            <div className="mt-6 space-y-5">
              {[
                ['Ward', 'Monaghan Ward'],
                ['City', 'Peterborough'],
                ['Focus', 'Practical growth, infrastructure, accountability'],
                ['Approach', 'Responsive, professional, community-driven'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="border-b border-slate-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {k}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="priorities" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-900">
              Priorities
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              A focused platform residents can understand quickly.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                'Affordable, sensible growth',
                'Support smart housing and development that respects existing neighbourhoods while helping Peterborough grow responsibly.',
              ],
              [
                'Infrastructure that works',
                'Push for roads, sidewalks, parks, and public assets that are maintained properly and planned with long-term value in mind.',
              ],
              [
                'Better accountability at City Hall',
                'Advocate for plain-language communication, financial discipline, and decisions residents can actually follow.',
              ],
            ].map(([title, body], i) => (
              <div
                key={title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-lg font-black text-white">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="video" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-900">
              Video
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Keep the message personal and direct.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A short, well-produced campaign video can help residents quickly
              understand who AJ is, why he is running, and what he wants to
              accomplish for Monaghan Ward.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li>• One main introduction video near the top of the page</li>
              <li>
                • Optional short clips for issues, endorsements, or events
              </li>
              <li>• Clear captions and mobile-friendly playback</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-xl">
            <div className="aspect-video bg-[linear-gradient(135deg,#0b1730,#183c73)]">
              <div className="flex h-full items-center justify-center">
                <div className="rounded-full bg-white/15 px-8 py-5 text-lg font-semibold text-white backdrop-blur">
                  Video Embed Area
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="involved" className="bg-blue-900 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_0.95fr] md:items-start">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
              Get involved
            </div>
            <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight md:text-5xl">
              Help build momentum across Monaghan Ward.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Sign up for campaign updates, volunteer opportunities, lawn signs,
              and event information.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="text-xl font-black tracking-tight">
              Join the campaign
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Simple, lightweight lead form for supporters.
            </div>
            <div className="mt-6 grid gap-4">
              <input
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Full name"
              />
              <input
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Email address"
              />
              <input
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Postal code"
              />
              <button className="rounded-2xl bg-blue-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-semibold text-slate-700">AJ Shearer</span> for
            Monaghan Ward, Peterborough
          </div>
          <div className="flex gap-5">
            <a href="#about" className="hover:text-blue-900">
              About
            </a>
            <a href="#priorities" className="hover:text-blue-900">
              Priorities
            </a>
            <a href="#involved" className="hover:text-blue-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
