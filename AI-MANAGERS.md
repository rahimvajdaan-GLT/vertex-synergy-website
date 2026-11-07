# Vertex weekly AI SEO and maintenance manager

- Runs Mondays at 06:41 UTC / 09:41 Riyadh time (GitHub scheduling can be delayed).
- Runs the read-only public SEO audit and `npm audit --json`; dependency counts are not proof of exploitability.
- Produces an artifact and a **draft PR to main containing only `reports/latest-review.md`**. No website code, PHP files, API settings, secrets, Hostinger configuration or production branch changes.
- Will not create a duplicate while a draft PR with its expected title is still open.
- For actual AI recommendations: add `OPENAI_API_KEY` in repository Settings > Secrets and variables > Actions > Repository secrets. This may incur API charges. Never paste the key into a GitHub issue, PR, repo file or this conversation.
- Without that secret the same workflow generates a deterministic, non-AI report, not fabricated model analysis.
- Model defaults to `gpt-4.1-mini`. Usage is limited to 900 output tokens per run; provider costs and availability depend on your account.
- The model only sees a curated public audit summary and aggregate vulnerability counts, **not** code, config, uploaded enquiry data, credential hashes or access tokens.
- The recommendations require developer review and testing; AI is not allowed to push production code automatically.
- The legacy administrator hash still present in production Git history needs a **separate planned migration** and credential rotation. Do not automate this with an agent.
