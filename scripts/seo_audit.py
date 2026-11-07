#!/usr/bin/env python3
"""Read-only public-site SEO audit; never logs credentials or sends authenticated requests."""
import datetime
import html.parser
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from seo_validation import validate_robots, validate_sitemap

SITE = os.environ.get("SEO_SITE_URL", "https://www.vsyenergy.com/").rstrip("/") + "/"
REPORT = Path("seo-report.json")
HEADERS = {"User-Agent": "VertexSEOAudit/1.0 (+website-owner; read-only)"}
TIMEOUT = 20

class MetaParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta = {}
        self.links = []
        self.headings = {"h1": 0, "h2": 0}
        self.html_lang = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
        if tag == "title":
            self.in_title = True
        if tag in self.headings:
            self.headings[tag] += 1
        if tag == "meta":
            k = (a.get("name") or a.get("property") or "").lower()
            if k:
                self.meta[k] = a.get("content", "")
        if tag == "link":
            self.links.append({"rel": a.get("rel", ""), "href": a.get("href", "")})
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data

def fetch(path):
    url = urllib.parse.urljoin(SITE, path)
    request = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            data = response.read(1_000_000)
            return {"url": response.geturl(), "status": response.status,
                    "content_type": response.headers.get("Content-Type", ""),
                    "body": data.decode("utf-8", errors="replace")}
    except urllib.error.HTTPError as ex:
        return {"url": url, "status": ex.code, "error": str(ex)}
    except Exception as ex:
        return {"url": url, "status": None, "error": type(ex).__name__ + ": " + str(ex)}

results = {key: fetch(path) for key, path in
           [("home", "/"), ("robots", "/robots.txt"), ("sitemap", "/sitemap.xml")]}
home = results["home"]
checks = {}
if home.get("status") == 200 and "html" in home.get("content_type", "").lower():
    parser = MetaParser()
    parser.feed(home.get("body", ""))
    canonical = next((x["href"] for x in parser.links if "canonical" in x["rel"].lower()), "")
    checks = {"page_title": parser.title.strip(),
              "title_present": bool(parser.title.strip()),
              "description_present": bool(parser.meta.get("description")),
              "canonical_present": bool(canonical),
              "canonical": canonical,
              "viewport_present": bool(parser.meta.get("viewport")),
              "html_lang": parser.html_lang,
              "og_title_present": bool(parser.meta.get("og:title")),
              "og_description_present": bool(parser.meta.get("og:description")),
              "h1_in_server_html": parser.headings["h1"],
              "note": "React SPAs may render headings and content client-side; server HTML does not reveal them."}
issues = []
for key in ("home", "robots", "sitemap"):
    if results[key].get("status") != 200:
        issues.append(f"{key} URL returned HTTP {results[key].get('status')}")
if results["robots"].get("status") == 200:
    issues.extend(validate_robots(results["robots"].get("body", ""),
                                  results["robots"].get("content_type", ""),
                                  SITE.rstrip("/") + "/sitemap.xml"))
if results["sitemap"].get("status") == 200:
    issues.extend(validate_sitemap(results["sitemap"].get("body", ""),
                                   results["sitemap"].get("content_type", ""), SITE))
if checks:
    if not checks.get("canonical_present"):
        issues.append("Homepage canonical tag missing")
    elif checks.get("canonical") != SITE:
        issues.append("Homepage canonical points to an unexpected URL")
    if not checks.get("description_present"):
        issues.append("Homepage meta description missing")
    if not checks.get("og_title_present") or not checks.get("og_description_present"):
        issues.append("Homepage Open Graph metadata incomplete")
public = {"checked_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
          "site": SITE,
          "http": {key: {k: v for k, v in val.items() if k != "body"} for key, val in results.items()},
          "homepage": checks,
          "issues": issues,
          "passed": len(issues) == 0,
          "limitations": ["Public unauthenticated HTML only", "No ranking or Search Console measurements",
                          "No JavaScript-rendered page crawling", "No private URLs checked"]}
REPORT.write_text(json.dumps(public, indent=2) + "\n", encoding="utf-8")
print(json.dumps(public, indent=2))

if issues:
    print("::error::Public SEO checks failed; inspect seo-report.json for details.")
    raise SystemExit(1)
