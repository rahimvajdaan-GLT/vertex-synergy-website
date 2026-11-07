"""Validate public crawler resources independent of HTTP status codes."""
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

def validate_robots(body, content_type, expected_sitemap):
    problems = []
    if "html" in content_type.lower() or "<html" in body.lower() or "<!doctype html" in body.lower():
        problems.append("robots.txt is returning HTML instead of crawler directives")
    if "User-agent:" not in body:
        problems.append("robots.txt lacks User-agent directive")
    if f"Sitemap: {expected_sitemap}" not in body:
        problems.append("robots.txt lacks the expected sitemap URL")
    return problems

def validate_sitemap(body, content_type, homepage):
    problems = []
    if "html" in content_type.lower() and "xml" not in content_type.lower():
        problems.append("sitemap.xml is returning HTML instead of XML")
    try:
        root = ET.fromstring(body)
        if root.tag != SITEMAP_NS + "urlset":
            problems.append("sitemap.xml does not contain an XML sitemap urlset root")
            return problems
        urls = [item.text or "" for item in root.findall(".//" + SITEMAP_NS + "loc")]
        if not urls:
            problems.append("sitemap.xml has no URLs")
        if homepage not in urls:
            problems.append("sitemap.xml is missing homepage URL")
        for url in urls:
            parts = urlparse(url)
            if parts.scheme != "https" or parts.netloc != urlparse(homepage).netloc:
                problems.append("sitemap.xml contains an unexpected URL: " + url)
    except ET.ParseError:
        problems.append("sitemap.xml is not well-formed XML")
    return problems
