import unittest
from seo_validation import validate_robots, validate_sitemap

HOME = "https://www.vsyenergy.com/"
URL = HOME + "sitemap.xml"
ROBOTS = "User-agent: *\\nAllow: /\\nSitemap: " + URL + "\\n"
XML = ('<?xml version="1.0" encoding="UTF-8"?>'
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
       '<url><loc>' + HOME + '</loc></url></urlset>')

class ValidateSeoAssets(unittest.TestCase):
    def test_valid_assets(self):
        self.assertEqual(validate_robots(ROBOTS, "text/plain", URL), [])
        self.assertEqual(validate_sitemap(XML, "application/xml", HOME), [])
    def test_html_fallback_detected(self):
        fallback = "<!doctype html><html><head></head></html>"
        self.assertTrue(validate_robots(fallback, "text/html", URL))
        self.assertTrue(validate_sitemap(fallback, "text/html", HOME))
    def test_malformed_sitemap(self):
        self.assertIn("sitemap.xml is not well-formed XML",
                      validate_sitemap("<urlset><broken>", "application/xml", HOME))
    def test_wrong_hostname(self):
        xml = XML.replace("www.vsyenergy.com", "example.org")
        self.assertTrue(validate_sitemap(xml, "application/xml", HOME))

if __name__ == "__main__":
    unittest.main()
