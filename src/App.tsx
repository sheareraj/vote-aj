export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#3a1a22]">
      <header className="sticky top-0 z-30 border-b border-[#efe4e7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#651024]">
              AJ Shearer
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7a6167]">
              Monaghan Ward • Peterborough
            </div>
          </div>

          <nav className="hidden gap-6 text-sm font-medium text-[#7a6167] md:flex">
            <a href="#about" className="hover:text-[#651024]">
              About
            </a>
            <a href="#priorities" className="hover:text-[#651024]">
              Priorities
            </a>
            <a href="#involved" className="hover:text-[#651024]">
              Get Involved
            </a>
          </nav>

          <a
            href="#involved"
            className="rounded-full bg-[#651024] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7a2337]"
          >
            Get in touch
          </a>
          <a
            href="#involved"
            className="rounded-full bg-[#651024] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7a2337]"
          >
            Order a Sign
          </a>
          <a
            href="/resume"
            className="rounded-full bg-[#651024] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7a2337]"
          >
            View My Experience
          </a>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#651024] text-white">
  {/* Mobile layout */}
  <div className="md:hidden">
    <div className="h-[52vh] overflow-hidden">
      <img
        src="/images/hero-main.jpg"
        alt="AJ Shearer in Peterborough"
        className="h-full w-full object-cover object-[58%_center]"
      />
    </div>

    <div className="px-6 py-10">
      <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
        Running for City Council
      </div>

      <h1 className="text-4xl font-black leading-[1.05] tracking-tight">
        A practical voice for Monaghan Ward.
      </h1>

      <p className="mt-5 text-base leading-7 text-white/90">
        Focused on growth, livability, accountability, and common-sense city
        building in Peterborough.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href="#about"
          className="rounded-full bg-white px-5 py-3 font-semibold text-[#651024] shadow-lg"
        >
          Learn More
        </a>

        <a
          href="#involved"
          className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white"
        >
          Get Involved
        </a>
      </div>
    </div>
  </div>

  {/* Desktop layout */}
  <div className="relative hidden min-h-screen md:block">
    <img
          src="/images/hero-main.jpg"
          alt="AJ Shearer in Peterborough"
          className="absolute inset-0 h-full w-full object-cover object-[85%_center]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#651024]/95 via-[#651024]/35 via-30% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur">
              Running for City Council
            </div>

            <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl">
              A practical voice for Monaghan Ward.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              Focused on growth, livability, accountability, and common-sense city
              building in Peterborough.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#about"
                className="rounded-full bg-white px-6 py-3 font-semibold text-[#651024] shadow-lg transition hover:-translate-y-0.5"
              >
                Learn More
              </a>

              <a
                href="#involved"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Get Involved
              </a>
            </div>
          </div>
        </div>
  </div>
</section>
      <section className="bg-[#651024] py-20">
  <div className="mx-auto max-w-[600px] px-6">
    <div className="overflow-hidden rounded-[2rem] shadow-2xl">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/BRqkrA3_uwY"
          title="AJ Shearer Campaign Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  </div>
</section>

      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
              About AJ
            </div>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#3a1a22] md:text-5xl">
              Rooted in Peterborough. Focused on family and community.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#7a6167]">
              AJ Shearer is a husband, father, business professional, and long-time
              member of the Peterborough community who is committed to helping build
              a stronger, safer, and more affordable future for local families.

            </p>
          </div>
          <div className="mx-auto max-w-md">
            <img
              src="/images/family-photo.jpg"
              alt="AJ Shearer and family"
              className="w-full rounded-3xl shadow-md"
            />
          </div>
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="space-y-10 text-center mx-auto max-w-xl">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#651024]">
                  Family First
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#7a6167]">
                  AJ and his wife Seanna are raising their two boys in Peterborough
                  and care deeply about building a city where families can feel safe,
                  connected, and optimistic about the future.
                </p>
              </div>

              <div className="border-t border-[#efe4e7] pt-10">
                <h3 className="text-2xl font-bold tracking-tight text-[#651024]">
                  Professional Background
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#7a6167]">
                  With a background in aerospace engineering, business intelligence,
                  data analytics, and real estate, AJ brings a practical,
                  data-driven perspective to solving problems and making decisions
                  that deliver long-term value for residents.
                </p>
              </div>

              <div className="border-t border-[#efe4e7] pt-10">
                <h3 className="text-2xl font-bold tracking-tight text-[#651024]">
                  Deep Local Roots
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#7a6167]">
                  AJ’s family has deep roots in the Peterborough area spanning seven
                  generations. Their connection to the region stretches back
                  generations through local businesses, families, neighbourhoods,
                  and community involvement.
                </p>

                <p className="mt-4 text-lg leading-8 text-[#7a6167]">
                  Peterborough is home — and AJ believes the city’s future should be
                  built in a way that preserves what people love about the community
                  while creating new opportunities for the next generation.
                </p>
              </div>
            </div>


          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="rounded-3xl border border-[#efe4e7] bg-[#f8f1f3] p-6 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
              At a glance
            </div>

            <div className="mt-6 space-y-5">
              {[
                ['Ward', 'Monaghan Ward'],
                ['City', 'Peterborough'],
                ['Focus', 'Practical growth, infrastructure, accountability'],
                ['Approach', 'Responsive, transparent, data-driven decisions'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="border-b border-[#efe4e7] pb-4 last:border-0 last:pb-0"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a6167]">
                    {k}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[#3a1a22]">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="priorities" className="bg-[#f8f1f3] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
              Priorities
            </div>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#3a1a22] md:text-5xl">
              A focused platform residents can understand quickly.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                'Affordable, Sensible Growth',
                'Support smart housing and development that respects existing neighbourhoods while helping Peterborough grow responsibly.',
              ],
              [
                'Infrastructure That Works',
                'Push for roads, sidewalks, parks, and public assets that are maintained properly and planned with long-term value in mind.',
              ],
              [
                'Better Accountability',
                'Advocate for plain-language communication, financial discipline, and decisions residents can actually follow.',
              ],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#efe4e7]"
              >
                <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-[#7a2337] to-[#651024] px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                  {title}
                </div>

                <p className="text-base leading-7 text-[#7a6167]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="GetInvolved" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
              Thank You
            </div>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#3a1a22] md:text-5xl">
              Thanks for taking the time to learn a little more about me and the campaign.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7a6167]">
              Peterborough is an incredible place to raise a family, build a career,
              and put down roots. I’m running because I believe we can make smarter,
              more practical decisions that help keep our city affordable, safe, and
              moving in the right direction.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7a6167]">
              If you’re looking for additional information, have questions about the
              campaign, or simply want to connect, please don’t hesitate to reach
              out. I’d genuinely love to hear from you.
            </p>

          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#efe4e7] bg-[#2b0b14] shadow-md">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/BRqkrA3_uwY"
                title="AJ Shearer Campaign Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section id="involved" className="bg-gradient-to-br from-[#7a2337] to-[#651024] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_0.95fr] md:items-start">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#f3dfe5]">
              Get involved
            </div>

            <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight md:text-5xl">
              Help build momentum across Monaghan Ward.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f3dfe5]">
              Sign up for campaign updates, volunteer opportunities, lawn signs,
              and event information.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-[#3a1a22] shadow-md">
            <div className="text-xl font-bold tracking-tight">Get in touch</div>

            <div className="mt-1 text-sm text-[#7a6167]">
              I'm more excited to hear from you than you are to fill out this form!
            </div>

            <form
              action="https://formspree.io/f/mzdojrpy"
              method="POST"
              className="mt-6 grid gap-4"
            >
              <input
                name="name"
                className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
                placeholder="Full name"
              />

              <input
                type="email"
                name="email"
                className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
                placeholder="Email address"
              />

              <input
                name="postalCode"
                className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
                placeholder="Postal code"
              />
              <label className="flex items-center gap-3 rounded-2xl border border-[#d9b8c2] px-4 py-3 text-[#3a1a22]">
                <input
                  type="checkbox"
                  name="lawnSign"
                  className="h-5 w-5 accent-[#651024]"
                />

                <span className="font-medium">
                  I want a lawn sign
                </span>
              </label>
              <textarea
                name="mutual_help"
                placeholder="How can we help each other?"
                rows={4}
                className="w-full rounded-xl border border-[#d9b8c2] px-4 py-3 text-[#3a1a22] placeholder-[#6b4a53] outline-none focus:border-[#651024] focus:ring-2 focus:ring-[#efe4e7]"
              />

              <button
                type="submit"
                className="rounded-2xl bg-[#651024] px-5 py-3 font-semibold text-white transition hover:bg-[#7a2337]"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#efe4e7] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#7a6167] md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-semibold text-[#3a1a22]">AJ Shearer</span> for
            Monaghan Ward, Peterborough
          </div>

          <div className="flex gap-5">
            <a href="#about" className="hover:text-[#651024]">
              About
            </a>
            <a href="#priorities" className="hover:text-[#651024]">
              Priorities
            </a>
            <a href="#involved" className="hover:text-[#651024]">
              Contact
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61589293620797"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#651024] hover:underline"
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}