export default function OopsPage() {
    return (
      <div className="min-h-screen bg-blue-900 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="text-sm font-semibold text-blue-100 hover:underline">
            ← Back to main site
          </a>
  
          <div className="mt-10 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-blue-900">
              Sorry I missed you
            </div>
  
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Oops — I missed you at the door.
            </h1>
  
            <p className="mt-5 text-lg leading-8 text-slate-600">
              I’m AJ Shearer, and I’m running for City Councillor in Monaghan Ward.
              I was hoping to introduce myself in person, but I wanted to leave you
              a quick message.
            </p>
  
            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-950">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/BRqkrA3_uwY"
                  title="Sorry I missed you at the door"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
  
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/"
                className="rounded-full bg-blue-900 px-6 py-3 font-semibold text-white"
              >
                Visit Main Campaign Site
              </a>
  
              <a
                href="/#involved"
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700"
              >
                Get Involved
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }