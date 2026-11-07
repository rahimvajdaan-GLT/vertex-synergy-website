# Daily VSY Energy public SEO audit

This scheduled GitHub Actions workflow checks the public site at
https://www.vsyenergy.com/ daily at 05:17 UTC (08:17 Saudi time),
subject to GitHub Actions scheduling delays.

## What it does
- Fetches the homepage, robots.txt and sitemap.xml using **unauthenticated GET**.
- Records HTTP status, title, meta description, canonical, viewport, Open Graph
  metadata and HTML language when available in the server-delivered HTML.
- Saves a JSON report in GitHub Actions > workflow run > Artifacts.
- Can be run manually from Actions > Daily VSY public SEO audit > Run workflow.

## What it does NOT do
- Does not edit code, content, SEO settings or Hostinger.
- Does not commit, push, deploy, merge, or open pull requests automatically.
- Does not measure search rankings, traffic, real page speed, client-rendered headings,
  or access Google Search Console.
- Does not perform authenticated requests or scan private endpoints.

This is a baseline, not a full AI SEO agent. Search Console integration and AI-generated
improvement proposals require separate, reviewed setup and permitted credentials.
