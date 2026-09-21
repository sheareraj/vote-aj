# Meta Pixel deployment patch

This patch adds Meta Pixel **1751128292656793** to every page of the Astro site while preserving the existing Vercel Analytics integration.

## Files changed

- `src/layouts/BaseLayout.astro` — adds the Meta Pixel loader + `PageView` event and the noscript fallback. This covers the homepage, priorities, donate, oops, and all `/data/*` pages that use the shared layout.
- `src/pages/resume.astro` — adds the same tracking because this page has its own standalone HTML layout.

No dependencies, `package.json`, `package-lock.json`, `astro.config.mjs`, or Vercel settings are changed. This is intentional so the working Vercel adapter/Analytics configuration in the current repository is preserved.

## Verify after deployment

1. Open the production site.
2. In Meta Events Manager, use **Test events** and visit the site.
3. Confirm a `PageView` event appears for pixel `1751128292656793`.
4. Optionally use the Meta Pixel Helper browser extension and confirm one pixel / one `PageView` on each page.

The pixel is site-wide and will fire a `PageView` on normal full-page Astro navigation.
