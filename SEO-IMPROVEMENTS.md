# SEO metadata and indexing notes

This change adds a homepage canonical URL and Open Graph/Twitter metadata to the Vite HTML template, plus real `robots.txt` and `sitemap.xml` assets under `public/`. The existing Apache fallback handles app routes while static files take precedence.

Only the verified public **homepage** is included in the XML sitemap. Routes `/login`, `/models`, and `/admin/models` are not listed. Dynamic `/project/:id` URLs are not listed because identifiers/content are runtime-backed and no verified public canonical route list is available.

**SPA SEO limitation:** `index.html` is shared across routes. Server-delivered HTML for dynamic project pages may still expose the homepage canonical and preview tags until proper route-specific server rendering or pre-rendering is added. Do not claim individual project pages are optimized for indexing until this is solved. The simple robots rules are crawler requests, not security controls, and the API must be secured independently.

**Deployment:** These source changes do not affect Hostinger until the separately reviewed manual release process is used. The public assets need to be verified live after approval/deployment: `/robots.txt` must return plain text; `/sitemap.xml` must return XML, not the SPA's HTML fallback.

Run `python3 scripts/test_seo_assets.py` and `npm run build` locally or via GitHub Actions. This verifies static metadata and expected routing structure, not browser-rendered navigation or production HTTP behavior.
