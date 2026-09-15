# Pass 10 — Progressive disclosure / plain-language presentation layer

## Goal
Keep the full analytical tools intact while adding a much thinner resident-facing layer that can be understood in 30 seconds to five minutes.

## New public routes
- `/data` — simplified five-minute overview
- `/data/taxes` — plain-language tax story
- `/data/spending` — largest comparable service changes
- `/data/results` — freshest housing, homelessness, crime, transit and infrastructure signals
- `/data/decisions` — selected significant Council decisions and Strong Mayor example

## Existing advanced tools retained
- `/data/budget`
- `/data/tax-drivers`
- `/data/outcomes`
- `/data/votes`

Each advanced tool now includes a prominent link back to its short explanation.

## Kiosk
`/data/kiosk` now opens directly into the four resident questions rather than the technical explorers.

## Navigation
The data header now emphasizes Taxes, Spending, Results and Decisions, with `Full data` returning to the advanced-tool section on `/data`.

## Validation
- `npm run data:build` passes.
- All generated JSON validates.
- Frontmatter syntax for all new Astro routes passes `node --check` after extraction.
- Full Astro compilation could not be completed in the build container because `npm ci` timed out before Astro was installed. Run `npm run build` locally / in Vercel as the final compilation check.
