export default function ResumePage() {
    return (
        <div className="min-h-screen bg-[#f8f1f3] text-[#2b0b14]">
            <header className="bg-[#651024] px-6 py-10 text-white">
                <div className="mx-auto max-w-6xl">
                    <a href="/" className="text-sm font-semibold text-[#f3dfe5] hover:underline">
                        ← Back to main site
                    </a>

                    <div className="mt-10 grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-center">
                        <div>
                            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#f3dfe5]">
                                AJ Shearer
                            </div>

                            <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
                                Experience, skills, and community roots.
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f3dfe5]">
                                A brief look at the background, work experience, and community
                                involvement that shaped how I approach problem solving,
                                leadership, and public service.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] bg-[#2b0b14] shadow-2xl">
                            <div className="aspect-video">
                                <iframe
                                    className="h-full w-full"
                                    src="https://www.youtube.com/embed/BRqkrA3_uwY"
                                    title="AJ Shearer Resume Introduction"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-20">
                <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ead7dd] md:p-10">
                    <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
                        Where I’ve developed my skills
                    </div>

                    <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b0b14]">
                        Education, experience, and a lifelong curiosity to keep learning.
                    </h2>

                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Peterborough Roots
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Grew up primarily in Peterborough and attended RF Downey,
                                Prince of Wales, and Adam Scott.
                            </p>
                        </div>

                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Engineering Education
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Bachelor of Engineering with Distinction from Carleton University.
                            </p>
                        </div>

                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Lifelong Learning
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Entrepreneurship and business ownership have reinforced the importance
                                of adaptability, curiosity, and continuous learning.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ead7dd] md:p-10">
                    <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
                        How I’ve earned a living
                    </div>

                    <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b0b14]">
                        Experience across technology, business, and real estate.
                    </h2>

                    <div className="mt-12 grid gap-10 md:grid-cols-2">
                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Systems & Technology
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Started in software testing and system integration before moving into
                                healthcare consulting and data analytics.
                            </p>
                        </div>

                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Entrepreneurship
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Co-founded and operated a business intelligence and system integration
                                company focused on helping organizations make better use of their data.
                            </p>
                        </div>

                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Real Estate
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                Returned home to partner with family and help people move into and
                                within our community as a Real Estate Broker.
                            </p>
                        </div>

                        <div>

                            <h3 className="mt-4 text-2xl font-black text-[#2b0b14]">
                                Problem Solving
                            </h3>

                            <p className="mt-3 text-base leading-7 text-[#6b4a53]">
                                My career has consistently centered around analyzing problems,
                                understanding systems, exploring solutions and helping people make informed decisions.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ead7dd] md:p-10">
                    <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#651024]">
                        Community Involvement
                    </div>

                    <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-[#2b0b14]">
                                Supporting organizations and activities that strengthen our community.
                            </h2>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    'Peterborough Pagans — Junior coach & sponsor',
                                    'Peterborough Squash Club — Board member, volunteer & sponsor',
                                    'Buckhorn Snowmobile Club — Trail maintenance volunteer',
                                    'PGHA Ice Kats — Sponsor',
                                    'Peterborough Thunder — Sponsor',
                                    'Peterborough Horticultural Society — Donor',
                                    'Peterborough Dragon Boat Festival — Donor',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-full bg-[#f8f1f3] px-5 py-3 text-sm font-semibold text-[#651024] ring-1 ring-[#ead7dd]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <img
                                src="/images/pagans-family.jpg"
                                alt="AJ Shearer community involvement"
                                className="w-full rounded-[2rem] shadow-xl ring-1 ring-[#ead7dd]"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}