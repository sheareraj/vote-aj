# Pass 12 — Vercel Web Analytics

Date: 2026-09-20

## Changes

- Added `@vercel/analytics` `^2.0.1` as a production dependency.
- Added the Astro Web Analytics component to `src/layouts/BaseLayout.astro`, which covers the main campaign site and all `/data/*` portal pages.
- Added the same component to `src/pages/resume.astro`, which is the one standalone Astro page that does not use `BaseLayout`.
- Updated `package-lock.json` for reproducible Vercel builds.

## Vercel deployment steps

1. Web Analytics must be enabled for the Vercel project (the dashboard screen showing "Get Started" indicates this workflow is already active).
2. Deploy this package / push these changes to the Git repository connected to the Vercel project.
3. Visit the deployed production site and navigate between a few pages, especially `/data`.
4. Vercel should begin receiving page-view data shortly after the deployment is visited.

No Analytics project ID, API key, or environment variable is required for the normal Vercel-hosted Web Analytics integration.
