#!/usr/bin/env python3
"""Validate SEO assets and the existing Hostinger SPA routing setup."""
import html.parser
import pathlib
import re
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
ROBOTS = (ROOT / "public/robots.txt").read_text(encoding="utf-8")
SITEMAP = ROOT / "public/sitemap.xml"
ROUTES = (ROOT / "src/App.jsx").read_text(encoding="utf-8")
HTACCESS = (ROOT / "public/.htaccess").read_text(encoding="utf-8")
ORIGIN = "https://www.vsyenergy.com/"

class Head(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.meta = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link":
            self.links.append(attrs)
        if tag == "meta":
            self.meta[attrs.get("property") or attrs.get("name")] = attrs.get("content")

parsed = Head()
parsed.feed(HTML)
canonicals = [item.get("href") for item in parsed.links if "canonical" in (item.get("rel") or "").lower().split()]
assert canonicals == [ORIGIN], f"Unexpected canonical links: {canonicals}"
assert parsed.meta["og:type"] == "website"
assert parsed.meta["og:url"] == ORIGIN
for name in ["description", "og:title", "og:description", "twitter:card"]:
    assert parsed.meta.get(name), f"Missing {name}"
assert parsed.meta["twitter:card"] == "summary"

root = ET.parse(SITEMAP).getroot()
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
assert root.tag.endswith("urlset")
urls = [el.text for el in root.findall("s:url/s:loc", ns)]
assert urls == [ORIGIN], f"Sitemap has unvalidated routes: {urls}"
assert f"Sitemap: {ORIGIN}sitemap.xml" in ROBOTS
assert re.search(r"(?m)^User-agent:\s*\*$", ROBOTS)
for path in ["/login", "/admin/", "/models"]:
    assert f"Disallow: {path}" in ROBOTS
assert "RewriteCond %{REQUEST_FILENAME} !-f" in HTACCESS
assert "RewriteCond %{REQUEST_FILENAME} !-d" in HTACCESS
assert "RewriteRule . /index.html [L]" in HTACCESS
for route in ['path="/"', 'path="/project/:id"', 'path="/login"', 'path="/models"', 'path="/admin/models"']:
    assert route in ROUTES, f"Expected SPA route missing: {route}"
print("SEO files valid; existing client-side routes and Apache SPA fallback preserved.")
