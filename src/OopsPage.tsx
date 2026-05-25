export default function OopsPage() {
  return (
    <div className="min-h-screen bg-[#651024] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm font-semibold text-[#f3dfe5] hover:underline"
        >
          ← Back to main site
        </a>

        <div className="mt-10 rounded-3xl bg-white p-6 text-slate-900 shadow-md">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#651024] md:text-5xl">
            Sorry I missed you at the door!
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#7a6167]">
            I’m AJ Shearer, and I’m running for City Councillor in Monaghan Ward.
            I was hoping to introduce myself in person, but I wanted to leave you
            a quick message.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-slate-950">
            <div className="aspect-square max-w-md mx-auto">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/9QfezQ3jfTs"
                title="Sorry I missed you at the door"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <form
            action="https://formspree.io/f/xvzldnvz"
            method="POST"
            className="mt-8 grid gap-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="firstName"
                required
                className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
                placeholder="First name"
              />

              <input
                name="lastName"
                required
                className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
                placeholder="Last name"
              />
            </div>

            <input
              type="email"
              name="email"
              required
              className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
              placeholder="Email address"
            />

            <input
              name="postalCode"
              className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
              placeholder="Postal code"
            />

            <textarea
              name="message"
              rows={5}
              className="rounded-2xl border border-[#d9b8c2] px-4 py-3 outline-none focus:border-[#651024]"
              placeholder="What would you like to talk about?"
            />

            <button
              type="submit"
              className="rounded-2xl bg-[#651024] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7a2337]"
            >
              Send AJ a Message
            </button>
          </form>

          <div className="mt-8 flex justify-center">
            <a
              href="/"
              className="rounded-full bg-[#651024] px-6 py-3 font-semibold text-white transition hover:bg-[#7a2337]"
            >
              Visit Main Campaign Site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}