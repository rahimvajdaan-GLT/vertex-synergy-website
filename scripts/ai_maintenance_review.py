#!/usr/bin/env python3
"""Generate a safe website improvement proposal from public SEO and npm audit facts.

Only sanitized/public diagnostics are sent to the optional AI provider.
This script never reads or edits Hostinger configuration or production content.
"""
import datetime as dt
import json
import os
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
report_dir = ROOT / "reports"
report_dir.mkdir(exist_ok=True)
site = "https://www.vsyenergy.com/"
seo_path = ROOT / "seo-report.json"
audit_path = ROOT / "npm-audit.json"
seo = json.loads(seo_path.read_text()) if seo_path.exists() else {}
audit = json.loads(audit_path.read_text()) if audit_path.exists() else {}
issues = seo.get("issues", [])
counts = (audit.get("metadata") or {}).get("vulnerabilities") or {}
counts = {k: int(counts.get(k, 0)) for k in ("critical", "high", "moderate", "low")}
facts = {
    "site": site,
    "seo_issues": issues[:15],
    "homepage": {k: seo.get("homepage", {}).get(k) for k in
                 ("title_present", "description_present", "canonical_present",
                  "og_title_present", "og_description_present", "html_lang")},
    "dependency_vulnerability_counts": counts,
}
date = dt.datetime.now(dt.timezone.utc).date().isoformat()
intro = [
    "# VSY Energy — AI SEO & Maintenance Review",
    "",
    f"Audit date: {date} (UTC)",
    "",
    "## Verified automated findings",
    "",
    f"- Public website: {site}",
    f"- SEO audit: {'; '.join(issues) if issues else 'No issues flagged by the limited public checks.'}",
    f"- Dependency audit counts: {counts}",
    "",
    "## Limitations",
    "",
    "- These checks do not measure rankings, traffic or JavaScript-rendered page content.",
    "- Dependency counts require package-specific manual triage; do not automatically run npm audit fix --force.",
    "- This report is a **proposal only**, not a tested website code change.",
    "- No production changes or auto-merge are allowed.",
    "",
]
key = os.environ.get("OPENAI_API_KEY", "").strip()
if key:
    model = os.environ.get("AI_REVIEW_MODEL", "gpt-4.1-mini")
    prompt = ("Act as a cautious SEO, security and frontend maintenance reviewer. "
              "Use ONLY supplied verified facts, do not invent metrics, rankings or fixes. "
              "Recommend up to five prioritized, testable changes appropriate for a "
              "React/Vite SPA hosted on Hostinger. Mark hypotheses clearly. "
              "No instructions to change auth secrets, expose private data or deploy. "
              "Output Markdown with Impact, Evidence, Change, Tests, Risks. "
              "Do not output executable code.")
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": prompt},
                     {"role": "user", "content": json.dumps(facts)}],
        "max_tokens": 900,
        "temperature": 0.2,
    }).encode()
    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        method="POST")
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            result = json.loads(response.read(100000))
        summary = result["choices"][0]["message"]["content"]
        intro.extend(["## AI recommendations (review required)", "", summary, ""])
    except Exception as exc:
        # Never print provider error response bodies or request headers.
        intro.extend(["## AI recommendations", "", "AI request was unavailable; only deterministic findings are included.", ""])
        print("AI advice unavailable:", type(exc).__name__)
else:
    intro.extend([
        "## AI recommendations",
        "",
        "AI model not connected. Configure GitHub Actions secret OPENAI_API_KEY "
        "to enable model-generated recommendations. Until then, this is an automated "
        "fact-based maintenance report.",
        "",
        "### Suggested human review",
        "",
        "- Check any flagged sitemap, robots or canonical problems.",
        "- Triage dependency advisories by actual reachability and severity.",
        "- Review mobile performance and React route-specific metadata separately.",
        "- Do not modify the live website or its administrator credentials from this report.",
        "",
    ])
out = report_dir / "latest-review.md"
out.write_text("\n".join(intro) + "\n", encoding="utf-8")
print("Prepared proposal:", out)
